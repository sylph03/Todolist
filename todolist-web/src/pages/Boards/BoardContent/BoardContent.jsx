import React from 'react'
import BoardActions from '~/components/Layout/BoardActions'
import TaskColumn from '~/components/Layout/TaskColumn'

const BoardContent = () => {
  const tasks = ['card 1', 'card 2', 'card 3', 'card 4', 'card 5', 'card 6', 'card 7', 'card 8', 'card 9', 'card 10']
  const tasks1 = ['card']
  return (
    <div className='w-full h-full'>
      <div className="md:pl-PL_BOARD_CONTENT p-SPACE_BOARD_CONTENT text-white dark:bg-gray-700 bg-sky-100 transition-all duration-300 flex flex-col gap-SPACE_BOARD_CONTENT overflow-auto">
        <BoardActions/>
        <div className="flex gap-SPACE_BOARD_CONTENT h-HEIGHT_BOARD_COLUMN min-w-5xl md:min-w-7xl">
          <TaskColumn title='Nhiệm vụ' bgColumn='bg-red-100' bgTitleColumn='bg-red-400' tasks={tasks}/>
          <TaskColumn title='Đang làm' bgColumn='bg-yellow-100' bgTitleColumn='bg-yellow-400' tasks={tasks1}/>
          <TaskColumn title='Hoàn thành' bgColumn='bg-green-100' bgTitleColumn='bg-green-400'/>
        </div>
      </div>
    </div>
  )
}

export default BoardContent