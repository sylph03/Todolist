import { useState, useEffect, useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { debounce } from 'lodash'

export const useBoardsData = () => {
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBoards, setFilteredBoards] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [starredBoards, setStarredBoards] = useState([])
  
  const location = useLocation()
  const navigate = useNavigate()
  
  // Xác định activeTab dựa trên URL (lazy initialization)
  const [activeTab, setActiveTab] = useState(() => {
    if (location.pathname === '/boards/calendar') return 'calendar'
    if (location.pathname === '/boards/starred') return 'starred'
    if (location.pathname === '/boards/recent') return 'recent'
    if (location.pathname === '/boards/team') return 'team'
    if (location.pathname === '/boards') return 'projects'
    return 'projects'
  })
  
  // Cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    if (location.pathname === '/boards/calendar') {
      setActiveTab('calendar')
    } else if (location.pathname === '/boards/starred') {
      setActiveTab('starred')
    } else if (location.pathname === '/boards/recent') {
      setActiveTab('recent')
    } else if (location.pathname === '/boards/team') {
      setActiveTab('team')
    } else if (location.pathname === '/boards') {
      setActiveTab('projects')
    }
  }, [location.pathname])

  // Tính toán teamBoards bằng useMemo để tối ưu performance
  const teamBoards = useMemo(() => {
    if (!boards) return []
    return boards.filter(board => board.memberIds && board.memberIds.length > 0)
  }, [boards])

  // Tính toán recentBoards - boards được truy cập gần đây
  const recentBoards = useMemo(() => {
    if (!boards) return []
    return boards
      .filter(board => board.lastAccessedAt)
      .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
      .slice(0, 10)
  }, [boards])

  const updateStateData = useCallback((res) => {
    const boardsData = res.boards || []
    setBoards(boardsData)
    setTotalBoards(res.totalBoards || 0)
    setFilteredBoards(boardsData)
    
    // Lọc các board đã được đánh dấu
    const starred = boardsData.filter(board => board.isFavorite)
    setStarredBoards(starred)
  }, [])

  // Xử lý click vào tab
  const handleTabClick = useCallback((tabName) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Xác định URL tương ứng với tab
    let targetUrl = '/boards'
    if (tabName === 'calendar') {
      targetUrl = '/boards/calendar'
    } else if (tabName === 'starred') {
      targetUrl = '/boards/starred'
    } else if (tabName === 'recent') {
      targetUrl = '/boards/recent'
    } else if (tabName === 'team') {
      targetUrl = '/boards/team'
    } else if (tabName === 'projects') {
      targetUrl = '/boards'
    }
    
    // Reset search khi chuyển tab
    setSearchQuery('')
    setIsSearching(false)
    
    // Navigate đến URL tương ứng
    // useEffect sẽ tự động fetch boards khi location.pathname thay đổi
    navigate(targetUrl)
  }, [navigate])

  // Search function (chỉ hoạt động khi ở tab projects)
  const searchFn = useCallback((query) => {
    // Chỉ cho phép search khi ở tab projects
    if (location.pathname !== '/boards') {
      setIsSearching(false)
      return
    }

    if (!query.trim()) {
      fetchBoardsAPI(location.search).then(updateStateData)
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    const searchParams = new URLSearchParams()
    searchParams.set('q[title]', query.trim())
    searchParams.set('page', '1')

    fetchBoardsAPI(`?${searchParams.toString()}`).then(updateStateData)
    setIsSearching(false)
  }, [location.pathname, location.search, updateStateData])

  const debouncedSearch = useMemo(
    () => debounce(searchFn, 500),
    [searchFn]
  )

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    setSearchQuery(value)
    setIsSearching(true)
    debouncedSearch(value)
  }, [debouncedSearch])

  // Handle search input blur
  const handleSearchBlur = useCallback(() => {
    debouncedSearch.flush()
  }, [debouncedSearch])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])

  // Fetch boards on location change
  useEffect(() => {
    // Fetch boards cho calendar page (vì CalendarView cần boards để hiển thị trong Add Event modal)
    if (location.pathname === '/boards/calendar') {
      // Chỉ fetch nếu boards chưa được load
      if (boards === null) {
        fetchBoardsAPI('').then(updateStateData)
      }
      return
    }
    
    // Các tab khác fetch boards với search params (chỉ khi ở /boards)
    // Các tab starred/recent/team không cần search params
    if (location.pathname === '/boards') {
      fetchBoardsAPI(location.search).then(updateStateData)
    } else {
      // starred, recent, team - fetch không có search params
      fetchBoardsAPI('').then(updateStateData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, location.pathname, updateStateData])

  // Get current boards based on active tab
  const getCurrentBoards = useCallback(() => {
    switch (activeTab) {
      case 'starred':
        return starredBoards
      case 'recent':
        return recentBoards
      case 'team':
        return teamBoards
      default:
        return filteredBoards
    }
  }, [activeTab, starredBoards, recentBoards, teamBoards, filteredBoards])

  return {
    // State
    boards,
    totalBoards,
    searchQuery,
    filteredBoards,
    isSearching,
    activeTab,
    starredBoards,
    teamBoards,
    recentBoards,
    
    // Actions
    handleTabClick,
    handleSearchChange,
    handleSearchBlur,
    getCurrentBoards,
    updateStateData
  }
}
