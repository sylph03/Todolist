// import React, { useRef, useState, useEffect } from 'react'
// import { useForm } from 'react-hook-form'
// import { X, Pencil } from 'lucide-react'
// import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
// import FieldErrorAlert from '../UI/FieldErrorAlert'
// import { useDispatch } from 'react-redux'
// import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
// import { toast } from 'react-toastify'
// import { updateBoardDetailsAPI } from '~/apis'

// const RenameProject = ({ boards, setBoards, showOptionsProject, setShowOptionsProject }) => {
//   const dispatch = useDispatch()
//   const renameInputRef = useRef(null)
//   const [showRenameModal, setShowRenameModal] = useState(false)
//   const [renamingBoardId, setRenamingBoardId] = useState(null)

//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     formState: { errors, isDirty, isValid }
//   } = useForm({
//     defaultValues: {
//       title: ''
//     },
//     mode: 'onChange' // Validate realtime
//   })

//   // Xử lý khi click vào nút đổi tên trong options menu
//   useEffect(() => {
//     if (showOptionsProject?.type === 'rename') {
//       const currentBoard = boards.find(board => board._id === showOptionsProject.id)
//       if (!currentBoard) return

//       setValue('title', currentBoard.title, {
//         shouldValidate: true,
//         shouldDirty: true
//       })
//       setRenamingBoardId(showOptionsProject.id)
//       setShowRenameModal(true)
//       setShowOptionsProject(null)
//     }
//   }, [showOptionsProject, boards, setValue])

//   const onSubmit = async (data) => {
//     if (!renamingBoardId) return

//     const currentBoard = boards.find(board => board._id === renamingBoardId)
//     if (!currentBoard) return

//     const updatedBoard = await updateBoardDetailsAPI(renamingBoardId, { title: data.title.trim() })
//     if (updatedBoard) {
//       // Cập nhật state boards
//       setBoards(prevBoards =>
//         prevBoards.map(board =>
//           board._id === renamingBoardId ? { ...board, title: data.title.trim() } : board
//         )
//       )

//       // Cập nhật active board nếu đang active
//       if (currentBoard._id === renamingBoardId) {
//         dispatch(updateCurrentActiveBoard({ ...currentBoard, title: data.title.trim() }))
//       }

//       toast.success('Đổi tên bảng thành công!')
//       handleRenameCancel()
//     }
//   }

//   const handleRenameCancel = () => {
//     setShowRenameModal(false)
//     setRenamingBoardId(null)
//     setShowOptionsProject(null)
//     reset()
//   }

//   // Cleanup khi component unmount
//   useEffect(() => {
//     return () => {
//       setShowRenameModal(false)
//       setRenamingBoardId(null)
//       reset()
//     }
//   }, [reset])

//   // Focus input when modal opens
//   useEffect(() => {
//     if (showRenameModal && renameInputRef.current) {
//       renameInputRef.current.focus()
//     }
//   }, [showRenameModal])

//   return (
//     <>
//       {showRenameModal && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//           onClick={handleRenameCancel}
//         >
//           <div
//             className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-[400px] p-6 animate-fadeIn"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Đổi tên bảng</h3>
//               <button
//                 onClick={handleRenameCancel}
//                 className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//               <div>
//                 <input
//                   {...register('title', {
//                     required: FIELD_REQUIRED_MESSAGE,
//                     minLength: {
//                       value: 3,
//                       message: 'Tên bảng phải có ít nhất 3 ký tự'
//                     },
//                     validate: (value) => {
//                       const currentBoard = boards.find(board => board._id === renamingBoardId)
//                       if (value.trim() === currentBoard?.title) {
//                         return 'Tên bảng phải khác tên hiện tại'
//                       }
//                       return true
//                     }
//                   })}
//                   ref={(e) => {
//                     register('title').ref(e)
//                     renameInputRef.current = e
//                   }}
//                   spellCheck={false}
//                   className={`w-full px-3 py-2 text-sm rounded-lg border
//                     ${errors.title
//                       ? 'border-red-500 dark:border-red-500 focus:border-red-500 dark:focus:border-red-500'
//                       : 'border-gray-200 dark:border-gray-700 focus:border-sky-500 dark:focus:border-sky-400'
//                     }
//                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
//                     focus:outline-none focus:ring-1
//                     ${errors.title ? 'focus:ring-red-500 dark:focus:ring-red-500' : 'focus:ring-sky-500 dark:focus:ring-sky-400'}
//                     placeholder-gray-400 dark:placeholder-gray-500
//                     transition-colors duration-200`}
//                   placeholder="Tiêu đề bảng"
//                   onKeyDown={(e) => {
//                     if (e.key === 'Escape') {
//                       handleRenameCancel()
//                     }
//                   }}
//                 />
//                 <FieldErrorAlert errors={errors} fieldName="title" />
//               </div>

//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={handleRenameCancel}
//                   className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
//                     hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                 >
//                   Hủy
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!isDirty || !isValid}
//                   className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
//                     ${!isDirty || !isValid
//                       ? 'bg-sky-400/50 dark:bg-sky-500/50 cursor-not-allowed'
//                       : 'bg-sky-500 hover:bg-sky-600 dark:bg-sky-500 dark:hover:bg-sky-600'
//                     }`}
//                 >
//                   Đổi tên
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default RenameProject