import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Sparkles, ChevronDown, ChevronUp, FolderOpen, Plus, Ellipsis, EllipsisVertical, Pencil, Star, Trash2, X } from 'lucide-react'
import { toast } from 'react-toastify'

const projects = [
  {
    id: 1, name: 'Today', description: 'Công việc hôm nay', isActive: true
  },
  {
    id: 2, name: 'Tomorrow', isActive: false
  },
  {
    id: 4, name: 'Project 2', isActive: false
  },
  {
    id: 5, name: 'Project 3', isActive: false
  },
  {
    id: 6, name: 'Project 4', isActive: false
  },
  {
    id: 7, name: 'Project 5', isActive: false
  },
  {
    id: 8, name: 'Project 6', isActive: false
  },
  {
    id: 9, name: 'Project 7', isActive: false
  },
  {
    id: 10, name: 'Project 8', isActive: false
  },
  {
    id: 11, name: 'Project 9', isActive: false
  },
  {
    id: 12, name: 'Project 10', isActive: false
  },
  {
    id: 13, name: 'Project 11', isActive: false
  },
  {
    id: 14, name: 'Project 12', isActive: false
  },
  {
    id: 15, name: 'Project 13', isActive: false
  },
  {
    id: 16, name: 'Project 14', isActive: false
  },
  {
    id: 17, name: 'Project 15', isActive: false
  },
  {
    id: 18, name: 'Project 16', isActive: false
  },
  {
    id: 19, name: 'Project 17', isActive: false
  },
  {
    id: 20, name: 'Project 18', isActive: false
  },
  {
    id: 21, name: 'Project 19', isActive: false
  },
  {
    id: 22, name: 'Project 20', isActive: false
  },
  {
    id: 23, name: 'Project 21', isActive: false
  },
  {
    id: 24, name: 'Project 22', isActive: false
  },
  {
    id: 25, name: 'Project 23', isActive: false
  },
  {
    id: 26, name: 'Project 24', isActive: false
  },
  {
    id: 27, name: 'Project 25', isActive: false
  }
]

