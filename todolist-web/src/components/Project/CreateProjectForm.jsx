import React, { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { createNewBoardAPI } from '~/apis'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import ColorPickerPopup, { colorOptions } from './ColorPickerPopup'

const CreateProjectForm = ({ formCreateProjectRef, setShowInput, formPosition, affterCreatedNewBoard }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      backgroundColor: 'bg-sky-200'
    }
  })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorButtonRef = useRef(null)

  const selectedColor = watch('backgroundColor')

  const handleColorPickerClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowColorPicker(!showColorPicker)
  }

  const handleColorChange = (color) => {
    setValue('backgroundColor', color)
    setShowColorPicker(false)
  }

  const submitCreateProject = async (data) => {
    const response = await createNewBoardAPI(data)
    setShowInput(false)
    reset()

    if (affterCreatedNewBoard) {
      affterCreatedNewBoard(response)
    }
  }

  return (
    <div
      ref={formCreateProjectRef}
      className="z-50 fixed w-88 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600"
      style={{ top: formPosition?.top, left: formPosition?.left }} >
      <div className="text-gray-900 dark:text-gray-100 font-semibold text-xl text-center mb-6 relative">
        Tạo bảng
        <X
          className="absolute top-1/2 right-0 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
          size={28}
          onClick={() => setShowInput(false)}
        />
      </div>

      <form onSubmit={handleSubmit(submitCreateProject)} className="space-y-4">
        <div>
          <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
            Tên bảng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Nhập tên bảng..."
            className={`w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:outline-none transition-all duration-200
              ${errors['title'] ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500' : 'border-gray-200 dark:border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500 dark:hover:border-sky-500'}`}
            {...register('title', { required: '💡Tiêu đề bảng là bắt buộc' })}
          />
          <FieldErrorAlert errors={errors} fieldName={'title'} />
        </div>

        <div>
          <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2" >
            Mô tả
          </label>
          <textarea
            placeholder="Thêm mô tả cho bảng..."
            rows="3"
            className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-3 focus:ring-1 focus:ring-sky-500 hover:border-sky-500 dark:hover:border-sky-500 focus:border-sky-500 focus:outline-none transition-all duration-200 resize-none"
            {...register('description')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Màu nền
          </label>
          <div className="relative">
            <button
              type="button"
              ref={colorButtonRef}
              onClick={handleColorPickerClick}
              className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 hover:border-sky-500 dark:hover:border-sky-500 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-md ${selectedColor}`}></span>
                <span className="text-gray-700 dark:text-gray-300">
                  {colorOptions.find(color => color.value === selectedColor)?.name || 'Chọn màu'}
                </span>
              </div>
            </button>
            {showColorPicker && (
              <ColorPickerPopup
                position={{
                  top: colorButtonRef.current?.getBoundingClientRect().bottom + 5,
                  left: colorButtonRef.current?.getBoundingClientRect().left
                }}
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          className="interceptor-loading w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl px-4 py-3 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 active:scale-95 mt-2" >
          Tạo bảng
        </button>
      </form>
    </div>
  )
}

export default CreateProjectForm