import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

// Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
// Giải pháp: Inject store: là kĩ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file authorizeAxios.js hiện tại
// Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên,
// từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào biến axiosReduxStore cục bộ trong file này
let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}

// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// withCredentials: Cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// Cấu hình Interceptors (đánh chặn giữa request và response)
// Interceptor Request: Can thiệp vào giữa những request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Chặn spam click
  interceptorLoadingElements(true)

  return config
}, (error) => {
  return Promise.reject(error)
})

// Khởi tạo một promise cho việc gọi api refresh_token
// Mục đích tạo promise này để khi nào gọi api refresh_token xong thì mới retry lại nhiều api bị lỗi trước đó
let refreshTokenPromise = null

// Interceptor Response: Can thiệp vào giữa những Response API
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Chặn spam click
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Mọi mã http status code nằm ngoài khoảng 200 - 299 sẽ là error và rơi vào đây
  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây

  // Chặn spam click
  interceptorLoadingElements(false)

  // Xử lý refresh token tự động
  // Trường hợp 1: Nếu nhận mã 401 từ BE, gọi api đăng xuất
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  // Trường hợp 2: Nếu nhận mã 410 từ BE, gọi api refresh token để làm mới accessToken
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một giá trị  _retry = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần tại 1 thời điểm
    originalRequests._retry = true

    // Kiểm tra xem nếu chưa có refreshTokenPromise thì thực hiện gán việc gợi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kì lỗi nào từ api refresh token thì logout luôn
          console.log(axiosReduxStore)
          axiosReduxStore.dispatch(logoutUserAPI(false))

          // return để tránh một lỗi bị gọi 2 lần API lougout nếu như API refreshTokenAPI trả về lỗi
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API thành công hay không thì vẫn luôn gán lại refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }

    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      // Bước 1: Đối với trường hợp nếu dự án cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây
      // Hiện tại ở đây không cần bước 1 này vì đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi gọi api refreshToken thành công

      // Bước 2: return lại axios instance kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi api ở đây
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  // Dùng toastify để hiển thị bất kể mọi mã lỗi lên màn hình - Ngoại trừ 410 - GONE phục vụ việc tự động refresh lại token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance