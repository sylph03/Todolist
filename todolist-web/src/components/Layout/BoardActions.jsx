import React, { useState, useCallback, useEffect } from 'react'
import { Plus, Archive, Columns2, Settings } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import FormCreateCard from '~/components/Card/FormCreateCard'
import FormCreateColumn from '~/components/Cloumn/FormCreateColumn'
import WIPSettingsModal from '~/components/UI/WIPSettingsModal'
import { toast } from 'react-toastify'
import BoardUserGroup from '~/pages/Boards/BoardUserGroup'
import InviteBoardUser from '~/pages/Boards/InviteBoardUser'
import SearchActionCard from '~/components/Card/SearchActionCard'
import { updateBoardDetailsAPI } from '~/apis'
import ArchiveModal from '../Card/ArchiveModal'
import { useConfirm } from '~/Context/ConfirmProvider'

const BoardActions = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { stateConfirm } = useConfirm()

  const [isShowFormCreateCard, setIsShowFormCreateCard] = useState(false)
  const [isShowFormCreateColumn, setIsShowFormCreateColumn] = useState(false)
  const [showWIPModal, setShowWIPModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)

  // WIP Settings state
  const [wipSettings, setWipSettings] = useState({
    enabled: board?.wipEnabled || false,
    limit: board?.wipLimit || 5
  })

  // Cập nhật wipSettings khi board thay đổi
  useEffect(() => {
    if (board) {
      setWipSettings({
        enabled: board.wipEnabled || false,
        limit: board.wipLimit || 5
      })
    }
  }, [board])

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

  // Mở modal cài đặt WIP
  const handleOpenWIPModal = () => {
    setShowWIPModal(true)
  }

  // Đóng modal cài đặt WIP
  const handleCloseWIPModal = () => {
    setShowWIPModal(false)
  }

  // Lưu cài đặt WIP
  const handleSaveWIP = async (newSettings) => {
    // Kiểm tra xem có thay đổi gì không
    const hasChanges = (
      newSettings.enabled !== board?.wipEnabled ||
      newSettings.limit !== board?.wipLimit
    )
    if (!hasChanges) {
      toast.info('Không có thay đổi nào để cập nhật')
      setShowWIPModal(false)
      return
    }

    // Gọi API để cập nhật board
    const response = await updateBoardDetailsAPI(board._id, {
      wipEnabled: newSettings.enabled,
      wipLimit: newSettings.limit
    })

    if (response) {
      // Cập nhật Redux store
      dispatch(updateCurrentActiveBoard({
        ...board,
        wipEnabled: newSettings.enabled,
        wipLimit: newSettings.limit
      }))

      // Cập nhật local state
      setWipSettings(newSettings)

      // Hiển thị thông báo
      if (newSettings.enabled) {
        toast.success(`Đã bật chế độ WIP với giới hạn ${newSettings.limit} task/cột`)
      } else {
        toast.success('Đã tắt chế độ giới hạn WIP')
      }

      setShowWIPModal(false)
    }
  }

  const handleOpenArchiveModal = () => {
    setShowArchiveModal(true)
  }

  const handleCloseArchiveModal = () => {
    if (stateConfirm.isOpen) {
      return
    }
    setShowArchiveModal(false)
  }

  return (
    <>
      <div className="flex flex-row justify-between items-center w-full h-HEIGHT_BOARD_BAR sticky top-0 left-0 z-10 bg-inherit gap-3 px-1">
        {/* Right Actions: Các nút chức năng */}
        <div className="flex gap-3">
          {/* Nút Thêm nhiệm vụ */}
          <button
            onClick={handleClickCreateCard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title={!board?.columns?.length ? 'Vui lòng tạo cột trước khi thêm nhiệm vụ' : 'Thêm nhiệm vụ'}
            aria-label="Thêm nhiệm vụ"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm nhiệm vụ</span>
          </button>

          {/* Nút Thêm cột */}
          <button
            onClick={handleClickCreateColumn}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title="Thêm cột"
            aria-label="Thêm cột"
          >
            <Columns2 className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Thêm cột</span>
          </button>

          {/* Nút nhiệm vụ lưu trữ*/}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95"
            title="Lưu nhiệm vụ"
            aria-label="Lưu nhiệm vụ"
            onClick={handleOpenArchiveModal}
          >
            <Archive className="w-5 h-5" />
            <span className="hidden xl:inline text-sm">Lưu nhiệm vụ</span>
          </button>

          {/* Nút chế độ WIP - HIỂN THỊ TRẠNG THÁI THỰC TẾ */}
          <button
            onClick={handleOpenWIPModal}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-95 ${wipSettings.enabled
              ? 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
              : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
            }`}
            title={wipSettings.enabled ? `WIP: ${wipSettings.limit} task/cột` : 'Bật chế độ giới hạn WIP'}
            aria-label="Chế độ WIP"
          >
            <Settings className={`w-5 h-5 ${wipSettings.enabled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600 dark:text-gray-300'}`} />
            <span className="hidden xl:inline text-sm font-medium">
              {wipSettings.enabled ? `WIP : ${wipSettings.limit}` : 'WIP'}
            </span>
          </button>
        </div>

        {/* Right Actions: Thanh tìm kiếm và thêm users vào board */}
        <div className="flex gap-3">
          {/* Thanh tìm kiếm */}
          <SearchActionCard />

          {/* Nút mời users vào board */}
          <InviteBoardUser boardId={board?._id} />

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

      {/* Modal cài đặt WIP */}
      <WIPSettingsModal
        isOpen={showWIPModal}
        onClose={handleCloseWIPModal}
        onSave={handleSaveWIP}
        currentSettings={{
          enabled: board?.wipEnabled || false,
          limit: board?.wipLimit || 5
        }}
      />

      {/* Modal lưu trữ nhiệm vụ */}
      <ArchiveModal
        isOpen={showArchiveModal}
        onClose={handleCloseArchiveModal}
        board={board}
      />
    </>
  )
}

export default BoardActions
