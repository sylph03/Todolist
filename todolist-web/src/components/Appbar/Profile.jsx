import React, { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from '~/Context/ConfirmProvider'
import { Link } from 'react-router-dom'

const Profile = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const { confirm } = useConfirm()

  const handleLogout = async () => {
    const result = await confirm({
      title: 'Đăng xuất khỏi tài khoản của bạn?',
      message: '',
      modal: true
    })

    setMenuOpen(false)

    if (result) {
      // Thực hiện gọi API logout
      dispatch(logoutUserAPI())
    } else {
      console.log('Hủy đăng xuất!')
    }
  }

  const handleMenuClick = (e) => {
    e.stopPropagation()
    setMenuOpen(!menuOpen)
  }

  const handleMenuItemClick = () => {
    setMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <>
      <div
        ref={buttonRef}
        className={`p-0.5 rounded-full transition relative ${
          menuOpen ? 'ring-2 ring-white/40 dark:ring-gray-500' : 'hover:ring-2 hover:ring-white/40 dark:hover:ring-gray-500'
        }`}
        onClick={handleMenuClick}
      >
        <img
          src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
          alt="User Avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-11 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-2 w-44 z-50 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              to='/settings/account'
              onClick={handleMenuItemClick}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <User className="size-4" />
              <span className="text-sm">Hồ sơ</span>
            </Link>
            <Link
              to='/settings'
              onClick={handleMenuItemClick}
              className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              <Settings className="size-4" />
              <span className="text-sm">Cài đặt</span>
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <LogOut className="size-4" />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Profile