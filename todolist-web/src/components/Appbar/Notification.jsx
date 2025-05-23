import React, { useState, useRef, useEffect } from 'react'
import { Bell, BellOff, Check, X, UserPlus, CheckCircle2, XCircle } from 'lucide-react'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInvitationsAPI, selectCurrentNotifications, updateBoardInvitationAPI, addNotification } from '~/redux/notification/notificationsSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'
import { useNavigate } from 'react-router-dom'

const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
}

const Notification = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef(null)
  const [newNotification, setNewNotification] = useState(false) // Kiểm tra có thông báo mới hay không

  const currentUser = useSelector(selectCurrentUser)

  const toggleNotification = () => {
    setIsNotificationOpen(!isNotificationOpen)
    // Khi click phần thông báo (icon cái chuông Bell) thì set lại trạng thái biến newNotification thành false
    setNewNotification(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Lấy dữ liệu notifications từ Redux
  const notifications = useSelector(selectCurrentNotifications)
  
  // Fetch danh sách lời mời invitations
  const dispatch = useDispatch()

  // Sử dụng useNavigate để chuyển hướng trang
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchInvitationsAPI())

    // Tạo function xử lý khi nhận được sự kiện real-time 
    const onReceiveNewInvitation = (invitation) => {
      // Nếu user đang đăng nhập hiện tại đang lưu trong redux chính là invitee trong bản ghi invitation
      if (invitation.inviteeId === currentUser._id) {
        // Thêm bản ghi invitation vào trong redux
        dispatch(addNotification(invitation))
        // Cập nhật trạng thái đang có thông báo đến
        setNewNotification(true)
      }
    }

    // Lắng nghe sự kiện real-time có tên là: BE_USER_INVITED_TO_BOARD từ server gửi về
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    // Clean Up sự kiện để ngăn chặn việc bị đăng ký lặp lại sự kiện
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }

  }, [dispatch, currentUser._id])

  const updateBoardInvitation = (status, invitationId) => {
    dispatch(updateBoardInvitationAPI({ status, invitationId }))
    .then((res) => {
      if (res.payload.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED) {
        navigate(`/boards/${res.payload.boardInvitation.boardId}`)
      }
    })

  }

  return (
    <div className="relative" ref={notificationRef}>
      <button
        onClick={toggleNotification}
        className="rounded-full appbar-button-custom p-2.5 hover:bg-white/10 transition-all duration-200 relative group"
        aria-label="Notifications"
        aria-expanded={isNotificationOpen}
      >
        <Bell className="size-5 text-white dark:text-gray-200 transition-transform duration-200 group-hover:scale-110" />
        {newNotification && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isNotificationOpen && (
        <div 
          className="absolute right-0 mt-1 w-[420px] min-w-[320px] bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
          role="dialog"
          aria-label="Notification panel"
        >
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Thông báo
              {notifications?.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 rounded-full">
                  {notifications.length}
                </span>
              )}
            </h3>
          </div>

          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {!notifications || notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700/50">
                    <BellOff className="size-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Không có thông báo mới</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {notifications?.map((notification, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-white dark:bg-gray-700/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-600/50"
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 p-2.5 bg-sky-50 dark:bg-sky-900/20 rounded-lg ring-1 ring-sky-100 dark:ring-sky-800/30">
                          <UserPlus className="size-5 text-sky-500 dark:text-sky-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="leading-relaxed text-[15px] text-gray-700 dark:text-gray-200 break-words">
                            <strong className="text-sky-600 dark:text-sky-400">{notification.inviter.displayName}</strong> đã mời bạn tham gia bảng <strong className="text-sky-600 dark:text-sky-400">{notification.board.title}</strong>
                          </p>
                          <div className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                            {moment(notification.createdAt).format('llll')}
                          </div>
                        </div>
                      </div>

                      {notification.boardInvitation.status === BOARD_INVITATION_STATUS.PENDING && (
                        <div className="flex justify-center gap-3 mt-2">
                          <button
                            onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED, notification._id)}
                            className="interceptor-loading flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          >
                            <Check className="size-4" />
                            Chấp nhận
                          </button>
                          <button
                            onClick={() => updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED, notification._id)}
                            className="interceptor-loading flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                          >
                            <X className="size-4" />
                            Từ chối
                          </button>
                        </div>
                      )}

                      {notification.boardInvitation.status === BOARD_INVITATION_STATUS.ACCEPTED && (
                        <div className="mt-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg ring-1 ring-emerald-100 dark:ring-emerald-800/30">
                          <p className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="size-4" />
                            Bạn đã chấp nhận lời mời tham gia bảng <strong>{notification.board.title}</strong>
                          </p>
                        </div>
                      )}
                      {notification.boardInvitation.status === BOARD_INVITATION_STATUS.REJECTED && (
                        <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg ring-1 ring-rose-100 dark:ring-rose-800/30">
                          <p className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400">
                            <XCircle className="size-4" />
                            Bạn đã từ chối lời mời tham gia bảng <strong>{notification.board.title}</strong>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Notification
