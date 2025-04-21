import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SquarePen } from 'lucide-react'
import OptionListCard from '../Card/OptionListCard'
import { useConfirm } from '~/Context/ConfirmProvider'

const TaskCard = ({ card, deleteCardDetails }) => {

  const [textAreaWidth, setTextAreaWidth] = useState(null)
  const [textArea, setTextArea] = useState(card?.title)
  const [showPopup, setShowPopup] = useState(false)

  const [textAreaCardPosition, setTextAreaCardPosition] = useState(null)
  const [optionsCardPosition, setOptionsCardPosition] = useState(null)

  const contentCardRef = useRef({})
  const popupRef = useRef(null)
  const textAreaRef = useRef(null)

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
      const heightOptionsCard = 222
      const widthOptionsCard = 127
      const heightCard = rect.height

      if (rect.width !== textAreaWidth) {
        setTextAreaWidth(rect.width)
      }

      let topTextArea = rect.top
      let leftTextArea = rect.left

      let topOptionsCard = rect.top + heightCard + 8
      let leftOptionsCard = rect.right - widthOptionsCard

      if (topOptionsCard + heightOptionsCard > window.innerHeight - 16) {
        topOptionsCard = topTextArea - heightOptionsCard - 8
        if (topTextArea + heightCard > window.innerHeight - 16) {
          topTextArea = window.innerHeight - heightCard - 16
          topOptionsCard = topTextArea - heightOptionsCard - 8
        }
      }

      setOptionsCardPosition({ top: topOptionsCard, left: leftOptionsCard })
      setTextAreaCardPosition({ top: topTextArea, left: leftTextArea })
    }
  }, [textAreaWidth])


  // Xử lý khi nhấn nút edit ở card
  const handleEditClick = (e) => {
    e.stopPropagation() // Ngăn sự kiện kéo khi click
    e.preventDefault()
    updatePopupPosition()

    setShowPopup(prev => !prev)
  }

  useEffect(() => {
    if (!showPopup) {
      setTextAreaCardPosition(null)
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

  // Khi nhấn edit ở card thì focus textarea và bôi xanh
  useEffect(() => {
    if (showPopup && textAreaRef.current) {
      textAreaRef.current.focus()
      textAreaRef.current.select() // bôi xanh toàn bộ text
    }
  }, [showPopup])

  return (
    <>
      <div
        className={`${card.FE_PlaceholderCard ? 'hidden' : 'block'} border border-transparent w-full rounded-xl cursor-pointer bg-white text-slate-800 shadow-md hover:shadow-lg transition-all duration-75 ease-in-out hover:scale-[1.01] group`}
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
      >
        <div className='w-full' ref={contentCardRef}>
          {/* Ảnh bìa */}
          {card?.cover && (<img src={card.cover} alt="cover" className="object-cover w-full h-[247px] rounded-t-xl" /> )}

          {/* Nội dung */}
          <div className="p-4 relative text-sm leading-relaxed font-medium">
            {card?.title}
            {/* Nút chỉnh sửa */}
            <div data-no-dnd="true" onClick={handleEditClick} className="absolute top-2 right-2 p-2 rounded-full transition-all hidden group-hover:block hover:bg-gray-100" title="Chỉnh sửa" > <SquarePen className="size-4.5" /></div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 h-screen w-screen bg-black/50 dark:bg-black/40 z-50 flex items-center justify-center">
          <div ref={popupRef} className="relative">

            {/* Text Area Popup */}
            <div
              className="fixed transition-all"
              style={{ top: textAreaCardPosition?.top, left: textAreaCardPosition?.left }}
            >
              {card?.cover && (
                <img
                  src={card.cover}
                  alt="cover"
                  className="object-cover w-full h-[247px] rounded-t-xl"
                />
              )}
              <textarea
                onChange={(e) => setTextArea(e.target.value)}
                ref={textAreaRef}
                spellCheck="false"
                rows="1"
                value={textArea}
                className={`
                  ${card?.cover ? 'rounded-b-xl' : 'rounded-xl'}
                  p-4 w-full
                  bg-white text-black
                  focus:outline-none
                  transition-all duration-200
                `}
                style={{ width: textAreaWidth ? `${textAreaWidth}px` : 'auto' }}
              />
            </div>

            {/* Options Popup */}
            <div
              className="fixed transition-all"
              style={{ top: optionsCardPosition?.top, left: optionsCardPosition?.left }}
            >
              <OptionListCard card={card} showPopup={showPopup} deleteCardDetails={deleteCardDetails} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskCard
