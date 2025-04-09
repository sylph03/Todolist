import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoutes'
import { columnRouter } from './columnRoutes'
import { cardRouter } from './cardRoutes'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use' })
})

Router.use('/boards', boardRouter)
Router.use('/columns', columnRouter)
Router.use('/cards', cardRouter)

export const APIs_V1 = Router