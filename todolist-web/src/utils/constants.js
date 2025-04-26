/* eslint-disable no-console */
/* eslint-disable no-undef */
let apiRoot = ''

// console.log(import.meta.env)
console.log(process.env)

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://todolist-api-4ntb.onrender.com'
}

console.log('apiRoot', apiRoot)

export const API_ROOT = apiRoot