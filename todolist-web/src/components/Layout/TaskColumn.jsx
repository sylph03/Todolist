import React from 'react'
import TaskCard from './TaskCard'

const TaskColumn = ({ title, bgColumn, bgTitleColumn, tasks }) => {
  return (
    <div className={`relative basis-1/3 h-full rounded-xl shadow-md ${bgColumn}`}>
      <div className={`flex items-center justify-center ${bgTitleColumn} h-HEIGHT_COLUMN_TITLE rounded-t-xl font-bold uppercase`}>
        { title }
      </div>
      <div className='w-full h-HEIGHT_COLUMN_CONTENT pr-1'>
        <div className='py-4 pl-4 pr-3 space-y-4 overflow-auto w-full h-full'>
          {tasks && tasks.map((task, index) => (
            <TaskCard key={index} content={task}/>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TaskColumn