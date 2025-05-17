import React from 'react'
import { X, Image, Calendar, Users, UserPlus, Paperclip, CheckSquare, Copy, Archive, Share2, FileText, Activity, Text } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCurrentActiveCard, selectCurrentActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ActiveCard = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)

  const board = useSelector(selectCurrentActiveBoard)
  const column = board?.columns.find(column => column._id === activeCard.columnId)

  const handleModalClose = () => {
    dispatch(clearCurrentActiveCard())
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/40 animate-fadeIn overflow-y-auto overflow-x-hidden m-0">
      {/* Modal Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div 
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-300 ease-out flex flex-col my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Card Cover */}
          {activeCard?.cover && (
            <div className="w-full bg-sky-200 relative rounded-t-xl">
              <div className="w-[40%] mx-auto bg-sky-200 h-[140px] md:h-[180px] lg:h-[220px] overflow-hidden">
                <img
                  src={activeCard.cover}
                  alt="cover"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 right-6 text-white bg-black/40 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  Ảnh bìa
                </span>
              </div>
            </div>
          )}

          {/* Title & List */}
          <div className="pt-6">
            <div className="flex items-center gap-2 mb-2 px-4">
              <input
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100 break-words bg-transparent border-2 rounded-sm border-transparent focus:border-sky-500 hover:border-sky-400 outline-none transition-colors duration-200 w-[92%] py-1.5 px-2"
                value={activeCard?.title || ''}
                onChange={e => {/* TODO: handle title change */}}
                placeholder="Nhập tiêu đề..."
              />
            </div>
            <div className="px-6 text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Trạng thái: <b>{column?.title}</b></span>
              </span>
            </div>
            {
              activeCard?.members?.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Thành viên:
                </span>
                <div className="flex -space-x-2">
                  {activeCard?.members?.map((member) => (
                    <img
                      key={member._id}
                      src={member.avatar || 'https://default-avatar-url.jpg'}
                      alt={member.displayName}
                      title={member.displayName}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                    />
                  ))}
                  {/* Nút thêm thành viên */}
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                    <UserPlus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div>
            
          </div>
          <div className="flex-1 flex flex-col md:flex-row gap-6 px-6 pb-6">
            {/* Left: Main Info */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Text className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="font-semibold text-gray-900 dark:text-gray-100">Mô tả</span>
                </div>
                <textarea
                  className="w-full min-h-[80px] rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-y"
                  placeholder="Thêm mô tả chi tiết..."
                />
                <div className="flex gap-2 mt-2">
                  <button className="px-4 py-1.5 bg-sky-600 text-white rounded font-medium hover:bg-sky-700 transition">Lưu</button>
                  <button className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition">Hủy</button>
                </div>
              </div>

              {/* Activity */}
              <div className="mb-2 flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">Hoạt động</span>
              </div>
              <div className="mb-4">
                <input 
                  className="w-full rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all" 
                  placeholder="Viết bình luận..." 
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <img 
                    src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{currentUser?.displayName}</span>
                      <span className="text-xs text-gray-400">17:20 12 thg 3, 2025</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">Đây là bình luận!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-6">
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <UserPlus className="w-4 h-4" />
                  Tham gia
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <Users className="w-4 h-4" />
                  Thành viên
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <Calendar className="w-4 h-4" />
                  Ngày
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <Paperclip className="w-4 h-4" />
                  Đính kèm
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                  <Image className="w-4 h-4" />
                  Ảnh bìa
                </button>
              </div>
              <div>
                <div className="text-xs text-gray-400 uppercase mb-2">Thao tác</div>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <CheckSquare className="w-4 h-4" />
                    Di chuyển
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <Copy className="w-4 h-4" />
                    Sao chép
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <Archive className="w-4 h-4" />
                    Lưu trữ
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                    <Share2 className="w-4 h-4" />
                    Chia sẻ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActiveCard