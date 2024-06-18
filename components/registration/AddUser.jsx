import { useState, useEffect } from 'react'
import { useTranslation } from 'i18n'
import TextInput from 'components/form/input/TextInput'
import { useFormik } from 'formik'
import validateForm from 'utils/validateForm'
import * as Yup from 'yup'
import cls from './Index.module.scss'
import axios from '../../utils/axios'
import router from 'next/router'
import { Router } from 'i18n'
import DeviceDetector from 'device-detector-js'
import {
    ArrowBackUserIcon,
    CheckboxIconUnchecked,
    CheckboxIconChecked,
} from '../svg.js'
import { useSelector, useDispatch } from 'react-redux'
import { setCookie } from 'nookies'
import { setProfileType } from 'store/actions/application/profileAction'

const AddUserForm = ({
    setStep,
    phoneNumber,
    setChildrenName,
    setProfileID,
    otpData,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const routerFrom = router.router.query.from
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const [device, setDevice] = useState(null)

    const profileType = useSelector((state) => state.mainProfile.profile_type)
    const handleCheckbox = () => {
        if (profileType === 'adult') {
            dispatch(setProfileType('children'))
        } else {
            dispatch(setProfileType('adult'))
        }
    }

    useEffect(() => {
        if (!device) {
            const deviceDetector = new DeviceDetector()
            const d = deviceDetector.parse(navigator.userAgent)
            setDevice(d)
        }
    }, [device])

    const formik = useFormik({
        initialValues: {
            name: '',
            pic: '',
        },

        validationSchema: Yup.object({
            name: validateForm('name', t),
        }),
        onSubmit: (values) => {
            if (routerFrom !== 'profileCreate') {
                axios
                    .post('/customer/register', {
                        apple_id: '',
                        facebook_id: '',
                        fcm_token: '',
                        google_id: '',
                        name: values.name,
                        phone: otpData.phone.replace(/ /g, ''),
                        platform: 0,
                        tag: '',
                    })
                    .then((res) => {
                        setProfileID(res?.data?.profile_id)
                        if (res) {
                            axios
                                .post('/customer/check-code', {
                                    code: otpData.code,
                                    phone: otpData.phone.replace(/ /g, ''),
                                    platform_name:
                                        device.device.brand === ''
                                            ? `${device.os.name} ${device.os.platform} | ${device.client.name} ${device.client.version}`
                                            : `${device.device.brand} ${device.device.model} | ${device.client.name} ${device.client.version}`,
                                })
                                .then((response) => {
                                    if (response) {
                                        setCookie(
                                            null,
                                            'profile_id',
                                            res?.data?.profile_id,
                                            { path: '/' },
                                        )
                                        setCookie(
                                            null,
                                            'session_id',
                                            response.data.session_id,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        setCookie(
                                            null,
                                            'access_token',
                                            response.data.access_token,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        setCookie(
                                            null,
                                            'user_id',
                                            response.data.id,
                                            {
                                                path: '/',
                                                maxAge: 30 * 24 * 60 * 60,
                                            },
                                        )
                                        // Router.push(
                                        //     `/profile-settings?id=${res?.data?.profile_id}`,
                                        // )
                                        Router.push(
                                            `/profile-settings?id=${
                                                res?.data?.profile_id
                                            }${
                                                Router?.query?.movie
                                                    ? `&movie=${Router?.query?.movie}`
                                                    : ''
                                            }${
                                                router?.query?.type
                                                    ? `&type=${router?.query?.type}`
                                                    : ''
                                            }${
                                                router?.query?.payment
                                                    ? `&payment=true`
                                                    : ''
                                            }${
                                                router?.query?.serial
                                                    ? `&serial=true`
                                                    : ''
                                            }`,
                                        )
                                    }
                                })
                                .catch((err) => {
                                    console.error(err)
                                })
                        }
                    })
            } else {
                if (ProfilesList?.profile_limit === ProfilesList?.count) {
                    console.error(`You can't add a new profile`)
                } else {
                    if (profileType === 'adult') {
                        axios
                            .post('/profile', {
                                name: values.name,
                                profile_age: 0,
                                profile_type: profileType,
                            })
                            .then((res) => {
                                // Router.push(
                                //     `/profile-settings?id=${res?.data?.id}`,
                                // )
                                Router.push(
                                    `/profile-settings?id=${res?.data?.id}${
                                        Router?.query?.movie
                                            ? `&movie=${Router?.query?.movie}`
                                            : ''
                                    }${
                                        router?.query?.type
                                            ? `&type=${router?.query?.type}`
                                            : ''
                                    }${
                                        router?.query?.payment
                                            ? `&payment=true`
                                            : ''
                                    }${
                                        router?.query?.serial
                                            ? `&serial=true`
                                            : ''
                                    }`,
                                )
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        setChildrenName(values.name)
                        setStep('children')
                    }
                }
            }
        },
    })

    return (
        <div className="relative ">
            <button
                onClick={() => router.back()}
                className={`hidden md:flex absolute left-[-30px] top-[45px] bg-[#100E19] w-[60px] h-[60px] rounded-full items-center justify-center group z-[1] ${cls.backUserButton}`}
            >
                <ArrowBackUserIcon />
            </button>
            <form
                autoComplete="off"
                className={`${cls.formChooseUser} w-[400px]`}
                onSubmit={formik.handleSubmit}
            >
                <div>
                    <h1 className="text-[28px] font-medium leading-[35px]">
                        {t('name?')}
                    </h1>
                    <div className="mt-4 mb-4 grid grid-col-1 gap-4">
                        <TextInput
                            className={cls.input}
                            name="name"
                            required={true}
                            placeholder={
                                routerFrom === 'profileCreate'
                                    ? t('write_new_user_name')
                                    : t('write name')
                            }
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.name}
                            touched={formik.touched.name}
                            type="text"
                        />
                    </div>
                    {routerFrom === 'profileCreate' && (
                        <div>
                            <div
                                onClick={() => handleCheckbox()}
                                className="flex items-center space-x-[13px] cursor-pointer font-medium"
                            >
                                {profileType === 'adult' ? (
                                    <CheckboxIconUnchecked />
                                ) : (
                                    <CheckboxIconChecked />
                                )}
                                <p>{t('child profile')}</p>
                            </div>
                            {profileType === 'children' && (
                                <p className="text-[#A9A7B4] mt-[8px] ml-9">
                                    {t('checkbox info')}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end flex-col mt-5">
                    <button className={cls.buttonsubmit} type="submit">
                        {t('login')}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddUserForm
