import React from 'react'
import TaskCard from './TaskCard'
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

  // Cards đã được sắp xếp ở component cha cao nhất (boards/_id.jsx)
  const orderedCards = column.cards

  // const colorMap = {
  //   red: {
  //     bgColumn: 'bg-red-50 dark:bg-red-900/20',
  //     bgTitleColumn: 'bg-red-500 dark:bg-red-600'
  //   },
  //   orange: {
  //     bgColumn: 'bg-orange-50 dark:bg-orange-900/20',
  //     bgTitleColumn: 'bg-orange-500 dark:bg-orange-600'
  //   },
  //   yellow: {
  //     bgColumn: 'bg-yellow-50 dark:bg-yellow-900/20',
  //     bgTitleColumn: 'bg-yellow-500 dark:bg-yellow-600'
  //   },
  //   green: {
  //     bgColumn: 'bg-green-50 dark:bg-green-900/20',
  //     bgTitleColumn: 'bg-green-500 dark:bg-green-600'
  //   },
  //   default: {
  //     bgColumn: 'bg-sky-50 dark:bg-sky-900/20',
  //     bgTitleColumn: 'bg-sky-500 dark:bg-sky-600'
  //   }
  //   // bg-green-100 dark:bg-green-200
  //   // bg-green-400 dark:bg-green-400
  // }

  return (
    <div className="select-none min-w-[352px] w-[352px] h-full px-1" ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <div className={`relative w-full h-full rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden transition-all duration-300 hover:shadow-xl ${column?.bgColumn ? column.bgColumn : 'bg-sky-100 dark:bg-sky-900/20'}`}>
        {/* Column Title */}
        <div
          {...listeners}
          className={`flex items-center justify-between text-white text-sm md:text-base px-6 h-HEIGHT_COLUMN_TITLE font-semibold uppercase tracking-wide rounded-t-xl ${column?.bgTitleColumn ? column.bgTitleColumn : 'bg-sky-500 dark:bg-sky-600'} ${cursor || 'cursor-grab'} hover:opacity-95 transition duration-200`}
        >
          <span className="truncate">{column?.title}</span>
          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
            {orderedCards?.[0]?.FE_PlaceholderCard ? 0 : orderedCards?.length || 0}
          </span>
        </div>

        {/* Cards area */}
        <SortableContext items={orderedCards?.map((card) => card._id)} strategy={verticalListSortingStrategy}>
          <div className="w-full h-HEIGHT_COLUMN_CONTENT">
            <div className="p-4 space-y-3 overflow-y-auto overflow-x-hidden w-full h-full scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {orderedCards?.length > 0 ? (
                orderedCards.map((card) => <TaskCard key={card._id} card={card} />)
              ) : (
                <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 text-sm">
                  No tasks yet
                </div>
              )}
            </div>
          </div>
        </SortableContext>
      </div>
    </div>
  )
}

export default TaskColumn

