import { useEffect, useRef } from 'react'

function TextInput({
    label,
    type,
    error,
    id,
    handleChange,
    name,
    additionalClasses = '',
    touched,
    ...rest
}) {
    const refFocus = useRef()
    useEffect(() => {
        refFocus.current.focus()
    }, [])
    return (
        <>
            <div className="relative f-col text-medium">
                <input
                    ref={refFocus}
                    onChange={handleChange}
                    className={`w-full rounded-lg bg-darkColor text-white placeholder-white focus:outline-none focus:border-transparent p-4 my-2 font-medium
                    ${
                        error && touched
                            ? 'border border-mainColor focus:placeholder-gray-800'
                            : ''
                    } ${additionalClasses}`}
                    name={name}
                    type={type}
                    required
                    {...rest}
                />
                <div className="absolute left-[5px] -bottom-2 text-[#DA1E28] text-[17px] h-[24px] mt-[10px]">
                    {error && touched ? error : ''}
                </div>
            </div>
        </>
    )
}

export default TextInput
