import { useState, useEffect, useRef } from 'react'
import MainButton from 'components/button/MainButton'
import React from 'react'
import {
    FullScreenIcon,
    MoreIcon,
    MuteIcon,
    PlayIcon,
    ReloadIcon,
    VolumeIcon,
    IMDBIcon,
    CreditCardIcon,
    ArrowRight,
    TelegramIconFill,
    FacebookIconFill,
    LinkIcon,
    ForwardIcon,
} from 'components/svg'
import NextLink from 'components/common/link'
import { useTranslation } from 'i18n'
import style from './banner.module.scss'
import { Router } from 'i18n'
import HLSSource from 'components/PlayerForVideo/HLSSource'
import { Player, Shortcut, ControlBar, BigPlayButton } from 'video-react'
import DeviceDetector from 'device-detector-js'
import { parseCookies } from 'nookies'
import restangleImg from '../../public/images/uzdplus secondary logo-01 (2).png'
import axios from 'utils/axios'
import { useSelector } from 'react-redux'
import BannerSlider from './BannerSlider'
import { useDispatch } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'

const baseUrl = process.env.BASE_DOMAIN

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const Banner = ({ banners }) => {
    const { access_token } = parseCookies()
    const [currentTrailer, setCurrentTrailer] = useState(
        getRandomInt(0, banners?.movies?.length - 1),
    )

    const { t, i18n } = useTranslation()
    const [volume, setVolume] = useState(false)
    const [allData, setallData] = useState([])
    const [shuffledData, setShuffledData] = useState()
    const [errorCase, setErrorCase] = useState(false)
    const [isPlay, setIsPlay] = useState(false)
    const [source, setSource] = useState({})
    const [isEnded, setIsEnded] = useState(false)
    const currentTime = useRef(null)
    const player = useRef(null)
    const [movieDuration, setMovieDuration] = useState('')
    const [sourceTrailer, setSourceTrailer] = useState('')
    const [colorActive, setColorActive] = useState(false)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const [purchase, setPurchase] = useState(false)
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const [text, setText] = useState('')
    const [checkSubscription, setCheckSubscription] = useState({})
    const [subscription, setSubscription] = useState([])
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [statusCopy, setStatusCopy] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        if (allData?.length) {
            setShuffledData(allData[currentTrailer])
        }
    }, [allData, currentTrailer])

    useEffect(() => {
        let trailer = []
        if (banners) {
            const news = banners?.news?.map((item, ind) => ({
                id: ind + 1,
                title: item.title,
                link: item.link,
                is_news: true,
                file_info: {
                    image: item.image,
                },
                slogan: item.text,
                trailer: [
                    {
                        image: item.image,
                        videos: [{ quality: '1080', file_name: item.video }],
                    },
                ],
            }))
            setallData([...banners?.movies, ...(news ? news : [])])
        }
    }, [banners])

    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    function getRandomInt(min, max) {
        min = Math.floor(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    // useEffect(() => {
    //     setCurrentTrailer(getRandomInt(0, banners?.movies?.length - 1))
    // }, [CurrentUserData, i18n?.language])

    useEffect(() => {
        if (
            (allData[currentTrailer]?.trailer?.length > 0
                ? allData[currentTrailer]?.trailer
                : [])[0]?.videos?.length === 0
        ) {
            if (!allData[currentTrailer]?.is_news) {
                setTimeout(() => {
                    setCurrentTrailer(
                        currentTrailer == allData?.length - 1
                            ? 0
                            : currentTrailer + 1,
                    )
                }, 5000)
            }
        } else {
            if (!allData[currentTrailer]?.is_news) {
                setTimeout(() => {
                    setCurrentTrailer(
                        currentTrailer == allData?.length - 1
                            ? 0
                            : currentTrailer + 1,
                    )
                }, (allData[currentTrailer]?.trailer?.length > 0 ? allData[currentTrailer]?.trailer : [])[0]?.videos[0]?.duration * 1000)
            }
        }
    }, [currentTrailer])

    useEffect(() => {
        if (
            (shuffledData?.trailer?.length > 0
                ? shuffledData?.trailer
                : [])[0]?.videos?.find((item) => item?.quality === 'auto')
        ) {
            setSourceTrailer(shuffledData?.trailer[0]?.videos?.slice(1)[0])
        } else {
            setSourceTrailer(
                (shuffledData?.trailer?.length > 0
                    ? shuffledData?.trailer
                    : [])[0]?.videos[0],
            )
        }
    }, [shuffledData, CurrentUserData, i18n?.language])

    const scrollTo = (direction) => {
        if (direction === 'right') {
            setCurrentTrailer(
                currentTrailer == allData?.length - 1 ? 0 : currentTrailer + 1,
            )
        } else {
            setCurrentTrailer(
                currentTrailer == 0 ? allData?.length - 1 : currentTrailer - 1,
            )
        }
    }

    useEffect(() => {
        if (isEnded) {
            scrollTo('right')
        }
    }, [isEnded])

    const statusMessage = {
        FREE_TRIAL: 'FREE_TRIAL',
        ACTIVE: 'ACTIVE',
        FREE_TRIAL_EXPIRED: 'FREE_TRIAL_EXPIRED',
        INACTIVE: 'INACTIVE',
    }

    useEffect(() => {
        if (shuffledData?.payment_type === 'free') {
            setColorActive(false)
        } else if (shuffledData?.payment_type === 'tvod') {
            if (purchase) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        } else if (shuffledData?.payment_type === 'svod') {
            if (purchase) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        }
    }, [shuffledData, purchase, CurrentUserData, i18n?.language])

    useEffect(() => {
        if (banners?.payment_type === 'tvod') {
            axios
                .post(`/check-purchase-access`, {
                    movie_slug: banners?.slug,
                })
                .then((res) => {
                    setPurchase(res?.data?.has_access)
                })
                .catch((err) => console.log(err))
        } else {
            // console.log('no purchase')
        }
    }, [CurrentUserData, banners, i18n?.language])

    useEffect(() => {
        if (shuffledData?.payment_type === 'tvod') {
            axios
                .post(`/check-purchase-access`, {
                    movie_slug: shuffledData?.slug,
                })
                .then((res) => {
                    setPurchase(res?.data?.has_access)
                })
                .catch((err) => console.log(err))
        }
    }, [shuffledData, CurrentUserData, i18n?.language])

    useEffect(() => {
        if (access_token) {
            if (shuffledData?.payment_type === 'svod') {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key: shuffledData?.category?.slug,
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        setCheckSubscription(res?.data)
                        if (res?.data?.has_access) {
                            setText(t('Смотреть'))
                            if (
                                shuffledData.access_message ===
                                'SESSION_LIMIT_ENDED'
                            ) {
                                axios
                                    .post('get-user-sessions', {
                                        key: 'movie',
                                    })
                                    .then((res) => {
                                        // setSessionsLimin(res?.data)
                                    })
                            }
                        } else {
                            axios
                                .get(
                                    `subscription/category?key=${
                                        shuffledData?.is_premier
                                            ? 'premier'
                                            : shuffledData?.is_megogo
                                            ? 'megogo'
                                            : shuffledData?.category?.slug
                                    }`,
                                )
                                .then((response) => {
                                    setSubscription(response?.data?.categories)
                                })

                            if (res?.data?.is_watched_free_trial) {
                                setText(t('buy_subscription'))
                            } else {
                                setText(t('start_free'))
                            }
                        }
                    })
            } else {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key: shuffledData?.category?.slug,
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        setCheckSubscription(res.data)
                        setText(t('watch'))
                    })
            }
        }
    }, [access_token, shuffledData, CurrentUserData, i18n?.language])

    const getStatusMessage = (value) => {
        const { has_access, message } = value
        if (shuffledData?.payment_type === 'tvod') {
            if (purchase) {
                return t('watch')
            } else {
                return i18n.language === 'ru' || i18n.language === 'en'
                    ? `${t('buy')} ${i18n.language === 'en' ? 'for' : 'за'} ${
                          shuffledData?.pricing?.substracted_price / 100
                      } ${t('sum')}`
                    : `${
                          shuffledData?.pricing?.substracted_price / 100
                      } so'mga sotib oling`
            }
        } else if (shuffledData?.payment_type === 'free') {
            return t('watch')
        } else {
            if (has_access && message === statusMessage.FREE_TRIAL)
                return t('watch')
            if (has_access && message === statusMessage.ACTIVE)
                return t('watch')
            if (!has_access && message === statusMessage.FREE_TRIAL_EXPIRED) {
                return t('buy')
            }
            if (!has_access) {
                return t('buy_subscription')
            }
            if (!has_access && message === statusMessage.INACTIVE)
                return t('buy_subscription')
            if (!has_access && !message) return t('start_free')

            return t('watch')
        }
    }

    useEffect(() => {
        setText(getStatusMessage(checkSubscription))
    }, [checkSubscription])

    const changeMuteState = () => {
        if (player.current) {
            player.current.muted = !player.current.muted
            setVolume(!volume)
        }
    }
    const handleLoad = () => {
        if (player.current) {
            player.current.seek(0)
            player.current.actions.play()
        }
    }
    function shuffle(array) {
        if (banners?.length !== 0) {
            let currentIndex = array?.length,
                randomIndex

            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex)
                currentIndex--
                ;[array[currentIndex], array[randomIndex]] = [
                    array[randomIndex],
                    array[currentIndex],
                ]
            }
        }

        return array ? array[0] : {}
    }

    useEffect(() => {
        player?.current?.subscribeToStateChange(handleStateChange)
    }, [])

    function handleStateChange(state) {
        setIsPlay(!state.paused)
        setIsEnded(state.ended)
        currentTime.current = state.currentTime
    }

    const checkAccess = () => {
        axios
            .post(`/check-purchase-access`, {
                movie_slug: shuffledData?.slug,
            })
            .then((res) => {
                if (!res.data.has_access) {
                    axios
                        .post(`/purchase`, {
                            episode_number: shuffledData?.is_serial ? 1 : 0,
                            is_serial: shuffledData?.is_serial,
                            movie_lang: i18n?.language,
                            movie_slug: shuffledData?.slug,
                            season_number: shuffledData?.is_serial ? 1 : 0,
                        })
                        .then((res) => {
                            axios
                                .post(`/payme-link`, {
                                    amount: shuffledData?.pricing
                                        ?.substracted_price,
                                    episode_number: shuffledData?.is_serial
                                        ? 1
                                        : 0,
                                    is_serial: shuffledData?.is_serial,
                                    lang: i18n?.language,
                                    movie_slug: shuffledData?.slug,
                                    purchase_id: res?.data?.purchase_id,
                                    season_number: shuffledData?.is_serial
                                        ? 1
                                        : 0,
                                    url: process.env.BASE_DOMAIN,
                                })
                                .then((res) =>
                                    window.location.replace(res?.data?.link),
                                )
                                .catch((err) => console.error(err))
                        })
                        .catch((err) => console.error(err))
                } else {
                    if (shuffledData?.is_serial) {
                        Router.push(
                            `/video-player?key=${shuffledData.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
                        )
                    } else {
                        Router.push(
                            `/video-player?key=${shuffledData?.slug}&trailer=false&ind=0`,
                        )
                    }
                }
            })
            .catch((err) => console.log(err))
    }

    const watchMovie = () => {
        if (access_token) {
            if (shuffledData?.payment_type === 'free') {
                if (shuffledData?.is_serial) {
                    Router.push(
                        `/video-player?key=${shuffledData.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
                    )
                } else {
                    Router.push(
                        `/video-player?key=${shuffledData?.slug}&trailer=false&ind=0`,
                    )
                }
            } else if (shuffledData?.payment_type === 'tvod') {
                checkAccess()
            } else if (shuffledData?.payment_type === 'svod') {
                if (checkSubscription?.has_access) {
                    if (shuffledData?.is_serial) {
                        Router.push(
                            `/video-player?key=${shuffledData.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
                        )
                    } else {
                        Router.push(
                            `/video-player?key=${shuffledData?.slug}&trailer=false&ind=0`,
                        )
                    }
                } else {
                    Router.push(
                        `/movie/${shuffledData?.slug}?from=banner&paymentType=svod`,
                    )
                }
            }
        } else {
            Router.push('/registration')
        }
    }

    const handlePlay = () => {
        if (source) {
            if (source?.file_name?.length == 0) {
                setErrorCase(true)
            } else if (source?.quality === 'original') {
                setErrorCase(true)
            }
        } else {
            setErrorCase(true)
        }
        watchMovie()
    }

    useEffect(() => {
        if (shuffledData?.duration) {
            let hours = Math.floor(shuffledData?.duration / 3600)
            let minutes = Math.floor((shuffledData?.duration % 3600) / 60)
            setMovieDuration(
                hours + `${t('hour')}` + ' ' + minutes + `${t('minutes')}`,
            )
        }
    }, [])

    return (
        <div>
            {banners?.movies?.length === 0 && banners?.news?.length === 0 ? (
                <div className="w-full h-[100vh]">
                    <img
                        src={restangleImg.src}
                        alt="img"
                        className="w-full h-[100vh] object-cover"
                    />
                </div>
            ) : (
                <div>
                    {window.innerWidth > 1030 ? (
                        <div className="banner_gradiend">
                            <NextLink
                                href={`/movie/${shuffledData?.slug}?from=${shuffledData?.category?.id}`}
                            >
                                <div
                                    className={
                                        isPlay
                                            ? 'after_gradient_none'
                                            : 'after_gradient bottom-0 md:bottom-none'
                                    }
                                ></div>
                            </NextLink>

                            <div
                                className={`absolute right-0 top-1/2 -translate-y-1/2 w-[60px] flex items-center duration-300 bg-gradient-to-l z-50`}
                            >
                                {banners?.movies?.length > 1 && (
                                    <div
                                        onClick={() => scrollTo('right')}
                                        className="duration-300 cursor-pointer arrowRight"
                                    >
                                        <ArrowRight width="60" height="60" />
                                    </div>
                                )}
                            </div>
                            <div
                                className={`absolute left-0 top-1/2 -translate-y-1/2 w-[60px] flex items-center duration-300 z-50`}
                            >
                                {banners?.movies?.length > 1 && (
                                    <div
                                        onClick={() => scrollTo('left')}
                                        className="duration-300 cursor-pointer rotate-180 -pb-10 arrowRight"
                                    >
                                        <ArrowRight width="60" height="60" />
                                    </div>
                                )}
                            </div>

                            {shuffledData?.file_info && (
                                <Player
                                    className="player_main_page"
                                    aspectratio="true"
                                    muted
                                    autoPlay
                                    playsInline
                                    ref={player}
                                    fluid={true}
                                    poster={
                                        shuffledData?.file_info?.image
                                            ? shuffledData?.file_info?.image
                                            : shuffledData?.logo_image
                                    }
                                    preload="auto"
                                >
                                    <Shortcut clickable={false} />
                                    <ControlBar className="control_bar" />
                                    {sourceTrailer?.file_name.includes(
                                        'banner-news',
                                    ) ? (
                                        <source
                                            src={
                                                sourceTrailer?.file_name
                                                    ? sourceTrailer?.file_name
                                                    : ''
                                            }
                                            key={sourceTrailer?.file_name || 1}
                                            isVideoChild
                                        />
                                    ) : (
                                        <HLSSource
                                            isVideoChild
                                            src={
                                                sourceTrailer?.file_name
                                                    ? sourceTrailer?.file_name
                                                    : ''
                                            }
                                            key={sourceTrailer?.file_name || 1}
                                        />
                                    )}
                                    <BigPlayButton disabled />
                                </Player>
                            )}
                            {isEnded && (
                                <div className="image_bg_for_banner">
                                    <img
                                        src={
                                            shuffledData &&
                                            shuffledData?.file_info?.image
                                        }
                                        alt=""
                                    />
                                </div>
                            )}
                            <div className="image_banner_bg">
                                <img
                                    src={
                                        shuffledData &&
                                        shuffledData?.file_info?.image
                                    }
                                    alt="image"
                                />
                            </div>
                            <div
                                className={`${style.responsive_banner_content} z-[4] w-full wrapper text-center`}
                            >
                                <div className="flex flex-col items-center">
                                    {shuffledData?.movie_logo_title?.length >
                                    0 ? (
                                        <img
                                            src={shuffledData?.movie_logo_title}
                                            alt="img"
                                            className="w-[250px]"
                                        />
                                    ) : (
                                        ''
                                    )}
                                    <NextLink
                                        href={`/movie/${shuffledData?.slug}?from=${shuffledData?.category?.id}`}
                                    >
                                        <div>
                                            <span
                                                className="text-3xl font-semibold text-[#ffffff]"
                                                id="bannerTitle"
                                            >
                                                {shuffledData?.title}
                                            </span>
                                            <div className="flex items-center justify-center md:hidden mt-[12px]">
                                                {shuffledData?.genres?.length >
                                                    0 && (
                                                    <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                                        {
                                                            shuffledData
                                                                ?.genres[0]
                                                                ?.title
                                                        }
                                                    </p>
                                                )}
                                                {shuffledData?.genres
                                                    ?.length === 2 && (
                                                    <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                                        {
                                                            shuffledData
                                                                ?.genres[1]
                                                                ?.title
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                                    •
                                                </p>
                                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                                    {shuffledData?.release_year}
                                                </p>
                                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                                    •
                                                </p>
                                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                                    {shuffledData?.country}
                                                </p>
                                                <p className="text-[#E9E9E9] text-7 leading-10 font-normal mx-1">
                                                    •
                                                </p>
                                                <div className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                                    <p className="text-[#E9E9E9] text-7 leading-10 font-normal">
                                                        +
                                                        {shuffledData?.age_restriction
                                                            ? shuffledData?.age_restriction
                                                            : 0}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </NextLink>
                                </div>
                            </div>

                            <div
                                className="hidden banner_content h-full sm:h-[100vh] z-[2] absolute sm:top-0 top-[-28px] right-0 w-full md:flex justify-between items-end"
                                id="bannerTitle"
                            >
                                <div className="w-full pb-[50px] md:pb-[115px] xl:pb-[50px] wrapper">
                                    <div className="text-white md:w-1/2">
                                        {shuffledData?.title && (
                                            <div className="mb-6 md:pl-9 xl:pl-0">
                                                {shuffledData?.movie_logo_title ? (
                                                    <img
                                                        src={
                                                            shuffledData?.movie_logo_title
                                                        }
                                                        alt={
                                                            shuffledData?.title
                                                        }
                                                        className="h-[65px] object-cover"
                                                    />
                                                ) : (
                                                    <span
                                                        className="text-3xl font-semibold"
                                                        // id="bannerTitle"
                                                    >
                                                        {shuffledData?.title}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        <div className="text-lg font-medium text-[#D5DADD] flex md:pl-9 xl:pl-0">
                                            {shuffledData?.rating_imdb
                                                ?.rating_imdb && (
                                                <span className="text-xl font-semibold text-white mr-2 hidden sm:flex">
                                                    <IMDBIcon />
                                                    <span
                                                        className="ml-[7px]"
                                                        // id="bannerTitle"
                                                    >
                                                        {' '}
                                                        {
                                                            shuffledData
                                                                ?.rating_imdb
                                                                ?.rating_imdb
                                                        }{' '}
                                                        <span className="text-[#D5DADD]">
                                                            ·
                                                        </span>
                                                    </span>
                                                </span>
                                            )}
                                            {shuffledData?.is_megogo && (
                                                <span className="text-xl font-semibold text-white mr-2.5 hidden sm:flex">
                                                    <IMDBIcon />
                                                    <span
                                                        className="ml-[7px]"
                                                        // id="bannerTitle"
                                                    >
                                                        {' '}
                                                        {
                                                            shuffledData?.rating
                                                        }{' '}
                                                        <span className="text-[#D5DADD]">
                                                            ·
                                                        </span>
                                                    </span>
                                                </span>
                                            )}
                                            {shuffledData?.country && (
                                                <span className="mr-2">
                                                    {shuffledData?.country} ·
                                                </span>
                                            )}
                                            {shuffledData?.release_year > 0 && (
                                                <span className="mr-2">
                                                    {shuffledData?.release_year}{' '}
                                                    ·
                                                </span>
                                            )}
                                            {movieDuration && (
                                                <span className="mx-2">
                                                    {movieDuration}{' '}
                                                </span>
                                            )}
                                            {shuffledData?.age_restriction && (
                                                <span className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                                    {shuffledData?.age_restriction
                                                        ? `${shuffledData?.age_restriction}+`
                                                        : `0+`}
                                                </span>
                                            )}
                                        </div>
                                        {shuffledData?.slogan && (
                                            <span className="text-lg mt-[5px] md:w-1/2 md:pl-9 xl:pl-0">
                                                {shuffledData?.slogan}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center md:mt-6 z-[2] relative sm:pb-8 2xl:pb-6">
                                        <div className="text-white flex items-center space-x-2 absolute left-1/2 bottom-0 -translate-x-1/2">
                                            {allData?.map((item, ind) => (
                                                <div
                                                    onClick={() =>
                                                        setCurrentTrailer(ind)
                                                    }
                                                    key={ind}
                                                    className={`cursor-pointer flex items-center justify-center rounded-full`}
                                                >
                                                    {item?.id ==
                                                    shuffledData?.id ? (
                                                        <div className="w-[8px] h-[8px] bg-[#5086EC] rounded-full"></div>
                                                    ) : (
                                                        <div className="w-[8px] h-[8px] bg-[#383641] rounded-full"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex space-x-4 ">
                                            {!shuffledData?.is_news && (
                                                <a className="inline-block">
                                                    <MainButton
                                                        onClick={() =>
                                                            handlePlay()
                                                        }
                                                        text={text}
                                                        icon={
                                                            colorActive ? (
                                                                <CreditCardIcon
                                                                    width="24"
                                                                    height="24"
                                                                />
                                                            ) : (
                                                                <PlayIcon />
                                                            )
                                                        }
                                                        additionalClasses={`${
                                                            colorActive
                                                                ? 'bg-[#D29404]'
                                                                : 'bg-mainColor'
                                                        } h-[42px] md:h-[56px] inline-flex w-full ${
                                                            colorActive
                                                                ? 'bgHoverYellow'
                                                                : 'bgHoverBlue'
                                                        } duration-200 rounded-[8px]`}
                                                        margin="mr-[5px]"
                                                    />
                                                </a>
                                            )}
                                            {shuffledData?.link && (
                                                <MainButton
                                                    onClick={() =>
                                                        window.open(
                                                            shuffledData.link,
                                                            '_blank',
                                                        )
                                                    }
                                                    text={t('more')}
                                                    additionalClasses="text-[17px] font-semibold h-[56px] md:flex bg-[#1C192C] md:w-auto rounded-[12px] hover:bg-[#231F36]"
                                                    icon={<MoreIcon />}
                                                    margin="mr-[5px]"
                                                />
                                            )}
                                            {!shuffledData?.is_news && (
                                                <span className="flex space-x-4">
                                                    <MainButton
                                                        onClick={() =>
                                                            Router.push(
                                                                `/movie/${shuffledData?.slug}?from=banner`,
                                                            )
                                                        }
                                                        text={t('more')}
                                                        additionalClasses="text-[17px] font-semibold h-[56px] md:flex bg-[#1C192C] md:w-auto rounded-[12px] hover:bg-[#231F36]"
                                                        icon={<MoreIcon />}
                                                        margin="mr-[5px]"
                                                    />

                                                    <div
                                                        className={`w-[42px] md:w-[56px] h-[42px] md:h-[56px] flex items-center rounded-[8px] duration-200 bg-[#1C192C] relative bgHoverGrey`}
                                                        id="videoPlayer"
                                                    >
                                                        <Button
                                                            id="basic-button"
                                                            aria-controls={
                                                                open
                                                                    ? 'basic-menu'
                                                                    : undefined
                                                            }
                                                            aria-haspopup="true"
                                                            aria-expanded={
                                                                open
                                                                    ? 'true'
                                                                    : undefined
                                                            }
                                                            onClick={
                                                                handleClick
                                                            }
                                                        >
                                                            <MainButton
                                                                onClick={() => {
                                                                    setStatusCopy(
                                                                        !statusCopy,
                                                                    )
                                                                }}
                                                                icon={
                                                                    <ForwardIcon />
                                                                }
                                                                additionalClasses="rounded-[8px] cursor-pointer"
                                                                id="demo-simple-select-label"
                                                            />
                                                        </Button>
                                                        <Menu
                                                            id="basic-menu"
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={
                                                                handleClose
                                                            }
                                                            MenuListProps={{
                                                                'aria-labelledby':
                                                                    'basic-button',
                                                            }}
                                                        >
                                                            <div className="w-full h-full bg-[#100E19]">
                                                                <div>
                                                                    {shuffledData?.logo_image && (
                                                                        <div className="relative">
                                                                            <img
                                                                                src={
                                                                                    shuffledData?.logo_image
                                                                                }
                                                                                alt={
                                                                                    shuffledData?.title
                                                                                }
                                                                                className="h-[207px] object-cover w-full"
                                                                            />
                                                                            <div className="shareButtonImg"></div>
                                                                            <span className="text-3xl font-semibold absolute bottom-0 left-0 w-full text-center text-white z-10 ">
                                                                                {
                                                                                    shuffledData?.title
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="w-[90%] mx-auto mt-3">
                                                                    <div className="bg-[#1C192C] rounded-[12px]">
                                                                        <MenuItem
                                                                            onClick={
                                                                                handleClose
                                                                            }
                                                                        >
                                                                            <li
                                                                                className="py-[8px] flex justify-start items-center w-full cursor-pointer"
                                                                                onClick={() => {
                                                                                    setStatusCopy(
                                                                                        false,
                                                                                    )
                                                                                    window.open(
                                                                                        `https://www.facebook.com/sharer/sharer.php?u=${
                                                                                            baseUrl +
                                                                                            Router?.asPath
                                                                                        }`,
                                                                                        '_blank',
                                                                                    )
                                                                                }}
                                                                            >
                                                                                <a
                                                                                    href="#"
                                                                                    className="  hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[32px] h-[32px] flex items-center justify-center rounded-full"
                                                                                >
                                                                                    <FacebookIconFill />
                                                                                </a>
                                                                                <span className="ml-3 text-[15px] font-[500]">
                                                                                    {t(
                                                                                        'facebook',
                                                                                    )}
                                                                                </span>
                                                                            </li>
                                                                        </MenuItem>
                                                                        <MenuItem
                                                                            onClick={
                                                                                handleClose
                                                                            }
                                                                        >
                                                                            <li
                                                                                className="py-[8px] flex justify-start items-center w-full cursor-pointer"
                                                                                onClick={() => {
                                                                                    setStatusCopy(
                                                                                        false,
                                                                                    )
                                                                                    window.open(
                                                                                        `https://telegram.me/share/url?url=${
                                                                                            baseUrl +
                                                                                            Router?.asPath
                                                                                        }`,
                                                                                        '_blank',
                                                                                    )
                                                                                }}
                                                                            >
                                                                                <a
                                                                                    href="#"
                                                                                    className=" hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[32px] h-[32px] flex items-center justify-center rounded-full"
                                                                                >
                                                                                    <TelegramIconFill />
                                                                                </a>
                                                                                <span className="ml-3 text-[15px] font-[500]">
                                                                                    {t(
                                                                                        'telegram',
                                                                                    )}
                                                                                </span>
                                                                            </li>
                                                                        </MenuItem>
                                                                    </div>
                                                                    <div className="bg-[#1C192C] rounded-[12px] mt-3 copyLinkShare">
                                                                        <MenuItem
                                                                            onClick={
                                                                                handleClose
                                                                            }
                                                                        >
                                                                            <li
                                                                                className="py-[8px] cursor-pointer flex justify-start items-center w-full"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(
                                                                                        baseUrl +
                                                                                            Router?.asPath,
                                                                                    )
                                                                                    dispatch(
                                                                                        showAlert(
                                                                                            t(
                                                                                                'copied',
                                                                                            ),
                                                                                            'success',
                                                                                        ),
                                                                                    )
                                                                                    setStatusCopy(
                                                                                        false,
                                                                                    )
                                                                                }}
                                                                            >
                                                                                <a
                                                                                    href="#"
                                                                                    className=" hover:scale-110 hover:bg-opacity-[0.2] duration-200 w-[32px] h-[32px] flex items-center justify-center rounded-full"
                                                                                >
                                                                                    <LinkIcon />
                                                                                </a>
                                                                                <span className="ml-3 text-[15px] font-[500]">
                                                                                    {t(
                                                                                        'copyLink',
                                                                                    )}
                                                                                </span>
                                                                            </li>
                                                                        </MenuItem>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Menu>
                                                    </div>
                                                </span>
                                            )}
                                        </div>

                                        {(shuffledData?.trailer?.length > 0
                                            ? shuffledData?.trailer
                                            : [])[0]?.videos[0]?.file_name
                                            ?.length > 0 && (
                                            <div className="hidden md:flex space-x-4">
                                                {!isEnded ? (
                                                    <>
                                                        <div
                                                            onClick={() =>
                                                                changeMuteState()
                                                            }
                                                            className="rounded-xl py-[15px] px-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer bgHoverGrey"
                                                        >
                                                            {volume ? (
                                                                <VolumeIcon />
                                                            ) : (
                                                                <MuteIcon />
                                                            )}
                                                        </div>

                                                        <div
                                                            onClick={() => {
                                                                Router.push(
                                                                    `/video-player/trailer?key=${
                                                                        shuffledData?.slug
                                                                            ? shuffledData.slug
                                                                            : shuffledData?.title
                                                                    }&ind=0&currentTime=${
                                                                        currentTime?.current
                                                                    }`,
                                                                )
                                                            }}
                                                            className={`rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer bgHoverGrey ${
                                                                shuffledData.is_news
                                                                    ? 'hidden'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <FullScreenIcon />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div
                                                        onClick={() =>
                                                            handleLoad()
                                                        }
                                                        className="rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer"
                                                    >
                                                        <ReloadIcon />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="banner_gradiend">
                            <BannerSlider
                                movies={allData}
                                currentTrailer={currentTrailer}
                                setShuffledData={setShuffledData}
                                shuffledData={shuffledData}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Banner
