import React from 'react'
import TaskCard from './TaskCard'
import { mapOrder } from '~/utils/sort'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TaskColumn = ({ column, cursor }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: column._id, data: { ...column } })
  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  const orderdedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  return (
    <div className='min-w-[380px] w-full h-full' ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <div className={`relative w-full h-full rounded-lg shadow-md ${column?.bgColumn}`} {...listeners}>
        <div className={`flex items-center justify-center ${column?.bgTitleColumn} h-HEIGHT_COLUMN_TITLE rounded-t-lg font-bold uppercase ${cursor ? cursor : 'cursor-grab' }`}>
          { column?.title }
        </div>
        <SortableContext items={orderdedCards?.map(card => card._id)} strategy={verticalListSortingStrategy}>
          <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
            <div className='py-4 pl-4 pr-3 space-y-4 overflow-y-auto overflow-x-hidden w-full h-full scroll-container'>
              {orderdedCards?.map(card => (
                <TaskCard key={card._id} card={card}/>
              ))}
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default TaskColumn