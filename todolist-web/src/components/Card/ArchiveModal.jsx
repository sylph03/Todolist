import React, { useMemo, useRef } from 'react'
import { Archive, RotateCcw, Trash2, X, Users, MessageSquare, Paperclip, Text } from 'lucide-react'
import { useConfirm } from '~/Context/ConfirmProvider'
import { toast } from 'react-toastify'
import { updateCardDetailsAPI } from '~/apis'
import { useDispatch } from 'react-redux'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { deleteCardDetailsAPI } from '~/apis'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { updateCurrentActiveCard, showActiveCard } from '~/redux/activeCard/activeCardSlice'
import useClickOutside from '~/hooks/useClickOutside'
import useEscapeKey from '~/hooks/useEscapeKey'

// Card Indicators component đơn giản
const CardIndicators = ({ card }) => {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
      {card?.description?.length > 0 && (
        <div className="flex items-center gap-1" title="Có mô tả">
          <Text className="w-3.5 h-3.5" />
        </div>
      )}
      {card?.memberIds?.length > 0 && (
        <div className="flex items-center gap-1" title="Thành viên">
          <Users className="w-3.5 h-3.5" />
          <span>{card.memberIds.length}</span>
        </div>
      )}
      {card?.comments?.length > 0 && (
        <div className="flex items-center gap-1" title="Bình luận">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{card.comments.length}</span>
        </div>
      )}
      {card?.attachments?.length > 0 && (
        <div className="flex items-center gap-1" title="Tập tin đính kèm">
          <Paperclip className="w-3.5 h-3.5" />
          <span>{card.attachments.length}</span>
        </div>
      )}
    </div>
  )
}

const ArchiveModal = ({ isOpen, onClose, board }) => {
  const { confirm } = useConfirm()
  const dispatch = useDispatch()

  const archiveModalRef = useRef(null)

  const archivedCards = useMemo(() => {
    if (!board?.columns) return []
    return board.columns.flatMap(column => 
      // SỬA: card.isArchived (boolean check)
      column.cards.filter(card => card.isArchived)
    ).sort((a, b) => a.title.localeCompare(b.title))
  }, [board])

  const handleOpenCard = (card) => {
    dispatch(updateCurrentActiveCard(card))
    dispatch(showActiveCard())
    onClose() // Tắt ArchiveModal khi mở ActiveCard
  }

  const handleUnarchiveCard = async (cardId) => {
    // Kiểm tra WIP limit trước khi khôi phục
    if (board?.wipEnabled) {
      const targetColumn = board.columns.find(column => column.cardOrderIds.includes(cardId))
      if (targetColumn) {
        // Đếm số active cards hiện tại (không archived, không placeholder)
        const currentActiveCards = targetColumn.cards.filter(c => !c.isArchived && !c.FE_PlaceholderCard)
        const wipLimit = board?.wipLimit || 5
        
        // Nếu column đã đạt WIP limit, không cho phép khôi phục
        if (currentActiveCards.length >= wipLimit) {
          toast.error(`Không thể khôi phục nhiệm vụ! Cột "${targetColumn.title}" đã đạt giới hạn WIP (${currentActiveCards.length}/${wipLimit})`)
          return
        }
      }
    }

    const response = await updateCardDetailsAPI(cardId, {
      isArchived: false,
      archivedAt: null
    })
    
    if (response) {
      dispatch(updateCardInBoard(response))

      // Tạo board mới với dữ liệu đã cập nhật
      const newBoard = cloneDeep(board)
      const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(cardId))
      
      if (targetColumn) {
        // Cập nhật card trong targetColumn với dữ liệu mới
        const cardIndex = targetColumn.cards.findIndex(c => c._id === cardId)
        if (cardIndex !== -1) {
          targetColumn.cards[cardIndex] = { ...targetColumn.cards[cardIndex], isArchived: false, archivedAt: null }
        }
        
        // Xóa FE_PlaceholderCard nếu có (vì đã có active card)
        targetColumn.cards = targetColumn.cards.filter(c => !c.FE_PlaceholderCard)
        targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(id => !id.includes('placeholder'))
        
        // Cập nhật board
        dispatch(updateCurrentActiveBoard(newBoard))
      }

      toast.success('Đã khôi phục nhiệm vụ!')
      onClose()
    }
  }

  const handleDeleteCard = async (cardId) => {
    const result = await confirm({
      title: 'Xóa nhiệm vụ',
      message: 'Hành động này sẽ xóa vĩnh viễn nhiệm vụ đã lưu trữ! Bạn có chắc chắn không?',
      modal: true
    })
    
    if (result) {
      const response = await deleteCardDetailsAPI(cardId)
      if (response) {
        const newBoard = cloneDeep(board)
        const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(cardId))
        
        if (targetColumn) {
          targetColumn.cards = targetColumn.cards.filter(c => c._id !== cardId)
          targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(_id => _id !== cardId)
          
          if (isEmpty(targetColumn.cards)) {
            const placeholderCard = generatePlaceholderCard(targetColumn)
            targetColumn.cards = [placeholderCard]
            targetColumn.cardOrderIds = [placeholderCard._id]
          }
          dispatch(updateCurrentActiveBoard(newBoard))
        }
        toast.success('Đã xóa vĩnh viễn nhiệm vụ!')
      }
    }
  }

  useClickOutside(archiveModalRef, onClose)
  useEscapeKey(onClose)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 dark:bg-black/40 animate-fadeIn overflow-y-auto overflow-x-hidden m-0">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div ref={archiveModalRef} className="relative w-full max-w-[1200px] bg-white dark:bg-gray-800 rounded-xl shadow-xl transform transition-all duration-300 ease-out flex flex-col my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Header đơn giản */}
          <div className="pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 px-6">
              <Archive className="w-6 h-6 text-sky-500 dark:text-sky-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Nhiệm vụ đã lưu trữ
              </h2>
              <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-sm rounded-full">
                {archivedCards.length}
              </span>
            </div>
          </div>

          {/* Content đơn giản */}
          <div className="flex-1 px-6 py-6">
            {archivedCards.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Archive className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Không có nhiệm vụ nào được lưu trữ
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Các nhiệm vụ đã lưu trữ sẽ xuất hiện ở đây
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {archivedCards.map((card) => (
                  <div
                    key={card._id}
                    onClick={() => handleOpenCard(card)}
                    className="group bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 overflow-hidden cursor-pointer"
                  >
                    {/* Ảnh bìa đơn giản */}
                    {card?.cover && (
                      <div className="w-full">
                        <img
                          src={card.cover}
                          alt="cover"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}

                    {/* Nội dung đơn giản */}
                    <div className="p-4">
                      {/* Title */}
                      <h3 className="font-medium text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {card.title}
                      </h3>
                      
                      {/* Card indicators đơn giản */}
                      <div className="mb-3">
                        <CardIndicators card={card} />
                      </div>
                      
                      {/* Archive info đơn giản */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                          <Archive className="w-3 h-3" />
                          Đã lưu trữ
                        </span>
                        {card.columnId && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs rounded">
                            {board.columns.find(col => col._id === card.columnId)?.title || 'Unknown'}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons đơn giản */}
                      <div className="flex items-center justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleUnarchiveCard(card._id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 text-sm font-medium rounded-md transition-colors hover:bg-sky-50 dark:hover:bg-sky-900/20"
                          title="Khôi phục nhiệm vụ"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Khôi phục
                        </button>
                        <button
                          onClick={() => handleDeleteCard(card._id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer đơn giản */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Archive className="w-4 h-4" />
                <span>Nhiệm vụ đã lưu trữ sẽ không hiển thị trên board chính</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-md transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArchiveModal