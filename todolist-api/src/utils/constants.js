import { env } from '~/config/environment'

// Domains được phép truy cập từ cors
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' Không cần localhost nữa vì file config/cors đã luôn cho phép môi trường dev
  'https://todolist-web-gamma.vercel.app'
  // ...
]

export const WEBSITE_DOMAINS = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEV