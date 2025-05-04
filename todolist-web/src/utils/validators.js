// Biểu thức chính quy
export const FIELD_REQUIRED_MESSAGE = 'Trường này là bắt buộc.'
export const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const EMAIL_RULE_MESSAGE = 'Email không hợp lệ.'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Mật khẩu phải bao gồm ít nhất 1 chữ cái, một số và ít nhất 8 ký tự.'

// Liên quan Validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'Tệp không được để trống.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Kích thước tệp tối đa đã vượt quá. (10 MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'Kiểu tệp không hợp lệ. Chỉ chấp nhận jpg, jpeg và png'
  }
  return null
}
