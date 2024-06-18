import { useIsMobile } from 'hooks/useIsMobile'
import MainButton from 'components/button/MainButton'
import React from 'react'
import {
    FavoriteLikeIcon,
    ForwardIcon,
    PlayIcon,
    FavoriteLikeIconBordered,
    CreditCardIcon,
    IMDBIcon,
    FullScreenIcon,
    MoreIcon,
    MuteIcon,
    ReloadIcon,
    VolumeIcon,
    TelegramIconFill,
    InstagramIcon,
    FacebookIconFill,
    LinkIcon,
} from 'components/svg'
import router from 'next/router'
import { Router } from 'i18n'
import { useEffect, useRef, useState } from 'react'
import axios from '../../utils/axios'
import { parseCookies } from 'nookies'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'
import MobilePlayerIntegration from 'components/PlayerForVideo/MobilePlaterIntegration'
import DeviceDetector from 'device-detector-js'
import { useTranslation } from 'i18n'
import { Player, Shortcut, ControlBar, BigPlayButton } from 'video-react'
import HLSSource from 'components/PlayerForVideo/HLSSource'
import { useDispatch, useSelector } from 'react-redux'
import { showAlert } from 'store/reducers/alertReducer'

import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const baseUrl = process.env.BASE_DOMAIN

const VideoPlayer = ({
    el,
    filterGenres,
    checkSubscription,
    purchase,
    CurrentUserData,
    link,
}) => {
    const [favoriteImg, setFavoriteImg] = useState('')
    const [favouriteId, setFavouriteId] = useState('')
    const [favouritePaymentType, setFavouritePaymentType] = useState('')
    const { t, i18n } = useTranslation()
    const statusMessage = {
        FREE_TRIAL: 'FREE_TRIAL',
        ACTIVE: 'ACTIVE',
        FREE_TRIAL_EXPIRED: 'FREE_TRIAL_EXPIRED',
        INACTIVE: 'INACTIVE',
    }
    const balance = useSelector((state) => state.userBalanceReducer.userBalance)
    const currentTime = useRef(null)
    const [volume, setVolume] = useState(false)
    const [isEnded, setIsEnded] = useState(false)
    const [isPlay, setIsPlay] = useState(false)
    const [sourceTrailer, setSourceTrailer] = useState('')

    const [colorActive, setColorActive] = useState(false)
    const dispatch = useDispatch()

    const [statusCopy, setStatusCopy] = useState(false)
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

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

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        if (el?.trailer) {
            if (el?.is_megogo) {
                setSourceTrailer(el?.trailer?.videos?.slice(1)[4])
            } else {
                const bestQuality = el?.trailer[0]?.videos?.find(
                    (item) => item?.quality === '1080p',
                )
                setSourceTrailer(bestQuality)
            }
        }
    }, [el])

    useEffect(() => {
        player?.current?.subscribeToStateChange(handleStateChange)
    }, [])

    useEffect(() => {
        if (isEnded) {
            handleLoad()
        }
    }, [isEnded])
    function handleStateChange(state) {
        setIsPlay(!state.paused)
        setIsEnded(state.ended)
        currentTime.current = state.currentTime
    }

    useEffect(() => {
        if (el?.payment_type === 'free') {
            setColorActive(false)
        } else if (el?.payment_type === 'tvod') {
            if (purchase) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        } else if (el?.payment_type === 'svod') {
            if (purchase) {
                setColorActive(false)
            } else {
                setColorActive(true)
            }
        }
    }, [purchase, el])

    const getStatusMessage = (value) => {
        const { has_access, message } = value
        if (el?.payment_type === 'tvod') {
            if (purchase) {
                return t('watch')
            } else {
                return i18n.language === 'ru' || i18n.language === 'en'
                    ? `${t('buy')} ${i18n.language === 'en' ? 'for' : 'за'} ${
                          el?.pricing?.substracted_price / 100
                      } ${t('sum')}`
                    : `${
                          el?.pricing?.substracted_price / 100
                      } so'mga sotib oling`
            }
        } else if (el?.payment_type === 'free') {
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

    const [errorCase, setErrorCase] = useState(false)
    const [isMobile] = useIsMobile()
    const [source, setSource] = useState({})
    const [text, setText] = useState('')

    useEffect(() => {
        setText(getStatusMessage(checkSubscription))
    }, [checkSubscription, el, router, purchase])

    const { access_token, profile_id, session_id } = parseCookies()
    const [movieDuration, setMovieDuration] = useState('')
    const player = useRef(null)
    const [like, setLike] = useState(el?.is_favourite)
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)

    useEffect(() => {
        setLike(!!el?.is_favourite)
    }, [el?.is_favourite])

    useEffect(() => {
        if (el?.is_megogo) {
            setFavoriteImg(el?.trailer?.image)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else if (!el?.is_megogo && !el?.is_premier) {
            setFavoriteImg(el?.file_info?.image)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else if (el?.is_premier && !el?.is_megogo) {
            setFavoriteImg(el?.image?.original)
            setFavouriteId(el?.id)
            setFavouritePaymentType(el?.payment_type)
        } else {
            setFavoriteImg('')
        }
    }, [el])

    const handleFavourite = () => {
        if (like) {
            axios
                .delete(
                    `/favourites/profile/${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }`,
                    {
                        data: {
                            slug: el?.slug,
                        },
                    },
                )
                .then((res) => res)
        } else {
            if (access_token) {
                axios
                    .post(
                        `/favourites/profile/${
                            CurrentUserData?.id
                                ? CurrentUserData?.id
                                : profile_id
                        }`,
                        {
                            is_megogo: el?.is_megogo ? true : false,
                            is_premier: el?.is_premier ? true : false,
                            lang: i18n?.language,
                            logo_image: favoriteImg,
                            movie_id: favouriteId,
                            payment_type: favouritePaymentType,
                            price: el?.price ? el?.price : 0,
                            rating_imdb: el?.is_megogo
                                ? parseInt(el?.rating)
                                : el?.rating_imdb?.rating_imdb
                                ? parseInt(el?.rating_imdb.rating_imdb)
                                : 0,
                            slug: el?.slug ? el?.slug : '',
                            title: {
                                title_en: i18n?.language === 'en' ? 'en' : '',
                                title_ru: i18n?.language === 'ru' ? 'ru' : '',
                                title_uz: i18n?.language === 'uz' ? 'uz' : '',
                            },
                        },
                    )
                    .then(() => {})
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        }
    }

    const handleMovie = () => {
        if (el?.is_serial) {
            if (el?.is_megogo) {
                Router.push(
                    `/video-player?id=${el.id}&episodeId=${
                        el?.seasons[0]?.episodes[0]?.id
                    }&ind=0&seasonNumber=1&episodeNumber=1&type=megogo${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }&genre=${
                        filterGenres[0]?.title ? filterGenres[0]?.title : ''
                    }`,
                )
            } else if (el?.is_premier) {
                Router.push(
                    `/video-player?id=${el?.id}&episodeId=${
                        el?.seasons[0]?.episodes[0]?.id
                    }&trailer=${false}&ind=0&seasonNumber=${1}&episodeNumber=${1}&type=premier${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }&genre=${
                        el?.genres[0]?.title ? el?.genres[0]?.title : ''
                    }`,
                )
            } else {
                Router.push(
                    `/video-player?key=${
                        el.slug
                    }&ind=0&seasonNumber=1&episodeNumber=1${
                        el?.last_episode?.season_key == 1 &&
                        el?.last_episode?.episode_key == 1 &&
                        el?.last_episode?.seconds > 0
                            ? `&lastTime=${el?.last_episode?.seconds}`
                            : ''
                    }`,
                )
            }
        } else {
            if (el?.is_premier) {
                Router.push(
                    `/video-player?id=${el.id}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=premier${
                        el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''
                    }&genre=${
                        el?.genres[0]?.title ? el?.genres[0]?.title : ''
                    }`,
                )
            } else if (el?.is_megogo) {
                Router.push(
                    `/video-player?id=${el.id}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=megogo&ganre=${
                        filterGenres?.length > 0 ? filterGenres[0]?.title : ''
                    }${
                        el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''
                    }&genre=${
                        filterGenres[0]?.title ? filterGenres[0]?.title : ''
                    }`,
                )
            } else {
                Router.push(
                    `/video-player?key=${el.slug}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }${el?.seconds > 0 ? `&lastTime=${el?.seconds}` : ''}`,
                )
            }
        }
    }

    const checkAccess = () => {
        axios
            .post(`/check-purchase-access?SessionId=${session_id}`, {
                movie_slug: el?.slug,
            })
            .then((res) => {
                if (balance?.balance >= el?.pricing?.substracted_price) {
                    if (!res.data.has_access) {
                        axios
                            .post(`/purchase`, {
                                episode_number: 0,
                                is_serial: el?.is_serial,
                                movie_lang: 'ru',
                                movie_slug: el?.slug,
                                season_number: 0,
                            })
                            .then((res) => {
                                axios
                                    .get('buy-single-movie', {
                                        params: {
                                            SessionId: session_id,
                                            balance_id: balance?.balance_id,
                                            amount: el?.pricing
                                                ?.substracted_price,
                                            user_subscription_id:
                                                res.data.purchase_id,
                                        },
                                    })
                                    .then((res) => {
                                        dispatch(
                                            showAlert(
                                                t('subscription_active_tvod'),
                                                'success',
                                            ),
                                        )
                                        if (res) {
                                            setText(t('watch'))
                                        }
                                    })
                                    .catch((err) => console.log(err))
                            })
                            .catch((err) => console.log(err))
                    } else {
                        Router.push(`/video-player?key=${el?.slug}&ind=0`)
                    }
                } else {
                    dispatch(showAlert(t('enoughFunds'), 'error'))
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        if (el?.duration) {
            let hours = Math.floor(el?.duration / 3600)
            let minutes = Math.floor((el?.duration % 3600) / 60)
            setMovieDuration(
                hours + `${t('hour')}` + ' ' + minutes + `${t('minutes')}`,
            )
        }
    }, [])

    useEffect(() => {
        if (access_token) {
            if (el?.payment_type === 'tvod') {
                axios
                    .post(`/check-purchase-access`, {
                        movie_slug: el?.slug,
                    })
                    .then((res) => {
                        if (res?.data?.has_access) {
                            setText(t('watch'))
                        }
                    })
                    .catch((err) => console.error(err))
            }
        }
    }, [])

    const watchMovie = () => {
        if (access_token) {
            if (el?.payment_type === 'free') {
                handleMovie()
            } else if (el?.payment_type === 'tvod') {
                checkAccess()
            } else if (el?.payment_type === 'svod') {
                if (checkSubscription?.has_access) {
                    handleMovie()
                } else {
                    // Router.push(`/movie/${el?.slug}#payment`)
                    link()
                }
            }
        } else {
            if (el?.is_megogo) {
                Router.push(`/registration?movie=${el?.id}&type=megogo`)
            } else if (el?.is_premier) {
                Router.push(`/registration?movie=${el?.id}&type=premier`)
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        }
    }

    const handlePlay = async () => {
        if (device.os.name === ' ') {
            if (source) {
                if (source?.file_name?.length == 0) {
                    setErrorCase(true)
                } else if (source?.quality === 'original') {
                    setErrorCase(true)
                }
            } else {
                setErrorCase(true)
            }
            // condition for subscription or play
            if (access_token) {
                if (el?.payment_type === 'svod') {
                    if (checkSubscription?.has_access) {
                        player.current.play()
                    } else {
                        if (el?.is_megogo || el?.is_premier) {
                            Router.push(
                                `/movie/${el?.id}?type=${
                                    el?.is_megogo ? 'megogo' : 'premier'
                                }`,
                            )
                        } else {
                            Router.push(`/movie/${el?.slug}#payment`)
                        }
                    }
                } else if (el?.payment_type === 'tvod') {
                    checkAccess()
                } else if (el?.payment_type === 'free') {
                    player?.current?.play()
                }
            } else {
                Router.push(`/registration?movie=${el?.slug}`)
            }
        } else {
            watchMovie()
        }
    }

    function handleOnClickCopy() {
        if (window.navigator.share) {
            window.navigator
                .share({
                    title: '`${postTitle} | ${siteTitle}`',
                    text: `Check out `,
                    url: baseUrl + Router?.asPath,
                })
                .then(() => {
                    console.log('Successfully shared')
                })
                .catch((error) => {
                    console.error(
                        'Something went wrong sharing the blog',
                        error,
                    )
                })
        }
    }

    return (
        <div className="relative">
            <div>
                {el?.trailer && !isMobile && !el?.is_premier ? (
                    <div
                        className={`relative h-[600px] md:h-[100vh] w-full flex justify-center items-center`}
                    >
                        <Player
                            className="player_main_page"
                            aspectratio="true"
                            muted
                            autoPlay
                            playsInline
                            ref={player}
                            fluid={true}
                            poster={
                                el?.is_megogo
                                    ? el?.trailer?.image
                                    : el?.file_info?.image
                            }
                            preload="auto"
                        >
                            <Shortcut clickable={false} />
                            <ControlBar className="control_bar" />
                            <HLSSource
                                isVideoChild
                                src={
                                    sourceTrailer?.src
                                        ? sourceTrailer?.src
                                        : sourceTrailer?.file_name
                                }
                                key={
                                    sourceTrailer?.src
                                        ? sourceTrailer?.src
                                        : sourceTrailer?.file_name || 1
                                }
                            />
                            <BigPlayButton disabled />
                        </Player>
                    </div>
                ) : (
                    <div
                        className={`relative w-full px-[50px] flex justify-center md:justify-start text-center items-end ${
                            isMobile
                                ? router.route !== '/preview/[movie]'
                                    ? 'wrapper min-h-[490px] h-[70vh]'
                                    : 'h-[100vh]'
                                : 'h-[100vh]'
                        }`}
                    >
                        <img
                            className="movies__img--banner h-full px-0 tablet:px-0"
                            src={
                                !el?.is_megogo && !el?.is_premier
                                    ? el?.file_info?.image
                                    : el?.image?.fullscreen
                                    ? el?.image?.fullscreen
                                    : el?.image?.original
                            }
                            alt="img"
                        />
                        <span className="movies__bg--banner h-full px-4 md:px-[50px] tablet:px-24"></span>

                        {windowWidth[0] < 1200 ? (
                            <div
                                onClick={() => handleOnClickCopy()}
                                className="absolute w-[56px] h-[56px] top-0 right-0 rounded-[6px] flex items-center justify-center cursor-pointer"
                            >
                                <ForwardIcon />
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {!router.pathname.includes('/preview') && (
                <div className="text-white z-10 wrapper banner-content mb-0">
                    <div className="mb-2 md:mb-6 text-center md:text-left">
                        {el?.movie_logo_title ? (
                            <img
                                src={el?.movie_logo_title}
                                alt={el?.title}
                                className="h-[65px] object-cover"
                            />
                        ) : (
                            <span className="text-3xl">{el?.title}</span>
                        )}
                    </div>
                    <div className="text-lg font-medium text-[#D5DADD] text-center flex flex-wrap justify-center md:justify-start px-7 md:px-0">
                        {el?.rating_imdb?.rating_imdb && (
                            <span className="text-xl font-semibold text-white mr-2 hidden sm:flex items-center">
                                <IMDBIcon />
                                <span className="ml-[7px]">
                                    {' '}
                                    {el?.rating_imdb?.rating_imdb}
                                </span>
                                <span className="text-[#D5DADD] ml-[5px]">
                                    ·
                                </span>
                            </span>
                        )}
                        {el?.is_megogo && (
                            <span className="text-xl font-semibold text-white mr-2 hidden sm:flex items-center">
                                <IMDBIcon />
                                <span className="ml-[7px]">
                                    {' '}
                                    {el?.rating}{' '}
                                    <span className="text-[#D5DADD] ml-[5px]">
                                        ·
                                    </span>
                                </span>
                            </span>
                        )}
                        {el?.country && (
                            <span className="mr-2">{el?.country} ·</span>
                        )}
                        {el?.release_year > 0 && (
                            <span className="mr-2">{el?.release_year} ·</span>
                        )}
                        {!el?.is_megogo ? (
                            <span>
                                {el?.genres?.length > 0 &&
                                    `${el?.genres[0]?.title}${
                                        el?.genres[1]?.title
                                            ? ', ' + el?.genres[1]?.title
                                            : ''
                                    }`}
                            </span>
                        ) : filterGenres?.length > 0 ? (
                            `${
                                filterGenres[0]?.title
                                    ? filterGenres[0]?.title
                                    : ''
                            },${' '}${
                                filterGenres[1]?.title
                                    ? filterGenres[1]?.title
                                    : ''
                            }`
                        ) : (
                            ''
                        )}
                        {movieDuration && (
                            <span className="mx-2">
                                <span className="ml-0.5 mr-1.5">·</span>
                                {movieDuration}
                            </span>
                        )}
                        {el?.age_restriction ? (
                            <span>
                                <span className="ml-1.5 mr-1.5">·</span>
                                <span className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                    {`${el.age_restriction}+`}
                                </span>
                            </span>
                        ) : (
                            <span>
                                <span className="ml-1.5 mr-1.5">·</span>
                                <span className="ring-1 ring-border-xl ring-[#E9E9E9] px-1 rounded ml-1">
                                    {`0+`}
                                </span>
                            </span>
                        )}
                    </div>
                    {!isMobile && (
                        <div className="text-lg mt-[5px] md:w-1/2">
                            {el?.slogan}
                        </div>
                    )}
                    {!router.pathname.includes('/preview') && (
                        <div className="flex items-end justify-center sm:justify-between">
                            <div className="flex justify-center items-center lg:justify-start mt-5 sm:mt-10 space-x-3 sm:space-x-4">
                                <div className="inline-block">
                                    <MainButton
                                        text={text}
                                        onClick={() => handlePlay()} // watchMovie()
                                        icon={
                                            colorActive ? (
                                                <PlayIcon />
                                            ) : (
                                                <CreditCardIcon
                                                    width="24"
                                                    height="24"
                                                />
                                            )
                                        }
                                        additionalClasses={`${
                                            colorActive
                                                ? 'bg-mainColor bgHoverBlue'
                                                : 'bg-[#D29404] bgHoverYellow'
                                        } h-[42px] md:h-[56px] inline-flex w-full border-2 hover:bg-opacity-[0.6] duration-200 rounded-[8px]`}
                                        margin={'mr-2 md:mr-0'}
                                    />
                                </div>
                                {el?.trailer &&
                                    !isMobile &&
                                    !el?.is_megogo &&
                                    !el?.is_premier && (
                                        <div className="inline-block">
                                            <MainButton
                                                onClick={() =>
                                                    Router.push(
                                                        `/video-player/trailer?key=${el?.slug}&ind=0&currentTime=${currentTime?.current}`,
                                                    )
                                                }
                                                text={t('trailer')}
                                                additionalClasses="bg-[#1C192C] h-[42px] md:h-[56px] inline-flex w-full hover:bg-[#231F36] duration-200 rounded-[8px]"
                                            />
                                        </div>
                                    )}
                                {el?.trailer && el?.is_megogo && !isMobile && (
                                    <div className="inline-block">
                                        <MainButton
                                            onClick={() =>
                                                Router.push(
                                                    `/video-player/trailer?id=${el.id}&ind=0&type=megogo&currentTime=${currentTime?.current}`,
                                                )
                                            }
                                            text={t('trailer')}
                                            additionalClasses="bg-[#1C192C] h-[42px] md:h-[56px] inline-flex w-full hover:bg-[#231F36] duration-200 rounded-[8px]"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`w-[42px] md:w-[56px] h-[42px] md:h-[56px] flex items-center rounded-[8px] group duration-200 ${
                                        like
                                            ? 'bg-[#5086EC] bgHoverBlue'
                                            : 'bg-[#5086EC] md:bg-[#1C192C] bgHoverGrey'
                                    }`}
                                >
                                    <MainButton
                                        margin="group-hover:scale-110 duration-300 md:ml-[4px]"
                                        additionalClasses="rounded-[8px]"
                                        icon={
                                            like ? (
                                                <FavoriteLikeIcon />
                                            ) : (
                                                <FavoriteLikeIconBordered />
                                            )
                                        }
                                        onClick={() => {
                                            setLike((item) => !item)
                                            handleFavourite()
                                        }}
                                    />
                                </div>
                                {windowWidth[0] > 1200 ? (
                                    <div
                                        className={`w-[56px] h-[56px] flex items-center rounded-[6px] group hover:bg-opacity-[0.6] duration-200 bg-[#1C192C] relative bgHoverGrey`}
                                    >
                                        <Button
                                            id="basic-button-single-page"
                                            style={{ cursor: 'pointer' }}
                                            aria-controls={
                                                open ? 'basic-menu' : undefined
                                            }
                                            aria-haspopup="true"
                                            aria-expanded={
                                                open ? 'true' : undefined
                                            }
                                            onClick={(event) => {
                                                handleClick(event)
                                                setStatusCopy(!statusCopy)
                                            }}
                                        >
                                            <ForwardIcon />
                                        </Button>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            MenuListProps={{
                                                'aria-labelledby':
                                                    'basic-button',
                                            }}
                                        >
                                            <div className="w-full h-full bg-[#100E19]">
                                                <div>
                                                    {el && (
                                                        <div className="relative">
                                                            <img
                                                                src={
                                                                    !el?.is_megogo &&
                                                                    !el?.is_premier
                                                                        ? el
                                                                              ?.file_info
                                                                              ?.image
                                                                        : el
                                                                              ?.image
                                                                              ?.fullscreen
                                                                        ? el
                                                                              ?.image
                                                                              ?.fullscreen
                                                                        : el
                                                                              ?.image
                                                                              ?.original
                                                                }
                                                                alt={el?.title}
                                                                className="h-[207px] object-cover w-full"
                                                            />
                                                            <div className="shareButtonImg"></div>
                                                            <span className="text-3xl font-semibold absolute bottom-0 left-0 w-full text-center text-white z-10 ">
                                                                {el?.title}
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
                                                    <div className="bg-[#1C192C] rounded-[12px] mt-3">
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
                                ) : null}
                            </div>
                            {el?.trailer && (
                                <div>
                                    {!el?.is_megogo &&
                                    el?.trailer[0]?.videos[0]?.file_name
                                        ?.length > 0 ? (
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
                                                        onClick={() =>
                                                            Router.push(
                                                                `/video-player/trailer?key=${el?.slug}&ind=0&currentTime=${currentTime?.current}`,
                                                            )
                                                        }
                                                        className="rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer bgHoverGrey"
                                                    >
                                                        <FullScreenIcon />
                                                    </div>
                                                </>
                                            ) : (
                                                <div
                                                    onClick={() => handleLoad()}
                                                    className="rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer"
                                                >
                                                    <ReloadIcon />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {el?.is_megogo && (
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
                                                        onClick={() =>
                                                            Router.push(
                                                                `/video-player/trailer?id=${el.id}&ind=0&type=megogo&currentTime=${currentTime?.current}`,
                                                            )
                                                        }
                                                        className="rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer bgHoverGrey"
                                                    >
                                                        <FullScreenIcon />
                                                    </div>
                                                </>
                                            ) : (
                                                <div
                                                    onClick={() => handleLoad()}
                                                    className="rounded-xl p-[15px] bg-[#1C192C] flex justify-center items-center cursor-pointer"
                                                >
                                                    <ReloadIcon />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
            {device.os.name === 'iOS' && (
                <div>
                    {el?.is_megogo ? (
                        <MobilePlayerIntegration
                            setSource={setSource}
                            source={source}
                            isTrailer={true}
                            player={player}
                            movie={el?.trailer}
                            indNumber={0}
                            setErrorCase={setErrorCase}
                            errorCase={errorCase}
                        />
                    ) : (
                        <MobilePlayer
                            setSource={setSource}
                            setErrorCase={setErrorCase}
                            errorCase={errorCase}
                            source={source}
                            player={player}
                            movie={el}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
