const OptionItemCard = ({ icon, label, isDanger, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${isDanger 
          ? 'text-red-500 dark:text-red-400' 
          : 'text-black dark:text-gray-200'
        }
        bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700
        flex items-center gap-2 flex-nowrap px-3 py-1.5 border rounded-md w-fit cursor-pointer
        transition-colors duration-200
      `}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </div>
  )
}

export default OptionItemCard
