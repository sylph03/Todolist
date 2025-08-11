import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, Image } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { createNewCardAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch } from 'react-redux'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import DescriptionMdEditor from '~/components/Card/DescriptionMdEditor'
import { singleFileValidator } from '~/utils/validators'
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import useClickOutside from '~/hooks/useClickOutside';
import useEscapeKey from '~/hooks/useEscapeKey';

const FormCreateCard = ({ isShowFormCreateCard, setIsShowFormCreateCard, board, defaultColumn }) => {
  const dispatch = useDispatch()
  const [coverImage, setCoverImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [cardDescription, setCardDescription] = useState('')
  const formRef = useRef(null)

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      status: defaultColumn?.title || ''
    },
    mode: 'onChange'
  })

  const status = watch('status')

  const options = board?.columns?.map(column => ({
    value: column.title,
    label: column.title
  })) || []

  // Reset form when defaultColumn changes
  useEffect(() => {
    if (defaultColumn) {
      setValue('status', defaultColumn.title, { shouldValidate: true })
    }
  }, [defaultColumn, setValue])

  const handleUpdateCardDescription = (description) => {
    setCardDescription(description)
  }

  const handleClickCancelFormCreateCard = useCallback(() => {
    setIsShowFormCreateCard(false)
    reset()
    setCoverImage(null)
    setImagePreview(null)
    setCardDescription('')
  }, [setIsShowFormCreateCard, reset])

  const handleSelect = (value) => {
    setValue('status', value, { shouldValidate: true })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const error = singleFileValidator(file)
      if (error) {
        toast.error(error)
        e.target.value = '' // Reset input if there's an error
        return
      }
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
    // Reset file input value
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const addNewCard = async (data) => {
    const selectedOption = options.find(option => option.value === data.status)
    const selectedColumn = board?.columns.find(column => column.title === selectedOption?.label)

    if (!selectedColumn) {
      toast.error('Không tìm thấy cột tương ứng với trạng thái đã chọn.')
      return
    }

    const newCardData = {
      boardId: board._id,
      columnId: selectedColumn._id,
      title: data.title.trim(),
      description: cardDescription
    }

    // Tạo FormData để gửi cả file và dữ liệu
    const formData = new FormData()
    // formData.append('boardId', newCardData.boardId)
    // formData.append('columnId', newCardData.columnId)
    // formData.append('title', newCardData.title)
    // formData.append('description', newCardData.description)
    Object.keys(newCardData).forEach(key => {
      formData.append(key, newCardData[key])
    })
    if (coverImage) {
      formData.append('cardCover', coverImage)
    }

    toast.promise(
      (async () => {
        const createdCard = await createNewCardAPI(formData)
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
      {
        pending: 'Đang tạo nhiệm vụ mới...',
        success: 'Tạo nhiệm vụ mới thành công!'
      }
    )
  }

  // Handle both Escape key press and click outside
  useClickOutside(formRef, () => {
    handleClickCancelFormCreateCard()
  })

  useEscapeKey(() => {
    handleClickCancelFormCreateCard()
  })

  if (!isShowFormCreateCard) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/40 animate-fadeIn overflow-y-auto overflow-x-hidden">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={formRef} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-[700px] transition-all duration-300 animate-slideUp relative my-8">
          {/* Close button */}
          <button
            onClick={handleClickCancelFormCreateCard}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            aria-label="Đóng form"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-gray-800 dark:text-gray-100">
            Tạo Nhiệm Vụ Mới
          </h2>

          <form onSubmit={handleSubmit(addNewCard)} className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Thông tin nhiệm vụ */}
              <div className="flex flex-col flex-1 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên nhiệm vụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full p-3 rounded-xl border transition duration-200 focus:outline-none dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 ${
                      errors['title']
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                        : 'border-gray-300 dark:border-gray-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500 dark:hover:border-sky-500'
                    }`}
                    placeholder="Nhập tên nhiệm vụ..."
                    {...register('title', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: {
                        value: 3,
                        message: 'Tên nhiệm vụ phải có ít nhất 3 ký tự'
                      }
                    })}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'title'} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả nhiệm vụ
                  </label>
                  <DescriptionMdEditor
                    isCreateCard={true}
                    cardDescriptionProp={cardDescription}
                    handleUpdateCardDescription={handleUpdateCardDescription}
                  />
                </div>
              </div>

              {/* Cài đặt bên phải */}
              <div className="flex flex-col w-full lg:w-64 h-fit p-4 md:p-6 gap-4 md:gap-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Listbox value={status} onChange={handleSelect}>
                      <div className="relative">
                        <Listbox.Button className={`w-full py-2.5 md:py-3 px-3 md:px-4 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border ${errors['status'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all hover:border-sky-500 dark:hover:border-sky-500 flex justify-between items-center`}>
                          {options.find((opt) => opt.value === status)?.label || 'Chọn trạng thái'}
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-2 p-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg animate-fadeIn max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                          {options.map((option) => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active, selected }) =>
                                `px-3 md:px-4 py-1.5 md:py-2 cursor-pointer rounded-lg mb-1 transition-all duration-200 ${
                                  selected ? 'bg-sky-100 dark:bg-gray-800 text-sky-500 font-medium shadow-sm' : ''
                                } ${active ? 'hover:bg-slate-100 dark:hover:bg-gray-700 hover:shadow-sm' : ''}`
                              }
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{option.label}</span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  <FieldErrorAlert errors={errors} fieldName={'status'} />
                  <input
                    type="hidden"
                    {...register('status', {
                      required: 'Vui lòng chọn trạng thái'
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ảnh bìa
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <label className="min-h-[80px] md:min-h-[90px] w-full h-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-300 cursor-pointer hover:border-sky-500 dark:hover:border-sky-500 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center justify-center gap-2 relative overflow-hidden">
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-auto object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                              <span className="text-white text-sm">Thay đổi ảnh</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Image className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-sm">Chọn ảnh bìa</span>
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
                          className="absolute top-2 right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 z-10"
                          title="Xóa ảnh"
                          type="button"
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5" />
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
                className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 shadow-sm transition duration-200 hover:shadow-md active:scale-95"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="interceptor-loading flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed dark:from-sky-600 dark:to-blue-700 dark:hover:from-sky-700 dark:hover:to-blue-800"
              >
                Tạo nhiệm vụ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FormCreateCard
