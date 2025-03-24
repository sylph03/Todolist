import React, { useEffect, useState } from 'react'
import BoardActions from '~/components/Layout/BoardActions'
import TaskColumn from '~/components/Layout/TaskColumn'
import { mapOrder } from '~/utils/sort'
import { DndContext, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

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

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handle drag end: ', event)
    const { active, over } = event

    // Kiểm tra tồn tại của over (kéo linh tinh ra ngoài thì return tránh lỗi)
    if (!over) return

    // Khi 2 vị trí kéo thả khác nhau
    if (active.id != over.id) {
      const oldIndex = orderedColumns.findIndex(column => column._id === active.id)
      const newIndex = orderedColumns.findIndex(column => column._id === over.id)

      // Sử dụng arrayMove để sắp xếp lại mảng ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
      // console.log(dndOrderedColumns)
      // console.log(dndOrderedColumnsIds)
      setOrderedColumns(dndOrderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
        </div>
      </div>
    </DndContext>
  )
}

export default BoardContent