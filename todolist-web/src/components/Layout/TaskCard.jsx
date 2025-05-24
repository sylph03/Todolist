import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SquarePen, Users, MessageSquare, Paperclip, Text } from 'lucide-react'
import OptionListCard from '../Card/OptionListCard'
import { useConfirm } from '~/Context/ConfirmProvider'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard, showActiveCard } from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'

const CardIndicators = ({ card }) => {
  return (
    <div className="flex items-center gap-4 text-xs text-gray-700 dark:text-gray-300">
      {/* Description */}
      {card?.description?.length > 0 && (
        <div className="flex items-center gap-1 mb-2" title="Nhiệm vụ đã có mô tả">
          <Text className="size-3.5" />
        </div>
      )}
      {/* Members indicator */}
      {card?.memberIds?.length > 0 && (
        <div className="flex items-center gap-1 mb-2" title="Thành viên">
          <Users className="size-3.5" />
          <span>{card.memberIds.length}</span>
        </div>
      )}

      {/* Comments indicator */}
      {card?.comments?.length > 0 && (
        <div className="flex items-center gap-1 mb-2" title="Bình luận">
          <MessageSquare className="size-3.5" />
          <span>{card.comments.length}</span>
        </div>
      )}

      {/* Attachments indicator */}
      {card?.attachments?.length > 0 && (
        <div className="flex items-center gap-1 mb-2" title="Các tập tin đính kèm">
          <Paperclip className="size-3.5" />
          <span>{card.attachments.length}</span>
        </div>
      )}
    </div>
  )
}

