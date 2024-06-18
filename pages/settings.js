import SettingsPage from 'components/pages/settings/SettingsPage'
import SEO from 'components/SEO'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from '../utils/axios'
import { parseCookies, destroyCookie } from 'nookies'
import { setProfilesList } from 'store/actions/application/profilesAction'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { Router } from 'i18n'
import { userBalanceAction } from 'store/actions/application/userBalanceAction'

export default function Settings() {
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const categories = useSelector((state) => state.categories.categories_value)
    const dispatch = useDispatch()
    const notifications = useSelector(
        (state) => state.notification.notification_value,
    )
    const { access_token, session_id } = parseCookies()

    useEffect(() => {
        if (!access_token) {
            window.location.replace('/registration')
        }
        if (profile && !profile.session_status) {
            logout()
        }
    }, [])

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

    const logout = () => {
        axios
            .delete(`/session`, {
                data: {
                    session_id,
                },
            })
            .then((res) => {
                destroyCookie(null, 'profile_id', {
                    path: '/',
                })
                destroyCookie(null, 'access_token', {
                    path: '/',
                })
                destroyCookie(null, 'session_id', {
                    path: '/',
                })
                destroyCookie(null, 'user_id', {
                    path: '/',
                })
                destroyCookie(null, 'next-i18next', {
                    path: '/',
                })
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                Router.push('/')
            })
    }
    return (
        <>
            <SEO />
            <SettingsPage
                profile={profile ? profile : []}
                categories={categories?.categories}
                notifications={notifications}
            />
        </>
    )
}
