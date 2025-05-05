// Brevo là tên thương hiệu mới của sib - Sendinblue
// Vì thế trong phần hướng dẫn trên github có thể nó vẫn còn giữ tên biến SivApiV3Sdk
const SivApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'

// Có thể xem thêm phần docs cấu hình theo từng ngôn ngữ khác nhau tùy từng dự án ở Brevo Darshboard > Account > SMTP & API > API Keys
let apiInstance = new SivApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khởi tạo sendSmtpEmail với thông tin cần thiết
  let sendSmtpEmail = new SivApiV3Sdk.SendSmtpEmail()
  // Tài khoản gửi email (tài khoản đăng ký Brevo)
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }
  // Những tài khoản nhận email
  // 'to' là một mảng để sau có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]
  // Tiêu đề của email
  sendSmtpEmail.subject = customSubject
  // Nội dung email
  sendSmtpEmail.htmlContent = htmlContent
  // Hành động gửi email
  // sendTransacEmail trả về Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}