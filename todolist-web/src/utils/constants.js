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

// Action cho việc thêm hoặc xóa thành viên trong card
export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

// Form dimensions
export const FORM_CREATE_PROJECT_WIDTH = 352
export const FORM_CREATE_PROJECT_HEIGHT = 495
export const OPTIONS_PROJECT_HEIGHT = 180