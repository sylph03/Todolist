import React, { useState } from 'react'
import { Plus, Search, Archive, CircleCheck, ChevronUp, Loader2, X, Image } from 'lucide-react'
import { toast } from 'react-toastify'
import { createNewCardAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

const BoardActions = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [isOpenStatusOption, setIsOpenStatusOption] = useState(false)
  const [isShowFormCreateCard, setIsShowFormCreateCard] = useState(false)
  const [selected, setSelected] = useState('todo')
  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const options = [
    { value: 'todo', label: 'Nhiệm vụ' },
    { value: 'prepare', label: 'Chuẩn bị' },
    { value: 'in-progress', label: 'Đang làm' },
    { value: 'completed', label: 'Hoàn thành' }
  ]

  const hanleClickCreateCard = () => {
    setIsShowFormCreateCard(prev => !prev)
  }

  const handleClickCancelFormCreateCard = () => {
    setSelected('todo')
    setIsOpenStatusOption(false)
    setIsShowFormCreateCard(false)
    reset()
    setCoverImage(null)
    setImagePreview(null)
  }

  const handleSelect = (value) => {
    setSelected(value)
    setIsOpenStatusOption(false)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setCoverImage(null)
    setImagePreview(null)
  }

  const addNewCard = async (data) => {
    const selectedColumn = board?.columns.find(column => column.title === options.find(option => option.value === selected)?.label)

    const newCardData = {
      boardId: board._id,
      columnId: selectedColumn._id,
      title: data.title,
      description: data.description,
      status: selected,
      cover: coverImage ? coverImage.name : ''
    }

    toast.promise(
      (async () => {
        const createdCard = await createNewCardAPI(newCardData)
        const newBoard = cloneDeep(board)
        const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
        
        if (columnToUpdate) {
          if (columnToUpdate.cards[0]?.FE_PlaceholderCard) {
            columnToUpdate.cards = [createdCard]
            columnToUpdate.cardOrderIds = [createdCard._id]
          } else {
            columnToUpdate.cards.unshift(createdCard)
            columnToUpdate.cardOrderIds.unshift(createdCard._id)
          }
        }
        
        dispatch(updateCurrentActiveBoard(newBoard))
        handleClickCancelFormCreateCard()
      })(),
      { pending: 'Đang tạo nhiệm vụ mới...' }
    ).then(res => {
      if (!res.error) {
        toast.success('Tạo nhiệm vụ mới thành công!')
      }
    })
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-3 px-1 backdrop-blur-sm">
        {/* Các nút chức năng */}
        <div className="flex gap-3 w-full md:justify-start">
          {/* Nút Thêm nhiệm vụ */}
          <button 
            onClick={hanleClickCreateCard} 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95" 
            title="Thêm nhiệm vụ" 
            aria-label="Thêm nhiệm vụ"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm nhiệm vụ</span>
          </button>

          {/* Nút Lưu nhiệm vụ */}
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white" 
            title="Lưu nhiệm vụ" 
            aria-label="Lưu nhiệm vụ"
          >
            <Archive className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Lưu nhiệm vụ</span>
          </button>

          {/* Nút Đã hoàn thành */}
          <button 
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95" 
            title="Xem nhiệm vụ đã hoàn thành" 
            aria-label="Đã hoàn thành"
          >
            <CircleCheck className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Đã hoàn thành</span>
          </button>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex items-center bg-white dark:bg-gray-600 rounded-lg px-3 py-2 shadow-md hover:shadow-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-sky-500 dark:focus-within:ring-sky-500 max-w-full md:max-w-[250px] w-full">
          <Search className="text-gray-400 dark:text-gray-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ..."
            className="bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 pl-2 w-full"
            aria-label="Tìm kiếm nhiệm vụ"
          />
        </div>
      </div>

      {/* Form tạo nhiệm vụ mới (Card mới) */}
      {isShowFormCreateCard && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/40 flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-2xl transition-all duration-300 animate-slideUp relative">
            {/* Close button */}
            <button 
              onClick={handleClickCancelFormCreateCard}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Đóng form"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Tạo Nhiệm Vụ Mới
            </h2>

            <form onSubmit={handleSubmit(addNewCard)} className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Thông tin nhiệm vụ */}
                <div className="flex flex-col basis-3/5 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên nhiệm vụ <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full p-3 rounded-xl border transition duration-200 focus:outline-none ${
                        errors['title']
                          ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                          : 'border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500'
                      }`}
                      placeholder="Nhập tên nhiệm vụ..."
                      {...register('title', {
                        required: FIELD_REQUIRED_MESSAGE
                      })}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'title'} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mô tả nhiệm vụ
                    </label>
                    <textarea
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:border-sky-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-sm resize-none transition duration-300"
                      placeholder="Thêm mô tả cho nhiệm vụ..."
                      rows="5"
                      {...register('description')}
                    />
                  </div>
                </div>

                {/* Cài đặt bên phải */}
                <div className="flex flex-col basis-2/5 p-6 gap-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Trạng thái
                    </label>
                    <div className="relative">
                      <div
                        onClick={() => setIsOpenStatusOption(!isOpenStatusOption)}
                        className={`${
                          isOpenStatusOption ? 'border-sky-500 ring-1 ring-sky-500/20' : ''
                        } w-full cursor-pointer rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-3 px-4 text-gray-800 dark:text-gray-100 hover:border-sky-500 transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{options.find((opt) => opt.value === selected)?.label}</span>
                          <ChevronUp
                            className={`${
                              isOpenStatusOption ? 'rotate-180 opacity-100' : 'opacity-0'
                            } transition-all duration-300 text-gray-500 dark:text-gray-300 w-5 h-5`}
                          />
                        </div>
                      </div>

                      {isOpenStatusOption && (
                        <ul className="absolute z-10 mt-2 p-2 w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg animate-fadeIn">
                          {options.map((option) => (
                            <li
                              key={option.value}
                              onClick={() => handleSelect(option.value)}
                              className={`px-4 py-2.5 cursor-pointer rounded-lg mb-1 transition-all duration-200 ${
                                selected === option.value
                                  ? 'bg-sky-100 dark:bg-gray-700 text-sky-600 dark:text-sky-400 font-medium'
                                  : 'hover:bg-slate-100 dark:hover:bg-gray-600'
                              }`}
                            >
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ảnh bìa
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 relative">
                        <label className="block h-[90px] px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 cursor-pointer hover:border-sky-500 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2 relative overflow-hidden">
                          {imagePreview ? (
                            <>
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                <span className="text-white text-sm">Thay đổi ảnh</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <Image className="w-5 h-5" />
                              <span>Chọn ảnh bìa</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange} 
                          />
                        </label>
                        {imagePreview && (
                          <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors duration-200 z-10"
                            title="Xóa ảnh"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClickCancelFormCreateCard}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white shadow-sm transition duration-200 hover:shadow-md active:scale-95"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="interceptor-loading flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Tạo nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default BoardActions
