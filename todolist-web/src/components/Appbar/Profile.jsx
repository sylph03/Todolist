import React, { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from '~/Context/ConfirmProvider'

const Profile = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const { confirm } = useConfirm()

  const hanleLogout = async () => {
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
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
      <button
        className={`p-0.5 rounded-full transition relative ${
          menuOpen ? 'ring-2 ring-white/40 dark:ring-gray-500' : 'hover:ring-2 hover:ring-white/40 dark:hover:ring-gray-500'
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <img
          src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'}
          alt="User Avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute right-0 top-11 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 shadow-lg rounded-lg p-2 w-44 z-30">
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <User className="size-4" />
            <span className="text-sm">Hồ sơ</span>
          </button>
          <button className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Settings className="size-4" />
            <span className="text-sm">Cài đặt</span>
          </button>
          <button onClick={hanleLogout} className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <LogOut className="size-4" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      )}
    </>
  )
}

export default Profile