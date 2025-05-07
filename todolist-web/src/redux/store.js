import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

// Cấu hình redux-persist
import { combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default localstorage

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // Key của cái persist tự chỉ định, mặc định là root
  storage: storage, // Biến storage ở trên - lưu vào localstorage
  whitelist: ['user'] // định nghĩa các slice ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
  // backlist: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

// Combine reducers trong dự án ở đây
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// Thực hiện persist reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // Sửa lỗi khi thực hiện redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})