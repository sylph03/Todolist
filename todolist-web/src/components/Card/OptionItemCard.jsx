const OptionItemCard = ({ icon, label, isDanger, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        ${isDanger ? 'text-red-600' : 'bg-white text-black border-gray-300 hover:bg-gray-100'}
                      flex items-center gap-2 flex-nowrap px-3 py-1.5 border rounded-md w-fit cursor-pointer
                      bg-white border-gray-300 text-black
                      hover:bg-gray-100
                      transition-colors duration-200
      `}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </div>
  )
}

export default OptionItemCard
