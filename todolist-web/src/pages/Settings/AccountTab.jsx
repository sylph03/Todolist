import React, { useState } from 'react'
import { Pencil, Mail, User, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { updateUserAPI } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

const AccountTab = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const [isEditing, setIsEditing] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      displayName: currentUser?.displayName,
    }
  })

  const submitChageGeneralInfomation = (data) => {
    const { displayName } = data

    // Nếu không có sự thay đổi gì thì không làm gì cả
    if (displayName === currentUser?.displayName) return

    toast.promise(
      dispatch(updateUserAPI({ displayName })),
      { pending: 'Đang cập nhật thông tin...'}
      ).then(res => {
        // Đoạn này phải kiểm tra không có lỗi thì mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Cập nhật thông tin thành công!')
        }
      })

    setIsEditing(false)
  }

  const handleCancel = () => {
    reset() // Reset form về giá trị mặc định
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-600">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={`${currentUser?.avatar ? currentUser.avatar : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}`}
                alt="User avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg cursor-pointer group"
            >
              <Camera className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-sky-600 dark:group-hover:text-sky-300" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                aria-label="Thay đổi ảnh đại diện"
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {currentUser?.displayName}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {currentUser?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600 dark:text-sky-300" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Thông tin cá nhân</h3>
          </div>
          <button
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 dark:text-sky-300 hover:text-sky-700 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <form onSubmit={handleSubmit(submitChageGeneralInfomation)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ Email
            </label>
            <input
              id="email"
              value={currentUser?.email}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed outline-none"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên đầy đủ
            </label>
            <input
              id="fullName"
              value={currentUser?.username}
              className="w-full bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg cursor-not-allowed outline-none"
              readOnly
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên hiển thị <span className="text-red-500">*</span>
            </label>
            <input
              id="displayName"
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                isEditing
                  ? errors['displayName']
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500 text-gray-900 dark:text-white'
                    : 'border-gray-300 focus:border-sky-400 focus:ring-1 focus:ring-sky-400 hover:border-sky-400 text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed'
              }`}
              {...register('displayName', {
                required: FIELD_REQUIRED_MESSAGE,
                disabled: !isEditing
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'displayName'} />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">Tên này sẽ xuất hiện trên hồ sơ công khai của bạn.</p>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                className="interceptor-loading w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AccountTab