import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useDarkMode } from '../../Context/ThemeContext'

const DarkModeToggler = () => {
  const { darkMode, setDarkMode } = useDarkMode()

  return (
    <button onClick = { () => setDarkMode(!darkMode) } className='appbar-button-custom p-2'>
      { darkMode ? <Sun className='size-4.5'/> : <Moon className='size-4.5'/>}
    </button>
  )
}

export default DarkModeToggler