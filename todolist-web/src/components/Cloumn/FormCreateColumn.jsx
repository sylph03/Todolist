import React, { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { createNewColumnAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import ColorPickerPopup, { colorOptions } from './ColorPickerPopupColumn'

const FormCreateColumn = ({ isShowFormCreateColumn, setIsShowFormCreateColumn }) => {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const formRef = useRef(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerPosition, setColorPickerPosition] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const colorButtonRef = useRef(null)
  const colorPickerRef = useRef(null)

  const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
    defaultValues: {
      title: ''
    },
    mode: 'onChange'
  })

  const handleClickCancelFormCreateColumn = () => {
    setIsShowFormCreateColumn(false)
    reset()
    setSelectedColor(null)
    setShowColorPicker(false)
  }

  // Handle both Escape key press and click outside
  useEffect(() => {
    if (!isShowFormCreateColumn) return

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        if (showColorPicker) {
          setShowColorPicker(false)
        } else {
          handleClickCancelFormCreateColumn()
        }
      }
    }

    const handleClickOutside = (e) => {
      // Xử lý click outside cho form
      if (formRef.current && !formRef.current.contains(e.target)) {
        // Kiểm tra nếu click vào color picker thì không đóng form
        if (colorPickerRef.current?.contains(e.target)) return
        handleClickCancelFormCreateColumn()
      }

      // Xử lý click outside cho color picker
      if (showColorPicker && colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        if (colorButtonRef.current?.contains(e.target)) return
        setShowColorPicker(false)
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isShowFormCreateColumn, showColorPicker])

  const handleColorPickerClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Nếu color picker đang mở và click vào nút thay đổi màu nền thì đóng lại
    if (showColorPicker && e.currentTarget.contains(e.target)) {
      setShowColorPicker(false)
      return
    }

    const button = colorButtonRef.current
    const rect = button.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = rect.bottom + 5
    let left = rect.left

    if (top + 138 > viewportHeight) {
      top = rect.top - 138 - 10
    }

    if (left + 256 > viewportWidth) {
      left = rect.right - 256
    }

    setColorPickerPosition({ top, left })
    setShowColorPicker(true)
  }

  const handleChangeBackgroundColor = (color) => {
    const selectedColorOption = colorOptions.find(option => option.bgTitleColumn === color)
    if (selectedColorOption) {
      setSelectedColor(selectedColorOption)
      setShowColorPicker(false)
    }
  }

  const addNewColumn = async (data) => {
    const newColumnData = {
      boardId: board._id,
      title: data.title.trim(),
      bgTitleColumn: selectedColor?.bgTitleColumn || 'bg-sky-500 dark:bg-sky-600',
      bgColumn: selectedColor?.bgColumn || 'bg-sky-100 dark:bg-sky-900/20'
    }

    toast.promise(
      (async () => {
        const createdColumn = await createNewColumnAPI(newColumnData)
        const newBoard = cloneDeep(board)
        newBoard.columns.push(createdColumn)
        newBoard.columnOrderIds.push(createdColumn._id)

        const placeholderCard = generatePlaceholderCard(createdColumn)
        const newColumnIndex = newBoard.columns.length - 1
        newBoard.columns[newColumnIndex].cards.push(placeholderCard)
        newBoard.columns[newColumnIndex].cardOrderIds.push(placeholderCard._id)

        dispatch(updateCurrentActiveBoard(newBoard))
        handleClickCancelFormCreateColumn()
      })(),
      {
        pending: 'Đang tạo cột mới...',
        success: 'Tạo cột mới thành công!'
      }
    )
  }

  if (!isShowFormCreateColumn) return null

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/40 flex justify-center items-center overflow-y-auto overflow-x-hidden z-50 p-4 animate-fadeIn">
      <div ref={formRef} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-8 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 animate-slideUp relative">
        {/* Close button */}
        <button
          onClick={handleClickCancelFormCreateColumn}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95"
          aria-label="Đóng form"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Tạo Cột Mới
        </h2>

        <form onSubmit={handleSubmit(addNewColumn)} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tên cột <span className="text-red-500">*</span>
            </label>
            <input
              className={`w-full p-3 rounded-xl border transition duration-200 focus:outline-none dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 ${
                errors['title']
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500 dark:hover:border-sky-500'
              }`}
              placeholder="Nhập tên cột..."
              {...register('title', {
                required: FIELD_REQUIRED_MESSAGE,
                validate: {
                  notDuplicate: value => {
                    const trimmedValue = value.trim()
                    return !board.columns.some(col => col.title === trimmedValue) || 'Tên cột đã tồn tại trong bảng này'
                  }
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'title'} />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Màu sắc
            </label>
            <button
              ref={colorButtonRef}
              type="button"
              onClick={handleColorPickerClick}
              className={`w-full p-3 rounded-xl border transition duration-200 focus:outline-none dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:border-sky-500 dark:hover:border-sky-500 flex items-center gap-2 ${
                showColorPicker ? 'border-sky-500 dark:border-sky-500' : ''
              }`}
            >
              <div className={`w-6 h-6 rounded-md ${selectedColor?.bgTitleColumn || 'bg-sky-500 dark:bg-sky-600'}`}></div>
              <span>{selectedColor?.name || 'Sky'}</span>
            </button>
          </div>

          {/* Nút hành động */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClickCancelFormCreateColumn}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm transition duration-200 hover:shadow-md active:scale-95"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="interceptor-loading flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Tạo cột
            </button>
          </div>
        </form>
      </div>

      {/* Color Picker Popup */}
      {showColorPicker && (
        <div 
          ref={colorPickerRef} 
          onClick={(e) => e.stopPropagation()}
          className="color-picker-popup"
        >
          <ColorPickerPopup
            position={colorPickerPosition}
            selectedColor={selectedColor?.bgTitleColumn}
            onColorChange={handleChangeBackgroundColor}
          />
        </div>
      )}
    </div>
  )
}

export default FormCreateColumn
