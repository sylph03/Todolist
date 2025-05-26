import React from 'react'

const colorOptions = [
  { name: 'Green', bgTitleColumn: 'bg-green-500 dark:bg-green-600', bgColumn: 'bg-green-100 dark:bg-green-900/20' },
  { name: 'Orange', bgTitleColumn: 'bg-orange-500 dark:bg-orange-600', bgColumn: 'bg-orange-100 dark:bg-orange-900/20' },
  { name: 'Yellow', bgTitleColumn: 'bg-yellow-500 dark:bg-yellow-600', bgColumn: 'bg-yellow-100 dark:bg-yellow-900/20' },
  { name: 'Red', bgTitleColumn: 'bg-red-500 dark:bg-red-600', bgColumn: 'bg-red-100 dark:bg-red-900/20' },
  { name: 'Sky', bgTitleColumn: 'bg-sky-500 dark:bg-sky-600', bgColumn: 'bg-sky-100 dark:bg-sky-900/20' },

  { name: 'Blue', bgTitleColumn: 'bg-blue-500 dark:bg-blue-600', bgColumn: 'bg-blue-100 dark:bg-blue-900/20' },
  { name: 'Indigo', bgTitleColumn: 'bg-indigo-500 dark:bg-indigo-600', bgColumn: 'bg-indigo-100 dark:bg-indigo-900/20' },
  { name: 'Purple', bgTitleColumn: 'bg-purple-500 dark:bg-purple-600', bgColumn: 'bg-purple-100 dark:bg-purple-900/20' },
  { name: 'Pink', bgTitleColumn: 'bg-pink-500 dark:bg-pink-600', bgColumn: 'bg-pink-100 dark:bg-pink-900/20' },
  { name: 'Rose', bgTitleColumn: 'bg-rose-500 dark:bg-rose-600', bgColumn: 'bg-rose-100 dark:bg-rose-900/20' },
  { name: 'Amber', bgTitleColumn: 'bg-amber-500 dark:bg-amber-600', bgColumn: 'bg-amber-100 dark:bg-amber-900/20' },
  { name: 'Lime', bgTitleColumn: 'bg-lime-500 dark:bg-lime-600', bgColumn: 'bg-lime-100 dark:bg-lime-900/20' },
  { name: 'Emerald', bgTitleColumn: 'bg-emerald-500 dark:bg-emerald-600', bgColumn: 'bg-emerald-100 dark:bg-emerald-900/20' },
  { name: 'Teal', bgTitleColumn: 'bg-teal-500 dark:bg-teal-600', bgColumn: 'bg-teal-100 dark:bg-teal-900/20' },
  { name: 'Cyan', bgTitleColumn: 'bg-cyan-500 dark:bg-cyan-600', bgColumn: 'bg-cyan-100 dark:bg-cyan-900/20' }
];


const ColorPickerPopup = ({
  position,
  selectedColor,
  onColorChange,
  className = ''
}) => {
  return (
    <div
      className={`z-100 fixed bg-white dark:bg-gray-900 p-3 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-64 animate-fadeIn color-picker-popup ${className}`}
      style={position ? { top: position.top, left: position.left } : {}}
    >
      <div className="grid grid-cols-5 gap-2">
        {colorOptions.map((color) => (
          <button
            key={color.bgTitleColumn}
            onClick={() => onColorChange(color.bgTitleColumn)}
            className={`w-8 h-8 rounded-md ${color.bgTitleColumn} hover:scale-110 transition-all duration-200 relative ${
              selectedColor === color.bgTitleColumn ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
            }`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}

export { colorOptions }
export default ColorPickerPopup