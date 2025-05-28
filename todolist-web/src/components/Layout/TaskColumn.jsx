import React, { useState, useRef, useEffect } from 'react'
import TaskCard from './TaskCard'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Ellipsis, Plus, Pencil, Trash2, X } from 'lucide-react'
import ColorPickerPopup, { colorOptions } from '../Cloumn/ColorPickerPopupColumn'
import { updateColumnDetailsAPI, deleteColumnDetailsAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '../UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FormCreateCard from '../Card/FormCreateCard'
import { useConfirm } from '~/Context/ConfirmProvider'
import RenameModal from '../UI/RenameModal'

const TaskColumn = ({ column, cursor }) => {
  const dispatch = useDispatch()
  const { confirm } = useConfirm()
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const [showMenu, setShowMenu] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerPosition, setColorPickerPosition] = useState(null)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showFormCreateCard, setShowFormCreateCard] = useState(false)
  const menuRef = useRef(null)
  const ellipsisButtonRef = useRef(null)
  const [menuPosition, setMenuPosition] = useState(null)
  const renameInputRef = useRef(null)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none'
  }

  // Cards đã được sắp xếp ở component cha cao nhất (boards/_id.jsx)
  const orderedCards = column.cards

  const updateMenuPosition = () => {
    if (ellipsisButtonRef.current && menuRef.current) {
      const buttonRect = ellipsisButtonRef.current.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Tính toán vị trí mặc định (bên phải nút)
      let top = buttonRect.bottom + 5
      let left = buttonRect.left

      // Kiểm tra và điều chỉnh vị trí ngang
      if (left + menuRect.width > viewportWidth) {
        // Nếu menu bị tràn bên phải, đặt nó bên trái nút
        left = viewportWidth - menuRect.width - 5
      }

      setMenuPosition({ top, left })
    }
  }

  // Xử lý click outside và ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Xử lý click outside cho menu
      if (showMenu && menuRef.current && !menuRef.current.contains(event.target)) {
        if (ellipsisButtonRef.current?.contains(event.target)) return

        if (showMenu && event.target.closest('.color-picker-popup')) return

        setShowMenu(false)
      }

      // Color picker
      if (showColorPicker && !event.target.closest('.color-picker-popup') && !event.target.closest('.color-change-button')) {
        setShowColorPicker(false)
      }
    }

    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (showColorPicker) {
          setShowColorPicker(false)
        } else if (showMenu) {
          setShowMenu(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscKey)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [showMenu, showColorPicker])

  // Cập nhật vị trí menu khi scroll hoặc resize
  useEffect(() => {
    if (showMenu) {
      const handleScroll = () => {
        updateMenuPosition()
      }

      const handleResize = () => {
        updateMenuPosition()
      }

      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [showMenu])

  const handleEllipsisClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowMenu(prev => !prev)
    if (!showMenu) {
      // Cập nhật vị trí menu khi mở
      setTimeout(updateMenuPosition, 0)
    }
  }

  const handleColorPickerClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Nếu color picker đang mở và click vào nút thay đổi màu nền thì đóng lại
    if (showColorPicker && e.currentTarget.contains(e.target)) {
      setShowColorPicker(false)
      return
    }

    const button = e.currentTarget
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

  const handleChangeBackgroundColor = async (color) => {
    // Tìm color option tương ứng
    const selectedColor = colorOptions.find(option => option.bgTitleColumn === color)
    if (!selectedColor) {
      toast.error('Không tìm thấy màu được chọn!')
      return
    }

    // Cập nhật cả bgTitleColumn và bgColumn
    const response = await updateColumnDetailsAPI(column._id, { 
      bgTitleColumn: selectedColor.bgTitleColumn,
      bgColumn: selectedColor.bgColumn 
    })

    if (response) {
      // Cập nhật column trong active board
      const updatedColumns = activeBoard.columns.map(col => 
        col._id === column._id 
          ? { ...col, bgTitleColumn: selectedColor.bgTitleColumn, bgColumn: selectedColor.bgColumn }
          : col
      )

      // Cập nhật active board
      dispatch(updateCurrentActiveBoard({
        ...activeBoard,
        columns: updatedColumns
      }))

      toast.success('Cập nhật màu sắc thành công!')
    }
    setShowColorPicker(false)
  }

  const handleRenameClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowRenameModal(true)
    setShowMenu(false)
  }

  const handleRenameSubmit = async (newTitle) => {
    const response = await updateColumnDetailsAPI(column._id, { title: newTitle })
    if (response) {
      // Cập nhật column trong active board
      const updatedColumns = activeBoard.columns.map(col => 
        col._id === column._id 
          ? { ...col, title: newTitle }
          : col
      )

      // Cập nhật active board
      dispatch(updateCurrentActiveBoard({
        ...activeBoard,
        columns: updatedColumns
      }))

      toast.success('Đổi tên cột thành công!')
    }
  }

  const handleRenameCancel = () => {
    setShowRenameModal(false)
  }

  // Focus input when modal opens
  useEffect(() => {
    if (showRenameModal && renameInputRef.current) {
      renameInputRef.current.focus()
    }
  }, [showRenameModal])

  const handleAddCardClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowFormCreateCard(true)
    setShowMenu(false)
  }

  const handleDeleteColumn = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Đóng menu options trước
    setShowMenu(false)

    const result = await confirm({
      title: 'Xoá Cột',
      message: `Hành động này sẽ xóa vĩnh viễn tất cả nhiệm vụ thuộc cột "${column.title}"! Bạn có chắc chắn không?`,
      modal: true
    })

    if (result) {
      const response = await deleteColumnDetailsAPI(column._id)
      if (response) {
        // Cập nhật state boards sau khi xóa
        const updatedColumns = activeBoard.columns.filter(col => col._id !== column._id)
        dispatch(updateCurrentActiveBoard({
          ...activeBoard,
          columns: updatedColumns
        }))

        toast.success('Xóa cột thành công!')
      }
    }
  }

  return (
    <>
      <div className="select-none min-w-[352px] w-[352px] h-HEIGHT_BOARD_COLUMN min-h-HEIGHT_BOARD_COLUMN px-1" ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
        <div className={`relative w-full h-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-xl ${column?.bgColumn ? column.bgColumn : 'bg-sky-100 dark:bg-sky-900/20'}`}>
          {/* Column Title */}
          <div
            {...listeners}
            className={`flex items-center justify-between text-white text-sm md:text-base px-6 h-HEIGHT_COLUMN_TITLE font-semibold tracking-wide rounded-t-xl ${column?.bgTitleColumn ? column.bgTitleColumn : 'bg-sky-500 dark:bg-sky-600'} ${cursor || 'cursor-grab'} hover:opacity-95 transition duration-200`}
          >
            <span className="truncate">{column?.title}</span>
            <div className="flex items-center gap-2">
              <button 
                ref={ellipsisButtonRef}
                data-no-dnd="true"
                onClick={handleEllipsisClick}
                className={`p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer ${showMenu ? 'bg-white/20' : ''}`}>
                <Ellipsis className="w-5 h-5" />
              </button>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {orderedCards?.[0]?.FE_PlaceholderCard ? 0 : orderedCards?.length || 0}
              </span>
            </div>
          </div>

          {/* Cards area */}
          <SortableContext items={orderedCards?.map((card) => card._id)} strategy={verticalListSortingStrategy}>
            <div className="w-full h-HEIGHT_COLUMN_CONTENT">
              <div className="p-4 space-y-3 overflow-y-auto overflow-x-hidden w-full h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {orderedCards?.length > 0 ? (
                  orderedCards.map((card) => <TaskCard key={card._id} card={card} />)
                ) : (
                  <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 text-sm">
                    No tasks yet
                  </div>
                )}
              </div>
            </div>
          </SortableContext>
        </div>
      </div>

      {showMenu && (
        <div 
          ref={menuRef}
          className="fixed z-100 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-56 animate-fadeIn"
          style={{
            top: menuPosition?.top,
            left: menuPosition?.left
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-center relative py-3 px-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Thao tác</h3>
            <button
              onClick={() => setShowMenu(false)}
              className="absolute right-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <div className="flex flex-col gap-1">
              <button
                onClick={handleAddCardClick}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm thẻ</span>
              </button>
              <button
                onClick={handleRenameClick}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out"
              >
                <Pencil className="w-4 h-4" />
                <span>Đổi tên</span>
              </button>
              <button
                onClick={handleColorPickerClick}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ease-in-out color-change-button ${showColorPicker ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <span className={`w-4 h-4 rounded-sm ${column?.bgTitleColumn || 'bg-sky-500 dark:bg-sky-600'}`}></span>
                <span>Thay đổi màu nền</span>
              </button>
              <button
                onClick={handleDeleteColumn}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ease-in-out"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xoá</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Popup */}
      {showColorPicker && (
        <ColorPickerPopup
          position={colorPickerPosition}
          selectedColor={column?.bgTitleColumn}
          onColorChange={handleChangeBackgroundColor}
        />
      )}

      {/* Rename Modal */}
      <RenameModal
        isOpen={showRenameModal}
        onClose={handleRenameCancel}
        onSubmit={handleRenameSubmit}
        title="Đổi tên cột"
        currentValue={column?.title}
        validateValue={(value) => {
          if (value.trim() === column?.title) {
            return 'Tên cột phải khác tên hiện tại'
          }
          return true
        }}
        placeholder="Tiêu đề cột"
      />

      {/* Form Create Card */}
      <FormCreateCard
        isShowFormCreateCard={showFormCreateCard}
        setIsShowFormCreateCard={setShowFormCreateCard}
        board={activeBoard}
        defaultColumn={column}
      />
    </>
  )
}

export default TaskColumn

