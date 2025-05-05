import JWT from 'jsonwebtoken'

// Hàm tạo mới Token - cần 3 tham số đầu vào
// userInfo: Những thông tin muốn đính kèm vào token
// secretSignature: Chữ ký bí mật (dạng một chuỗi string ngẫu nhiên) trên docs thì để tên privateKey đều được
// tokenLife: Thời gian sống của token
const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    // Hàm sign() của thư viện Jwt - thuật toán mặc định là HS256
    return JWT.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
  } catch (error) { throw new Error(error) }
}

// Hàm kiểm tra token có hợp lệ hay không
// Hợp lệ ở đây là cái token được tạo ra có đúng với cái chữ ký bí mật secretSignature trong dự án hay không
const verifyToken = async (token, secretSignature) => {
  try {
    // Hàm verify của thư viện Jwt
    return JWT.verify(token, secretSignature)
  } catch (error) { throw new Error(error) }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}