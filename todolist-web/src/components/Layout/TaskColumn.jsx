import React from 'react'
import TaskCard from './TaskCard'
import { mapOrder } from '~/utils/sort'

const TaskColumn = ({ column }) => {
  const orderdedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
  return (
    <div className={`relative w-full h-full rounded-lg shadow-md ${column?.bgColumn}`}>
      <div className={`flex items-center justify-center ${column?.bgTitleColumn} h-HEIGHT_COLUMN_TITLE rounded-t-xl font-bold uppercase`}>
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