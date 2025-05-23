import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { Navigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, MailCheck, LogIn } from 'lucide-react'

import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { loginUserAPI } from '~/redux/user/userSlice'

const LoginForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm()
  let [searchParams] = useSearchParams()
  const { registeredEmail, verifiedEmail } = Object.fromEntries([...searchParams])

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispatch(loginUserAPI({ email, password })),
      { pending: 'Đang đăng nhập...' }
    ). then(res => {
      // Kiểm tra không có lỗi (kiểm tra thành công) thì mới redirect về route /
      if (!res.error) navigate('/')
    })
  }

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        {/* <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-sky-600" />
        </div> */}
        <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
        {/* <p className="text-gray-500 mt-2">Chào mừng bạn quay trở lại!</p> */}
      </div>

      <div>
        {verifiedEmail && (
          <div className="mb-6 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 flex items-start gap-2">
            <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />
            <div>
              Email <strong>{verifiedEmail}</strong> đã được xác minh. <br />
              Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ!
            </div>
          </div>
        )}

        {registeredEmail && (
          <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex items-start gap-2">
            <MailCheck className="w-5 h-5 mt-0.5 text-blue-600" />
            <div>
              Chúng tôi đã gửi một email xác minh đến <strong>{registeredEmail}</strong>. <br />
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để xác minh tài khoản.
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(submitLogIn)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none ${
              errors['email']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 hover:border-sky-400'
            }`}
            placeholder="Nhập email"
            {...register('email', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: EMAIL_RULE,
                message: EMAIL_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'email'} />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="password"
            className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none ${
              errors['password']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 hover:border-sky-400'
            }`}
            placeholder="Nhập mật khẩu"
            {...register('password', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: PASSWORD_RULE,
                message: PASSWORD_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'password'} />
        </div>

        <button
          type="submit"
          className="interceptor-loading w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          Đăng nhập
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-sky-500 hover:text-sky-600 font-medium hover:underline transition-colors duration-200">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
