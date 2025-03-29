/* eslint-disable no-console */
// const express = require('express')
import express from 'express'
import exitHook from 'async-exit-hook'
import { env } from './config/environtment.js' 
import { CONNECT_DB, CLOSE_DB, GET_DB } from './config/mongodb.js'
import { APIs_V1 } from './routes/v1/index.js'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())
  
  app.use('/v1', APIs_V1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`server is running http://${env.APP_HOST}:${env.APP_PORT}`)
  })

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