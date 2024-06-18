import { useRef, useState } from 'react'
import { ProfileIcon } from '../../components/pages/settings/menuIcons'
import { ArrowRight } from 'components/svg'
import router from 'next/router'
import { useTranslation } from 'i18n'
const Staff = ({ el }) => {
    const ScrollBody = useRef(null)
    const [windowWidth] = useWindowSize()
    const [currentScroll, setCurrentScroll] = useState(0)
    const [showArrow, setShowArrow] = useState(false)
    const { t } = useTranslation()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const scrollTo = (direction) => {
        if (direction === 'right') {
            ScrollBody.current.scrollLeft += windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft += windowWidth[0]))
        } else {
            ScrollBody.current.scrollLeft -= windowWidth.toString()
            setCurrentScroll((ScrollBody.current.scrollLeft -= windowWidth[0]))
        }
    }

    return (
        <div
            className="relative group"
            onMouseEnter={() => setShowArrow(true)}
            onMouseLeave={() => setShowArrow(false)}
        >
            <div
                ref={ScrollBody}
                className="flex overflow-x-scroll scroll-body-smooth space-x-2 sm:space-x-8 py-8 wrapper relative"
            >
                {!el?.is_megogo &&
                    el?.staffs?.map((item, ind) => (
                        <div
                            key={item?.staff?.id}
                            className="hover:scale-110 duration-300"
                            onClick={() => {
                                router.push(`/actor?slug=${item?.staff?.slug}`)
                            }}
                        >
                            <div className="w-[64px] sm:w-24 h-[64px] sm:h-24 rounded-full bg-[#1C192C] flex items-center justify-center overflow-hidden cursor-pointer">
                                {item?.staff?.photo ? (
                                    <img
                                        src={item?.staff?.photo}
                                        alt={item?.staff?.first_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ProfileIcon
                                        width="32"
                                        height="32"
                                        stroke="#666086"
                                    />
                                )}
                            </div>
                            <p className="text-[#D9D8E0] font-medium mt-2 w-24 break-words leading-5">
                                <span>{item?.staff?.first_name}</span>
                                <span> {item?.staff?.last_name}</span>
                            </p>
                            <span className="text-sm text-[#A9A7B4] capitalize mt-3">
                                {item?.position}
                            </span>
                        </div>
                    ))}
                {el?.is_megogo &&
                    el?.staffs?.map((item, ind) => (
                        <div
                            key={ind}
                            className="hover:scale-110 duration-300 cursor-pointer"
                            onClick={() => {
                                router.push(`/actor?id=${item?.id}`)
                            }}
                        >
                            <div className="w-[64px] sm:w-24 h-[64px] sm:h-24 rounded-full bg-[#1C192C] flex items-center justify-center overflow-hidden">
                                {item?.avatar?.image_original ? (
                                    <img
                                        src={
                                            item.avatar?.image_original
                                                ? item.avatar?.image_original
                                                : '../../public/vectors/movie-image-vector.svg'
                                        }
                                        alt={item?.name_original}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <ProfileIcon
                                        width="32"
                                        height="32"
                                        stroke="#666086"
                                    />
                                )}
                            </div>
                            <p className="text-[#D9D8E0] font-medium mt-2 w-24 break-words leading-5">
                                <span>{item?.name}</span>
                            </p>
                            <span className="text-sm text-[#A9A7B4] capitalize mt-3">
                                {t(`${item?.type}`)}
                            </span>
                        </div>
                    ))}
            </div>
            <div
                onClick={() => scrollTo('right')}
                className={`absolute right-0 top-0 cursor-pointer h-[100%] flex items-center duration-300 from-black bg-gradient-to-l ${
                    showArrow &&
                    windowWidth[0] !== currentScroll &&
                    el?.staffs?.length >= 12
                        ? 'opacity-[1]'
                        : 'opacity-0'
                }`}
            >
                <div className="mb-20">
                    <ArrowRight width="60" height="60" />
                </div>
                {/* <div className="h-[50%]"></div> */}
            </div>
            <div
                onClick={() => scrollTo('left')}
                className={`rotate-180 absolute left-0 top-0 cursor-pointer h-[65%] flex items-center duration-300 ${
                    showArrow && currentScroll > 0 ? 'opacity-[1]' : 'opacity-0'
                }`}
            >
                <ArrowRight className="rotate-[20deg]" width="60" height="60" />
            </div>
        </div>
    )
}

export default Staff
