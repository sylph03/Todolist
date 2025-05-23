import React from 'react'
import { ListTodo, Bell, User, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import DarkModeToggler from '~/components/UI/DarkModeToggler'
import Profile from '../Appbar/Profile'
import Notification from '../Appbar/Notification'
const AppBar = () => {
  return (
    <div className="w-full h-HEIGHT_APPBAR min-h-HEIGHT_APPBAR bg-gradient-to-r from-sky-500 to-sky-600 dark:from-gray-800 dark:to-gray-900 flex items-center justify-between px-6 shadow-lg z-20 transition-all duration-300">
      {/* AppBar Left */}
      <Link
        to="/"
        className="flex items-center justify-center font-semibold text-white cursor-pointer hover:opacity-80 transition-opacity duration-200"
      >
        <ListTodo className="size-6 text-white mr-2" />
        <span className="text-lg font-bold tracking-wide">ToDo</span>
      </Link>

      {/* AppBar Right */}
      <div className="flex items-center gap-3">
        <DarkModeToggler />
        <Notification />
        <Profile />
      </div>
    </div>
  )
}

export default AppBar
