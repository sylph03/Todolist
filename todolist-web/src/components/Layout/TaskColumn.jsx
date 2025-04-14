import React from 'react'
import TaskCard from './TaskCard'
import { mapOrder } from '~/utils/sort'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TaskColumn = ({ column, cursor }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : 1,
    touchAction: 'none'
  }

  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    <div className="min-w-[300px] md:min-w-[360px] max-w-[480px] w-full h-full" ref={setNodeRef} style={dndKitColumnStyles} {...attributes} >
      <div className={`relative w-full h-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-transform duration-300 ${column?.bgColumn ? column.bgColumn : 'bg-sky-100'}`} {...listeners} >
        {/* Column Title */}
        <div className={`flex items-center justify-center text-white text-sm md:text-base px-4 h-HEIGHT_COLUMN_TITLE font-semibold uppercase tracking-wide rounded-t-xl ${column?.bgTitleColumn ? column.bgTitleColumn : 'bg-sky-500'} ${cursor || 'cursor-grab'} hover:opacity-95 transition duration-200`} >
          {column?.title}
        </div>

        {/* Cards area */}
        <SortableContext items={orderedCards?.map((card) => card._id)} strategy={verticalListSortingStrategy}>
          <div className="w-full h-HEIGHT_COLUMN_CONTENT pr-0.5">
            <div className="p-4 space-y-4 overflow-y-auto overflow-x-hidden w-full h-full scroll-container">
              {/* {orderedCards && orderedCards.length > 0 ? (orderedCards.map((card) => <TaskCard key={card._id} card={card} />)) :} */}
              {orderedCards.map((card) => <TaskCard key={card._id} card={card} />)}
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default TaskColumn

