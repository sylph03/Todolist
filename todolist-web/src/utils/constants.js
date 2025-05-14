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

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 8

// Form dimensions
export const FORM_CREATE_PROJECT_WIDTH = 320
export const FORM_CREATE_PROJECT_HEIGHT = 391
export const OPTIONS_PROJECT_HEIGHT = 138