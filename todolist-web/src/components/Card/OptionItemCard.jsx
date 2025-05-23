const OptionItemCard = ({ icon, label, isDanger, onClick, isFileUpload, isLeftPosition }) => {
  return (
    <div
      onClick={!isFileUpload ? onClick : undefined}
      className={`${isDanger
        ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
        : 'text-black dark:text-gray-200'
      }
        bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
        flex items-center gap-2 flex-nowrap px-3 py-1.5 border rounded-md self-${isLeftPosition ? 'end' : 'start'} cursor-pointer
        transition-colors duration-200
      `}
    >
      {isFileUpload ? (
        <label className="flex items-center gap-2 flex-nowrap cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={onClick} />
          {icon}
          <span className="whitespace-nowrap">{label}</span>
        </label>
      ) : (
        <>
          {icon}
          <span className="whitespace-nowrap">{label}</span>
        </>
      )}
    </div>
  )
}

export default OptionItemCard