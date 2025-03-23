import React from 'react'
import BoardActions from '~/components/Layout/BoardActions'
import TaskColumn from '~/components/Layout/TaskColumn'
import { mapOrder } from '~/utils/sort'

const BoardContent = ({ board }) => {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <div className='w-full h-full'>
      <div className="md:pl-PL_BOARD_CONTENT p-SPACE_BOARD_CONTENT text-white dark:bg-gray-700 bg-sky-100 transition-all duration-300 flex flex-col gap-SPACE_BOARD_CONTENT overflow-auto">
        <BoardActions/>
        <div className="flex gap-SPACE_BOARD_CONTENT h-HEIGHT_BOARD_COLUMN min-w-5xl md:min-w-7xl">
          {orderedColumns?.map(column => (
            <TaskColumn key={column._id} column={column}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BoardContent