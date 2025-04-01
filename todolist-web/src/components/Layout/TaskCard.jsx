import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SquarePen } from 'lucide-react'
const TaskCard = ({ card }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card._id, data: { ...card } })
  const dndKitCardStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #00BCFF' : '1px solid transparent'
  }
  return (
    <div className={`${card.FE_PlaceholderCard ? 'hidden' : 'block'} w-full rounded-lg shadow-md bg-white text-slate-800 cursor-pointer group hover:border-[#00BCFF]`} ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners}>
      {card?.cover && <img src={card.cover} className='object-cover w-full h-[247px]'/>}
      <div className='p-4 relative '>
        {card?.title}
        <div className='absolute top-0 right-1 p-2 rounded-full text-gray-700 transition hidden group-hover:block hover:bg-gray-100'>
          <SquarePen className='size-4.5' />
        </div>
      </div>
    </div>
  )
}

export default TaskCard