import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Listbox } from '@headlessui/react'
import { ChevronDown } from 'lucide-react'
import useClickOutside from '../../hooks/useClickOutside'
import { cloneDeep } from 'lodash'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { moveCardToDifferentColumnAPI, updateColumnDetailsAPI } from '~/apis'
import { useDispatch } from 'react-redux'
import { generatePlaceholderCard } from '~/utils/formatters'
import { toast } from 'react-toastify'
import { AlertTriangle } from 'lucide-react'

const MoveCardPopup = ({ onClose, board, card, moveButtonRef, setShowPopup }) => {
  const [selectColumn, setSelectColumn] = useState(null)
  const [selectPosition, setSelectPosition] = useState(null)
  const [positionOverFlowColumnOptions, setPositionOverFlowColumnOptions] = useState(false)
  const [positionOverFlowPositionOptions, setPositionOverFlowPositionOptions] = useState(false)

  const movePopupRef = useRef(null)
  const buttonColumnOptionsRef = useRef(null)
  const buttonPositionOptionsRef = useRef(null)

  const dispatch = useDispatch()
  // Lưu columnId ban đầu để so sánh khi đổi column
  const [prevColumn, setPrevColumn] = useState(null)

  useClickOutside(movePopupRef, onClose, [moveButtonRef])

  const positionMovePopup = () => {
    if (!moveButtonRef.current || !movePopupRef.current) {
      return { top: 0, left: 0 }
    }
    const moveButton = moveButtonRef.current.getBoundingClientRect()
    const movePopup = movePopupRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth

    let top = moveButton.bottom + 5
    let left = moveButton.left

    if (top + movePopup.height > viewportHeight) {
      top = moveButton.top - movePopup.height - 5
    }

    if (left + movePopup.width > viewportWidth) {
      left = viewportWidth - movePopup.width - 5
    }

    return { top, left }
  }

  // Memoize position để tránh tính toán lại mỗi lần render
  const popupPosition = React.useMemo(() => {
    return positionMovePopup()
  }, [moveButtonRef.current, movePopupRef.current])

  // Memoize column title để tránh tìm kiếm lại
  const selectedColumnTitle = React.useMemo(() => {
    return board?.columns?.find(col => col._id === selectColumn)?.title || 'Chọn danh sách'
  }, [board?.columns, selectColumn])

  // Memoize position options để tránh tính toán trong render
  const positionOptions = React.useMemo(() => {
    if (!selectColumn) return []

    const selectedColumn = board?.columns?.find((column) => column._id === selectColumn)
    const cardOrderIds = selectedColumn?.cardOrderIds || []
    const isOnlyPlaceholder = cardOrderIds.length === 1 && cardOrderIds[0].endsWith('-placeholder-card')
    const isSameColumn = selectColumn === card?.columnId
    const count = isOnlyPlaceholder
      ? 1
      : isSameColumn
        ? cardOrderIds.length
        : cardOrderIds.length + 1

    return Array.from({ length: count }, (_, index) => index)
  }, [board?.columns, selectColumn, card?.columnId])

  useEffect( () => {
    if (buttonColumnOptionsRef.current) {
      const columnOptions = buttonColumnOptionsRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - columnOptions.bottom
      const spaceAbove = columnOptions.top

      if (spaceBelow < 200 && spaceAbove > 200) {
        setPositionOverFlowColumnOptions(true)
      } else {
        setPositionOverFlowColumnOptions(false)
      }
    }
  }, [selectColumn, buttonColumnOptionsRef.current])

  useEffect( () => {
    if (buttonPositionOptionsRef.current) {
      const positionOptions = buttonPositionOptionsRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - positionOptions.bottom
      const spaceAbove = positionOptions.top

      if (spaceBelow < 200 && spaceAbove > 200) {
        setPositionOverFlowPositionOptions(true)
      } else {
        setPositionOverFlowPositionOptions(false)
      }
    }
  }, [selectPosition, buttonPositionOptionsRef.current])

  useEffect(() => {
    if (card && board) {
      setSelectColumn(card.columnId)
      const column = board?.columns?.find((column) => column._id === card.columnId)
      const position = column?.cardOrderIds?.indexOf(card._id)
      setSelectPosition(position)
      setPrevColumn(card.columnId)
    }
  }, [card, board])

  // Chỉ reset vị trí khi đổi sang column khác
  useEffect(() => {
    if (
      selectColumn &&
      board &&
      prevColumn !== null &&
      selectColumn !== prevColumn
    ) {
      // Tìm column mới
      const selectedColumn = board?.columns?.find((column) => column._id === selectColumn)
      const cardOrderIds = selectedColumn?.cardOrderIds || []
      const isOnlyPlaceholder = cardOrderIds.length === 1 && cardOrderIds[0].endsWith('-placeholder-card')
      const isSameColumn = selectColumn === card?.columnId
      const count = isOnlyPlaceholder
        ? 0
        : isSameColumn
          ? cardOrderIds.length - 1
          : cardOrderIds.length
      setSelectPosition(count)
      setPrevColumn(selectColumn)
    }
  }, [selectColumn, board, prevColumn])

  // Helper function để xử lý placeholder card
  const handlePlaceholderCard = (column) => {
    column.cards = column.cards.filter(c => !c.FE_PlaceholderCard)
    column.cardOrderIds = column.cardOrderIds.filter(id => !id.includes('placeholder-card'))
  }

  // Helper function để thêm placeholder card nếu column rỗng
  const addPlaceholderIfEmpty = (column) => {
    if (column.cards.length === 0) {
      const placeholderCard = generatePlaceholderCard(column)
      column.cards = [placeholderCard]
      column.cardOrderIds = [placeholderCard._id]
    }
  }

  // Helper function để cập nhật UI và gọi API
  const updateUIAndCallAPI = (newBoard, apiCall) => {
    setShowPopup(false)
    onClose()
    dispatch(updateCurrentActiveBoard(newBoard))

    apiCall()
      .then(() => toast.success('Đã di chuyển thẻ thành công!'))
      .catch(() => toast.error('Đã xảy ra lỗi khi di chuyển thẻ.'))
  }

  const canMoveCardToColumn = (columnId) => {
    if (!board?.wipEnabled) return true
    
    const targetColumn = board.columns.find(col => col._id === columnId)
    if (!targetColumn) return true
    
    // Nếu di chuyển trong cùng column, không cần kiểm tra WIP limit
    if (columnId === card?.columnId) return true
    
    const currentCardCount = targetColumn.cards?.filter(c => !c.FE_PlaceholderCard && !c.isArchived).length || 0
    const wipLimit = board.wipLimit || 5
    
    return currentCardCount < wipLimit
  }

  const getWIPStatus = (columnId) => {
    if (!board?.wipEnabled) return null
    
    const targetColumn = board.columns.find(col => col._id === columnId)
    if (!targetColumn) return null
    
    const currentCardCount = targetColumn.cards?.filter(c => !c.FE_PlaceholderCard && !c.isArchived).length || 0
    const wipLimit = board.wipLimit || 5
    
    return {
      current: currentCardCount,
      limit: wipLimit,
      isAtLimit: currentCardCount >= wipLimit,
      canAdd: currentCardCount < wipLimit
    }
  }

  const handleMoveCard = () => {
    if (selectColumn == null || selectPosition == null) return

    // Kiểm tra WIP limit trước khi di chuyển
    if (!canMoveCardToColumn(selectColumn)) {
      const wipStatus = getWIPStatus(selectColumn)
      const targetColumn = board.columns.find(col => col._id === selectColumn)
      toast.error(`Không thể di chuyển card - cột "${targetColumn.title}" đã đạt giới hạn WIP (${wipStatus.current}/${wipStatus.limit})!`)
      return
    }

    const newBoard = cloneDeep(board)
    const targetColumn = newBoard.columns.find(column => column._id === selectColumn)
    const isSameColumn = selectColumn === card.columnId

    if (isSameColumn) {
      // Di chuyển trong cùng column
      const currentIndex = targetColumn.cards.findIndex(c => c._id === card._id)

      if (currentIndex !== selectPosition) {
        handlePlaceholderCard(targetColumn) // có thể bỏ qua filter này nếu chắc chắn 100% không bao giờ có placeholder card khi column có card thật

        const newCurrentIndex = targetColumn.cards.findIndex(c => c._id === card._id) // Tìm lại index của card sau khi xóa placeholder
        const movedCard = targetColumn.cards.splice(newCurrentIndex, 1)[0]
        targetColumn.cards.splice(selectPosition, 0, movedCard)
        targetColumn.cardOrderIds = targetColumn.cards.map(c => c._id)

        updateUIAndCallAPI(newBoard, () =>
          updateColumnDetailsAPI(selectColumn, {
            cardOrderIds: targetColumn.cardOrderIds.filter(id => !id.includes('placeholder-card'))
          })
        )
      } else {
        toast.info('Vị trí thẻ không thay đổi')
        setShowPopup(false)
        onClose()
      }
    } else {
      // Di chuyển sang column khác
      const sourceColumn = newBoard.columns.find(column => column._id === card.columnId)

      // Xóa card khỏi column nguồn
      sourceColumn.cards = sourceColumn.cards.filter(c => c._id !== card._id)
      sourceColumn.cardOrderIds = sourceColumn.cardOrderIds.filter(id => id !== card._id)
      addPlaceholderIfEmpty(sourceColumn) // Thêm placeholder card nếu column rỗng

      // Thêm card vào column đích
      handlePlaceholderCard(targetColumn) // Xóa placeholder card nếu có trong column mới
      const updatedCard = { ...card, columnId: selectColumn }
      targetColumn.cards.splice(selectPosition, 0, updatedCard)
      targetColumn.cardOrderIds.splice(selectPosition, 0, card._id)

      updateUIAndCallAPI(newBoard, () =>
        moveCardToDifferentColumnAPI({
          currentCardId: card._id,
          prevColumnId: card.columnId,
          prevCardOrderIds: sourceColumn.cardOrderIds.filter(id => !id.includes('placeholder-card')),
          nextColumnId: selectColumn,
          nextCardOrderIds: targetColumn.cardOrderIds
        })
      )
    }
  }

  return (
    <div
      ref={movePopupRef}
      className="fixed z-100 bg-white dark:bg-gray-900 rounded-xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-600 w-80 max-w-full animate-fadeIn"
      style={{ top: popupPosition.top, left: popupPosition.left }}
    >
      <div className="flex items-center justify-center relative py-3 px-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Di chuyển thẻ</h3>
        <button
          onClick={onClose}
          className="absolute right-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Chọn đích đến</p>
        <div className="grid grid-cols-10 gap-3 mt-2">
          <div className="flex flex-col col-span-6">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Danh sách</label>
            <Listbox value={selectColumn} onChange={setSelectColumn}>
              <div className="relative">
                <Listbox.Button
                  ref={buttonColumnOptionsRef}
                  className="w-full p-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 transition-all hover:border-sky-400 dark:hover:border-sky-500 flex justify-between items-center"
                >
                  {selectedColumnTitle}
                  <ChevronDown className="w-4 h-4" />
                </Listbox.Button>
                <Listbox.Options
                  className={`absolute z-10 p-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl animate-fadeIn max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${positionOverFlowColumnOptions ? 'bottom-full mb-2' : 'mt-2'}`}
                >
                  {board?.columns?.map((column) => {
                    const wipStatus = getWIPStatus(column._id)
                    const isDisabled = wipStatus?.isAtLimit && column._id !== card?.columnId
                    
                    return (
                      <Listbox.Option
                        key={column._id}
                        value={column._id}
                        disabled={isDisabled}
                        className={({ active, selected }) =>
                          `px-4 py-2 cursor-pointer rounded-lg mb-1 transition-all duration-200 text-sm text-gray-900 dark:text-gray-100 ${
                            selected ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 font-semibold shadow-sm' : ''
                          } ${active && !isDisabled ? 'hover:bg-sky-100 dark:hover:bg-gray-700 hover:shadow-sm' : ''} ${
                            isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                          }`
                        }
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{column.title}</span>
                          {wipStatus && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              wipStatus.isAtLimit 
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            }`}>
                              {wipStatus.current}/{wipStatus.limit}
                            </span>
                          )}
                        </div>
                      </Listbox.Option>
                    )
                  })}
                </Listbox.Options>
              </div>
            </Listbox>
            {selectColumn && board?.wipEnabled && (() => {
              const wipStatus = getWIPStatus(selectColumn)
              if (wipStatus?.isAtLimit && selectColumn !== card?.columnId) {
                return (
                  <div className="p-3 mt-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-300">
                        Cột "{board.columns.find(col => col._id === selectColumn)?.title}" đã đạt giới hạn WIP ({wipStatus.current}/{wipStatus.limit})
                      </span>
                    </div>
                  </div>
                )
              }
              return null
            })()}
          </div>
          <div className="flex flex-col col-span-4">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Vị trí</label>
            <Listbox value={selectPosition} onChange={setSelectPosition} disabled={!selectColumn}>
              <div className="relative">
                <Listbox.Button
                  ref={buttonPositionOptionsRef}
                  className="w-full p-2 text-sm text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 transition-all hover:border-sky-400 dark:hover:border-sky-500 flex justify-between items-center"
                >
                  {selectPosition !== null ? selectPosition + 1 : 'Chọn vị trí'}
                  <ChevronDown className="w-4 h-4" />
                </Listbox.Button>
                <Listbox.Options className={`absolute z-10 p-2 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl animate-fadeIn max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${positionOverFlowPositionOptions ? 'bottom-full mb-2' : 'mt-2'}`}>
                  {positionOptions.map((index) => (
                    <Listbox.Option
                      key={index}
                      value={index}
                      className={({ active, selected }) =>
                        `px-4 py-2 cursor-pointer rounded-lg mb-1 transition-all duration-200 text-sm text-gray-900 dark:text-gray-100 ${
                          selected ? 'bg-sky-100 dark:bg-sky-900 text-sky-600 font-semibold shadow-sm' : ''
                        } ${active ? 'hover:bg-sky-100 dark:hover:bg-gray-700 hover:shadow-sm' : ''}`
                      }
                    >
                      <div className="flex items-center gap-2">
                        <span>{index + 1}</span>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            className={`px-5 py-2 text-sm font-semibold text-white rounded-lg shadow transition-all ${
              canMoveCardToColumn(selectColumn)
                ? 'bg-sky-500 hover:bg-sky-600 focus:ring-2 focus:ring-sky-400 dark:focus:ring-sky-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleMoveCard}
            disabled={!canMoveCardToColumn(selectColumn)}
          >
            Di chuyển
          </button>
        </div>
      </div>
    </div>
  )
}

export default MoveCardPopup