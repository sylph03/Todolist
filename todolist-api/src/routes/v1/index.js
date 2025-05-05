import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import { columnRouter } from './columnRoute'
import { cardRouter } from './cardRoute'
import { userRouter } from './userRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use' })
})

Router.use('/boards', boardRouter)
Router.use('/columns', columnRouter)
Router.use('/cards', cardRouter)
Router.use('/users', userRouter)

export const APIs_V1 = Router