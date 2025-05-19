import React from 'react'
import { Shield } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { PASSWORD_RULE, PASSWORD_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { API_ROOT } from '~/utils/constants'
import { useDispatch } from 'react-redux'
import { useConfirm } from '~/Context/ConfirmProvider'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'

const SecurityTab = () => {
  const { confirm } = useConfirm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const submitChangePassword = async (data) => {
    const { currentPassword, newPassword } = data

    const res = await toast.promise(
      dispatch(updateUserAPI({ currentPassword, newPassword })),
      { pending: 'Đang cập nhật mật khẩu...' }
    )

    if (!res.error) {
      toast.success('Cập nhật mật khẩu thành công!')
      const result = await confirm({
        title: 'Đăng xuất',
        message: 'Mật khẩu đã được thay đổi. Bạn có muốn đăng nhập lại?',
        modal: true
      })

      if (result) {
        dispatch(logoutUserAPI(false))
        navigate('/login')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-sky-600 dark:text-sky-300" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Bảo mật</h3>
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-600">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Đổi mật khẩu</h4>
        <form onSubmit={handleSubmit(submitChangePassword)} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors['currentPassword']
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-sky-400 dark:focus:border-sky-300 focus:ring-1 focus:ring-sky-400 dark:focus:ring-sky-300 hover:border-sky-400 dark:hover:border-sky-400'
              }`}
              {...register('currentPassword', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'currentPassword'} />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors['newPassword']
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-sky-400 dark:focus:border-sky-300 focus:ring-1 focus:ring-sky-400 dark:focus:ring-sky-300 hover:border-sky-400 dark:hover:border-sky-400'
              }`}
              {...register('newPassword', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'newPassword'} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`w-full px-4 py-2.5 border rounded-lg transition duration-200 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                errors['confirmPassword']
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-sky-400 dark:focus:border-sky-300 focus:ring-1 focus:ring-sky-400 dark:focus:ring-sky-300 hover:border-sky-400 dark:hover:border-sky-400'
              }`}
              {...register('confirmPassword', {
                required: FIELD_REQUIRED_MESSAGE,
                validate: (value) => {
                  if (value === watch('newPassword')) return true
                  return 'Mật khẩu không khớp!'
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'confirmPassword'} />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}

export default SecurityTab