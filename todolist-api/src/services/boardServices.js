/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { slugify } from '~/utils/formatters'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE, DEFAULT_SKIP, DEFAULT_LIMIT } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

const createNew = async (userId, reqBody) => {
  try {
    // Xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tầng model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(userId, newBoard)

    const boardId = createdBoard.insertedId

    // Tạo 4 column mặc định với dữ liệu chi tiết
    const defaultColumns = [
      { title: 'Nhiệm vụ', bgColumn: 'bg-red-100 dark:bg-red-900/20', bgTitleColumn: 'bg-red-500 dark:bg-red-600' },
      { title: 'Chuẩn bị', bgColumn: 'bg-orange-100 dark:bg-orange-900/20', bgTitleColumn: 'bg-orange-500 dark:bg-orange-600' },
      { title: 'Đang làm', bgColumn: 'bg-yellow-100 dark:bg-yellow-900/20', bgTitleColumn: 'bg-yellow-500 dark:bg-yellow-600' },
      { title: 'Hoàn thành', bgColumn: 'bg-green-100 dark:bg-green-900/20', bgTitleColumn: 'bg-green-500 dark:bg-green-600' }
    ]

    for (const column of defaultColumns) {
      const newColumn = {
        boardId: String(boardId),
        title: column.title,
        bgColumn: column.bgColumn,
        bgTitleColumn: column.bgTitleColumn
      }

      const createdColumn = await columnModel.createNew(newColumn)
      const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

      if (getNewColumn) {
        getNewColumn.cards = []
        await boardModel.pushColumnOrderIds(getNewColumn)
      }
    }

    const getNewBoard = await boardModel.findOneById(boardId)

    // Trả kết quả về, trong Service luôn phải có return
    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    const resBoard = cloneDeep(board)
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) { throw error }
}

const moveCardToDifferentColumn = async (reqBody) => {
  try {
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId
    })

    return { updateResult: 'Successfully' }
  } catch (error) { throw error }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    // Nếu không tồn tại page hoặc itemsPerPage thì sẽ được gán giá trị mặc định
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))

    return results
  } catch (error) { throw error }
}

const getBoardsForSidebar = async (userId) => {
  try {

    const results = await boardModel.getBoardsForSidebar(userId)

    return results
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn,
  getBoards,
  getBoardsForSidebar
}