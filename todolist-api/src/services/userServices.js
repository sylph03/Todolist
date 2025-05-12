/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatters'
import { WEBSITE_DOMAINS } from '~/utils/constants'
import { BrevoProvider } from '~/providers/BrevoProvider'
import { JwtProvider } from '~/providers/JWTProvider'
import { env } from '~/config/environment'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    // Kiểm tra email đã tồn tại trong hệ thống chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email đã đăng ký')
    }

    // Tạo data để lưu và db
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // tham số thứ 2 (8) là độ phức tạp, giá trị cao thì băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // Mặc định là username, sau có thể cập nhật
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gủi email cho user xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAINS}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Todolist: Vui lòng xác nhận email của bạn trước khi sử dụng dịch vụ của chúng tôi!'
    const htmlContent = `
      <h3>Đây là liên kết xác minh của bạn:</h3>
      <h3>${verificationLink}</h3>
      <h3>Trân trọng,<br/>Admin Dat</h3>
    `
    // Gọi Provider gửi Email
    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    // return trả dữ liệu cho phía Controller
    return pickUser(getNewUser)

  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    // Kiểm tra các điều kiện cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tài khoản!')

    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Tài khoản của bạn đã kích hoạt!')

    if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token không hợp lệ!')

    // Nếu mọi thứ ok thì bắt đầu cập nhật thông tin
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    const updateUser = await userModel.update(existUser._id, updateData)

    return pickUser(updateUser)

  } catch (error) { throw error }
}

const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Kiểm tra các điều kiện cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tài khoản!')

    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Tài khoản của bạn chưa kích hoạt!')

    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email hoặc mật khẩu không đúng!')

    // Nếu mọi thứ ok thì bắt đầu tạo Tokens đăng nhập để trả về cho phía FE
    // Tạo thông tin để đính kèm trong JWT Token bao gồm _id và email của user
    const userInfo = {
      _id: existUser._id,
      email: existUser.email
    }

    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15 // 15 giây
      env.REFRESH_TOKEN_LIFE
    )

    // Trả về thông tin của user kèm theo 2 cái token vừa tạo ra
    return { accessToken, refreshToken, ...pickUser(existUser) }

  } catch (error) { throw error }
}

const refreshToken = async (clientRefreshToken) => {
  try {
    // Verify / giải mã refresh token có hợp lệ không
    const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE)

    // Đoạn này vì chỉ lưu thông tin unique và cố định của user trong token rồi, vì vậy có thể lấy luôn từ decoded ra, tiết kiệm query vào DB lấy dữ liệu mới
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5 // 5 giây
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existUser = await userModel.findOneById(userId)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy tài khoản!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Tài khoản của bạn chưa kích hoạt!')

    // Khởi tạo kết quả updated User ban đầu là rỗng
    let updateUser = {}

    // Trường hợp thay đổi mật khẩu
    if (reqBody.currentPassword && reqBody.newPassword) {
      // Nếu currentPassword sai
      if (!bcryptjs.compareSync(reqBody.currentPassword, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Mật khẩu hiện tại không đúng!')
      }
      // Nếu currentPassword đúng thì sẽ hash một cái mật khẩu mới và update lại vào DB
      updateUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.newPassword, 8)
      })
    }
    else if (userAvatarFile) {
      // Trường hợp upload file lên Cloudinary
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')
      // Lưu lại url (secure_url) của file vào DB
      updateUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url
      })
    }
    else {
      // Trường hợp update thông tin chung (displayName)
      updateUser = await userModel.update(userId, reqBody)
    }

    return pickUser(updateUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update
}