import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/cardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('cardCover'), cardValidation.createNew, cardController.createNew)
  .get(authMiddleware.isAuthorized, cardController.getCards)


Router.route('/:id')
  .delete(authMiddleware.isAuthorized, cardValidation.deleteItem, cardController.deleteItem)
  .put(authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('cardCover'), cardValidation.update, cardController.update)

export const cardRouter = Router