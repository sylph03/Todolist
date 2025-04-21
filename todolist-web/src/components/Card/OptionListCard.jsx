import { CreditCard, MoveRight, Archive, Trash2 } from 'lucide-react'
import OptionItemCard from './OptionItemCard'
import { useConfirm } from '~/Context/ConfirmProvider'

const OptionListCard = ({ card, deleteCardDetails }) => {

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
      deleteCardDetails(card._id)
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
