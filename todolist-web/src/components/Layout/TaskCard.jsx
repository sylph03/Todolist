import React from 'react'

const TaskCard = ({ card }) => {
  return (
    <div className='w-full h-20 rounded-md p-4 shadow-md bg-white text-slate-800'>
      {card?.title}
    </div>
  )
}

export default TaskCard