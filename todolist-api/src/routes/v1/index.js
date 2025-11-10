import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRoute'
import { columnRouter } from './columnRoute'
import { cardRouter } from './cardRoute'
import { userRouter } from './userRoute'
import { invitationRouter } from './invitationRoute'
import { eventRouter } from './eventRoute'
import { aiRoute } from './aiRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use' })
})

Router.use('/boards', boardRouter)
Router.use('/columns', columnRouter)
Router.use('/cards', cardRouter)
Router.use('/users', userRouter)
Router.use('/invitations', invitationRouter)
Router.use('/ai', aiRoute)
Router.use('/events', eventRouter)

export const APIs_V1 = Router