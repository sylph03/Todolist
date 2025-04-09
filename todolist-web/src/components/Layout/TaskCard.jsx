// import React from 'react'
// import { useSortable } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import { SquarePen } from 'lucide-react'

// const TaskCard = ({ card }) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
//     id: card._id,
//     data: { ...card }
//   })

//   const dndKitCardStyles = {
//     transform: CSS.Translate.toString(transform),
//     transition,
//     opacity: isDragging ? 0.5 : undefined,
//     border: isDragging ? '1px solid #00BCFF' : '1px solid transparent'
//   }

//   return (
//     <div className={`${card.FE_PlaceholderCard ? 'hidden' : 'block'} w-full rounded-xl shadow-md bg-white text-slate-800 cursor-pointer group hover:border-[#00BCFF] hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out`} ref={setNodeRef} style={dndKitCardStyles} {...attributes} {...listeners} >
//       {card?.cover && (<img src={card.cover} alt="cover" className='object-cover w-full h-[247px] rounded-t-xl'/>)}

//       <div className='p-4 relative text-sm leading-relaxed font-medium'>
//         {card?.title}

//         {/* Nút chỉnh sửa */}
//         <div className='absolute top-2 right-2 p-2 rounded-full text-gray-600 transition-all hidden group-hover:block hover:bg-gray-100 hover:text-black' title="Chỉnh sửa" >
//           <SquarePen className='size-4.5' />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TaskCard
import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SquarePen } from 'lucide-react'

const TaskCard = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #00BCFF' : ''
  }

  return (
    <div
      className={`${card.FE_PlaceholderCard ? 'hidden' : 'block'} border border-transparent w-full rounded-xl cursor-pointer bg-white text-slate-800 shadow-md hover:shadow-lg transition-all duration-75 ease-in-out hover:scale-[1.01] group`}
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...listeners}
    >
      {/* Ảnh bìa */}
      {card?.cover && (<img src={card.cover} alt="cover" className="object-cover w-full h-[247px] rounded-t-xl" /> )}

      {/* Nội dung */}
      <div className="p-4 relative text-sm leading-relaxed font-medium">
        {card?.title}
        {/* Nút chỉnh sửa */}
        <div className="absolute top-2 right-2 p-2 rounded-full transition-all hidden group-hover:block hover:bg-gray-100" title="Chỉnh sửa" > <SquarePen className="size-4.5" /></div>
      </div>
    </div>
  )
}

export default TaskCard
