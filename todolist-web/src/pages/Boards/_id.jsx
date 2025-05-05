import React, { useEffect, useState } from 'react'
import AppBar from '~/components/Layout/AppBar'
import SideBar from '~/components/Layout/SideBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/UI/Loading/PageLoadingSpinner'

const Board = () => {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  const { boardId } = useParams()

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  // Dùng state của Redux thay vì state component
  // const [board, setBoard] = useState(null)

  useEffect(() => {
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // const createNewColumn = async (newColumnData) => {
  //   const createdColumn = await createNewColumnAPI({
  //     ... newColumnData,
  //     boardId: board._id
  //   })

  //   // Khi tạo mới sẽ chưa có card, cần xử lý kéo thả column rỗng
  //   createdColumn.cards = [generatePlaceholderCard(createdColumn)]
  //   createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

  //   // Tự set lại state board thay vì gọi fetch BoardApi
  //   // Dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newBoard nhưng bản chất của spread operation là Shallow Copy/Clone,
  //   // nên dính quy tắc của Immutability trong redux toolkit không dùng được hàm push/unshift, trường hợp này dùng Deep Copy/Clone toàn bộ Board (cách khác là dùng concat() thay vì push/unshift)
  //   // const newBoard = { ...board }
  //   const newBoard = cloneDeep(board)
  //   newBoard.columns.push(createdColumn)
  //   newBoard.columnOrderIds.push(createdColumn._id)

  //   // setBoard(newBoard)
  //   dispatch(updateCurrentActiveBoard(newBoard))
  // }

  // Gọi API và xử lý khi kéo thả column xong xuôi

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    // Trường hợp Spread Operation này thì không lỗi vì không dùng push/unshift làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị bằng mảng mới
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Cannot assign to read only property 'cards' of object
    // Trường hợp Immutability ở đây đã đụng tới giá trị cards đang được coi là chỉ đọc read only (nested object - can thiệp sâu dữ liệu)
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardsIds })
  }

  // Di chuyển card sang column khác:
  // - cập nhật mảng ban đầu (xóa _id của card ra khỏi mảng cardOrderIds)
  // - cập nhật mảng cardOrderIds của column tiếp theo (thêm _id của card vào mảng)
  // - cập nhật trường columnId mới của card đã kéo
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    // Trường hợp Spread Operation này thì không lỗi vì không dùng push/unshift làm thay đổi trực tiếp kiểu mở rộng mảng, mà chỉ đang gán lại toàn bộ giá trị bằng mảng mới
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))


    // Gọi API xử lý
    let prevCardOrderIds = dndOrderedColumns.find(column => column._id === prevColumnId)?.cardOrderIds

    // Xử lý khi kéo phần tử card cuối cùng ra khỏi column (column rỗng có placeholder card, cần xóa đi trước khi gửi dữ liệu lên BE)
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(column => column._id === nextColumnId)?.cardOrderIds
    })
  }

  if (!board) {
    return (
      <PageLoadingSpinner caption={'Loading Board...'}/>
    )
  }

  return (
    <div className="h-screen w-screen dark:bg-gray-800 text-white dark:text-gray-100 flex flex-col">
      <AppBar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <div className="flex flex-1 h-full relative">
        <SideBar board={board} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <BoardContent
          board={board}
          isSidebarOpen={isSidebarOpen}

          moveColumns={moveColumns}
          moveCardInTheSameColumn={moveCardInTheSameColumn}
          moveCardToDifferentColumn={moveCardToDifferentColumn}
        />
      </div>
    </div>
  )
}

export default Board