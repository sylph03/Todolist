import React from 'react'
import { LayoutGrid, Sparkles, Clock, Users } from 'lucide-react'

const BoardsEmptyState = ({ 
  activeTab, 
  searchQuery 
}) => {
  const isStarredTab = activeTab === 'starred'
  const isRecentTab = activeTab === 'recent'
  const isTeamTab = activeTab === 'team'

  const getEmptyStateConfig = () => {
    // Kiểm tra search query trước tiên - ưu tiên cao nhất
    if (searchQuery && searchQuery.trim()) {
      return {
        icon: LayoutGrid,
        title: 'Không tìm thấy bảng nào',
        description: 'Thử tìm kiếm với từ khóa khác hoặc tạo bảng mới'
      }
    }
    
    // Sau đó mới kiểm tra các tab
    if (isStarredTab) {
      return {
        icon: Sparkles,
        title: 'Chưa có bảng nào được đánh dấu',
        description: 'Nhấn vào biểu tượng ngôi sao trên bảng để đánh dấu bảng yêu thích'
      }
    }
    
    if (isRecentTab) {
      return {
        icon: Clock,
        title: 'Chưa có bảng nào được truy cập gần đây',
        description: 'Truy cập vào các bảng để chúng xuất hiện ở đây'
      }
    }
    
    if (isTeamTab) {
      return {
        icon: Users,
        title: 'Chưa có bảng nhóm nào',
        description: 'Mời thành viên vào bảng để tạo bảng nhóm hoặc tham gia bảng có sẵn'
      }
    }
    
    // Mặc định cho tab "Dự án"
    return {
      icon: LayoutGrid,
      title: 'Chưa có bảng nào',
      description: 'Nhấn vào nút "Tạo bảng mới" ở góc trên bên phải để bắt đầu quản lý công việc của bạn'
    }
  }

  const config = getEmptyStateConfig()
  const IconComponent = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
        <IconComponent className="w-12 h-12 text-sky-500 dark:text-sky-300" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {config.title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
        {config.description}
      </p>
    </div>
  )
}

export default BoardsEmptyState
