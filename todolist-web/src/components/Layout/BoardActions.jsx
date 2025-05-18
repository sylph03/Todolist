import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Search, Archive, CircleCheck, Columns2, X } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import FormCreateCard from '~/components/Card/FormCreateCard'
import { toast } from 'react-toastify'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import FieldErrorAlert from '~/components/UI/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { createNewColumnAPI } from '~/apis/index'
import { generatePlaceholderCard } from '~/utils/formatters'


const BoardActions = () => {
  const board = useSelector(selectCurrentActiveBoard)
  const dispatch = useDispatch()
  const [isShowFormCreateCard, setIsShowFormCreateCard] = useState(false)
  const [isShowFormCreateColumn, setIsShowFormCreateColumn] = useState(false)

  const { register: registerColumn, handleSubmit: handleSubmitColumn, formState: { errors: errorsColumn }, reset: resetColumn } = useForm()

  const handleClickCreateColumn = () => {
    setIsShowFormCreateColumn(prev => !prev)
  }

  const handleClickCancelFormCreateColumn = () => {
    setIsShowFormCreateColumn(false)
    resetColumn()
  }

  const addNewColumn = async (data) => {
    const newColumnData = {
      boardId: board._id,
      title: data.title.trim()
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

  const handleClickCreateCard = () => {
    if (board?.columns?.length === 0) {
      toast.info('Vui lòng tạo cột trước khi thêm nhiệm vụ!')
      return
    }
    setIsShowFormCreateCard(true)
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-3 px-1">
        {/* Các nút chức năng */}
        <div className="flex gap-3 w-full md:justify-start">
          {/* Nút Thêm nhiệm vụ */}
          <button
            onClick={handleClickCreateCard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600
            text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title={!board?.columns?.length ? 'Vui lòng tạo cột trước khi thêm nhiệm vụ' : 'Thêm nhiệm vụ'}
            aria-label="Thêm nhiệm vụ"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm nhiệm vụ</span>
          </button>

          {/* Nút Thêm nhiệm vụ */}
          <button
            onClick={handleClickCreateColumn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title="Thêm cột"
            aria-label="Thêm cột"
          >
            <Columns2 className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm cột</span>
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

      {/* Form tạo nhiệm vụ mới */}
      <FormCreateCard
        isShowFormCreateCard={isShowFormCreateCard}
        setIsShowFormCreateCard={setIsShowFormCreateCard}
        board={board}
      />

      {/* Form tạo cột mới */}
      {isShowFormCreateColumn && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/40 flex justify-center items-center overflow-y-auto overflow-x-hidden z-50 p-4 animate-fadeIn">
          <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 animate-slideUp relative">
            {/* Close button */}
            <button
              onClick={handleClickCancelFormCreateColumn}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
              aria-label="Đóng form"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Tạo Cột Mới
            </h2>

            <form onSubmit={handleSubmitColumn(addNewColumn)} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tên cột <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full p-3 rounded-xl border transition duration-200 focus:outline-none dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 ${
                    errorsColumn['title']
                      ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-400 hover:border-red-500'
                      : 'border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 hover:border-sky-500'
                  }`}
                  placeholder="Nhập tên cột..."
                  {...registerColumn('title', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <FieldErrorAlert errors={errorsColumn} fieldName={'title'} />
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleClickCancelFormCreateColumn}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-white shadow-sm transition duration-200 hover:shadow-md active:scale-95"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="interceptor-loading flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Tạo cột
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
