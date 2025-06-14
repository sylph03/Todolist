import React, { useState, useEffect, useRef, useCallback } from 'react'
import Appbar from '~/components/Layout/AppBar'
import { Plus, LayoutGrid, Search, Star, Sparkles, Clock, ChevronRight, Users, Settings, FolderOpen, Calendar, BookOpen, Archive, CheckCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PageLoadingSpinner from '~/components/UI/Loading/PageLoadingSpinner'
import { fetchBoardsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE, FORM_CREATE_PROJECT_WIDTH, FORM_CREATE_PROJECT_HEIGHT } from '~/utils/constants'
import Pagination from '~/components/UI/Pagination'
import CreateProjectForm from '~/components/Project/CreateProjectForm'
import { debounce } from 'lodash'

const Boards = () => {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBoards, setFilteredBoards] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef(null)

  const [showInput, setShowInput] = useState(false) // Hiển thị form tạo board hay không
  const [formPosition, setFormPosition] = useState(null) // Vị trí của form tạo board
  const formCreateProjectRef = useRef(null) // Tham chiếu form tạo board
  const plusButtonRef = useRef(null) // Tham chiếu nút + (Plus)
  const location = useLocation()

  const query = new URLSearchParams(location.search)

  const page = parseInt(query.get('page') || '1', 10)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        fetchBoardsAPI(location.search).then(updateStateData)
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      // Thêm query search vào URL params
      const searchParams = new URLSearchParams()
      searchParams.set('q[title]', query.trim()) // Format query param theo model
      searchParams.set('page', '1') // Reset về trang 1 khi tìm kiếm
      
      // Fetch boards với search params
      fetchBoardsAPI(`?${searchParams.toString()}`).then(updateStateData)
      setIsSearching(false)
    }, 500),
    [location.search]
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  // Handle search input blur
  const handleSearchBlur = () => {
    debouncedSearch.flush()
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  const updateStateData = (res) => {
    setBoards(res.boards || [])
    setTotalBoards(res.totalBoards || 0)
    setFilteredBoards(res.boards || [])
  }

  useEffect(() => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }, [location.search])

  const affterCreatedNewBoard = () => {
    // fetch lại danh sách boards với phân trang
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  // Tách riêng logic tính toán vị trí form
  const calculateFormPosition = () => {
    if (!plusButtonRef.current) return null

    const rect = plusButtonRef.current.getBoundingClientRect()
    const isSmallScreen = window.innerWidth <= 640 // Breakpoint sm trong Tailwind
    const padding = 16 // Padding an toàn để form không sát cạnh màn hình

    // Nếu màn hình nhỏ (như điện thoại), luôn đặt form ở giữa
    if (isSmallScreen) {
      const centerTop = Math.max(padding, (window.innerHeight - FORM_CREATE_PROJECT_HEIGHT) / 2)
      const centerLeft = Math.max(padding, (window.innerWidth - FORM_CREATE_PROJECT_WIDTH) / 2)
      return { top: centerTop, left: centerLeft }
    }

    // Logic cho màn hình lớn
    let top = rect.top - 10
    let left = rect.left - FORM_CREATE_PROJECT_WIDTH - 10

    // Kiểm tra và điều chỉnh vị trí nếu form vượt quá kích thước màn hình
    if (top + FORM_CREATE_PROJECT_HEIGHT > window.innerHeight - padding) {
      // Nếu form vượt quá chiều cao màn hình, đặt ở giữa theo chiều dọc
      top = Math.max(padding, (window.innerHeight - FORM_CREATE_PROJECT_HEIGHT) / 2)
    }

    if (left + FORM_CREATE_PROJECT_WIDTH > window.innerWidth - padding) {
      // Nếu form vượt quá chiều rộng màn hình, đặt ở giữa theo chiều ngang
      left = Math.max(padding, (window.innerWidth - FORM_CREATE_PROJECT_WIDTH) / 2)
    }

    // Đảm bảo form không bị cắt ở cạnh trên và trái
    top = Math.max(padding, top)
    left = Math.max(padding, left)

    return { top, left }
  }

  useEffect(() => {
    if (!showInput) {
      setFormPosition(null)
      return
    }

    // Xử lý khi nhấn ra ngoài popup
    const handleClickOutside = (event) => {
      if (showInput && formCreateProjectRef.current && !formCreateProjectRef.current.contains(event.target)) {
        if (plusButtonRef.current?.contains(event.target)) return
        setShowInput(false)
      }
    }

    // Cập nhật vị trí form khi scroll hoặc resize
    const handleScrollOrResize = () => {
      if (showInput) {
        setFormPosition(calculateFormPosition())
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [showInput])

  // Xử lý sự kiện nhấn nút + (Plus)
  const handlePlusClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    setFormPosition(calculateFormPosition())
    setShowInput(!showInput)
  }

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
                          ref={searchInputRef}
                          type="text"
                          placeholder="Tìm kiếm bảng..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onBlur={handleSearchBlur}
                          className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 w-full transition-all duration-200"
                        />
                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-2.5" />
                        {isSearching && (
                          <div className="absolute right-3 top-2.5">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-500 border-t-transparent"></div>
                          </div>
                        )}
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
                  {/* Trường hợp không có bảng nào */}
                  {filteredBoards.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                      <div className="w-24 h-24 mb-6 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                        <LayoutGrid className="w-12 h-12 text-sky-500 dark:text-sky-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {searchQuery ? 'Không tìm thấy bảng nào' : 'Chưa có bảng nào'}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                        {searchQuery 
                          ? 'Thử tìm kiếm với từ khóa khác hoặc tạo bảng mới'
                          : 'Nhấn vào nút "Tạo bảng mới" ở góc trên bên phải để bắt đầu quản lý công việc của bạn'
                        }
                      </p>
                    </div>
                  )}

                  {/* Danh sách bảng */}
                  {filteredBoards.length > 0 &&
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {filteredBoards.map((board) => (
                        <div key={board?._id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 border border-gray-100 dark:border-gray-700">
                          <div className={`h-16 sm:h-22 ${board?.backgroundColor || 'bg-sky-200'} relative`}>
                            {board?.favorite && <button className="absolute top-2 sm:top-3 right-2 sm:right-3 p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-200">
                              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </button>}
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