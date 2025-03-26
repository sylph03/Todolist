import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
const TaskCard = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card._id, data: { ...card } })
  const dndKitCardStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #00BCFF' : undefined
  }
  return (
    <div className={`${card.FE_PlaceholderCard ? 'hidden' : 'block'} w-full rounded-md shadow-md bg-white text-slate-800`} ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}>
      {card?.cover && <img src={card.cover} className='object-cover w-full h-[247px]'/>}
      <div className='p-4'>
        {card?.title}
      </div>
    </div>
  )
}

export default TaskCard