import React from 'react'
import { ListTodo, Bell, User, Settings, LogOut } from 'lucide-react'
import DarkModeToggler from '~/components/UI/DarkModeToggler'
import Profile from '../Appbar/Profile'

function AppBar({ toggleSidebar }) {

  return (
    <div className="w-full h-HEIGHT_APPBAR min-h-HEIGHT_APPBAR bg-sky-500 dark:bg-gray-800 flex items-center justify-between px-4 shadow-md z-20">
      {/* AppBar Left */}
      <div className="flex items-center font-semibold cursor-pointer" onClick={toggleSidebar}>
        <ListTodo className="size-6 text-white mr-2" />
        ToDo
      </div>

      {/* AppBar Right */}
      <div className="flex items-center gap-3">
        <DarkModeToggler />
        <button className="rounded-full appbar-button-custom p-2">
          <Bell className="size-4.5 text-white dark:text-gray-300" />
        </button>
        <Profile/>
      </div>
    </div>
  )
}

export default AppBar
