import express from 'express'
import { aiController } from '~/controllers/aiController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()
Router.use(authMiddleware.isAuthorized)
Router.post('/suggestions', aiController.generateTaskSuggestions)

export const aiRoute = Router