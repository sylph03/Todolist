import React, { useState, useEffect, useRef } from 'react'
import Appbar from '~/components/Layout/AppBar'
import { Plus, LayoutGrid, Search, Star, Sparkles, Clock, ChevronRight, Users, Settings, FolderOpen, Calendar, BookOpen, Archive, CheckCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PageLoadingSpinner from '~/components/UI/Loading/PageLoadingSpinner'
import { fetchBoardsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE, FORM_CREATE_PROJECT_WIDTH, FORM_CREATE_PROJECT_HEIGHT } from '~/utils/constants'
import Pagination from '~/components/UI/Pagination'
import CreateProjectForm from '~/components/Project/CreateProjectForm'

const Boards = () => {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)

  const [showInput, setShowInput] = useState(false) // Hiển thị form tạo board hay không
  const [formPosition, setFormPosition] = useState(null) // Vị trí của form tạo board
  const formCreateProjectRef = useRef(null) // Tham chiếu form tạo board
  const plusButtonRef = useRef(null) // Tham chiếu nút + (Plus)
  const location = useLocation()

  const query = new URLSearchParams(location.search)

  const page = parseInt(query.get('page') || '1', 10)

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
  }

  useEffect(() => {
    // // Fake tạm 16 item thay cho boards
    // setBoards([...Array(16)].map((_, i) => i))
    // // Fake tạm 100 item thay cho totalBoards
    // setTotalBoards(100)

    fetchBoardsAPI(location.search).then(updateStateData)

  }, [location.search]) // Fix typo in dependency

  const affterCreatedNewBoard = () => {
    // fetch lại danh sách boards
    fetchBoardsAPI(location.search).then(updateStateData)
  }

// Xử lý sự kiện nhấn nút + (Plus)
const handlePlusClick = () => {
  if (plusButtonRef.current) {
    const rect = plusButtonRef.current.getBoundingClientRect()
    let top = rect.top - 10
    let left = rect.left - FORM_CREATE_PROJECT_WIDTH - 10
  
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

useEffect(() => {
  const handleClickOutside = (event) => {
    // Form tạo project
    if (showInput && formCreateProjectRef.current && !formCreateProjectRef.current.contains(event.target)) {
      if (plusButtonRef.current?.contains(event.target)) return
      setShowInput(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [showInput])

  if (!boards) {
    return <PageLoadingSpinner />
  }

  return (
    <>
      {showInput &&
        <CreateProjectForm
          formCreateProjectRef={formCreateProjectRef}
          setShowInput={setShowInput}
          formPosition={formPosition}
          affterCreatedNewBoard={affterCreatedNewBoard}
        />
      }
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-700">
        <Appbar />

        <div className='overflow-y-auto overflow-x-hidden h-[calc(100vh-50px)]'>
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-8 sm:pb-12">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <LayoutGrid className="w-6 h-6 sm:w-7 sm:h-7 text-sky-500 dark:text-sky-300" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Không gian làm việc</h2>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              {/* Sidebar */}
              <aside className="w-full lg:w-66 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
                <div className="p-4">
                  {/* Workspace Section */}
                  <div className="mb-4 sm:mb-6">
                    <nav className="space-y-2">
                      <Link to="/projects" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-sky-50 dark:bg-sky-900/30 rounded-lg transition-all duration-200 hover:bg-sky-100 dark:hover:bg-sky-900/40 hover:shadow-sm">
                        <FolderOpen className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Dự án</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Divider */}
                  <div className="my-4 sm:my-6 border-t border-gray-200 dark:border-gray-700"></div>

                  {/* Quick Access */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Truy cập nhanh</h3>
                    <nav className="space-y-2">
                      <Link to="/starred" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <Sparkles className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Đã đánh dấu</span>
                      </Link>
                      <Link to="/recent" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <Clock className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Gần đây</span>
                      </Link>
                      <Link to="/team" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <Users className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Nhóm</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Task Management */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quản lý công việc</h3>
                    <nav className="space-y-2">
                      <Link to="/calendar" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <Calendar className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Lịch</span>
                      </Link>
                      <Link to="/notes" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <BookOpen className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Ghi chú</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Archives */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Lưu trữ</h3>
                    <nav className="space-y-2">
                      <Link to="/archived" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <Archive className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Nhiệm vụ lưu trữ</span>
                      </Link>
                      <Link to="/completed" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                        <CheckCircle className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                        <span className="text-sm font-medium">Nhiệm vụ đã hoàn thành</span>
                      </Link>
                    </nav>
                  </div>

                  {/* Workspace Settings */}
                  <div className="space-y-2">
                    <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Cài đặt</h3>
                    <Link to="/settings" className="flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm">
                      <Settings className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
                      <span className="text-sm font-medium">Cài đặt</span>
                    </Link>
                  </div>
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col p-4 sm:p-6">
                {/* Header */}
                <header className="flex-none mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Các Bảng Dự Án Của Bạn</h1>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      {/* Search Bar */}
                      <div className="relative w-full sm:w-72">
                        <input
                          type="text"
                          placeholder="Tìm kiếm bảng..."
                          className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 w-full transition-all duration-200"
                        />
                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
                      </div>
                      <button 
                        onClick={handlePlusClick} 
                        ref={plusButtonRef}
                        className="bg-sky-500 text-white px-5 py-2.5 rounded-lg hover:bg-sky-600 transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm hover:shadow-md">
                        <Plus className={`w-5 h-5 mr-2 transition-all duration-200 ${showInput ? '-rotate-45' : ''}`} />
                        Tạo bảng mới
                      </button>
                    </div>
                  </div>
                </header>

                {/* Content Area */}
                <div className="flex-1">
                  {/* Trường hợp gọi API nhưng không tồn tại Board nào trong db trả về */}
                  {boards.length === 0 &&
                    <p className="text-gray-500 dark:text-gray-400">Không có bảng nào</p>
                  }

                  {/* Trường hợp gọi API và có boards trong db trả về thì render danh sách boards */}
                  {/* Boards Grid */}
                  {boards.length > 0 &&
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {boards.map((board) => (
                        <div key={board?._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700">
                          <div className="h-16 sm:h-22 bg-sky-200 relative">
                            <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200">
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>
                          </div>
                          <div className="p-3 sm:p-4">
                            <div className="flex items-start justify-between mb-2 sm:mb-3">
                              <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{board?.title}</h3>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2">
                              {board?.description}
                            </p>
                            <Link to={`/boards/${board?._id}`} className="flex items-center text-xs sm:text-sm text-sky-500 dark:text-sky-300 hover:text-sky-600 dark:hover:text-sky-300 transition-colors">
                              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              Đi tới bảng
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>}

                  {/* Pagination */}
                  {totalBoards > 0 &&
                    <Pagination
                      count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                      page={page}
                      path='/boards'
                    />
                  }
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Boards