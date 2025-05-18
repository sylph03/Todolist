import React, { useState } from 'react'

const ToggleFocusInput = ({
  value,
  onChange,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value)

  const handleBlur = () => {
    const trimmedValue = inputValue.trim()

    // Nếu giá trị không thay đổi hoặc rỗng thì set lại giá trị gốc từ props và return không làm gì cả
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    // Khi giá trị thay đổi thì gọi lên hàm ở Props cha để xử lý
    onChange(trimmedValue)
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
  }

  return (
    <input
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      {...props}
    />
  )
}

export default ToggleFocusInput