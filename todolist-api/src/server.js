/* eslint-disable no-console */
import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { env } from './config/environment'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { APIs_V1 } from './routes/v1/index'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()
  // Handle Cors
  app.use(cors(corsOptions))

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    // Môi trường Production (đang support Render.com)
    app.listen(process.env.PORT, () => {
      console.log(`Production: server is running at ${process.env.PORT}`)
    })
  } else {
    // Môi trường Local Dev
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Local: server is running http://${env.APP_HOST}:${env.APP_PORT}`)
    })
  }


  // Thực hiện các tác vụ cleanup trước khi dừng server
  // Có vẻ chỉ hiển thị console.log() ở CLOSE_DB() và console.log('Disconnected from MongoDB Cloud Atlas!') trên terminal unbuntu (WSL)
  exitHook(() => {
    console.log('Closing MongoDB connection...')
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas!')
  })
}


// Chỉ khi kết nối database thành công mới Start Server backend
CONNECT_DB()
  .then(() => {
    console.log('Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  })
  .catch(error => {
    console.log('Lỗi kết nối MongoDB:', error)
    process.exit(0)
  })