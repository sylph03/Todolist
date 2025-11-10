import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FolderOpen, 
  Sparkles, 
  Clock, 
  Users, 
  Calendar, 
  BookOpen, 
  Archive, 
  CheckCircle, 
  Settings 
} from 'lucide-react'

// Component TabButton tái sử dụng
const TabButton = ({ tab }) => {
  const IconComponent = tab.icon
  return (
    <button 
      onClick={tab.onClick}
      className={`flex items-center px-4 py-2.5 text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 hover:shadow-sm w-full text-left ${tab.isActive ? 'bg-sky-50 dark:bg-sky-900/30' : ''}`}
    >
      <IconComponent className="w-5 h-5 mr-3 text-sky-500 dark:text-sky-300" />
      <span className="text-sm font-medium">{tab.label}</span>
    </button>
  )
}

const BoardsSidebar = ({ 
  activeTab, 
  starredBoardsCount, 
  recentBoardsCount, 
  teamBoardsCount, 
  onTabClick 
}) => {
  // Cấu trúc dữ liệu cho các tab - dễ mở rộng
  const tabsConfig = [
    {
      id: 'projects',
      label: 'Dự án',
      icon: FolderOpen,
      isActive: activeTab === 'projects',
      onClick: onTabClick('projects'),
      showCreateButton: true
    },
    {
      id: 'starred',
      label: 'Đã đánh dấu',
      icon: Sparkles,
      isActive: activeTab === 'starred',
      onClick: onTabClick('starred'),
      count: starredBoardsCount,
      showCreateButton: false
    },
    {
      id: 'recent',
      label: 'Gần đây',
      icon: Clock,
      isActive: activeTab === 'recent',
      onClick: onTabClick('recent'),
      count: recentBoardsCount,
      showCreateButton: false
    },
    {
      id: 'team',
      label: 'Nhóm',
      icon: Users,
      isActive: activeTab === 'team',
      onClick: onTabClick('team'),
      count: teamBoardsCount,
      showCreateButton: false
    }
  ]

  return (
    <aside className="w-full lg:w-66 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
      <div className="p-4">
        {/* Workspace Section */}
        <div className="mb-4 sm:mb-6">
          <nav className="space-y-2">
            <TabButton tab={tabsConfig[0]} />
          </nav>
        </div>

        {/* Divider */}
        <div className="my-4 sm:my-6 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Quick Access */}
        <div className="mb-4 sm:mb-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Truy cập nhanh</h3>
          <nav className="space-y-2">
            <TabButton tab={tabsConfig[1]} />
            <TabButton tab={tabsConfig[2]} />
            <TabButton tab={tabsConfig[3]} />
          </nav>
        </div>

        {/* Task Management */}
        <div className="mb-4 sm:mb-6">
          <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quản lý công việc</h3>
          <nav className="space-y-2">
            <TabButton tab={{
              id: 'calendar',
              label: 'Lịch',
              icon: Calendar,
              isActive: activeTab === 'calendar',
              onClick: onTabClick('calendar'),
              showCreateButton: false
            }} />
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
  )
}

export default BoardsSidebar
