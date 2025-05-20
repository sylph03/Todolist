import React, { useRef, useEffect } from 'react'
import { X, Image, Calendar, Users, UserPlus, Paperclip, CheckSquare, Copy, Archive, Share2, FileText, Activity, Text } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCurrentActiveCard, selectCurrentActiveCard, updateCurrentActiveCard, selectIsShowActiveCard, hideActiveCard } from '~/redux/activeCard/activeCardSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import ToggleFocusInput from '../UI/ToggleFocusInput'
import DescriptionMdEditor from './DescriptionMdEditor'
import ActivitySection from './ActivitySection'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

const ActiveCard = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowActiveCard = useSelector(selectIsShowActiveCard)
  const modalRef = useRef(null)
  const titleInputRef = useRef(null)

  const board = useSelector(selectCurrentActiveBoard)
  const column = board?.columns?.find(column => column._id === activeCard?.columnId)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Trigger blur event on the title input if it exists and is focused
        if (titleInputRef.current && document.activeElement === titleInputRef.current) {
          titleInputRef.current.blur()
        }
        // Small delay to allow the blur event to complete
        setTimeout(() => {
          dispatch(hideActiveCard())
          dispatch(clearCurrentActiveCard())
        }, 100)
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        // Trigger blur event on the title input if it exists and is focused
        if (titleInputRef.current && document.activeElement === titleInputRef.current) {
          titleInputRef.current.blur()
        }
        // Small delay to allow the blur event to complete
        setTimeout(() => {
          dispatch(hideActiveCard())
          dispatch(clearCurrentActiveCard())
        }, 100)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [dispatch])

  const handleModalClose = () => {
    // Trigger blur event on the title input if it exists and is focused
    if (titleInputRef.current && document.activeElement === titleInputRef.current) {
      titleInputRef.current.blur()
    }
    // Small delay to allow the blur event to complete
    setTimeout(() => {
      dispatch(hideActiveCard())
      dispatch(clearCurrentActiveCard())
    }, 100)
  }

  // Hàm dùng chung cho các trường hợp update card
  const callApiUpdateCard = async (updateData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)

    // Cập nhật lại card đang active trong modal hiện tại
    dispatch(updateCurrentActiveCard(updatedCard))

    // Cập nhật lại bản ghi card trong activeBoard (nested data)
    dispatch(updateCardInBoard(updatedCard))
    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUpdateCardCover = (event) => {
    const error = singleFileValidator(event.target.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target.files[0])

    // Gọi API
    toast.promise(
      callApiUpdateCard(reqData).finally(() => event.target.value = ''),
      { pending: 'Đang cập nhật ảnh bìa...' }
    )
  }

  // Dùng async await ở đây để component con ActivitySection chờ và nếu thành công thì clear input comment
  const onAddCardComment = async(commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  if (!isShowActiveCard || !activeCard) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/40 animate-fadeIn overflow-y-auto overflow-x-hidden m-0">
      {/* Modal Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-300 ease-out flex flex-col my-8"
        >
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 ${activeCard?.cover ? 'dark:hover:bg-gray-800' : 'dark:hover:bg-gray-700'} transition-all duration-200 z-10`}
          >
            <X className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </button>

          {/* Card Cover */}
          {activeCard?.cover && (
            <div className="w-full relative rounded-t-xl">
              <div className="h-[146px] w-auto md:h-[176px] mx-auto bg-sky-200 overflow-hidden rounded-t-xl bg-sky-200 dark:bg-gray-700">
                <img
                  src={activeCard.cover}
                  alt="cover"
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-4 right-6 text-white bg-black/40 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  <Image className="w-4 h-4" />
                  Ảnh bìa
                </span>
              </div>
            </div>
          )}

          {/* Title & List */}
          <div className={`${activeCard?.cover ? 'pt-4' : 'pt-6'}`}>
            <div className="flex items-center gap-2 mb-2 px-4">
              <ToggleFocusInput
                ref={titleInputRef}
                value={activeCard?.title}
                onChange={onUpdateCardTitle}
                className="text-2xl font-semibold text-gray-900 dark:text-gray-100 break-words bg-transparent border rounded-lg border-transparent focus:border-sky-500 hover:border-sky-400 outline-none transition-colors duration-200 w-[92%] py-1.5 px-2"
              />
            </div>
            <div className="px-6 text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Trạng thái: <b>{column?.title}</b></span>
              </span>
            </div>
            {activeCard?.members?.length > 0 && (
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
          <div className="flex-1 flex flex-col md:flex-row gap-6 px-6 pb-6">
            {/* Left: Main Info */}
            <div className="flex-1 min-w-0">
              {/* Description */}
              <DescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />

              {/* Activity */}
              <ActivitySection cardComments={activeCard?.comments} onAddCardComment={onAddCardComment} currentUser={currentUser} />
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
                <label className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer">
                  <Image className="w-4 h-4" />
                  Ảnh bìa
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onUpdateCardCover}
                    className="hidden"
                  />
                </label>
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