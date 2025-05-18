import React from 'react'
import { EllipsisVertical } from 'lucide-react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { Link } from 'react-router-dom'

const ProjectItem = ({
  project,
  type = 'normal',
  onEllipsisClick,
  showOptionsProject,
  optionsButtonRef
}) => {
  const activeBoard = useSelector(selectCurrentActiveBoard)
  const keyString = `${type}-${project._id}`
  const isActive = activeBoard?._id === project._id
  const isShown = showOptionsProject?.type === type && showOptionsProject?.id === project._id

  return (
    <Link
      to={`/boards/${project._id}`}
      key={keyString}
      title={project?.description}
      className={`relative group px-4 py-2 rounded-xl cursor-pointer transition duration-200 
        ${isActive ? 'bg-white/20 dark:bg-gray-700' : 'bg-transparent dark:bg-gray-800'} 
        hover:bg-white/20 dark:hover:bg-gray-700`}
    >
      {/* Tên dự án */}
      <span className="text-white dark:text-gray-100 text-sm md:text-base truncate block pr-10">
        {project.title}
      </span>

      {/* Nút ba chấm */}
      <EllipsisVertical
        className={`
          absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 w-7 h-7
          text-gray-200 hover:text-white dark:text-gray-400 dark:hover:text-white
          transition-opacity duration-200 ease-in-out
          ${isShown ? 'opacity-100 text-white dark:text-white' : 'opacity-0'}
          group-hover:opacity-100
        `}
        onClick={(e) => {
          e.stopPropagation() // Ngăn sự kiện click "lan lên" thẻ <Link>
          e.preventDefault() // Ngăn <Link> thực hiện điều hướng
          onEllipsisClick(e, { type, id: project._id })
        }}
        ref={(el) => {
          optionsButtonRef.current[keyString] = el
        }}
      />
    </Link>
  )
}

export default ProjectItem
