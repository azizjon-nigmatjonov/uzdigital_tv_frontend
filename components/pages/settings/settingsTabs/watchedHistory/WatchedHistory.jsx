import { useState, useRef } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import NextLink from 'components/common/link'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import axios from 'utils/axios'
import { useEffect } from 'react'
import { useTranslation } from 'i18n'
import {
    DeleteIcon,
    CancelIcon,
    CheckIcon,
    EmptyIcon,
    PremierTag,
} from 'components/svg'
import router from 'next/router'
import { parseCookies } from 'nookies'
import { useSelector } from 'react-redux'
import MainButton from 'components/button/MainButton'
import Skeleton from '@mui/material/Skeleton'
import NullData from 'components/errorPopup/NullData'
import MegaGoTag from '../../../../../public/vectors/MegagoTag.svg'

export default function WatchedHistory() {
    const { t, i18n } = useTranslation()
    const [currentPage, setCurrentPage] = useState(1)
    const [deleteActive, setDeleteActive] = useState(false)
    const [data, setData] = useState([])
    const [copyData, setCopyData] = useState(null)
    const [movies, setMovies] = useState([])
    const [allSelect, setAllSelect] = useState(false)
    const [isAllSelectActive, setAllSelectActive] = useState(false)
    const { session_id, profile_id } = parseCookies()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const ScalettonNumber = [1, 2, 3]
    const [error, setError] = useState(false)
    const wrapperRef = useRef(null)
    const [movieActiveCount, setMovieActiveCount] = useState(0)

    const getRecentlyWatchedMovies = () => {
        setLoading(true)
        if (session_id)
            axios
                .get(
                    `recently-watched-movies?SessionId=${session_id}&profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }&lang=${i18n?.language}&page=${1}&limit=${100}`,
                )
                .then((res) => {
                    console.log(res?.data)
                    setCount(res?.data?.count)
                    setData(res?.data?.user_movies)
                })
                .catch(() => {
                    setError(true)
                })
                .finally(() => {
                    setLoading(false)
                })
    }
    // test
    useEffect(() => {
        if (data) {
            setCopyData(
                data?.map((item) => ({
                    ...item,
                    isActive: false,
                })),
            )
        }
    }, [data])

    useEffect(() => {
        getRecentlyWatchedMovies()
    }, [CurrentUserData])

    const handleMovie = (id, type) => {
        if (deleteActive) {
            const modifiedData = copyData?.find(
                (movie) => movie.movie_key === id,
            )
            if (!modifiedData.isActive) {
                modifiedData.isActive = true
                setMovies((prev) => [...prev, modifiedData])
                setMovieActiveCount((prev) => prev + 1)
            } else {
                modifiedData.isActive = false
                setMovieActiveCount((prev) => prev - 1)
                setMovies((prev) => [...prev, modifiedData])
            }
        } else {
            if (type === 'megogo') {
                router.push(`/movie/${id}?type=megogo`)
            }
            if (type === 'premier') {
                router.push(`/movie/${id}?type=premier`)
            }
            if (!type) {
                router.push(`movie/${id}`)
            }
        }
    }

    useEffect(() => {
        if (movieActiveCount === count) {
            setAllSelectActive(true)
        } else {
            setAllSelectActive(false)
        }
    }, [movieActiveCount])

    useEffect(() => {
        if (allSelect) {
            setAllSelectActive(true)
        } else {
            setAllSelectActive(false)
        }
    }, [allSelect])

    const selectAllMovie = () => {
        const newData = data.map((item) => ({ ...item, isActive: true }))
        setCopyData(newData)
        setAllSelectActive(true)
        setMovieActiveCount(newData?.length)
    }

    const canselSelectall = () => {
        const newData = data.map((item) => ({ ...item, isActive: false }))
        setCopyData(newData)
        setAllSelectActive(false)
        setMovieActiveCount(0)
    }

    useEffect(() => {
        if (!deleteActive && copyData) {
            const oldData = copyData.map((item) => ({
                ...item,
                isActive: false,
            }))
            setCopyData(oldData)
            setAllSelectActive(false)
            setMovieActiveCount(0)
        }
    }, [deleteActive])

    const handleToDelete = () => {
        let result = []
        if (copyData && copyData?.length > 0) {
            for (let i = 0; i < copyData.length; i++) {
                if (copyData[i].isActive) {
                    result.push(copyData[i].movie_key)
                }
            }
        }
        if (result) {
            axios
                .delete(
                    `recently-watched-movies?profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }`,
                    {
                        data: {
                            movie_key: result.join(','),
                        },
                    },
                )
                .then(() => {
                    getRecentlyWatchedMovies()
                    setMovieActiveCount(0)
                    setDeleteActive(false)
                    result = []
                    setTimeout(() => {
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                        })
                    }, 300)
                })
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', detectKeyPress, true)
    }, [])

    const detectKeyPress = (e) => {
        if (e.keyCode === 27) {
            setDeleteActive(false)
        }
    }

    return (
        <div className="relative w-full" ref={wrapperRef}>
            {copyData?.length > 0 && !loading && (
                <div
                    onClick={() => setDeleteActive((prev) => !prev)}
                    className="absolute right-0 -top-16 text-[17px] cursor-pointer flex items-center space-x-2"
                >
                    {deleteActive ? (
                        <CancelIcon fill={'#fff'} />
                    ) : (
                        <DeleteIcon fill={'#fff'} />
                    )}
                    <span>{deleteActive ? t('cancel') : t('delete')}</span>
                </div>
            )}
            {deleteActive && !loading && !error && (
                <div
                    onClick={() =>
                        isAllSelectActive ? canselSelectall() : selectAllMovie()
                    }
                    className="mb-4 items-center space-x-3 cursor-pointer group inline-flex"
                >
                    <div
                        className={`w-[18px] h-[18px] duration-200 rounded-[4px] border-[1.5px] inline-flex items-center justify-center 
                                              ${
                                                  isAllSelectActive
                                                      ? 'bg-[#5086EC] border-transparent'
                                                      : 'border-[#5b596480] group-hover:border-[#ffffffcd]'
                                              }`}
                    >
                        {isAllSelectActive && <CheckIcon fill="#111" />}
                    </div>
                    <span className="text-[15px] text-[#E0E0E0] font-normal">
                        {t('selectAll')}
                    </span>
                </div>
            )}
            {!loading && copyData && !error && (
                // <InfiniteScroll
                //     dataLength={''}
                //     style={{ overflow: 'visible' }}
                //     next={() => {
                //         setCurrentPage((pre) => ++pre)
                //     }}
                //     hasMore={true}
                // >
                <div className="w-full grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-5 sm:gap-y-5">
                    {copyData?.map((item, i) => (
                        <div
                            key={item?.id}
                            className="inline-block w-full relative"
                        >
                            {item?.is_megogo && !item?.related_movies && (
                                <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute left-[70px] top-1 text-white uppercase text-[13px] font-semibold flex items-center justify-center">
                                    <MegaGoTag />
                                </div>
                            )}
                            {item?.is_premier && !item?.related_movies && (
                                <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute left-[70px] top-1 text-white uppercase text-[14px] font-semibold flex items-center justify-center">
                                    <PremierTag />
                                </div>
                            )}
                            <a>
                                <div
                                    onClick={() => {
                                        if (deleteActive) {
                                            handleMovie(
                                                item?.movie_key,
                                                item?.movie_key,
                                            )
                                        } else {
                                            if (item?.is_megogo) {
                                                handleMovie(
                                                    item?.movie_key,
                                                    'megogo',
                                                )
                                            } else if (item?.is_premier) {
                                                handleMovie(
                                                    item?.movie_key,
                                                    'premier',
                                                )
                                            } else {
                                                handleMovie(item?.movie_key)
                                            }
                                        }
                                    }}
                                    className="flex space-x-2 h-full cursor-pointer group"
                                >
                                    {deleteActive ? (
                                        <div className="h-full flex items-center">
                                            <div
                                                className={`w-[18px] h-[18px] duration-200 rounded-[4px] inline-flex items-center justify-center 
                                              ${
                                                  item?.isActive
                                                      ? 'bg-[#5086EC]'
                                                      : 'border-[1.5px] border-[#5b596480] group-hover:border-[#ffffffcd]'
                                              }`}
                                            >
                                                {item?.isActive && (
                                                    <CheckIcon fill="#111" />
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    <div className="rounded-[4px] w-[102px] overflow-hidden">
                                        <LazyLoadImage
                                            className={`object-cover h-[142px] w-full`}
                                            src={item?.logo_image}
                                        ></LazyLoadImage>
                                    </div>

                                    <div className="w-[55%] relative overflow-hidden">
                                        <div className="h-[85%] overflow-hidden">
                                            <p className="text-[15px] font-medium">
                                                {i18n?.language === 'en'
                                                    ? item?.title?.en
                                                    : i18n?.language === 'ru'
                                                    ? item?.title?.ru
                                                    : item?.title?.uz}
                                            </p>
                                            <p className="text-[#A9A7B4] text-[13px] mt-1 flex flex-wrap">
                                                {item?.year && (
                                                    <span>{item?.year}</span>
                                                )}
                                                {item?.country && (
                                                    <span className="mx-1">
                                                        {'· '}
                                                        {i18n?.language === 'en'
                                                            ? item?.country?.en
                                                            : i18n?.language ===
                                                              'ru'
                                                            ? item?.country?.ru
                                                            : item?.country?.uz}
                                                    </span>
                                                )}
                                                {item?.genre && (
                                                    <span>
                                                        {'· '}
                                                        {i18n?.language === 'en'
                                                            ? item?.genre?.en
                                                            : i18n?.language ===
                                                              'ru'
                                                            ? item?.genre?.ru
                                                            : item?.genre?.uz}
                                                    </span>
                                                )}
                                            </p>
                                            {item?.price && (
                                                <p>
                                                    {item?.price + t('sum')}{' '}
                                                    something
                                                    aklsmdlaksmdlamsdalksdmakldm
                                                </p>
                                            )}
                                        </div>
                                        <span
                                            className={`
                                                absolute text-[12px] 2xl:text-[13px] bottom-0 left-0`}
                                        >
                                            {item?.payment_type === 'tvod' ? (
                                                <span className="text-[#F50057">
                                                    {item?.movie?.pricing
                                                        ?.substracted_price /
                                                        100}
                                                </span>
                                            ) : item?.payment_type ===
                                              'svod' ? (
                                                <span className="text-[#4589FF]">
                                                    {t('svod')}
                                                </span>
                                            ) : (
                                                <span className="text-[#ffffff55]">
                                                    {t('free')}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
                // </InfiniteScroll>
            )}
            {movieActiveCount > 0 && !loading && !error && (
                <MainButton
                    onClick={() => handleToDelete()}
                    text={t('deleteSelects')}
                    additionalClasses="w-full xl:w-[485px] bg-[#5086EC] bgHoverBlue rounded-[8px] mx-auto mt-20"
                />
            )}

            {loading && !error && (
                <div className="">
                    <div className="w-full grid grid-flow-row-dense grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 grid-rows-3 gap-x-2 sm:gap-x-4 gap-y-5 sm:gap-y-5">
                        {ScalettonNumber.map((item) => (
                            <div
                                key={item}
                                className="h-[142px] 2xl:h-[180px] extra:h-[240px]"
                            >
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '8px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && copyData?.length === 0 && (
                <div className="flex justify-center">
                    <NullData
                        icon={<EmptyIcon />}
                        title={t('yourWatchedEmpty')}
                        text={t('hereWatchedVideos')}
                        textButton={null}
                        link={() => router.push('/settings?from=profile')}
                    />
                </div>
            )}
        </div>
    )
}
