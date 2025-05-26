import { UserPlus2 } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE
} from '~/utils/validators'
import { inviteUserToBoardAPI } from '~/apis'
import { socketIoInstance } from '~/socketClient'

const InviteBoardUser = ({ boardId }) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const handleClosePopover = () => {
    setIsOpenPopover(false)
    reset()
  }

  const handleTogglePopover = () => {
    setIsOpenPopover(prev => !prev)
  }

  const submitInviteUserToBoard = (data) => {
    const { inviteeEmail } = data
    // Gọi API mời người dùng vào board
    inviteUserToBoardAPI({ boardId, inviteeEmail }).then((invitation) => {

      // Clear input value sử dụng react-hook-form bằng setValue, đồng thời đóng popover
      setValue('inviteeEmail', '')
      handleClosePopover()

      // Mời một người dùng vào board xong thì cũng sẽ gửi/emit sự kiện socket lên server (tính năng real-time) (FE_USER_INVITED_TO_BOARD)
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })
  }

  useEffect(() => {
    if (!isOpenPopover) return

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        handleClosePopover()
      }
    }

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target) &&
          buttonRef.current && !buttonRef.current.contains(e.target)) {
        handleClosePopover()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpenPopover])

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={handleTogglePopover}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 ${isOpenPopover ? 'bg-gray-200 dark:bg-gray-900' : ''}`}
        title="Mời users vào board"
        aria-label="Mời"
      >
        <UserPlus2 className="w-5 h-5" />
        <span className="hidden xl:inline text-sm">Mời</span>
      </button>

      {isOpenPopover && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 w-80 animate-fadeIn">
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none text-gray-900 dark:text-gray-100">
                Mời thành viên
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nhập email của người bạn muốn mời
              </p>
            </div>

            <form onSubmit={handleSubmit(submitInviteUserToBoard)} className="space-y-3">
              <div className="space-y-1">
                <input
                  placeholder="Email"
                  className={`w-full px-3 py-2 rounded-lg border transition duration-200 focus:outline-none dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 ${
                    errors['inviteeEmail']
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                      : 'border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500'
                  }`}
                  {...register('inviteeEmail', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: EMAIL_RULE,
                      message: EMAIL_RULE_MESSAGE
                    }
                  })}
                />
                <FieldErrorAlert errors={errors} fieldName={'inviteeEmail'} />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClosePopover}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-md bg-sky-500 hover:bg-sky-600 text-white transition-colors duration-200"
                >
                  Gửi lời mời
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InviteBoardUser