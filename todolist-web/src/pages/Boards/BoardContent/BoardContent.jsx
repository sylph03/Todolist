import React, { useCallback, useEffect, useRef, useState } from 'react'
import BoardActions from '~/components/Layout/BoardActions'
import TaskColumn from '~/components/Layout/TaskColumn'
import TaskCard from '~/components/Layout/TaskCard'
import { mapOrder } from '~/utils/sort'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners, pointerWithin, getFirstCollision } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'

const ACIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board }) => {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chuột di chuyển 10 pixel trước khi kích hoạt kéo thả
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhấn giữ 250ms và dung sai của cảm ứng 5px thì kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  // Ưu tiên sử dụng 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  // Một thời điểm chỉ có một phần tử column hoặc card được kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnDraggingCard, setOldColumnDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán va chạm)
  const lastOverId = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    // Nên dùng cardId thay vì cardOrderIds bởi vì ở bước handleDragOver sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chung xử lý cập nhật lại state trong trường hợp di chuyển Card giữa các column khác nhau
  const moveCardBeetweenDifferentColumns = (overColumn, overCardId, active, over, aciveColumn, activeDraggingCardId, activeDraggingCardData) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí của overCard trong column đích được thả
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán cardIndex mới (trên hoặc dưới overCard)
      let newCardIndex
      const isBelowOverItem = active.rect.current?.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng OderedColumnsState cũ ra một cái mới để xử lý dữ liệu rồi return để cập nhật OrderedColumnsState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === aciveColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      if (nextActiveColumn) {
        // Xóa card ở column đang active
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Thêm Placehoder Card nếu column rỗng (do kéo hết card đi)
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Kiểm tra card đang kéo có tồn tại ở Overcolumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Khi dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activateDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Thêm card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activateDraggingCardData)
        // Xóa Placeholder Card nếu đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        // Cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACIVE_DRAG_ITEM_TYPE.CARD : ACIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Quá trình kéo một phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu kéo column
    if (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Xử lý thêm nếu kéo card qua lại giữa các column
    const { active, over } = event

    if (!active || !over) return

    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    const { id: overCardId } = over

    // Tìm 2 column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Không tồn tại card trong column thì không làm gì hết
    if (!activeColumn || !overColumn) return

    // Xử lý logic kéo card nhưng chưa thả qua 2 column khác nhau
    if (activeColumn._id !== overColumn._id) {
      moveCardBeetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }

  }

  const handleDragEnd = (event) => {
    // console.log('handle drag end: ', event)
    const { active, over } = event

    // Kiểm tra tồn tại của over (kéo linh tinh ra ngoài thì return tránh lỗi)
    if (!active || !over) return

    // Xử lý thả card
    if (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      // Tìm 2 column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Không tồn tại card trong column thì không làm gì hết
      if (!activeColumn || !overColumn) return

      if (oldColumnDraggingCard._id !== overColumn._id) {
        moveCardBeetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        // Thả card trong cùng column
        const oldCardIndex = oldColumnDraggingCard?.cards?.findIndex(card => card._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(column => column._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          // Tìm tới cái column mà đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)
          // Cập nhật lại 2 giá trị mới là card và cardOderIds trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumns
        })
      }
    }
    // Xử lý thả column
    if (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Khi 2 vị trí kéo thả khác nhau
      if (active.id != over.id) {
        const oldColumnIndex = orderedColumns.findIndex(column => column._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(column => column._id === over.id)

        // Sử dụng arrayMove để sắp xếp lại mảng ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
        // console.log(dndOrderedColumns)
        // console.log(dndOrderedColumnsIds)
        setOrderedColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnDraggingCard(null)
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  // Custom thuật toán va chạm. args = arguments = các đối số, tham số
  const collisionDetectionStrategy = useCallback((args) => {
    // Kéo column thì trả về thuật toán closestCorners
    if (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm điểm giao nhau, va chạm, trả về một mảng các va chạm - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)

    // Nếu pointerIntersections là mảng rỗng, return luôn không làm gì hết
    if (!pointerIntersections?.length) return

    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây - Không cần bước này nữa
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    // Tìm  overId đầu tiên ở trong pointerIntersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // OverId là null thì trả về mảng rỗng tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    // sensor: Cảm biến, collisionDetection: Thuật toán phát hiện va chạm, flickering: collisionDetection={closestCorners} + sai lệch dữ liệu
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={collisionDetectionStrategy}>
      <div className='w-full h-full'>
        <div className="md:pl-PL_BOARD_CONTENT p-SPACE_BOARD_CONTENT text-white dark:bg-gray-700 bg-sky-100 transition-all duration-300 flex flex-col gap-SPACE_BOARD_CONTENT overflow-y-hidden overflow-x-auto">
          <BoardActions/>
          <SortableContext items={orderedColumns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
            <div className="flex gap-SPACE_BOARD_CONTENT h-HEIGHT_BOARD_COLUMN min-w-5xl md:min-w-7xl">
              {orderedColumns?.map(column => (
                <TaskColumn key={column._id} column={column}/>
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            { !activeDragItemType && null }
            { (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.COLUMN) && <TaskColumn column={activeDragItemData}/> }
            { (activeDragItemType === ACIVE_DRAG_ITEM_TYPE.CARD) && <TaskCard card={activeDragItemData}/> }
          </DragOverlay>
        </div>
      </div>
    </DndContext>
  )
}

export default BoardContent