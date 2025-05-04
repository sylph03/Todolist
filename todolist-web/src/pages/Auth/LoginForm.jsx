import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitLogIn = (data) => {
    console.log('submit login: ', data)
  }

  return (
    <div className="w-md p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Đăng nhập</h2>
      <form onSubmit={handleSubmit(submitLogIn)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            className={`w-full px-4 py-2 border rounded-lg transition duration-200 focus:outline-none ${
              errors['email']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 hover:border-blue-400'
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
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className={`w-full px-4 py-2 border rounded-lg transition duration-200 focus:outline-none ${
              errors['password']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 hover:border-blue-400'
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
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105"
        >
          Đăng nhập
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-blue-500 hover:underline font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  )
}

export default LoginForm