const TaskCard = ({ card }) => {
  const dispatch = useDispatch()

  const [textCardWidth, setTextCardWidth] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [inputValue, setInputValue] = useState(card?.title)
  const [isLeftPosition, setIsLeftPosition] = useState(false)

  const [textCardCardPosition, setTextCardCardPosition] = useState(null)
  const [optionsCardPosition, setOptionsCardPosition] = useState(null)

  const contentCardRef = useRef({})
  const popupRef = useRef(null)
  const inputRef = useRef(null)

  const { stateConfirm } = useConfirm()

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #00BCFF' : ''
  }

  // Theo dõi cập nhật vị trí popup (opstions card)
  const updatePopupPosition = useCallback(() => {
    if (contentCardRef.current) {
      const rect = contentCardRef.current.getBoundingClientRect()
      const heightOptionsCard = 270
      const widthOptionsCard = 120
      const heightCard = rect.height
      const SAFE_MARGIN = 16

      if (rect.width !== textCardWidth) {
        setTextCardWidth(rect.width)
      }

      let topTextCard = rect.top
      let leftTextCard = rect.left

      let topOptionsCard = rect.top
      let leftOptionsCard = rect.right + 8

      // Nếu chiều cao card vượt quá mép dưới màn hình thì đặt card cách 16px
      if (topTextCard + heightCard > window.innerHeight - SAFE_MARGIN) {
        topTextCard = window.innerHeight - heightCard - SAFE_MARGIN
        topOptionsCard = topTextCard
      }
      // Nếu chiều cao option card vượt quá mép dưới màn hình thì mép dưới option card sẽ bằng mép dưới card
      if (topOptionsCard + heightOptionsCard > window.innerHeight - SAFE_MARGIN) {
        topOptionsCard = topTextCard + heightCard - heightOptionsCard
      }

      // Nếu chiều cao card vượt quá mép trên màn hình thì đặt card cách 16px
      if (topTextCard < SAFE_MARGIN) {
        topTextCard = SAFE_MARGIN
        topOptionsCard = topTextCard
      }

      // Nếu chiều ngang của option card vượt mép phải màn hình thì đưa sang trái
      if (leftOptionsCard + widthOptionsCard > window.innerWidth) {
        leftOptionsCard = leftTextCard - widthOptionsCard - 8
        setIsLeftPosition(true)
      } else {
        setIsLeftPosition(false)
      }

      setOptionsCardPosition({ top: topOptionsCard, left: leftOptionsCard })
      setTextCardCardPosition({ top: topTextCard, left: leftTextCard })
    }
  }, [textCardWidth])


  // Xử lý khi nhấn nút edit ở card
  const handleEditClick = () => {
    // e.stopPropagation() // Ngăn sự kiện kéo khi click
    updatePopupPosition()
    setInputValue(card?.title) // Reset input value to current card title
    setShowPopup(prev => !prev)
  }

  // Xử lý sự kiện nhấn chuột phải
  const handleContextMenu = (e) => {
    e.preventDefault() // Ngăn menu mặc định của trình duyệt
    handleEditClick()
  }

  useEffect(() => {
    if (!showPopup) {
      setTextCardCardPosition(null)
      setOptionsCardPosition(null)
      return
    }

    // Xử lý khi nhấn ra ngoài popup
    const handleClickOutside = (event) => {
      if (stateConfirm.isOpen) return

      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false)
      }
    }

    // Nhấn Esc thoát popup
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setShowPopup(false)
    }

    // Lắng nghe sự kiện kích thước trình duyệt thay đổi hoặc cuộn để đảm bảo popup luôn bám theo contentCard
    const handleScrollOrResize = () => {
      updatePopupPosition()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)

      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [showPopup, stateConfirm.isOpen, updatePopupPosition])

  // Khi nhấn edit ở card thì focus input và bôi xanh
  useEffect(() => {
    if (showPopup && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select() // bôi xanh toàn bộ text
    }
  }, [showPopup])

  // Cập nhật vị trí popup khi ảnh bìa thay đổi
  useEffect(() => {
    if (showPopup) {
      updatePopupPosition()
    }
  }, [card?.cover, showPopup, updatePopupPosition])

  const setActiveCard = (e) => {
    if (e.target.closest('[data-no-dnd="true"]')) return
    // Cập nhật dữ liệu activeCard trong Redux
    dispatch(updateCurrentActiveCard(card))
    dispatch(showActiveCard())
    setShowPopup(false)
  }

  const updateCardTitle = async (newTitle) => {
    const updatedCard = await updateCardDetailsAPI(card._id, { title: newTitle.trim() })

    // Cập nhật lại bản ghi card trong activeBoard (nested data)
    dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }

  const handleSaveTitle = async () => {
    const trimmedValue = inputValue.trim()

    if (trimmedValue && trimmedValue !== card.title) {
      await updateCardTitle(trimmedValue)
    }
    setShowPopup(false)
  }

  return (
    <>
      <div
        className={`
          ${card.FE_PlaceholderCard ? 'hidden' : 'block'} 
          border border-gray-200 dark:border-gray-700
          w-full rounded-xl 
          cursor-pointer 
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-100
          shadow-sm dark:shadow-gray-900/30
          hover:shadow-md dark:hover:shadow-gray-900/50
          hover:border-gray-300 dark:hover:border-gray-600
          transition-all 
          duration-200 
          ease-in-out 
          hover:scale-[1.01] 
          group
          select-none
        `}
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        onClick={setActiveCard}
        onContextMenu={handleContextMenu}
      >
        <div className='w-full' ref={contentCardRef}>
          {/* Ảnh bìa */}
          {card?.cover && (
            <img
              src={card.cover}
              alt="cover"
              className="object-contain w-full h-full rounded-t-xl"
            />
          )}

          {/* Nội dung */}
          <div className="px-4 pt-4 pb-2 relative text-sm leading-relaxed font-medium">
            <div className="mb-2">
              {card?.title}
            </div>
            {/* Nút chỉnh sửa */}
            <div
              data-no-dnd="true"
              onClick={handleEditClick}
              className="
                absolute
                top-2
                right-2
                p-2
                rounded-full
                transition-all
                hidden
                group-hover:block
                hover:bg-gray-100
                dark:hover:bg-gray-700
                active:bg-gray-200
                dark:active:bg-gray-600
              "
              title="Chỉnh sửa"
            >
              <SquarePen className="size-4.5 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Card indicators */}
            <CardIndicators card={card} />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 h-screen w-screen bg-black/50 dark:bg-black/60 z-50 flex items-center justify-center">
          <div ref={popupRef} className="relative">
            {/* Text Card Popup */}
            <div
              className="fixed transition-all cursor-pointer"
              style={{ top: textCardCardPosition?.top, left: textCardCardPosition?.left }}
            >
              {card?.cover && (
                <img
                  src={card.cover}
                  alt="cover"
                  className="object-contain w-[312px] h-full rounded-t-xl"
                  style={{ width: textCardWidth ? `${textCardWidth}px` : 'auto' }}
                />
              )}
              <div 
                className={`px-4 pt-4 pb-2 bg-white dark:bg-gray-800 ${card?.cover ? 'rounded-b-xl' : 'rounded-xl'}`}
                style={{ width: textCardWidth ? `${textCardWidth}px` : 'auto' }}
              >
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  spellCheck={false}
                  className={`
                    w-full mb-2
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    focus:outline-none
                    transition-all duration-200
                    placeholder-gray-400
                    dark:placeholder-gray-500
                  `}
                />
                {/* Card indicators */}
                <CardIndicators card={card} />
              </div>
            </div>

            {/* Options Popup */}
            <div
              className="fixed transition-all"
              style={{ top: optionsCardPosition?.top, left: optionsCardPosition?.left }}
            >
              <OptionListCard
                card={card}
                setShowPopup={setShowPopup}
                updateCardTitle={handleSaveTitle}
                isLeftPosition={isLeftPosition}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskCard
// Theo dõi cập nhật vị trí popup (opstions card)
// const updatePopupPosition = useCallback(() => {
//   if (contentCardRef.current) {
//     const rect = contentCardRef.current.getBoundingClientRect()
//     const heightOptionsCard = 270
//     const widthOptionsCard = 120
//     const heightCard = rect.height
//     const SAFE_MARGIN = 16 // Khoảng cách an toàn với màn hình

//     if (rect.width !== textCardWidth) {
//       setTextCardWidth(rect.width)
//     }

//     let topTextCard = rect.top
//     let leftTextCard = rect.left

//     // Tính toán vị trí cho options card
//     let topOptionsCard = rect.top + heightCard + 8
//     let leftOptionsCard = rect.right - widthOptionsCard

//     // Kiểm tra và điều chỉnh vị trí text card nếu cần
//     if (topTextCard + heightCard > window.innerHeight - SAFE_MARGIN) {
//       topTextCard = window.innerHeight - heightCard - SAFE_MARGIN
//     }

//     // Kiểm tra và điều chỉnh vị trí nếu vượt quá màn hình trên
//     if (topTextCard < SAFE_MARGIN) {
//       topTextCard = SAFE_MARGIN
//     }

//     // Tính toán vị trí options card dựa trên vị trí mới của text card
//     const spaceBelow = window.innerHeight - (topTextCard + heightCard + SAFE_MARGIN)
//     const spaceAbove = topTextCard - SAFE_MARGIN

//     if (spaceBelow >= heightOptionsCard) {
//       // Nếu có đủ không gian phía dưới, đặt options card ở dưới
//       topOptionsCard = topTextCard + heightCard + 8
//     } else if (spaceAbove >= heightOptionsCard) {
//       // Nếu có đủ không gian phía trên, đặt options card ở trên
//       topOptionsCard = topTextCard - heightOptionsCard - 8
//     } else {
//       // Nếu không đủ không gian ở cả trên và dưới, đặt options card ở vị trí có nhiều không gian hơn
//       if (spaceBelow > spaceAbove) {
//         topOptionsCard = window.innerHeight - heightOptionsCard - SAFE_MARGIN
//       } else {
//         topOptionsCard = SAFE_MARGIN
//       }
//     }

//     // Kiểm tra và điều chỉnh vị trí ngang nếu cần
//     if (leftOptionsCard < SAFE_MARGIN) {
//       leftOptionsCard = SAFE_MARGIN
//     } else if (leftOptionsCard + widthOptionsCard > window.innerWidth - SAFE_MARGIN) {
//       leftOptionsCard = window.innerWidth - widthOptionsCard - SAFE_MARGIN
//     }

//     setOptionsCardPosition({ top: topOptionsCard, left: leftOptionsCard })
//     setTextCardCardPosition({ top: topTextCard, left: leftTextCard })
//   }
// }, [textCardWidth])
