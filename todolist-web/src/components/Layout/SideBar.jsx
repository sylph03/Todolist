import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Sparkles, ChevronUp, FolderOpen, Plus, Ellipsis, Pencil, Star, Trash2, ChevronDown } from 'lucide-react'
import ProjectItem from '../Project/ProjectItem'
import CreateProjectForm from '../Project/CreateProjectForm'

const projects = [
  {
    id: 1, name: 'Today', description: 'Công việc hôm nay', isActive: true, favorite: true
  },
  {
    id: 2, name: 'Tomorrow', isActive: false, favorite: true
  },
  {
    id: 4, name: 'Project 2', isActive: false, favorite: true
  },
  {
    id: 5, name: 'Project 3', isActive: false, favorite: true
  },
  {
    id: 6, name: 'Project 4', isActive: false
  },
  {
    id: 7, name: 'Project 5', isActive: false
  },
  {
    id: 8, name: 'Project 6', isActive: false, favorite: true
  },
  {
    id: 9, name: 'Project 7', isActive: false, favorite: true
  },
  {
    id: 10, name: 'Project 8', isActive: false, favorite: true
  },
  {
    id: 11, name: 'Project 9', isActive: false
  },
  {
    id: 12, name: 'Project 10', isActive: false, favorite: true
  },
  {
    id: 13, name: 'Project 11', isActive: false, favorite: true
  },
  {
    id: 14, name: 'Project 12', isActive: false, favorite: true
  },
  {
    id: 15, name: 'Project 13', isActive: false, favorite: true
  },
  {
    id: 16, name: 'Project 14', isActive: false, favorite: true
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
  const [showInput, setShowInput] = useState(false) // Hiển thị form tạo board hay không
  const [toggleFavoriteProject, setToggleFavoriteProject] = useState(false) // Hiển thị danh sách dự án đã đánh dấu hay không
  const [showOptionsProject, setShowOptionsProject] = useState(null) // Hiển thị menu lựa chọn cho dự án đang nhấn (null vì có thể set nhiều dự án khác)
  const [optionProjectPosition, setOptionProjectPosition] = useState(null) // Vị trí của menu lựa chọn dự án
  const [formPosition, setFormPosition] = useState(null) // Vị trí của form tạo board
  const plusButtonRef = useRef(null) // Tham chiếu nút tạo board (+)
  const optionsButtonRef = useRef({}) // Tham chiếu nút lựa chọn menu dự án (⋮)
  const projectsContainerRef = useRef(null) // Tham chiếu thẻ cha bọc dự án để quản lý thanh cuộn

  const formCreateProjectRef = useRef(null) // Tham chiếu form tạo board
  const OptionProjectRef = useRef(null) // Tham chiếu menu lựa chọn dự án

  // Xử lý dropdown khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (showOptionsProject) {
        const key = `${showOptionsProject.type}-${showOptionsProject.id}`
        const button = optionsButtonRef.current[key]

        if (button) {
          const rect = button.getBoundingClientRect()
          const viewportHeight = window.innerHeight
          const menuHeight = 138

          let top = rect.bottom + 5
          let left = rect.left

          if (top + menuHeight > viewportHeight) {
            top = rect.top - menuHeight - 5
          }

          setOptionProjectPosition(prev => {
            if (prev?.top !== top || prev?.left !== left) {
              return { top, left }
            }
            return prev
          })
        }
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Form tạo project
      if (showInput && formCreateProjectRef.current && !formCreateProjectRef.current.contains(event.target)) {
        if (plusButtonRef.current?.contains(event.target)) return
        setShowInput(false)
      }

      // Options project
      if (showOptionsProject && OptionProjectRef.current && !OptionProjectRef.current.contains(event.target)) {
        const key = `${showOptionsProject.type}-${showOptionsProject.id}`
        const currentProjectButton = optionsButtonRef.current[key]

        if (currentProjectButton?.contains(event.target)) return

        setShowOptionsProject(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showInput, showOptionsProject])

  // Xử lý sự kiện nhấn nút + (Plus)
  const handlePlusClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect()
      let top = rect.top - 30
      let left = rect.right + 30
      const formCreateProjectWidth = 320
      const formCreateProjectHeight = 328
      if (top + formCreateProjectHeight > window.innerHeight) {
        top = rect.top - formCreateProjectHeight
      }
      if (left + formCreateProjectWidth > window.innerWidth) {
        left = rect.right - formCreateProjectWidth/2
      }
      setFormPosition({ top, left })
    }
    setShowInput(!showInput)
  }

  // Xử lý sự kiện nhấn nút ⋮ (Ellipsis)
  const handleOptionsProject = (e, projectKey) => {
    e.preventDefault()
    e.stopPropagation()

    const keyString = `${projectKey.type}-${projectKey.id}`

    if (optionsButtonRef.current[keyString]) {
      const rect = optionsButtonRef.current[keyString].getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const menuHeight = 138

      let top = rect.bottom + 5
      let left = rect.left

      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 5
      }

      setOptionProjectPosition({ top, left })
    }

    setShowOptionsProject((prev) => (
      prev && prev.type === projectKey.type && prev.id === projectKey.id ? null : projectKey
    ))
  }


  return (
    <>
      {showInput &&
        <CreateProjectForm
          formCreateProjectRef={formCreateProjectRef}
          setShowInput={setShowInput}
          formPosition={formPosition}
        />
      }

      {/* Options project */}
      {showOptionsProject && (
        <div
          ref={OptionProjectRef}
          className="z-50 fixed bg-white dark:bg-gray-900 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-48"
          style={{ top: optionProjectPosition?.top, left: optionProjectPosition?.left }} >
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

        {/* Không gian làm việc */}
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
          <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full" ref={projectsContainerRef}>
            {/* Ô tìm kiếm */}
            <div className='px-3 pt-2'>
              <div className="flex items-center bg-sky-500 dark:bg-gray-800 rounded-lg px-3 py-2 transition duration-200 ease-in-out hover:bg-white/20 focus-within:bg-white/20 dark:focus-within:bg-gray-700 dark:hover:bg-gray-700 w-full group">
                <Search className="text-white dark:text-gray-400 w-5 h-5 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ..."
                  className="ml-3 bg-transparent outline-none text-white dark:text-gray-100 placeholder-white dark:placeholder-gray-400 w-full text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Đã đánh dấu */}
            <div className={`px-3 ${toggleFavoriteProject ? 'pb-3 mb-1 border-b border-sky-400 dark:border-slate-700' : ''} flex flex-col gap-2`}>
              <div onClick={() => setToggleFavoriteProject(prev => !prev)} className="relative flex items-center justify-between px-3 py-2  rounded-lg cursor-pointer group transition duration-200 hover:bg-white/20 dark:hover:bg-gray-700">
                <div className="flex items-center gap-2 text-white dark:text-gray-100">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm sm:text-base font-medium">Đã đánh dấu</span>
                </div>

                <div className="absolute right-2 p-1 top-1/2 -translate-y-1/2">
                  <ChevronUp className={`${toggleFavoriteProject ? 'animate-turnRight180' : 'animate-turnLeft180'} w-5 h-5 text-gray-200 dark:text-gray-300 cursor-pointer hover:text-white transition duration-150`} />
                </div>
              </div>
              {/* Danh sách đã đánh dấu */}
              {toggleFavoriteProject &&
                <div className="flex flex-col gap-2 w-full max-w-full">
                  {projects?.map((project) => (
                    project.favorite && (
                      <ProjectItem
                        key={`favorite-${project.id}`}
                        project={project}
                        type="favorite"
                        onEllipsisClick={handleOptionsProject}
                        showOptionsProject={showOptionsProject}
                        optionsButtonRef={optionsButtonRef}
                      />
                    )
                  ))}
                </div>
              }
            </div>

            {/* Dự án */}
            <div className='px-3 pb-2 flex flex-col gap-2'>
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
              {/* Danh sách dự án */}
              <div className="flex flex-col gap-2 w-full max-w-full">
                {projects?.map((project) => (
                  <ProjectItem
                    key={`normal-${project.id}`}
                    project={project}
                    onEllipsisClick={handleOptionsProject}
                    showOptionsProject={showOptionsProject}
                    optionsButtonRef={optionsButtonRef}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar