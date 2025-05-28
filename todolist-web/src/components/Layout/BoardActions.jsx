import React, { useState, useCallback } from 'react'
import { Plus, Archive, Columns2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import FormCreateCard from '~/components/Card/FormCreateCard'
import FormCreateColumn from '~/components/Cloumn/FormCreateColumn'
import { toast } from 'react-toastify'
import BoardUserGroup from '~/pages/Boards/BoardUserGroup'
import InviteBoardUser from '~/pages/Boards/InviteBoardUser'
import SearchActionCard from '~/components/Card/SearchActionCard'

const BoardActions = () => {
  const board = useSelector(selectCurrentActiveBoard)
  const [isShowFormCreateCard, setIsShowFormCreateCard] = useState(false)
  const [isShowFormCreateColumn, setIsShowFormCreateColumn] = useState(false)

  const handleClickCreateColumn = useCallback(() => {
    setIsShowFormCreateColumn(prev => !prev)
  }, [])

  const handleClickCreateCard = () => {
    if (board?.columns?.length === 0) {
      toast.info('Vui lòng thêm cột trước khi thêm nhiệm vụ!')
      return
    }
    setIsShowFormCreateCard(true)
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-3 px-1">
        {/* Right Actions: Các nút chức năng */}
        <div className="flex gap-3">
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

          {/* Nút Thêm cột */}
          <button
            onClick={handleClickCreateColumn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title="Thêm cột"
            aria-label="Thêm cột"
          >
            <Columns2 className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm cột</span>
          </button>

          {/* Nút nhiệm vụ lưu trữ*/}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title="Lưu nhiệm vụ"
            aria-label="Lưu nhiệm vụ"
          >
            <Archive className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Lưu nhiệm vụ</span>
          </button>
        </div>

        {/* Right Actions: Thanh tìm kiếm và thêm users vào board */}
        <div className="flex gap-3">
          {/* Thanh tìm kiếm */}
          <SearchActionCard />

          {/* Nút mời users vào board */}
          <InviteBoardUser boardId={board?._id}/>

          {/* Thêm users vào board */}
          <BoardUserGroup boardUsers={board?.FE_allUsers} />
        </div>
      </div>

      {/* Form tạo nhiệm vụ mới */}
      <FormCreateCard
        isShowFormCreateCard={isShowFormCreateCard}
        setIsShowFormCreateCard={setIsShowFormCreateCard}
        board={board}
      />

      {/* Form tạo cột mới */}
      <FormCreateColumn
        isShowFormCreateColumn={isShowFormCreateColumn}
        setIsShowFormCreateColumn={setIsShowFormCreateColumn}
      />
    </>
  )
}

export default BoardActions
