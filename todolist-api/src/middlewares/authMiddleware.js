import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JWTProvider'
import ApiError from '~/utils/ApiError'

// Middleware này đảm nhiệm: xác thực JWT accesstoken nhận từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next) => {
  // Lấy accesstoken nằm trong request cookies từ phía client - withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken

  // Nếu như accessToken không tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }
  try {
    // Thực hiên giải mã token xem có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)

    // Nếu như token hợp lệ thì cần lưu thông tin giải mã được vào req.jwtDecoded, để sử dụng cho các tầng cần sử lý phía sau
    req.jwtDecoded = accessTokenDecoded

    // Cho phép request đi tiếp
    next()
  } catch (error) {
    // Nếu accessToken bị hết hạn (expired) thì cần trả về lỗi GONE - 410 cho phía FE biết để gọi api refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Cần làm mới token.'))
    }
    // Nếu accessToken không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì trả mã lỗi 401 cho FE gọi api sign_out
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}