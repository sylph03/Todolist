import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { eventController } from '~/controllers/eventController'

const Router = express.Router()

// Query events: /v1/events?boardId=...&from=...&to=...
Router.route('/')
  .get(authMiddleware.isAuthorized, eventController.getEvents)
  .post(authMiddleware.isAuthorized, eventController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, eventController.update)
  .delete(authMiddleware.isAuthorized, eventController.deleteEvent)

export const eventRouter = Router


