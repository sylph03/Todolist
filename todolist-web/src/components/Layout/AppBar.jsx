import React from 'react'
import { ListTodo, Bell, User } from 'lucide-react'
import DarkModeToggler from '~/components/UI/DarkModeToggler'

function AppBar({ toggleSidebar }) {
  return (
    <div className="w-full h-HEIGHT_APPBAR min-h-HEIGHT_APPBAR bg-sky-500 dark:bg-gray-800 flex items-center justify-between px-4 shadow-md z-2">
      {/* AppBar Left */}
      <div className="flex items-center font-semibold cursor-pointer" onClick={toggleSidebar}>
        <ListTodo className="size-6 text-white mr-2" />
        ToDo
      </div>

      {/* AppBar Mid */}

      {/* AppBar Right */}
      <div className="flex items-center gap-3">
        <DarkModeToggler />
        <button className="rounded-full appbar-button-custom p-2">
          <Bell className="size-4.5" />
        </button>
        <button className="p-0.5 rounded-full hover:ring-2 hover:ring-white/40 dark:hover:ring-gray-500 transition">
          <img src='https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg' alt="User Avatar" className="h-8 w-8 rounded-full object-cover"/>
        </button>
      </div>
    </div>
  )
}

export default AppBar