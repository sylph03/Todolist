import React from 'react'

const FieldErrorAlert = ({ errors, fieldName }) => {
  if (!errors || !errors[fieldName]) return null

  return (
    <div className="text-red-500 text-sm mt-1">
      {errors[fieldName]?.message}
    </div>
  )
}

export default FieldErrorAlert
