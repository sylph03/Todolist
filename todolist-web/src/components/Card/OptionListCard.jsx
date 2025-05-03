import { CreditCard, MoveRight, Archive, Trash2 } from 'lucide-react'
import OptionItemCard from './OptionItemCard'
import { useConfirm } from '~/Context/ConfirmProvider'
import { deleteCardDetailsAPI } from '~/apis'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const OptionListCard = ({ card }) => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const { confirm } = useConfirm()

  const handleOpenCard = () => {
    console.log('Mở thẻ')
  }

  const handleMoveCard = () => {
    console.log('Di chuyển thẻ')
  }

  const handleArchiveCard = () => {
    console.log('Lưu trữ thẻ')
  }

  const handleDeleteCard = async () => {
    const result = await confirm({
      title: 'Xoá nhiệm vụ',
      message: 'Hành động này sẽ xóa vĩnh viễn nhiệm vụ của bạn! Bạn có chắc chắn không?',
      modal: true
    })
    if (result) {
      // Cannot assign to read only property 'cards' of object
      // Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only (nested object - can thiệp sâu dữ liệu)
      // const newBoard = { ...board }
      const newBoard = cloneDeep(board)
      const targetColumn = newBoard.columns.find(column => column.cardOrderIds.includes(card._id))

      if (targetColumn) {
        targetColumn.cards = targetColumn.cards.filter(c => c._id !== card._id)
        targetColumn.cardOrderIds = targetColumn.cardOrderIds.filter(_id => _id !== card._id)

        if (isEmpty(targetColumn.cards)) {
          const placeholderCard = generatePlaceholderCard(targetColumn)
          targetColumn.cards = [placeholderCard]
          targetColumn.cardOrderIds = [placeholderCard._id]
        }
        // setBoard(newBoard)
        dispatch(updateCurrentActiveBoard(newBoard))

      }

      deleteCardDetailsAPI(card._id).then(res => {
        toast.success(res?.deleteResult)
      })
    } else {
      console.log('Hủy xóa!')
    }
  }

  const options = [
    { icon: <CreditCard />, label: 'Mở thẻ', onClick: handleOpenCard },
    { icon: <MoveRight />, label: 'Di chuyển', onClick: handleMoveCard },
    { icon: <Archive />, label: 'Lưu trữ', onClick: handleArchiveCard },
    { icon: <Trash2 />, label: 'Xóa', onClick: handleDeleteCard, isDanger: true }
  ]

  return (
    <div className="flex flex-col items-end gap-2">
      {options.map((item, index) => (
        <OptionItemCard
          key={index}
          icon={item.icon}
          label={item.label}
          isDanger={item.isDanger}
          onClick={item.onClick}
        />
      ))}

      <div
        className="flex items-center justify-center px-3 py-1.5 rounded-md w-fit font-medium cursor-pointer
                   bg-sky-500 text-white border border-sky-500
                   hover:bg-sky-600 transition-colors duration-200"
      >
        Lưu
      </div>
    </div>
  )
}

export default OptionListCard
