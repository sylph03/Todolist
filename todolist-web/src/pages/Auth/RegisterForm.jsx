import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { UserPlus } from 'lucide-react'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import { toast } from 'react-toastify'
import { registerUserAPI } from '~/apis'

const RegisterForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const navigate = useNavigate()

  const submitRegister = (data) => {
    const { email, password } = data
    toast.promise(
      registerUserAPI({ email, password }),
      { pending: 'Đang tiến hành đăng ký...' }
    ). then(user => {
      navigate(`/login?registeredEmail=${user.email}`)
    })
  }

  return (
    <div className="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
      <div className="flex flex-col items-center mb-8">
        {/* <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-sky-600" />
        </div> */}
        <h2 className="text-3xl font-bold text-gray-800">Đăng ký</h2>
        {/* <p className="text-gray-500 mt-2">Tạo tài khoản mới của bạn</p> */}
      </div>

      <form onSubmit={handleSubmit(submitRegister)} className="space-y-5">
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
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Xác nhận mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none ${
              errors['confirmPassword']
                ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                : 'border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 hover:border-sky-400'
            }`}
            placeholder="Nhập lại mật khẩu"
            {...register('confirmPassword', {
              validate: (value) => {
                if (value === watch('password')) return true
                return 'Mật khẩu không khớp!'
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'confirmPassword'} />
        </div>
        <button
          type="submit"
          className="interceptor-loading w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg"
        >
          Đăng ký
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-sky-500 hover:text-sky-600 font-medium hover:underline transition-colors duration-200">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}

export default RegisterForm
