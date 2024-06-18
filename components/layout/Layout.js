import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import Header from 'components/header/Header'
import { useEffect, useState } from 'react'
import Splash from 'components/Splash/Splash'
import { motion } from 'framer-motion'
import HeaderSearch from '../search/HeaderSearch'
import { useSelector, useDispatch } from 'react-redux'
const Footer = dynamic(() => import('../footer/Footer'))
import { parseCookies } from 'nookies'
import axios from '../../utils/axios'
import { setCategorisValue } from 'store/actions/application/categoriesActions'
import {
    setNotification,
    setNotificationUnread,
} from 'store/actions/application/notificationAction'
import { useTranslation } from 'i18n'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { userBalanceAction } from 'store/actions/application/userBalanceAction'
import SEO from 'components/SEO'

export default function Layout({ children, profile }) {
    const noHeaderRoutes = [
        '/registration',
        '/verify-code',
        '/change-password',
        '/stories',
        '/video-player',
        '/video-player/trailer',
        '/video',
        '/tv/tv-video',
        '/404',
        '/_error',
        '/500',
        '/session-limit-ended',
        '/session-limit-ended/upgrate-tarif',
        '/session-limit-ended/remove-users',
        '/profile-settings',
        '/profiles',
        '/test-chanel',
    ]
    const noFooterOnly = [
        '/preview/[movie]',
        '/registration',
        '/verify-code',
        '/change-password',
        '/stories',
        '/video-player',
        '/video-player/trailer',
        '/video',
        '/tv/tv-video',
        '/404',
        '/_error',
        '/500',
        '/session-limit-ended',
        '/session-limit-ended/upgrate-tarif',
        '/session-limit-ended/remove-users',
        '/profile-settings',
        '/profiles',
        '/test-chanel',
    ]
    const { i18n } = useTranslation()
    const router = useRouter()
    const dispatch = useDispatch()
    const [splash, setSplash] = useState(true)
    const categories = useSelector((state) => state.categories.categories_value)
    const setSearch = useSelector((state) => state.searchReducer.set_search)
    const notifications = useSelector(
        (state) => state.notification.notification_value,
    )
    const notificationsUnread = useSelector(
        (state) => state.notification.notification_unread_value,
    )
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const { session_id } = parseCookies()

    useEffect(() => {
        if (session_id) {
            axios
                .get('user-balance', {
                    SessionId: session_id,
                })
                .then((res) => {
                    dispatch(userBalanceAction(res?.data))
                })
                .catch((err) => {
                    console.log('err1', err)
                })
        }
    }, [])
    useEffect(() => {
        setTimeout(() => {
            setSplash(false), 1500
            sessionStorage.setItem('splashTime', 'not_available')
        })
    }, [])

    useEffect(() => {
        if (session_id) {
            if (!ProfilesList) {
                axios
                    .get('/profiles', {
                        headers: {
                            SessionId: session_id,
                        },
                    })
                    .then((res) => {
                        dispatch(setProfilesList(res?.data ? res?.data : null))
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }, [session_id, ProfilesList])

    useEffect(() => {
        if (session_id) {
            axios
                .get('user-notifications?page=1&limit=100')
                .then((response) => {
                    if (response) {
                        dispatch(setNotification(response.data))
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [])

    useEffect(() => {
        if (i18n?.language) {
            axios
                .get(`categories?lang=${i18n.language}`)
                .then((response) => {
                    if (response) {
                        dispatch(setCategorisValue(response.data))
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [i18n?.language])

    useEffect(() => {
        if (session_id) {
            axios
                .get('user-unread-notification-count')
                .then((response) => {
                    if (response) {
                        dispatch(setNotificationUnread(response.data?.count))
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [])

    const splashTime = sessionStorage.getItem('splashTime')

    return (
        <>
            <SEO />
            <div id="main_container" className="bg-mainBG">
                {splashTime !== 'not_available' && splash ? (
                    <Splash />
                ) : (
                    <>
                        {!noHeaderRoutes.includes(router.pathname) && (
                            <Header
                                profile={profile}
                                categories={categories?.categories || []}
                                notifications={notifications || {}}
                                notificationsUnread={notificationsUnread}
                            />
                        )}
                        {!setSearch ? (
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{
                                    duration: 0.3,
                                    ease: [0.6, 0.01, -0.05, 0.9],
                                }}
                            >
                                <div>{children}</div>
                            </motion.div>
                        ) : (
                            <HeaderSearch />
                        )}
                        {!setSearch &&
                        !noFooterOnly.includes(router.pathname) ? (
                            <Footer categories={categories?.categories || []} />
                        ) : (
                            ''
                        )}
                    </>
                )}
            </div>
        </>
    )
}
