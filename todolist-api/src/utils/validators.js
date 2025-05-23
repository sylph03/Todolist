export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Chuỗi của bạn không khớp với mẫu Object Id!'

export const FIELD_REQUIRED_MESSAGE = 'Trường này là bắt buộc.'
export const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const EMAIL_RULE_MESSAGE = 'Email không hợp lệ.'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Mật khẩu phải bao gồm ít nhất 1 chữ cái, một số và ít nhất 8 ký tự.'

// Liên quan Validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']