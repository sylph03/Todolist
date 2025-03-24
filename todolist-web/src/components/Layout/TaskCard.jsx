import React from 'react'

const TaskCard = ({ card }) => {
  return (
    <div className='w-full rounded-md shadow-md bg-white text-slate-800'>
      {card?.cover && <img src={card.cover} className='object-cover w-full h-[247px]'/>}
      <div className='p-4'>
        {card?.title}
      </div>
    </div>
  )
}

export default TaskCard