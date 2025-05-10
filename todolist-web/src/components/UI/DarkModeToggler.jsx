import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '../../Context/ThemeContext'

const DarkModeToggler = () => {
  const { darkMode, setDarkMode } = useDarkMode()

  return (
    <button onClick = { () => setDarkMode(!darkMode) } className='appbar-button-custom p-2 rounded-full hover:bg-white/10 transition-colors duration-200'>
      { darkMode ? <Sun className='size-5 text-white dark:text-gray-300'/> : <Moon className='size-5 text-white dark:text-gray-300'/>}
    </button>
  )
}

export default DarkModeToggler