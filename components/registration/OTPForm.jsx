import { useEffect, useRef, useState } from 'react'
import { Typography } from '@material-ui/core'
import VerificationInput from 'react-verification-input'
import cls from './Index.module.scss'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import { setCookie } from 'nookies'
import { useDispatch } from 'react-redux'
import { parseCookies } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import DeviceDetector from 'device-detector-js'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Lottie from 'lottie-web'
import { Router } from 'i18n'
import { setRecommendationValue } from 'store/actions/application/recommendationActions'
import { useSelector } from 'react-redux'
import router from 'next/router'
import NullData from 'components/errorPopup/NullData'
import { SuccessSybscriptionIcon } from 'components/svg'

export default function OTPForm({
    setStep,
    phone_nmbr,
    exists,
    ProfileID,
    setOtpData,
    from,
}) {
    const { t } = useTranslation()
    const [errBorder, setErrBorder] = useState(false)
    const [time, setTime] = useState(60)
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState('')
    const [device, setDevice] = useState(null)
    const dispatch = useDispatch()
    const [isDisable, setIsDisable] = useState(true)
    const [error, setError] = useState(false)
    const loadingAnimation = useRef(null)
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id } = parseCookies()
    const [tvCodeEnteredSuccessfull, setTvCodeSuccess] = useState(false)
    // const onBlur = () => otp.length !== 6 && setErrBorder(true)
    const resendOtp = () => {
        axios.get(
            `/customer/send-code?phone=%2B${phone_nmbr
                .replace(/ /g, '')
                .substring(1, phone_nmbr.length)}`,
        )
    }

    useEffect(() => {
        if (loading)
            Lottie.loadAnimation({
                container: loadingAnimation.current,
                renderer: 'svg',
                autoplay: true,
                animationData: require('../../public/data.json'),
            })
    }, [loading])

    useEffect(() => {
        if (!device) {
            const deviceDetector = new DeviceDetector()
            const d = deviceDetector.parse(navigator.userAgent)
            setDevice(d)
        }
    }, [device])
    useEffect(() => {
        const timer = () => {
            setTime((prev) => prev - 1)
        }
        let interval = setTimeout(() => {
            timer()
        }, 1000)
        if (time === 0) {
            clearTimeout(interval)
        }
    }, [time])

    const submitOtp = (e) => {
        e && e.preventDefault()
        setIsDisable(true)
        if (!Router.query.from) {
            if (exists) {
                axios
                    .post('/customer/check-code', {
                        code: otp,
                        phone: phone_nmbr.replace(/ /g, ''),
                        platform_name:
                            device.device.brand === ''
                                ? `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`
                                : `${device.device.brand} ${device.device.model} | ${device.client.name} ${device.client.version}`,
                    })
                    .then((res) => {
                        setCookie(null, 'profile_id', res?.data?.profile_id, {
                            path: '/',
                        })
                        setCookie(null, 'session_id', res.data.session_id, {
                            path: '/',
                            maxAge: 30 * 24 * 60 * 60,
                        })
                        setCookie(null, 'access_token', res.data.access_token, {
                            path: '/',
                            maxAge: 30 * 24 * 60 * 60,
                        })
                        setCookie(null, 'user_id', res.data.id, {
                            path: '/',
                            maxAge: 30 * 24 * 60 * 60,
                        })

                        if (!res.data.session_status) {
                            setCookie(null, 'session_status', 'false', {
                                path: '/',
                            })
                            Router.push('/session-limit-ended?status=offline')
                            return
                        }

                        if (exists) {
                            axios
                                .get(`/profiles/${res?.data?.profile_id}`)
                                .then((response) => {
                                    dispatch(
                                        setRecommendationValue(response?.data),
                                    )

                                    setLoading(true)
                                    sessionStorage.setItem(
                                        'userActivation',
                                        'false',
                                    )
                                    setTimeout(() => {
                                        if (router.query?.movie) {
                                            if (
                                                router?.query?.type === 'megogo'
                                            ) {
                                                Router.push(
                                                    `/movie/${Router.query.movie}?type=megogo`,
                                                )
                                            } else if (
                                                Router?.query?.type ===
                                                'premier'
                                            ) {
                                                Router.push(
                                                    `/movie/${Router.query.movie}?type=premier`,
                                                )
                                            } else {
                                                Router.push(
                                                    `movie/${Router.query.movie}`,
                                                )
                                            }
                                        } else {
                                            router.push('/')
                                        }
                                    }, 500)
                                })
                                .catch((err) => {
                                    console.log(err)
                                })
                                .finally(() => {
                                    dispatch(
                                        showAlert(t('login_alert'), 'success'),
                                    )
                                })
                        } else {
                            Router.push(
                                `/profile-settings?id=${ProfileID}${
                                    Router?.query?.movie
                                        ? `&movie=${Router?.query?.movie}`
                                        : ''
                                }${
                                    router?.query?.type
                                        ? `&type=${router?.query?.type}`
                                        : ''
                                }${
                                    router?.query?.from === 'banner'
                                        ? `&from=banner`
                                        : ''
                                }`,
                            )
                            // setStep('addUser')
                        }
                    })
                    .catch((err) => {
                        setErrBorder(true)
                        setIsDisable(true)
                        setError(true)
                    })
            } else {
                axios
                    .post(`/customer/check-otp`, {
                        code: otp,
                        phone: phone_nmbr.replace(/ /g, ''),
                        platform_name:
                            device.device.brand === ''
                                ? `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`
                                : `${device.device.brand} ${device.device.model} | ${device.client.name} ${device.client.version}`,
                    })
                    .then((response) => {
                        if (response) {
                            setOtpData(response.data)
                            setStep('addUser')
                        }
                    })
                    .catch((error) => {
                        setErrBorder(true)
                        setIsDisable(true)
                        setError(true)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        } else {
            if (router?.query?.from === 'codeTv') {
                axios
                    .put(`customer/update-tv-code`, {
                        code: otp,
                        facebook_id: '',
                        google_id: '',
                        phone: profile?.phone,
                    })
                    .then((res) => {
                        if (res?.status === 200) {
                            setTvCodeSuccess(true)
                        }
                    })
                    .catch((error) => {
                        setErrBorder(true)
                        setError(true)
                        setIsDisable(true)
                    })
            } else {
                axios
                    .put('/customer/check-code-update', {
                        code: otp,
                        newPhone: phone_nmbr.replace(/ /g, ''),
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            Router.replace(
                                `/settings?from=${Router.query.from}`,
                            )
                        }
                    })
                    .catch((err) => {
                        setErrBorder(true)
                        setError(true)
                        setIsDisable(true)
                    })
                    .finally(() => {
                        dispatch(
                            showAlert(
                                t(
                                    'Rewrite the password or click the send code button again',
                                ),
                                'error',
                            ),
                        )
                        setError(false)
                        setErrBorder(false)
                        setIsDisable(false)
                    })
            }
        }
    }
    useEffect(() => {
        setTimeout(() => {
            if (otp.length === 6) {
                setIsDisable(false)
                submitOtp()
            } else {
                setIsDisable(true)
                setError(false)
            }
        }, 500)
    }, [otp])

    const redirectBack = () => {
        if (router?.query?.from === 'codeTv') {
            router.push('settings?from=profile')
        } else {
            setErrBorder(false)
            setStep('login')
        }
    }

    return (
        <>
            <div className={cls.formotp}>
                <p className="text-12 leading-14 font-semibold md:text-14 md:leading-17">
                    {t('enter_code')}
                </p>
                <div className="hidden md:block">
                    {loading ? null : (
                        <button
                            onClick={() => redirectBack()}
                            className={`hidden md:flex absolute left-[-25px] top-[45px] bg-[#100E19] w-[50px] h-[50px] rounded-full items-center justify-center group z-10 ${cls.backUserButton}`}
                        >
                            <ArrowBackIcon
                                className={`group-hover:scale-110 duration-300 ${cls.ArrowBackIcon}`}
                            />
                        </button>
                    )}
                </div>
                <form onSubmit={submitOtp}>
                    <div className="mt-[6px] mb-6 grid grid-col-1 gap-1">
                        {from == 'codeTv' && (
                            <Typography className={cls.contenttext}>
                                {t('content_in_otp')}
                                {phone_nmbr}
                            </Typography>
                        )}
                        <div className={cls.otpconfirm}>
                            <VerificationInput
                                length={6}
                                autoFocus
                                placeholder=""
                                type="tel"
                                validChars="/^\d+$/"
                                onChange={(e) => {
                                    setOtp(e), setErrBorder(false)
                                }}
                                onFocus={() => setErrBorder(false)}
                                classNames={{
                                    container: cls.container,
                                    character: errBorder
                                        ? cls.nofocus
                                        : cls.character,
                                    characterInactive: cls.character__inactive,
                                    characterSelected:
                                        !errBorder && cls.character__selected,
                                }}
                            />
                        </div>
                        {error && (
                            <Typography className="text-[#D31919] text-[15px] mt-3">
                                {t('error_Register_Code')}
                            </Typography>
                        )}
                    </div>
                    {router?.query?.from !== 'codeTv' && (
                        <div>
                            {time <= 0 ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrBorder(false)
                                        setError(false)
                                        resendOtp()
                                        setTime(60)
                                    }}
                                    className={cls.resendotp}
                                >
                                    {t('send_Register_code')}
                                </button>
                            ) : (
                                <div className={cls.time}>
                                    <p>00:{time < 10 ? `0${time}` : time}</p>
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isDisable}
                                className={
                                    isDisable ? cls.disable : cls.buttonsubmit
                                }
                            >
                                {t('next')}
                            </button>
                        </div>
                    )}
                </form>
                {loading && (
                    <div className={cls.loading} ref={loadingAnimation} />
                )}
            </div>

            {tvCodeEnteredSuccessfull && (
                <div className="absolute top-0 left-0 w-full h-full bg-[#100e19] z-[999] flex items-center">
                    <NullData
                        icon={<SuccessSybscriptionIcon fill="#119C2B" />}
                        title={t('youEnteredTrueCode')}
                        text={t('watchMovieOnBigScreen')}
                        textButton={t('backToProfile')}
                        link={() => router.push('settings?from=profile')}
                    />
                </div>
            )}
        </>
    )
}
