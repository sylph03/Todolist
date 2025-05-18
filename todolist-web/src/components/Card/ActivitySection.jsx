import React from 'react'
import { Activity, Send } from 'lucide-react'
import moment from 'moment'

const ActivitySection = ({ currentUser }) => {

  const handleAddCardComment = (event) => {
    // Bắt hành động người dùng nhấn Enter && không phải hành động shift + enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault() // Thêm dòng này để khi Enter không bị nhảy dòng
      if (!event.target.value) return // Nếu không có giá trị gì thì không làm gì

      // Tạo biến commend data để gửi api
      const commentToAdd = {
        userAvatar: currentUser?.avatar,
        userDisplayName: currentUser?.displayName,
        content: event.target.value.trim(),
      }
    }
  }

  return (
    <>
      <div className="mb-2 flex items-center gap-2">
        <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">Hoạt động</span>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <img
          src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
          alt="User Avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="relative flex-1">
          <input
            onKeyDown={handleAddCardComment}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2.5 pr-10 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 hover:border-sky-500 dark:hover:border-sky-500 focus:outline-none transition-all duration-200"
            placeholder="Viết bình luận..."
          />
          <Send className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-sky-500 cursor-pointer transition-colors duration-200" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 text-sm group">
          <img
            src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-100 dark:ring-sky-900"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.displayName}</span>
              <span className="text-xs text-gray-400">{moment().format('llll')}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg shadow-sm leading-6 transition-shadow duration-200">
              Đây là bình luận!<br/>Test comment
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <img
            src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-100 dark:ring-sky-900"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.displayName}</span>
              <span className="text-xs text-gray-400">{moment().format('llll')}</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-lg shadow-sm leading-6 transition-shadow duration-200">
              Đây là bình luận!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivitySection