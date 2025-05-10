import React, { useState } from 'react'
import { Plus, Search, Archive, CircleCheck, ChevronUp, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { createNewCardAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'


const BoardActions = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const [isOpenStatusOption, setIsOpenStatusOption] = useState(false)
  const [isShowFormCreateCard, setIsShowFormCreateCard] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const [newCardDescription, setNewCardDescription] = useState('')
  const [selected, setSelected] = useState('todo')
  const [coverImage, setCoverImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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
  }

  const handleSelect = (value) => {
    setSelected(value)
    setIsOpenStatusOption(false)
  }

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Vui lòng nhập tên nhiệm vụ')
      return
    }

    setIsLoading(true)
    try {
      const selectedColumn = board?.columns.find(column => column.title === options.find(option => option.value === selected)?.label)

      const newCardData = {
        boardId: board._id,
        columnId: selectedColumn._id,
        title: newCardTitle,
        description: newCardDescription,
        status: selected,
        cover: coverImage ? coverImage.name : ''
      }

      const createdCard = await createNewCardAPI(newCardData)
      // Cập nhật state board
    // Tự set lại state board thay vì gọi fetch BoardApi
    // Dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operation là Shallow Copy/Clone,
    // nên dính quy tắc của Immutability trong redux toolkit không dùng được hàm push/unshift, trường hợp này dùng Deep Copy/Clone toàn bộ Board (cách khác là dùng concat() thay vì push/unshift)
    // const newBoard = { ...board }
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
      
      if (columnToUpdate) {
        if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
          columnToUpdate.cards = [createdCard]
          columnToUpdate.cardOrderIds = [createdCard._id]
        } else {
          columnToUpdate.cards.unshift(createdCard)
          columnToUpdate.cardOrderIds.unshift(createdCard._id)
        }
        toast.success('Thêm nhiệm vụ mới thành công!')
      }
      
      dispatch(updateCurrentActiveBoard(newBoard))

      setNewCardTitle('')
      setNewCardDescription('')
      setSelected('todo')
      setCoverImage(null)
      setIsOpenStatusOption(false)
      setIsShowFormCreateCard(false)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo nhiệm vụ mới')
    } finally {
      setIsLoading(false)
    }
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
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-2xl transition-all duration-300 animate-slideUp">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Tạo Nhiệm Vụ Mới
            </h2>

            <div className="flex flex-col md:flex-row border-b border-gray-200 dark:border-gray-700 gap-8 pb-6">
              {/* Thông tin nhiệm vụ */}
              <div className="flex flex-col basis-3/5 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tên nhiệm vụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={newCardTitle}
                    onChange={e => setNewCardTitle(e.target.value)}
                    type="text"
                    placeholder="Nhập tên nhiệm vụ..."
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:border-sky-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-sm transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mô tả nhiệm vụ
                  </label>
                  <textarea
                    value={newCardDescription}
                    onChange={e => setNewCardDescription(e.target.value)}
                    placeholder="Thêm mô tả cho nhiệm vụ..."
                    rows="5"
                    className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:border-sky-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none shadow-sm resize-none transition duration-300"
                  />
                </div>
              </div>

              {/* Cài đặt bên phải */}
              <div className="flex flex-col basis-2/5 p-4 gap-5 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-inner">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trạng thái
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setIsOpenStatusOption(!isOpenStatusOption)}
                      className={`group ${
                        isOpenStatusOption ? 'border-sky-400 dark:border-sky-400' : ''
                      } w-full cursor-pointer rounded-lg border-1 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-4 pr-10 text-gray-800 dark:text-gray-100 hover:border-sky-500 transition-all duration-300`}
                    >
                      {options.find((opt) => opt.value === selected)?.label}
                      <ChevronUp
                        className={`${
                          isOpenStatusOption
                            ? 'animate-turnRight180 opacity-100'
                            : 'animate-turnLeft180 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                        } transition-all duration-300 pointer-events-none absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 w-4 h-4`}
                      />
                    </div>

                    {isOpenStatusOption && (
                      <ul className="absolute z-10 mt-1 p-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg animate-fadeIn">
                        {options.map((option) => (
                          <li
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`px-4 py-2 cursor-pointer rounded-sm mb-1 transition-colors duration-200 ${
                              selected === option.value
                                ? 'bg-sky-100 dark:bg-gray-700 dark:text-sky-400'
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ảnh bìa
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 cursor-pointer hover:border-sky-500 transition duration-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      {coverImage ? coverImage.name : 'Chọn ảnh bìa'}
                      <input type="file" className="hidden" onChange={e => setCoverImage(e.target.files[0])} />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleClickCancelFormCreateCard}
                className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white shadow-sm transition duration-200 hover:shadow-md active:scale-95"
              >
                Hủy
              </button>
              <button 
                onClick={addNewCard} 
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Đang tạo...</span>
                  </>
                ) : (
                  'Tạo nhiệm vụ'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BoardActions
