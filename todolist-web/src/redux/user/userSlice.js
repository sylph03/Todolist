import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentUser: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // axios trả kết quả về property của nó là data
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Đã đăng xuất!')
    }
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây là response.data trả về ở trên
      state.currentUser = action.payload
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      // Sau khi API logout thành công thì xóa thông tin currentUser về null
      // Kết hợp với ProtectedRoute đã làm ở App.js => code sẽ điều hướng về login
      state.currentUser = null
    })
  }
})

// Actions: Nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Ở trên không có properties actions vì những actions này được redux tạo tự động theo tên reducer
// export const {} = userSlice.actions

// Selectors: Nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// File này tên là userSlice nhưng export một thứ là Reducer
// export default userSlice.reducer
export const userReducer = userSlice.reducer