import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoutes'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use' })
})

Router.use('/boards', boardRouter)

export const APIs_V1 = Router