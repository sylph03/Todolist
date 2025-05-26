import React from 'react'

const colorOptions = [
  { name: 'Sky', value: 'bg-sky-200' },
  { name: 'Blue', value: 'bg-blue-200' },
  { name: 'Indigo', value: 'bg-indigo-200' },
  { name: 'Purple', value: 'bg-purple-200' },
  { name: 'Pink', value: 'bg-pink-200' },
  { name: 'Rose', value: 'bg-rose-200' },
  { name: 'Red', value: 'bg-red-200' },
  { name: 'Orange', value: 'bg-orange-200' },
  { name: 'Amber', value: 'bg-amber-200' },
  { name: 'Yellow', value: 'bg-yellow-200' },
  { name: 'Lime', value: 'bg-lime-200' },
  { name: 'Green', value: 'bg-green-200' },
  { name: 'Emerald', value: 'bg-emerald-200' },
  { name: 'Teal', value: 'bg-teal-200' },
  { name: 'Cyan', value: 'bg-cyan-200' }
]

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
            key={color.value}
            onClick={() => onColorChange(color.value)}
            className={`w-8 h-8 rounded-md ${color.value} hover:scale-110 transition-all duration-200 relative ${
              selectedColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500' : ''
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