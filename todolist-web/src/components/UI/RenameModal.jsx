import React, { useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from './FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

const RenameModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  currentValue,
  validateValue,
  placeholder = 'Nhập tên mới...',
  submitButtonText = 'Đổi tên'
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty, isValid }
  } = useForm({
    defaultValues: {
      title: ''
    },
    mode: 'onChange'
  })

  const renameInputRef = useRef(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setValue('title', currentValue, {
        shouldValidate: false,
        shouldDirty: true
      })
    } else {
      reset()
    }
  }, [isOpen, currentValue, setValue, reset])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && renameInputRef.current) {
      renameInputRef.current.focus()
    }
  }, [isOpen])

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = async (data) => {
    await onSubmit(data.title.trim())
    handleCancel()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[400px] p-6 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            onClick={handleCancel}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <input
              {...register('title', {
                required: FIELD_REQUIRED_MESSAGE,
                validate: (value) => {
                  if (validateValue && validateValue(value)) {
                    return validateValue(value)
                  }
                  return true
                }
              })}
              ref={(e) => {
                register('title').ref(e)
                renameInputRef.current = e
              }}
              spellCheck={false}
              className={`w-full px-3 py-2 text-sm rounded-lg border 
                ${errors.title ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-sky-500 dark:focus:border-sky-400'}
                bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                focus:outline-none focus:ring-1
                ${errors.title ? 'focus:ring-red-500 dark:focus:ring-red-500' : 'focus:ring-sky-500 dark:focus:ring-sky-400'}
                placeholder-gray-400 dark:placeholder-gray-500
                transition-colors duration-200`}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
            />
            <FieldErrorAlert errors={errors} fieldName="title" />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isDirty || !isValid}
              className={`interceptor-loading px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors 
                ${!isDirty || !isValid ? 'bg-sky-400/50 dark:bg-sky-500/50 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600'}`}
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RenameModal 