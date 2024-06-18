import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import InputMask from 'react-input-mask'
import { authorization } from 'components/config/firebase-config'
import {
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    getAuth,
} from 'firebase/auth'
import { ArrowLeft, FacebookIcon, GoogleIcon } from 'components/svg'
import { Button, Divider, Typography } from '@material-ui/core'
import cls from './Index.module.scss'
import { useTranslation } from 'i18n'
import axios from '../../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import DeviceDetector from 'device-detector-js'
import { parseCookies, setCookie } from 'nookies'
import { showAlert } from 'store/reducers/alertReducer'
import { Router } from 'i18n'
import { setProfile } from '../../store/actions/application/profileAction'

const LoginForm = ({ setStep, setPhone, setExists, setLoginData, phone }) => {
    const { t } = useTranslation('common')
    const dispatch = useDispatch()
    const deviceDetector = new DeviceDetector()
    const device = deviceDetector.parse(navigator.userAgent)
    const { access_token } = parseCookies()
    const [googleAccaunt, setGoogleAccaunt] = useState({})
    const [facebookAccaunt, setFacebookAccaunt] = useState({})
    const profileValue = useSelector((state) => state.mainProfile.profile_value)
    const { session_id } = parseCookies()

    const signInWithApple = () => {
        const provider = new OAuthProvider('apple.com')
        provider.addScope('email')
        provider.addScope('name')

        provider.setCustomParameters({
            locale: 'en',
        })

        const auth = getAuth()
        signInWithPopup(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user

                // Apple credential
                const credential = OAuthProvider.credentialFromResult(result)
                const accessToken = credential.accessToken
                const idToken = credential.idToken

                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code
                const errorMessage = error.message
                // The email of the user's account used.
                const email = error.email
                // The credential that was used.
                const credential = OAuthProvider.credentialFromError(error)

                // ...
            })
    }

    const postData = (value) => {
        return {
            apple_id: '',
            // id: value?.user?.phoneNumber
            //     ? value?.user?.phoneNumber
            //     : value?.providerId !== 'google.com'
            //     ? value?.user?.uid
            //     : value?.providerId === 'google.com'
            //     ? value?.user?.uid
            //     : '',
            facebook_id:
                value?.providerId !== 'google.com' ? value?.user?.uid : '',
            fcm_token: '',
            google_id:
                value?.providerId === 'google.com' ? value?.user?.uid : '',
            name: value?.user?.displayName,
            phone: value?.user?.phoneNumber ? value?.user?.phoneNumber : '',
            platform_name: `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`,
            platform: 3,
            email: value?.user?.email,
            tag: '',
        }
    }
    const saveCookies = (value) => {
        setCookie({}, 'profile_id', value.profile_id, { path: '/' })
        setCookie({}, 'session_id', value.session_id, {
            path: '/',
        })
        // if (!value.session_status) {
        //     Router.push(`/session-limit-ended?user_id=${value.id}`)
        //     return
        // }
        setCookie({}, 'access_token', value.access_token, {
            path: '/',
        })
        setCookie({}, 'user_id', value.id || value.user_id, {
            path: '/',
        })
        Router.push(Router.query.movie ? `movie/${Router.query.movie}` : '')
        dispatch(showAlert(t('login_alert'), 'success'))
    }

    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(authorization, provider)
            .then((res) => {
                setGoogleAccaunt(res)
            })
            .catch((error) => console.log(error))
    }

    const signInWithFacebook = () => {
        const provider = new FacebookAuthProvider()
        signInWithPopup(authorization, provider)
            .then((res) => setFacebookAccaunt(res))
            .catch((error) => console.log(error))
    }

    useEffect(() => {
        if (googleAccaunt?.operationType === 'signIn') {
            axios
                .get(`/customer/exists?google_id=${googleAccaunt.user?.uid}`)
                .then((res) => {
                    setExists(res.data.exists)
                    if (res.data.exists === true) {
                        axios
                            .post('/customer/login', postData(googleAccaunt))
                            .then((res) => {
                                saveCookies(res?.data)
                                if (!res.data.session_status) {
                                    Router.push(
                                        '/session-limit-ended?status=offline',
                                    )
                                    return
                                }
                                sessionStorage.setItem(
                                    'userActivation',
                                    'false',
                                )
                                Router.push('/')
                            })
                    } else {
                        axios
                            .post('/customer/register', postData(googleAccaunt))
                            .then((res) => {
                                setCookie(
                                    null,
                                    'profile_id',
                                    res?.data?.profile_id,
                                    { path: '/' },
                                )
                                setCookie(
                                    null,
                                    'session_id',
                                    res?.data?.session_id,
                                    {
                                        path: '/',
                                        maxAge: 30 * 24 * 60 * 60,
                                    },
                                )
                                setCookie(
                                    null,
                                    'access_token',
                                    res?.data?.access_token,
                                    {
                                        path: '/',
                                        maxAge: 30 * 24 * 60 * 60,
                                    },
                                )
                                setCookie(null, 'user_id', res?.data?.id, {
                                    path: '/',
                                    maxAge: 30 * 24 * 60 * 60,
                                })
                                setTimeout(() => {
                                    Router.push(
                                        `/profile-settings?id=${res?.data?.profile_id}`,
                                    )
                                }, 500)
                                // Router.push(
                                //     `/profile-settings?id=${
                                //         res?.data?.profile_id
                                //     }${
                                //         Router?.query?.movie
                                //             ? `&movie=${Router?.query?.movie}`
                                //             : ''
                                //     }${
                                //         Router?.query?.type
                                //             ? `&type=${router?.query?.type}`
                                //             : ''
                                //     }${
                                //         Router?.query?.payment
                                //             ? `&payment=true`
                                //             : ''
                                //     }${
                                //         Router?.query?.serial
                                //             ? `&serial=true`
                                //             : ''
                                //     }`,
                                // )
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
        } else if (facebookAccaunt?.operationType === 'signIn') {
            axios
                .get(
                    `/customer/exists?facebook_id=${facebookAccaunt.user?.uid}`,
                )
                .then((res) => {
                    setExists(res.data.exists)
                    if (res.data.exists === true) {
                        axios
                            .post('/customer/login', postData(facebookAccaunt))
                            .then((res) => {
                                saveCookies(res.data)
                                if (!res.data.session_status) {
                                    Router.push(
                                        '/session-limit-ended?status=offline',
                                    )
                                    return
                                }
                                sessionStorage.setItem(
                                    'userActivation',
                                    'false',
                                )
                                Router.push('/')
                            })
                    } else {
                        axios
                            .post(
                                '/customer/register',
                                postData(facebookAccaunt),
                            )
                            .then((res) => {
                                saveCookies(res.data)
                                Router.push('/')
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
        }
    }, [googleAccaunt, facebookAccaunt])

    // const customerProfile = (values) => {
    //     console.log();
    //     if (session_id) {
    //         axios
    //             .get('/customer/profile')
    //             .then((response) => {
    //                 if (response) {
    //                     dispatch(setProfile(response?.data?.customer))
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error(error)
    //             })
    //     }
    // }

    const formik = useFormik({
        initialValues: {
            phone_number: '',
        },

        validationSchema: Yup.object({
            phone_number: Yup.string()
                .min(17, t('invalid_number'))
                .required(t('phone_Number_Required')),
        }),

        onSubmit: (values) => {
            axios
                .get(
                    `/customer/exists?phone=%2B${values.phone_number
                        .replace(/ /g, '')
                        .substring(1, values.phone_number.length)}`,
                )
                .then((res) => {
                    setExists(res.data.exists)
                    setPhone(values.phone_number)
                    if (Router.query.from !== 'profile') {
                        if (res.data.exists === true) {
                            axios.get(
                                `/customer/send-code?phone=%2B${values.phone_number
                                    .replace(/ /g, '')
                                    .substring(1, values.phone_number.length)}`,
                            )
                            setStep('otp')
                        } else {
                            if (values.phone_number) {
                                axios.get(
                                    `/customer/send-code?phone=%2B${values.phone_number
                                        .replace(/ /g, '')
                                        .substring(
                                            1,
                                            values.phone_number.length,
                                        )}`,
                                )
                                setStep('otp')
                            }
                        }
                    } else {
                        if (res.data.exists === true) {
                            dispatch(
                                showAlert(
                                    t('This number is already registered'),
                                    'error',
                                ),
                            )
                        } else {
                            axios.get(
                                `/customer/send-code?phone=%2B${values.phone_number
                                    .replace(/ /g, '')
                                    .substring(1, values.phone_number.length)}`,
                            )
                            setStep('otp')
                        }
                    }
                })
        },
        validateOnChange: false,
        validateOnBlur: false,
    })

    return (
        <div className="relative">
            <button
                onClick={() =>
                    Router.query.from === 'profile'
                        ? Router.push('/settings?from=profile')
                        : Router.push('/')
                }
                className={`hidden md:flex absolute left-[-30px] top-[45px] bg-[#100E19] w-[60px] h-[60px] rounded-full items-center justify-center group z-10 ${cls.backUserButton}`}
            >
                <ArrowLeft
                    width={`22px`}
                    height={`auto`}
                    className="group-hover:scale-125 duration-300"
                />
            </button>
            <form
                autoComplete="off"
                className={cls.form}
                onSubmit={formik.handleSubmit}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: '600',
                        lineHeight: '35px',
                    }}
                    className={cls.formtitle}
                >
                    {Router.query.from !== 'profile'
                        ? t('login')
                        : t('Изменить номер телефона')}
                </h1>
                <div className="relative mt-8 mb-6 grid grid-col-1 gap-2">
                    <label className={cls.label}>{t('enterPhoneNumber')}</label>
                    <InputMask
                        autoFocus
                        mask={`+\\9\\9\\8 99 999 99 99`}
                        maskChar=""
                        type="tel"
                        className={cls.input}
                        name="phone_number"
                        placeholder={t('phone')}
                        onBlur={formik.handleBlur}
                        error={formik.errors.phone_number}
                        touched={formik.touched.phone_number}
                        onChange={formik.handleChange}
                        onKeyPress={(e) => {
                            e.code === 13 && e.preventDefault()
                        }}
                        value={formik.values.phone_number}
                        alwaysShowMask
                    />
                    <p
                        style={{
                            position: 'absolute',
                            bottom: '-28px',
                            color: '#DA1E28',
                        }}
                    >
                        {formik.errors.phone_number}
                    </p>
                </div>
                <button
                    className={`mt-2 w-full h-[48px] sm:h-[56px] text-lg rounded-[12px] font-medium text-white outline-none border-0 ${
                        formik.values.phone_number
                            ? 'bg-[#5086EC] bgHoverBlue'
                            : 'bg-[#fff] text-[#A9A7B4]'
                    }`}
                    type="submit"
                    id="loginButton"
                >
                    <Typography>{t('next')}</Typography>
                </button>
                {Router.query.from !== 'profile' && (
                    <>
                        <div className="hidden md:flex items-center my-6">
                            <Divider width="40%" />
                            <p className="text-center text-[#C6C6C6] text-[15px] leading-[16px] mx-5">
                                {t('or')}
                            </p>
                            <Divider width="40%" />
                        </div>
                        <div className="md:hidden items-center my-6">
                            <p className="text-center text-[#C6C6C6] text-[15px] leading-[16px] mx-5">
                                {t('or enter by the')}
                            </p>
                        </div>
                        <div className={`${cls.integrationbuttons} `}>
                            <button
                                onClick={() => signInWithFacebook()}
                                className={`${cls.btn} mr-3.5 md:mr-0`}
                                type="button"
                            >
                                <FacebookIcon />
                                <p className="hidden md:block ml-2">
                                    {t('sign_Up_Facebook')}
                                </p>
                            </button>
                            <button
                                onClick={() => signInWithGoogle()}
                                className={cls.btn}
                                type="button"
                            >
                                <GoogleIcon />
                                <p className="hidden md:block  ml-2">
                                    {t('sign_Up_Google')}
                                </p>
                            </button>

                            {/* <button
                    onClick={() => signInWithApple()}
                    className={cls.btn}
                    type="submit"
                >
                    <AppleIcon />
                </button> */}
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}

export default LoginForm
