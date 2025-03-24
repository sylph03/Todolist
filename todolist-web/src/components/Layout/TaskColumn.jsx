import React from 'react'
import TaskCard from './TaskCard'
import { mapOrder } from '~/utils/sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TaskColumn = ({ column }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column._id, data: { ...column } })
  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition
  }
  const orderdedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  return (
    <div className={`relative w-full h-full rounded-lg shadow-md ${column?.bgColumn}`} ref={setNodeRef} style={dndKitColumnStyles} {...attributes} {...listeners}>
      <div className={`flex items-center justify-center ${column?.bgTitleColumn} h-HEIGHT_COLUMN_TITLE rounded-t-lg font-bold uppercase`}>
        { column?.title }
      </div>
      <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
        <div className='py-4 pl-4 pr-3 space-y-4 overflow-auto w-full h-full'>
          {orderdedCards?.map(card => (
            <TaskCard key={card._id} card={card}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskColumn