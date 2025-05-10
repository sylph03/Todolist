import React, { useState } from 'react'
import { Pencil, Mail, User, Camera } from 'lucide-react'

const AccountTab = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    displayName: 'nguyenvana',
    fullName: 'Nguyen Van A',
    email: 'example@email.com'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-8">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
              <img
                src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg"
                alt="User avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-2 right-2 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-all shadow-md hover:shadow-lg cursor-pointer group"
            >
              <Camera className="w-5 h-5 text-gray-700 group-hover:text-sky-600" />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.fullName}</h2>
            <p className="text-gray-500 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {formData.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
            {isEditing ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="w-full bg-gray-50 text-gray-500 px-4 py-2.5 border border-gray-300 rounded-lg cursor-not-allowed outline-none"
            />
          </div>

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đầy đủ
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              readOnly
              className="w-full bg-gray-50 text-gray-500 px-4 py-2.5 border border-gray-300 rounded-lg cursor-not-allowed outline-none"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên hiển thị
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={formData.displayName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg outline-none transition-colors ${
                isEditing
                  ? 'border-gray-300 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 hover:border-sky-400'
                  : 'bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
            />
            <p className="text-xs text-gray-500 mt-1.5">Tên này sẽ xuất hiện trên hồ sơ công khai của bạn.</p>
          </div>

          {isEditing && (
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
