import React, { useState, useEffect, useRef } from 'react'
import { Search, FileText, CreditCard } from 'lucide-react'
import { getCardsAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { debounce } from 'lodash'
import { useDispatch } from 'react-redux'
import { showActiveCard, updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice'

const SearchActionCard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const dropdownRef = useRef(null)

  // State xử lý hiển thị kết quả fetch về từ api
  const [open, setOpen] = useState(false)

  // State lưu trữ danh sách card fetch về được
  const [cards, setCards] = useState(null)

  // Sẽ hiện loading khi bắt đầu gọi api fetch cards
  const [loading, setLoading] = useState(false)

  // State lưu giá trị input search
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    // Khi đóng phần list kết quả lại thì đồng thời clear cho cards về null
    if (!open) { 
      setCards(null)
      setSearchValue('')
    }
  }, [open])

  // Xử lý click outside để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click vào input hoặc dropdown thì không đóng
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Kiểm tra nếu đang focus vào input thì không đóng
        if (document.activeElement === dropdownRef.current.querySelector('input')) {
          return
        }
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Tạo hàm debounce để tránh gọi API quá nhiều
  const debouncedSearch = debounce(async (searchValue) => {
    if (!searchValue) return

    // Escape các ký tự đặc biệt trong chuỗi tìm kiếm
    const escapedSearchValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const searchQuery = { title: escapedSearchValue }
    const searchPath = `?q=${JSON.stringify(searchQuery)}`
    const result = await getCardsAPI(searchPath)
    
    // Kiểm tra và xử lý kết quả trả về
    if (Array.isArray(result)) {
      setCards(result)
    } else {
      setCards([])
    }
    setLoading(false)
  }, 500)

  // Xử lý việc nhận data nhập vào từ input sau đó gọi api để lấy kết quả về
  const handleInputSearchChange = (e) => {
    const value = e.target.value
    setSearchValue(value)
    
    if (!value) {
      setCards(null)
      setLoading(false)
      setOpen(false)
      return
    }
    
    setOpen(true)
    setLoading(true)
    debouncedSearch(value)
  }

  // Khi select chọn một card thì mở thể đó showActiveCard và update currentActiveCard
  const handleSelectedCard = (card) => {
    setOpen(false)
    setSearchValue('')
    // Dispatch actions để update Redux state
    dispatch(showActiveCard())
    dispatch(updateCurrentActiveCard(card))
    // Navigate đến board chứa card đó
    navigate(`/boards/${card.boardId}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchValue}
        onChange={handleInputSearchChange}
        onFocus={() => searchValue && setOpen(true)}
        spellCheck={false}
        placeholder="Tìm kiếm nhiệm vụ..."
        className="max-w-[300px] pl-10 pr-4 py-[7px] rounded-xl border border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          transition duration-200 placeholder-gray-500 dark:placeholder-gray-400"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />

      {/* Dropdown kết quả tìm kiếm */}
      {open && (
        <div className="absolute top-full right-0 mt-2 w-[360px] bg-white dark:bg-gray-800 rounded-xl shadow-lg border-transparent
          transform transition-all duration-200 ease-in-out origin-top
          animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-t-xl border-b border-gray-100 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Nhiệm vụ</div>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center space-x-2 py-4 text-gray-500 dark:text-gray-400">
                <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 border-t-sky-500 rounded-full animate-spin"></div>
                <span>Đang tìm kiếm...</span>
              </div>
            ) : cards && cards.length > 0 ? (
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {cards.map((card, index) => (
                  <div key={card._id}>
                    <div
                      onClick={() => handleSelectedCard(card)}
                      className="group p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer
                        transition-colors duration-150 ease-in-out"
                    >
                      <div className="flex items-start gap-3">
                        {card.cover ? (
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                            <img 
                              src={card.cover} 
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                            {card.title}
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < cards.length - 1 && (
                      <div className="h-px bg-gray-100 dark:bg-gray-700/50 mx-3" />
                    )}
                  </div>
                ))}
              </div>
            ) : searchValue ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                <Search className="w-8 h-8 text-gray-400 mb-3" />
                <span>Không tìm thấy kết quả</span>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Thử tìm kiếm với từ khóa khác
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchActionCard