import { env } from '~/config/environment'

// Domains được phép truy cập từ cors
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' Không cần localhost nữa vì file config/cors đã luôn cho phép môi trường dev
  'https://todolist-web-gamma.vercel.app'
  // ...
]

export const WEBSITE_DOMAINS = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEV

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 8

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}