const SideBar = ({ isOpen, toggleSidebar }) => {
  const [showInput, setShowInput] = useState(false)
  const [showOptionsProject, setShowOptionsProject] = useState(null)
  const [optionProjectPosition, setOptionProjectPosition] = useState(null)
  const [formPosition, setFormPosition] = useState(null)
  const plusButtonRef = useRef(null)
  const optionsButtonRef = useRef({})
  const projectsContainerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      if (showOptionsProject && optionsButtonRef.current[showOptionsProject]) {
        const rect = optionsButtonRef.current[showOptionsProject].getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const menuHeight = 142

        let top = rect.top + 28
        let left = rect.left

        if (top + menuHeight > viewportHeight) {
          top = rect.top - menuHeight - 6
        }
        // Chỉ set state khi vị trí thay đổi
        setOptionProjectPosition(prev => {
          if (prev?.top !== top || prev?.left !== left) {
            return { top, left }
          }
          return prev
        })
      }
    }

    const projectsContainer = projectsContainerRef.current
    if (projectsContainer) {
      projectsContainer.addEventListener('scroll', handleScroll)
    }

    return () => {
      if (projectsContainer) {
        projectsContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [showOptionsProject])

  const handlePlusClick = (e) => {
    e.stopPropagation()
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect()
      setFormPosition({
        top: rect.top - 30,
        left: rect.right + 30
      })
    }
    setShowInput(!showInput)
  }

  const handleOptionsProject = (e, project) => {
    e.stopPropagation()
    if (optionsButtonRef.current[project.id]) {
      const rect = optionsButtonRef.current[project.id].getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const menuHeight = 138 // Approximate height of the options menu

      // Calculate position relative to viewport
      let top = rect.bottom + 5
      let left = rect.left

      // Check if menu would go below viewport
      if (top + menuHeight > viewportHeight) {
        // Position menu above the button
        top = rect.top - menuHeight - 5
      }

      setOptionProjectPosition({ top, left })
    }
    setShowOptionsProject(prev => (prev === project.id ? null : project.id))
  }

  return (
    <>
      {showInput && (
        <div
          className="z-50 fixed w-80 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700" style={{ top: formPosition?.top, left: formPosition?.left }} >
          <div className="text-gray-900 dark:text-gray-100 font-semibold text-lg text-center mb-5 relative">
            Tạo bảng
            <X className="absolute top-1/2 right-0 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors" size={26} onClick={() => setShowInput(false)} />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="board-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
                Tên bảng <span className="text-red-500">*</span>
              </label>
              <input id="board-name" type="text" placeholder="Nhập tên bảng..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1.5">
                👋 Tiêu đề bảng là bắt buộc
              </p>
            </div>

            <div>
              <label htmlFor="board-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" >
                Mô tả
              </label>
              <input id="board-description" type="text" placeholder="Thêm mô tả cho bảng..." className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 transition" />
            </div>

            <button
              onClick={()=>{toast.error('Vui lòng nhập tên bảng')}}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg px-4 py-2 shadow-md transition-all duration-300 dark:bg-sky-600 dark:hover:bg-sky-500" >
              Tạo bảng
            </button>
          </div>
        </div>
      )}

      {/* Options project */}
      {showOptionsProject && (
        <div className="z-50 fixed bg-white dark:bg-gray-900 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-48" style={{ top: optionProjectPosition?.top, left: optionProjectPosition?.left }} >
          <div className="flex flex-col gap-1.5">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700" >
              <Pencil className="w-4 h-4" />
              <span>Đổi tên</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition" >
              <Star className="w-4 h-4" />
              <span>Yêu thích</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-100 dark:hover:bg-gray-700" >
              <Trash2 className="w-4 h-4" />
              <span>Xoá</span>
            </button>
          </div>
        </div>
      )}

      {!isOpen && <div className='h-full min-w-4 max-w-4 bg-sky-500 absolute top-0 bottom-0 dark:bg-gray-800'>
        <ChevronRight className='z-1 absolute border border-white dark:border-gray-400 shadow-md bg-sky-500 rounded-full bottom-1/2 left-1/4 cursor-pointer hover:bg-sky-400 dark:bg-gray-800 dark:hover:bg-gray-700' onClick={toggleSidebar}/>
      </div>}
      <div className={`z-1 absolute top-0 bottom-0 h-full max-w-WIDTH_SIDEBAR min-w-WIDTH_SIDEBAR bg-sky-500 dark:bg-gray-800 shadow-md ${isOpen ? 'animate-fadeInLeft' : 'animate-fadeOutLeft'}`}>
        <div className="flex flex-wrap items-center justify-between w-full px-4 py-3 bg-sky-500 dark:bg-[#1e293b] border-b border-sky-400 dark:border-slate-700 transition-colors duration-300">
          <div className="flex items-center gap-3 cursor-pointer group">
            <img src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg" alt="User Avatar" className="h-9 w-9 rounded-full object-cover shadow-md group-hover:ring-2 group-hover:ring-white/40 dark:group-hover:ring-slate-400 transition" />
            <span className="font-semibold text-white dark:text-slate-100 text-base transition">
              Không gian làm việc
            </span>
          </div>

          {/* Right: Toggle Sidebar */}
          <button
            className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-slate-600/40 transition-all duration-200" onClick={toggleSidebar} aria-label="Toggle Sidebar" >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-white dark:text-slate-100" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white dark:text-slate-100" />
            )}
          </button>
        </div>

        <div className='h-[calc(100%-65px)] pr-0.5 mt-0.5'>
          <div className="p-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full" ref={projectsContainerRef}>
            {/* Ô tìm kiếm */}
            <div className="flex items-center bg-sky-500 dark:bg-gray-800 rounded-lg px-3 py-2 transition duration-200 ease-in-out hover:bg-white/20 focus-within:bg-white/20 dark:focus-within:bg-gray-700 dark:hover:bg-gray-700 w-full group">
              <Search className="text-white dark:text-gray-400 w-5 h-5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm ..."
                className="ml-3 bg-transparent outline-none text-white dark:text-gray-100 placeholder-white dark:placeholder-gray-400 w-full text-sm sm:text-base"
              />
            </div>

            {/* Đã đánh dấu */}
            <div className="relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition duration-200 hover:bg-white/20 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 text-white dark:text-gray-100">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Đã đánh dấu</span>
              </div>

              <div className="absolute right-2 p-1 top-1/2 -translate-y-1/2">
                <ChevronUp className="w-5 h-5 text-gray-200 dark:text-gray-300 cursor-pointer hover:text-white transition duration-150" />
              </div>
            </div>

            {/* Dự án */}
            <div className="relative px-3 py-2 rounded-lg cursor-pointer group transition duration-200 hover:bg-white/20 dark:hover:bg-gray-700">
              <div className="flex items-center gap-2 text-white dark:text-gray-100 pr-15">
                <FolderOpen className="w-5 h-5" />
                <span className="text-sm sm:text-base font-medium">Dự án</span>
              </div>

              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()} // Ngăn click làm ảnh hưởng cha
                >
                  <Ellipsis className="w-7 h-7 p-1 dark:text-gray-300 text-gray-200 hover:text-white cursor-pointer" />
                </div>
                <div
                  onClick={handlePlusClick}
                  ref={plusButtonRef}
                >
                  <Plus className={`w-7 h-7 p-1 dark:text-gray-300 cursor-pointer text-gray-200 hover:text-white ${showInput ? 'text-white dark:text-white' : 'text-gray-200'}`} />
                </div>
              </div>
            </div>

            {/* Danh sách ngày */}
            <div className="flex flex-col gap-2 w-full max-w-full">
              {projects?.map((project) => (
                <div
                  key={project.id}
                  title={project?.description}
                  className={`relative group px-4 py-2 rounded-xl cursor-pointer transition duration-200 
                    ${project.isActive ? 'bg-white/20 dark:bg-gray-700' : 'bg-transparent dark:bg-gray-800'} 
                    hover:bg-white/20 dark:hover:bg-gray-700`}
                >
                  {/* Tên dự án */}
                  <span className="text-white dark:text-gray-100 text-sm md:text-base truncate block pr-10">
                    {project.name}
                  </span>

                  {/* Nút ba chấm EllipsisVertical */}
                  <EllipsisVertical
                    className={`
                      absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 w-7 h-7
                      text-gray-200 hover:text-white dark:text-gray-400 dark:hover:text-white
                      transition-opacity duration-200 ease-in-out
                      ${showOptionsProject === project.id ? 'opacity-100 text-white dark:text-white' : 'opacity-0'} 
                      group-hover:opacity-100
                    `}
                    onClick={(e) => handleOptionsProject(e, project)}
                    ref={(el) => (optionsButtonRef.current[project.id] = el)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar