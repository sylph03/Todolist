import { createSlice } from '@reduxjs/toolkit'

// Khởi tạo giá trị State của một cái Slice trong redux
const initialState = {
  currentActiveCard: null
}

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    // Luôn cần có ngoặc nhọn {} cho function trong reducer cho dù code có 1 dòng, đây là quy tắc của Redux
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    
    updateCurrentActiveCard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const fullCard = action.payload

      // Xử lý dữ liệu nếu cần thiết...

      // Update lại dữ liệu currentActiveCard
      state.currentActiveCard = fullCard
    }
  },

  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {}
})

// Actions: Nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)
// Ở trên không có properties actions vì những actions này được redux tạo tự động theo tên reducer
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selectors: Nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

// File này tên là activeCardSlice nhưng export một thứ là Reducer
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer