const MainButton = ({
    text = '',
    onClick,
    isLoading,
    type = 'button',
    disabled = false,
    additionalClasses = '',
    icon = '',
    margin,
}) => (
    <button
        type={type || 'button'}
        onClick={onClick}
        className={`w-full flex items-center py-[14px] text-white text-4 leading:5 font-medium sm:p-4 px-[16px] md:px-[30px] justify-center text-center disabled:opacity-50 disabled:cursor-default focus:outline-none rounded-[8px] duration-300 outline-none border-none ${additionalClasses}`}
        disabled={disabled}
    >
        {isLoading ? (
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-500 h-6 w-6 mx-auto" />
        ) : (
            <>
                <div className="flex items-center md:space-x-[7px]">
                    {icon ? <span className={`${margin}`}>{icon}</span> : null}
                    <span className="flex items-center text-[15px] font-semibold justify-center tracking-[-0.41px]">
                        {text}
                    </span>
                </div>
            </>
        )}
    </button>
)

export default MainButton
