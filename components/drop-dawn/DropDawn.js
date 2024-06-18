import { Router } from 'i18n'
import { destroyCookie, parseCookies } from 'nookies'
import React, { useState, useEffect } from 'react'
import dropStyle from './DropDawn.module.scss'
import { useTranslation } from 'i18n'
import {
    LogoutIcon,
    PlusIconWhite,
    CheckIcon,
    ProfileImgChange,
} from 'components/svg'
import axios from 'utils/axios'
import InfoModal from 'components/modal/InfoModal'
import { Link } from 'i18n'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useDispatch, useSelector } from 'react-redux'
import {
    setRecommendationValue,
    setRecommendationActivator,
} from 'store/actions/application/recommendationActions'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { setProfile } from 'store/actions/application/profileAction'

function DropDawn() {
    const { t } = useTranslation()
    const { session_id } = parseCookies()
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const dispatch = useDispatch()

    const profiles = ProfilesList?.profiles
    useEffect(() => {
        if (profiles) {
            for (let i = 0; i < profiles?.length; i++) {
                if (profiles[i].is_main) {
                    let saver = profiles[0]
                    profiles[0] = profiles[i]
                    profiles[i] = saver
                    return
                }
            }
        }
    }, [profiles])

    // useEffect(() => {
    //     axios
    //         .get('/profiles', {
    //             headers: {
    //                 SessionId: session_id,
    //             },
    //         })
    //         .then((res) => {
    //             dispatch(setProfilesList(res?.data ? res?.data : null))
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }, [])

    const [open, setOpen] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)
    const openModal = Boolean(anchorEl)

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const logout = () => {
        axios
            .delete(`/session`, {
                data: {
                    session_id,
                },
            })
            .then((res) => {
                destroyCookie(null, 'megogo_token', {
                    path: '/',
                })
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
                dispatch(setProfile(null))
                dispatch(setProfilesList(null))
                dispatch(setRecommendationValue(null))
                dispatch(setRecommendationActivator(false))
                sessionStorage.removeItem('listSelected')
                sessionStorage.removeItem('userActivation')
                window.localStorage.removeItem('idImageUpload')
                Router.push('/')
            })
    }

    const getMovieData = (ID) => {
        axios
            .get(`/profiles/${ID}`)
            .then((res) => {
                dispatch(setRecommendationValue(res?.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className={dropStyle.drop}>
            <button
                onClick={handleClick}
                type="button"
                className={dropStyle.drop__btn}
            >
                {CurrentUserData && !CurrentUserData?.is_main ? (
                    <img
                        className={dropStyle.drop__img}
                        src={
                            CurrentUserData?.profile_type === 'children' &&
                            CurrentUserData?.profile_image === ''
                                ? '../vectors/childrenProfile.svg'
                                : CurrentUserData?.profile_image
                                ? CurrentUserData.profile_image
                                : '../vectors/movie-image-vector-user.svg'
                        }
                        alt="avatar"
                    />
                ) : (
                    <img
                        className={dropStyle.drop__img}
                        src={
                            profile?.avatar
                                ? profile.avatar
                                : CurrentUserData?.profile_image
                                ? CurrentUserData?.profile_image
                                : '../vectors/movie-image-vector.svg'
                        }
                        alt="avatar"
                    />
                )}
                {!profile?.avatar && !CurrentUserData && (
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-xl uppercase">
                        {profile?.profile_type === 'children'
                            ? t('child')
                            : profile?.name?.trim()?.substr(0, 1)}
                    </div>
                )}
                {CurrentUserData && !CurrentUserData?.profile_image && (
                    <div
                        className={`absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 ${
                            CurrentUserData?.profile_type === 'children'
                                ? 'text-[12px]'
                                : 'uppercase text-[xl]'
                        }`}
                    >
                        {CurrentUserData?.profile_type === 'children'
                            ? t('child')
                            : CurrentUserData?.name?.trim().substr(0, 1)}
                    </div>
                )}
            </button>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openModal}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 2.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: '-11px',
                            right: 14,
                            width: 0,
                            height: 0,
                            bgcolor: 'transparent',
                            zIndex: -1,
                            border: '8px solid transparent',
                            borderTop: '0',
                            borderBottom: '11px solid #1C192C',
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {profiles?.length > 0 ? (
                    <div>
                        {profiles?.map((item) => (
                            <div key={item?.id}>
                                <MenuItem onClick={handleClose}>
                                    <a
                                        onClick={() => getMovieData(item?.id)}
                                        className="relative"
                                    >
                                        {CurrentUserData?.id === item?.id && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <CheckIcon
                                                    width="15px"
                                                    height="12px"
                                                />
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-[12px] min-w-[260px] max-w-[260px]">
                                            <div
                                                className={`w-[40px] h-[40px] rounded-[12px] flex items-center justify-center overflow-hidden font-[600] text-xl relative ${
                                                    item?.profile_image
                                                        ? ''
                                                        : item.is_main
                                                        ? 'profileImage'
                                                        : 'profileImageUser'
                                                }`}
                                            >
                                                {item?.profile_type ===
                                                    'children' ||
                                                item?.profile_image ? (
                                                    <img
                                                        className="w-full h-full object-cover"
                                                        src={
                                                            item?.profile_type ===
                                                                'children' &&
                                                            item?.profile_image ===
                                                                ''
                                                                ? '../vectors/childrenProfile.svg'
                                                                : item?.profile_image
                                                        }
                                                        alt="avatar"
                                                    />
                                                ) : (
                                                    <div className="uppercase">
                                                        {item?.name
                                                            ?.trim()
                                                            .substr(0, 1)}
                                                    </div>
                                                )}
                                                {item?.profile_type ===
                                                    'children' &&
                                                    !item?.profile_image && (
                                                        <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 text-[12px]">
                                                            {t('child')}
                                                        </div>
                                                    )}
                                            </div>
                                            <h3 className="max-w-[160px] overflow-hidden">
                                                {item?.name}
                                            </h3>
                                        </div>
                                    </a>
                                </MenuItem>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <MenuItem onClick={handleClose}>
                            <a onClick={() => getMovieData(profile?.id)}>
                                <div className="flex items-center space-x-[12px] min-w-[260px]">
                                    <div className="w-[40px] h-[40px] overflow-hidden rounded-[12px] flex items-center justify-center uppercase font-[600] text-xl">
                                        <img
                                            className="w-full h-full object-cover"
                                            src={
                                                profile?.profile_type ===
                                                    'children' &&
                                                profile?.profile_image === ''
                                                    ? '../vectors/childrenProfile.svg'
                                                    : profile?.avatar
                                                    ? profile?.avatar
                                                    : '../vectors/movie-image-vector.svg'
                                            }
                                            alt="profile.avatar"
                                        />
                                    </div>
                                    <h3>{profile?.name}</h3>
                                </div>
                                <div className="w-[75%] h-[1px] bg-[#fff] bg-opacity-[0.12] ml-auto"></div>
                            </a>
                        </MenuItem>
                    </div>
                )}
                {ProfilesList?.profile_limit !== ProfilesList?.count && (
                    <MenuItem onClick={handleClose}>
                        <Link href="/registration?from=profileCreate">
                            <a className="flex items-center space-x-[12px] min-w-[260px]">
                                <div className="w-[40px] h-[40px] bg-[#383641] rounded-[12px] flex items-center justify-center">
                                    <PlusIconWhite width="18px" height="18px" />
                                </div>
                                <h3>{t('add')}</h3>
                            </a>
                        </Link>
                    </MenuItem>
                )}
                <div className="px-[24px] w-full h-[1px] bg-[#fff] bg-opacity-[0.12] my-[6px]"></div>
                <MenuItem onClick={handleClose}>
                    <Link href="/settings?from=favourite">
                        <a>
                            <h4 className="py-[6px]">{t('favourite')}</h4>
                        </a>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/settings?from=profile">
                        <a className="flex items-center space-x-[12px]">
                            {/* <div className="w-[40px] h-[40px] bg-[#383641] rounded-[12px] flex items-center justify-center">
                                <SettingsIcon />
                            </div> */}
                            <h4 className="py-[6px]">{t('settings')}</h4>
                        </a>
                    </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Link href="/settings?from=subscription">
                        <a>
                            <h4 className="py-[6px]">{t('subscription')}</h4>
                        </a>
                    </Link>
                </MenuItem>
                <div>
                    <MenuItem onClick={handleClose}>
                        <a onClick={() => setOpen(true)}>
                            <h4 className="py-[6px] text-[#84919A]">
                                {t('logout')}
                            </h4>
                        </a>
                    </MenuItem>
                </div>
            </Menu>
            {open && (
                <InfoModal
                    open={open}
                    icon={<LogoutIcon />}
                    mainButton={t('logout')}
                    bgColorMain="bg-[#383641]"
                    bgColorCencel="bg-[#5086EC]"
                    textColorMain="text-[#fff]"
                    setOpen={setOpen}
                    title={t('logout_title')}
                    text={t('logout_text')}
                    onClick={() => {
                        logout()
                    }}
                />
            )}
        </div>
    )
}

export default DropDawn
