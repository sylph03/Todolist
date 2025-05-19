import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Sparkles, ChevronUp, FolderOpen, Plus, Ellipsis, Pencil, Star, Trash2 } from 'lucide-react'
import ProjectItem from '../Project/ProjectItem'
import CreateProjectForm from '../Project/CreateProjectForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { Link } from 'react-router-dom'
import { FORM_CREATE_PROJECT_WIDTH, FORM_CREATE_PROJECT_HEIGHT, OPTIONS_PROJECT_HEIGHT } from '~/utils/constants'
import { fetchBoardsForSidebarAPI } from '~/apis'

const SideBar = ({ isOpen, toggleSidebar }) => {

  const currentUser = useSelector(selectCurrentUser)

  const [showInput, setShowInput] = useState(false) // Hiển thị form tạo board hay không
  const [toggleFavoriteProject, setToggleFavoriteProject] = useState(false) // Hiển thị danh sách dự án đã đánh dấu hay không
  const [showOptionsProject, setShowOptionsProject] = useState(null) // Hiển thị menu lựa chọn cho dự án đang nhấn (null vì có thể set nhiều dự án khác)

  const [optionProjectPosition, setOptionProjectPosition] = useState(null) // Vị trí của menu lựa chọn dự án
  const [formPosition, setFormPosition] = useState(null) // Vị trí của form tạo board
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)

  const plusButtonRef = useRef(null) // Tham chiếu nút tạo board (+)
  const optionsButtonRef = useRef({}) // Tham chiếu nút lựa chọn menu dự án (⋮)
  const projectsContainerRef = useRef(null) // Tham chiếu thẻ cha bọc dự án để quản lý thanh cuộn

  const formCreateProjectRef = useRef(null) // Tham chiếu form tạo board
  const OptionProjectRef = useRef(null) // Tham chiếu menu lựa chọn dự án

  const getListBoards = async () => {
    setLoading(true)
    const response = await fetchBoardsForSidebarAPI()
    setBoards(response.boards)
    setLoading(false)
  }

  const handleCreatedNewBoard = (newBoard) => {
    // Thêm board mới vào đầu danh sách
    setBoards(prevBoards => [...prevBoards, newBoard])
  }

  // Load boards khi component mount
  useEffect(() => {
    getListBoards()
  }, [])

  // Xử lý dropdown khi cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (showOptionsProject) {
        const key = `${showOptionsProject.type}-${showOptionsProject.id}`
        const button = optionsButtonRef.current[key]

        if (button) {
          const rect = button.getBoundingClientRect()
          const viewportHeight = window.innerHeight

          let top = rect.bottom + 5
          let left = rect.left

          if (top + OPTIONS_PROJECT_HEIGHT > viewportHeight) {
            top = rect.top - OPTIONS_PROJECT_HEIGHT - 5
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
  const handlePlusClick = () => {
    if (plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect()
      let top = rect.top - 30
      let left = rect.right + 30

      if (top + FORM_CREATE_PROJECT_HEIGHT > window.innerHeight) {
        top = rect.top - FORM_CREATE_PROJECT_HEIGHT
      }
      if (left + FORM_CREATE_PROJECT_WIDTH > window.innerWidth) {
        left = rect.right - FORM_CREATE_PROJECT_WIDTH/2
      }
      setFormPosition({ top, left })
    }
    setShowInput(!showInput)
  }

  // Xử lý sự kiện nhấn nút ⋮ (Ellipsis)
  // Chưa hiểu tại sao thêm e thì mới hiển thị đúng @@
  const handleOptionsProject = (e, projectKey) => {
    // e.preventDefault()
    // e.stopPropagation()

    const keyString = `${projectKey.type}-${projectKey.id}`

    if (optionsButtonRef.current[keyString]) {
      const rect = optionsButtonRef.current[keyString].getBoundingClientRect()
      const viewportHeight = window.innerHeight

      let top = rect.bottom + 5
      let left = rect.left

      if (top + OPTIONS_PROJECT_HEIGHT > viewportHeight) {
        top = rect.top - OPTIONS_PROJECT_HEIGHT - 5
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
          affterCreatedNewBoard={handleCreatedNewBoard}
        />
      }

      {/* Options project */}
      {showOptionsProject && (
        <div
          ref={OptionProjectRef}
          className="z-50 fixed bg-white dark:bg-gray-900 p-2 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 w-48 animate-fadeIn"
          style={{ top: optionProjectPosition?.top, left: optionProjectPosition?.left }} >
          <div className="flex flex-col gap-1.5">
            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out" >
              <Pencil className="w-4 h-4" />
              <span>Đổi tên</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 ease-in-out" >
              <Star className="w-4 h-4" />
              <span>Yêu thích</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ease-in-out" >
              <Trash2 className="w-4 h-4" />
              <span>Xoá</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar thu gọn */}
      {!isOpen && <div className='h-full min-w-4 max-w-4 bg-sky-500 absolute top-0 bottom-0 dark:bg-gray-800 transition-all duration-300'>
        <ChevronRight className='z-1 absolute border border-white dark:border-gray-400 shadow-md bg-sky-500 rounded-full bottom-1/2 left-1/4 cursor-pointer hover:bg-sky-400 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200' onClick={toggleSidebar}/>
      </div>}

      {/* Sidebar mở */}
      <div className={`z-1 absolute top-0 bottom-0 h-full max-w-WIDTH_SIDEBAR min-w-WIDTH_SIDEBAR bg-gradient-to-b from-sky-500 to-sky-600 dark:from-gray-800 dark:to-gray-900 shadow-lg transition-all duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Không gian làm việc */}
        <div className="flex flex-wrap items-center justify-between w-full px-4 py-3 bg-sky-500/50 dark:bg-[#1e293b]/50 backdrop-blur-sm border-b border-sky-400/30 dark:border-slate-700/30 transition-all duration-300">
          <Link to='/boards' className="flex items-center gap-3 cursor-pointer group">
            <img src={currentUser?.avatar || 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'} alt="User Avatar" className="h-9 w-9 rounded-full object-cover shadow-md ring-2 ring-white/20 group-hover:ring-white/40 dark:ring-slate-400/20 dark:group-hover:ring-slate-400/40 transition-all duration-300" />
            <span className="font-semibold text-white dark:text-slate-100 text-base transition-all duration-300 group-hover:text-white/90">
              Không gian làm việc
            </span>
          </Link>

          {/* Right: Toggle Sidebar */}
          <button
            className="p-2 rounded-md hover:bg-white/20 dark:hover:bg-slate-600/40 transition-all duration-200 active:scale-95" onClick={toggleSidebar} aria-label="Toggle Sidebar" >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-white dark:text-slate-100" />
            ) : (
              <ChevronRight className="w-5 h-5 text-white dark:text-slate-100" />
            )}
          </button>
        </div>

        <div className='h-[calc(100%-65px)] pr-0.5 mt-0.5'>
          <div className="flex flex-col gap-2 overflow-y-auto overflow-x-hidden h-full scrollbar-thin scrollbar-thumb-sky-400/30 dark:scrollbar-thumb-gray-600/30 scrollbar-track-transparent" ref={projectsContainerRef}>
            {/* Ô tìm kiếm */}
            <div className="px-3 pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm ..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-sky-400/30 dark:border-slate-700/30
                    bg-white/10 dark:bg-gray-800/50 text-white dark:text-gray-100
                    focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30
                    transition duration-200 placeholder-gray-100 dark:placeholder-gray-400
                    backdrop-blur-sm"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-100 dark:text-gray-400" />
              </div>
            </div>

            {/* Đã đánh dấu */}
            <div className={`px-3 ${toggleFavoriteProject ? 'pb-3 mb-1 border-b border-sky-400/30 dark:border-slate-700/30' : ''} flex flex-col gap-2`}>
              <div onClick={() => setToggleFavoriteProject(prev => !prev)} className="relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2 text-white dark:text-gray-100">
                  <Sparkles className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm sm:text-base font-medium">Đã đánh dấu</span>
                </div>

                <div className="absolute right-2 p-1 top-1/2 -translate-y-1/2">
                  <ChevronUp className={`${toggleFavoriteProject ? 'animate-turnRight180' : 'animate-turnLeft180'} w-5 h-5 text-gray-200 dark:text-gray-300 cursor-pointer hover:text-white transition-all duration-200`} />
                </div>
              </div>
              {/* Danh sách đã đánh dấu */}
              {toggleFavoriteProject &&
                <div className="flex flex-col gap-2 w-full max-w-full animate-fadeIn">
                  {boards?.map((board) => (
                    board.favorite && (
                      <ProjectItem
                        key={`favorite-${board._id}`}
                        project={board}
                        type="favorite"
                        onEllipsisClick={handleOptionsProject}
                        showOptionsProject={showOptionsProject}
                        optionsButtonRef={optionsButtonRef}
                      />
                    )
                  ))}
                  {loading && (
                    <div className="text-center text-white/70 dark:text-gray-400 py-2">
                      Đang tải...
                    </div>
                  )}
                </div>
              }
            </div>

            {/* Dự án */}
            <div className='px-3 pb-2 flex flex-col gap-2'>
              <div className="relative px-3 py-2 rounded-lg cursor-pointer group transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-700/50">
                <div className="flex items-center gap-2 text-white dark:text-gray-100 pr-15">
                  <FolderOpen className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-sm sm:text-base font-medium">Dự án</span>
                </div>

                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Ellipsis className="w-7 h-7 p-1 dark:text-gray-300 text-gray-200 hover:text-white cursor-pointer transition-all duration-200 hover:scale-110" />
                  </div>
                  <div
                    onClick={handlePlusClick}
                    ref={plusButtonRef}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Plus className={`w-7 h-7 p-1 dark:text-gray-300 cursor-pointer text-gray-200 hover:text-white transition-all duration-200 ${showInput ? 'text-white dark:text-white rotate-45' : 'text-gray-200'}`} />
                  </div>
                </div>
              </div>
              {/* Danh sách dự án */}
              <div className="flex flex-col gap-2 w-full max-w-full">
                {boards?.map((board) => (
                  <ProjectItem
                    key={`normal-${board._id}`}
                    project={board}
                    onEllipsisClick={handleOptionsProject}
                    showOptionsProject={showOptionsProject}
                    optionsButtonRef={optionsButtonRef}
                  />
                ))}
                {loading && (
                  <div className="text-center text-white/70 dark:text-gray-400 py-2">
                    Đang tải...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar