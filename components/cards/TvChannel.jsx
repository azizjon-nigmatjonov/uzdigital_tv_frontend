import { useState, useRef } from 'react'
import LinearProgress, {
    linearProgressClasses,
} from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { parseCookies } from 'nookies'
import DeviceDetector from 'device-detector-js'
import router from 'next/router'
import axios from '../../utils/axios'
import { useEffect } from 'react'
import MobilePlayer from 'components/PlayerForVideo/MobilePlayer'
import { useTranslation } from 'i18n'
import ErrorPopup from 'components/errorPopup/Popup'
import { ExpredIcon } from 'components/svg'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 4,
    borderRadius: 8,
    width: '100%',
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor:
            theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: '#5086EC',
    },
}))

const TvChannel = ({ imgSrc, title = '10 : 00', info, addClass = '', el }) => {
    const { t } = useTranslation()
    const program_time = Math.round(el?.passed_percentage)
    const MINUTES = el?.reminded_time //some integer
    let m = MINUTES % 60
    let h = (MINUTES - m) / 60
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }

    const { access_token } = parseCookies()
    const player = useRef(null)

    const [errorCase, setErrorCase] = useState(false)
    const [source, setSource] = useState({})

    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const [checkSubscription, setCheckSubscription] = useState({})
    const [expired, setExpired] = useState(false)
    const [subscription, setSubscription] = useState([])
    const TV_Player = { ...el, is_channel: true }

    const getData = async () => {
        if (access_token) {
            axios
                .get(`/tv/channel/${el?.id}`, {
                    Authorization: access_token,
                })
                .then((res) => {
                    if (res?.data?.payment_type === 'svod') {
                        axios
                            .post(
                                `check-subscription-access`,
                                {
                                    key: 'tv',
                                },
                                { Authorization: access_token },
                            )
                            .then((res) => {
                                setCheckSubscription(res?.data)

                                if (res.data.has_access) {
                                    ;('')
                                } else {
                                    axios
                                        .get(`subscription/category?key=tv`)
                                        .then((res) => {
                                            setSubscription(res.data.categories)
                                        })
                                }
                            })
                    }
                })
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        getData()
    }, [])

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
                    }
                } else if (el?.payment_type === 'tvod') {
                    // checkAccess()
                } else if (el?.payment_type === 'free') {
                    player.current.play()
                }
            } else {
                router.push(`/registration?movie=${el?.slug}`)
            }
        } else {
            watchMovie()
        }
    }

    const watchMovie = () => {
        if (access_token) {
            if (el?.payment_type === 'free') {
                handleMovie()
            } else if (el?.payment_type === 'tvod') {
                // checkAccess()
                console.log(`tvod doesn't work in tv`)
            } else if (el?.payment_type === 'svod') {
                if (
                    checkSubscription?.has_access ||
                    subscription?.length === 0
                ) {
                    handleMovie()
                } else {
                    setExpired(true)
                    if (
                        checkSubscription.message === '' &&
                        checkSubscription.is_watched_free_trial === false
                    ) {
                        window.location.replace(
                            `/settings?from=subscription&key=tv&freeTrial=false&tvPlay=${el.id}`,
                        )
                    }
                    // window.location.replace(`/tv/channel?id=${el?.id}#payment`)
                    // window.location.replace(`/settings?from=subscription&key=tv`)
                }
            }
        } else {
            router.push(`/registration`)
        }
    }

    const handleMovie = () => {
        router.push(`/tv/tv-video?key=${el.id}`)
    }
    return (
        <>
            <div
                onClick={() => handlePlay()}
                className={`cursor-pointer w-full bg-[#1C192C] rounded-[12px] duration-300 hover:scale-105 p-5 ${addClass}`}
                id="tvChannel"
            >
                <a>
                    <div className="flex items-center h-[100px]">
                        <div
                            className={`relative h-[64px] w-[64px] ${
                                !imgSrc && 'profileImageUser'
                            }`}
                        >
                            {imgSrc && (
                                <img
                                    className="rounded-full object-cover h-[64px] w-[64px]"
                                    src={imgSrc}
                                    layout="fill"
                                    alt="img"
                                />
                            )}
                        </div>
                        <div className="ml-4 flex flex-col w-[70%] overflow-hidden">
                            <span className="text-[17px] sm:text-[18px] font-normal text-white">
                                {title}
                            </span>

                            <span className="text-[17px] text-white text-opacity-[0.5] font-normal my-[4px] h-[50px] overflow-hidden">
                                {info.substring(0, 35)}
                                {`${info.length > 35 ? '...' : ''}`}
                            </span>

                            {el?.payment_type === 'free' ? (
                                <span className="text-[#119C2B]">
                                    {t('free')}
                                </span>
                            ) : (
                                <span className="text-[#4589FF]">
                                    {t('svod')}
                                </span>
                            )}
                        </div>
                    </div>
                </a>
            </div>
            {checkSubscription.has_access === false &&
                checkSubscription.is_watched_free_trial &&
                checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                expired && (
                    <ErrorPopup
                        openModal={expired}
                        setOpenModal={setExpired}
                        link={() => {
                            setExpired(false)
                            setTimeout(() => {
                                window.location.replace(
                                    `/settings?from=subscription&key=tv&subscriptionId=${checkSubscription?.subscription_id}&tvPlay=${el?.id}`,
                                )
                            }, 100)
                        }}
                        title={t('expired')}
                        textButton={`${t('activate')} `}
                        text={t('expired_text')}
                        icon={<ExpredIcon />}
                    />
                )}
            {checkSubscription.has_access === false &&
                checkSubscription.is_watched_free_trial &&
                checkSubscription?.message === 'INACTIVE' &&
                expired && (
                    <ErrorPopup
                        openModal={expired}
                        setOpenModal={setExpired}
                        link={() => {
                            setExpired(false)
                            setTimeout(() => {
                                window.location.replace(
                                    `/settings?from=subscription&key=tv&tvPlay=${el?.id}&message=INACTIVE`,
                                )
                            }, 100)
                        }}
                        title={t('expired')}
                        textButton={t('activate')}
                        text={t('expired_follow')}
                        icon={<ExpredIcon />}
                    />
                )}
            {device.os.name === '' && (
                <MobilePlayer
                    setSource={setSource}
                    setErrorCase={setErrorCase}
                    errorCase={errorCase}
                    source={source}
                    player={player}
                    movie={TV_Player}
                />
            )}
        </>
    )
}

export default TvChannel
