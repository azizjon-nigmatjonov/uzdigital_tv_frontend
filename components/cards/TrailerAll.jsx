import { useRef, useState } from 'react'
import { ProfileIcon } from '../../components/pages/settings/menuIcons'
import { ArrowRight, PlayerIcon } from 'components/svg'
import router from 'next/router'
import MobilePlayerIntegration from 'components/PlayerForVideo/MobilePlaterIntegration'
import DeviceDetector from 'device-detector-js'

const TrailerAll = ({ trailerData, additionalClasses, elem, ind }) => {
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const ScrollBody = useRef(null)
    const [windowWidth] = useWindowSize()
    const [currentScroll, setCurrentScroll] = useState(0)
    const [showArrow, setShowArrow] = useState(false)
    const [source, setSource] = useState({})
    const player = useRef(null)
    const [errorCase, setErrorCase] = useState(false)

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
        <>
            <div
                className="relative group"
                onMouseEnter={() => setShowArrow(true)}
                onMouseLeave={() => setShowArrow(false)}
            >
                <div
                    ref={ScrollBody}
                    className="flex overflow-x-scroll scroll-body-smooth space-x-8 py-8 wrapper relative"
                >
                    <div
                        onClick={() =>
                            router.push(
                                `/video-player/trailer?id=${elem.id}&ind=0&type=megogo`,
                            )
                        }
                        className={`${additionalClasses} rounded-[4px] overflow-hidden relative hover:scale-105 duration-200 cursor-pointer`}
                    >
                        <span
                            className={`absolute z-[2] ${additionalClasses}`}
                            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
                        >
                            <span className="w-full h-full flex items-center justify-center relative group">
                                <span
                                    className={`group-hover:opacity-[1] ${
                                        window.innerWidth < 1200
                                            ? 'opacity-1'
                                            : 'opacity-0'
                                    } duration-300`}
                                >
                                    <PlayerIcon />
                                </span>
                            </span>
                        </span>
                        <img
                            className="w-full h-full object-cover"
                            src={trailerData?.image}
                            alt="img"
                        />
                    </div>
                </div>

                {/* <div
                    onClick={() => scrollTo('right')}
                    className={`absolute right-0 top-0 cursor-pointer h-full flex items-center duration-300 ${
                        showArrow &&
                        windowWidth[0] !== currentScroll &&
                        trailerData?.videos?.length > 5
                            ? 'opacity-[1]'
                            : 'opacity-0'
                    }`}
                >
                    <ArrowRight width="60" height="60" />
                </div>
                <div
                    onClick={() => scrollTo('left')}
                    className={`rotate-180 absolute left-0 top-0 cursor-pointer h-full flex items-center duration-300 ${
                        showArrow && currentScroll > 0
                            ? 'opacity-[1]'
                            : 'opacity-0'
                    }`}
                >
                    <ArrowRight
                        className="rotate-[20deg]"
                        width="60"
                        height="60"
                    />
                </div> */}
            </div>
            {device.os.name === 'iOS' && (
                <MobilePlayerIntegration
                    setSource={setSource}
                    source={source}
                    isTrailer={true}
                    player={player}
                    movie={trailerData}
                    indNumber={ind}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                />
            )}
        </>
    )
}

export default TrailerAll
