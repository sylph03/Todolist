import React from 'react'
import DarkModeToggler from '../ModeSelect/DarkModeToggler'
import { ListTodo, Bell, User } from 'lucide-react'

function AppBar() {
  return (
    <div className="w-full h-14 bg-[#1e88e5] dark:bg-gray-800 flex items-center px-4 shadow-md z-1">
      {/* AppBar Left */}
      <div className="flex items-center">
        <ListTodo className="size-6 text-white" />
      </div>

      {/* AppBar Mid */}
      <div className="flex-1 text-center font-semibold text-lg">
        ToDo
      </div>

      {/* AppBar Right */}
      <div className="flex items-center gap-3">
        <DarkModeToggler />
        <button className="rounded-full appbar-button-custom p-2">
          <Bell className="size-4.5" />
        </button>
        <button className="p-0.5 rounded-full hover:bg-[#42a5f5] dark:hover:bg-white/20 transition">
          <img src='https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg' alt="User Avatar" className="h-8 w-8 rounded-full object-cover"/>
        </button>
      </div>
    </div>
  )
}

export default AppBar