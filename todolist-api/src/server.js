// const express = require('express')
import express from 'express'

const app = express()

const hostname = 'localhost'
const port = 8017

app.get('/', (req, res) => {
  res.send('<h1>Hello world!</h1>')
})

app.listen(port, hostname, () => {
  console.log(`server is running http://${hostname}:${port}`)
})
