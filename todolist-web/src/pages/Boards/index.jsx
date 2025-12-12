import React, { useState, useEffect, useRef } from 'react'
import Appbar from '~/components/Layout/AppBar'
import { Plus, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import PageLoadingSpinner from '~/components/UI/Loading/PageLoadingSpinner'
import { fetchBoardsAPI } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE, FORM_CREATE_PROJECT_WIDTH, FORM_CREATE_PROJECT_HEIGHT } from '~/utils/constants'
import Pagination from '~/components/UI/Pagination'
import CreateProjectForm from '~/components/Project/CreateProjectForm'
import BoardsSidebar from '~/components/Layout/BoardsSidebar'
import BoardsSearchBar from '~/components/UI/BoardsSearchBar'
import BoardsEmptyState from '~/components/UI/BoardsEmptyState'
import BoardGrid from '~/components/Board/BoardGrid'
import CalendarView from '~/components/Calendar/CalendarView'
import { useBoardsData } from '~/hooks/useBoardsData'
import { useBoardAccess } from '~/hooks/useBoardAccess'
import { socketIoInstance } from '~/socketClient'

const Boards = () => {
  const [showInput, setShowInput] = useState(false)
  const [formPosition, setFormPosition] = useState(null)
  const formCreateProjectRef = useRef(null)
  const plusButtonRef = useRef(null)
  const searchInputRef = useRef(null)
  const location = useLocation()

  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  // Custom hooks
  const {
    boards,
    totalBoards,
    searchQuery,
    isSearching,
    activeTab,
    starredBoards,
    teamBoards,
    recentBoards,
    handleTabClick,
    handleSearchChange,
    handleSearchBlur,
    getCurrentBoards,
    updateStateData
  } = useBoardsData()

  const { handleBoardAccess } = useBoardAccess()

  const affterCreatedNewBoard = () => {
    fetchBoardsAPI(location.search).then(updateStateData)
  }

  // Lắng nghe realtime events để cập nhật danh sách boards
  useEffect(() => {
    if (!socketIoInstance) return

    // Handler khi board được cập nhật
    const handleBoardUpdated = (data) => {
      if (boards) {
        // Refetch boards để cập nhật danh sách
        fetchBoardsAPI(location.search).then(updateStateData)
      }
    }

    // Handler khi board bị xóa
    const handleBoardDeleted = (data) => {
      if (boards) {
        // Refetch boards để cập nhật danh sách
        fetchBoardsAPI(location.search).then(updateStateData)
      }
    }

    // Đăng ký listeners
    socketIoInstance.on('BE_BOARD_UPDATED', handleBoardUpdated)
    socketIoInstance.on('BE_BOARD_DELETED', handleBoardDeleted)

    // Cleanup
    return () => {
      socketIoInstance.off('BE_BOARD_UPDATED', handleBoardUpdated)
      socketIoInstance.off('BE_BOARD_DELETED', handleBoardDeleted)
    }
  }, [boards, location.search, updateStateData])

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
              <BoardsSidebar
                activeTab={activeTab}
                starredBoardsCount={starredBoards.length}
                recentBoardsCount={recentBoards.length}
                teamBoardsCount={teamBoards.length}
                onTabClick={handleTabClick}
              />

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col p-4 sm:p-6">
                {/* Header */}
                <header className="flex-none mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          {activeTab === 'starred'
                            ? 'Bảng Đã Đánh Dấu'
                            : activeTab === 'recent'
                              ? 'Bảng Gần Đây'
                              : activeTab === 'team'
                                ? 'Bảng Nhóm'
                                : activeTab === 'calendar'
                                  ? 'Lịch'
                                  : 'Các Bảng Dự Án Của Bạn'
                          }
                        </h1>
                    </div>
                    {activeTab === 'projects' && (
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {/* Search Bar */}
                        <BoardsSearchBar
                            ref={searchInputRef}
                          searchQuery={searchQuery}
                          isSearching={isSearching}
                          onSearchChange={handleSearchChange}
                          onSearchBlur={handleSearchBlur}
                        />
                        {/* Chỉ hiển thị nút tạo bảng mới khi tab cho phép */}
                        {activeTab === 'projects' && (
                        <button
                          onClick={handlePlusClick}
                          ref={plusButtonRef}
                          className="bg-sky-500 text-white px-5 py-2.5 rounded-lg hover:bg-sky-600 transition-all duration-200 flex items-center justify-center text-sm font-medium shadow-sm hover:shadow-md">
                          <Plus className={`w-5 h-5 mr-2 transition-all duration-200 ${showInput ? '-rotate-45' : ''}`} />
                          Tạo bảng mới
                        </button>
                        )}
                      </div>
                    )}
                  </div>
                </header>

                {/* Content Area */}
                <div className="flex-1">
                  {activeTab === 'calendar' ? (
                    <CalendarView boards={boards} />
                  ) : (
                    (() => {
                      const currentBoards = getCurrentBoards()
                      
                      return (
                        <>
                    {/* Trường hợp không có bảng nào */}
                          {currentBoards.length === 0 && (
                            <BoardsEmptyState 
                              activeTab={activeTab}
                              searchQuery={searchQuery}
                            />
                    )}

                    {/* Danh sách bảng */}
                          {currentBoards.length > 0 && (
                            <BoardGrid 
                              boards={currentBoards}
                              onBoardAccess={handleBoardAccess}
                            />
                          )}
                        </>
                      )
                    })()
                  )}

                  {/* Pagination - chỉ hiển thị khi ở tab "Dự án" */}
                  {activeTab === 'projects' && totalBoards > 0 &&
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