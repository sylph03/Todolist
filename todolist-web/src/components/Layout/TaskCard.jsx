import React from 'react'

const TaskCard = ({ content }) => {
  return (
    <div className='w-full h-20 rounded-2xl p-4 shadow-md bg-white text-black'>
      {content}
    </div>
  )
}

export default TaskCard