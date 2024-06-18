import React, { useEffect, useRef } from 'react'
import {
    styled,
    alpha,
    Box,
    Drawer,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ClickAwayListener,
} from '@material-ui/core'
import {
    CancelIcon,
    CartoonIcon,
    CollectionsIcon,
    HamburgerMenuIcon,
    HomeIcon,
    MoviesIcon,
    ProfileIcon,
    LogoutIcon,
    SearchIcon,
    SerialsIcon,
    UpdateProfileIcon,
    ClearIconDark,
    UzDigitalSvgIcon,
} from 'components/svg'
import UzdIcon from '../../public/vectors/UzdIcon.svg'
import cls from './styles.module.scss'
import axios from '../../utils/axios'
import InfoModal from 'components/modal/InfoModal'
import { useTranslation } from 'i18n'
import { useState } from 'react'
import { Link } from 'i18n'
import { parseCookies, destroyCookie } from 'nookies'
import { useRouter } from 'next/router'
import Notifications from 'components/cards/Notifications'
import { useDispatch, useSelector } from 'react-redux'
import {
    setSearchAction,
    setSearchValue,
} from 'store/actions/application/searchAction'

const MobileHeader = ({
    navbarActive,
    categories,
    notificationsUnread,
    notifications,
}) => {
    const { t } = useTranslation()
    const router = useRouter()
    const path = router.asPath.split('/')[1]
    const { access_token, session_id, user_id } = parseCookies()
    const [notifActive, setNotifActive] = useState(false)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const refClear = useRef()
    const [touch, setTouch] = useState()
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })
    const [hideSearchIcon, setHideSearchIcon] = useState(false)

    useEffect(() => {
        if (router.asPath === '/settings' || router.asPath === '/selected') {
            setHideSearchIcon(true)
        } else {
            setHideSearchIcon(false)
        }
    }, [router])

    useEffect(() => {
        return () => {
            dispatch(setSearchAction(false))
        }
    }, [])

    useEffect(() => {
        if (setSearch) {
            refClear.current.focus()
        }
    }, [setSearch])

    const setSearch = useSelector((state) => state?.searchReducer?.set_search)

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }

    const StyledDrawer = styled((props) => <Drawer {...props} />)(
        ({ theme }) => ({
            '& MuiBackdrop-root': {
                backdropFilter: 'blur(8px)',
            },
            '& .MuiPaper-root': {
                backgroundColor: '#1C192C !important',
                minWidth: 180,
                maxWidth: '100%',
                // paddingLeft: '16px',
                // paddingRight: '12px',
                color:
                    theme.palette.mode === 'light'
                        ? 'rgb(55, 65, 81)'
                        : theme.palette.grey[300],
                boxShadow:
                    'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
                '& .MuiMenu-list': {
                    padding: '4px 0',
                    backgroundColor: 'black',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                '& .MuiList-root': {
                    padding: '0px !important',
                    '& .MuiListItem-root': {
                        fontSize: 18,

                        // paddingRight: '20px !important',
                        '&:active': {
                            backgroundColor: alpha(
                                theme.palette.primary.main,
                                theme.palette.action.selectedOpacity,
                            ),
                        },
                        '&:hover': {
                            backgroundColor: '#292929',
                        },
                    },
                    '& .MuiListItem-gutters': {
                        padding: '15px 0',
                    },
                },
            },
        }),
    )

    const list = (anchor) => (
        <Box
            sx={{
                width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
            }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <div className="border-b-[1px] border-b-[#303030] pl-4">
                    <Link href="/">
                        <a
                            className={`nav-link_mobile ${
                                router.route === '/' && 'active'
                            }`}
                        >
                            <ListItem button key="home_key">
                                <ListItemText primary={t('home')} />
                            </ListItem>
                        </a>
                    </Link>
                </div>
                <div className="border-b-[1px] border-b-[#303030] pl-4">
                    <Link href="/tv">
                        <a
                            className={`nav-link_mobile ${
                                router.route === '/tv' && 'active'
                            }`}
                        >
                            <ListItem button key="chosen_key">
                                <ListItemText primary={t('tv_channels')} />
                            </ListItem>
                        </a>
                    </Link>
                </div>
                {categories?.map((elem, ind) => (
                    <div
                        className="border-b-[1px] border-b-[#303030] pl-4"
                        key={ind}
                    >
                        <Link
                            key={elem.id}
                            href={`/movies/${elem.id}?type=${elem.slug}`}
                        >
                            <a
                                className={`nav-link_mobile ${
                                    router.query.category === elem.id
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                <ListItem button key="home_key">
                                    <ListItemText
                                        primary={t(`${elem.title}`)}
                                    />
                                </ListItem>
                            </a>
                        </Link>
                    </div>
                ))}
                <div className="border-b-[1px] border-b-[#303030] pl-4">
                    <Link href="/selected">
                        <a
                            className={`nav-link_mobile ${
                                router.route === '/selected' && 'active'
                            }`}
                        >
                            <ListItem button key="chosen_key">
                                <ListItemText primary={t('selected')} />
                            </ListItem>
                        </a>
                    </Link>
                </div>
                {/* ============ Notification ================ */}
                <div className="md:hidden block">
                    <div className="border-b-[1px] border-b-[#303030] pl-4">
                        <Link href="/settings?from=notifications">
                            <a
                                className={`w-full nav-link_mobile ${
                                    router.query.from === 'notifications'
                                        ? 'active'
                                        : ''
                                }`}
                            >
                                <ListItem button key="chosen_key">
                                    <ListItemText
                                        primary={t('notifications')}
                                    />
                                    {notificationsUnread > 0 && (
                                        <span className="w-[2px] h-[70%] absolute right-0 bg-[#4589FF]" />
                                    )}
                                </ListItem>
                            </a>
                        </Link>
                    </div>
                </div>
                {access_token ? (
                    <div className=" border-b-[1px] border-b-[#303030] pl-4">
                        <div className="border-b-[1px] border-b-[#303030]">
                            <Link href="/settings">
                                <a
                                    className={`nav-link_mobile ${
                                        router.route === '/settings' &&
                                        router.query.from !== 'notifications'
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    <ListItem button key="chosen_key">
                                        <ListItemText primary={t('settings')} />
                                    </ListItem>
                                </a>
                            </Link>
                        </div>
                        <div
                            className="border-b-[1px] border-b-[#303030]"
                            onClick={() => {
                                setOpen(true)
                            }}
                        >
                            <Link href="/">
                                <a>
                                    <ListItem button key="chosen_key">
                                        <ListItemText
                                            className="text-red-500"
                                            primary={t('logout')}
                                        />
                                    </ListItem>
                                </a>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="border-b-[1px] border-b-[#303030] pl-4">
                        <Link href="/registration">
                            <a>
                                <ListItem button key="chosen_key">
                                    <ListItemText primary={t('login')} />
                                </ListItem>
                            </a>
                        </Link>
                    </div>
                )}
            </List>
        </Box>
    )

    const logout = () => {
        axios
            .delete(`/session`, {
                data: { session_id },
            })
            .then((res) => {
                // setOpen(false)
                destroyCookie({}, 'access_token', {
                    path: '/',
                })
                destroyCookie({}, 'session_id', {
                    path: '/',
                })
                destroyCookie({}, 'user_id', {
                    path: '/',
                })
                destroyCookie({}, 'next-i18next', {
                    path: '/',
                })
                window.localStorage.removeItem('idImageUpload')
                router.push('/')
            })
    }

    return (
        <>
            <div
                className={`mobile-header z-[9999999] relative bg-[#1C192C] md:px-[34px] ${
                    !setSearch && !hideSearchIcon
                        ? 'pt-3 pr-3 h-[80px]'
                        : 'py-[8px]'
                }
        ${router.pathname === '/' && 'header-gradient'} ${
                    navbarActive && 'header-active'
                }`}
            >
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        {!setSearch &&
                            ['left'].map((anchor) => (
                                <React.Fragment key={anchor}>
                                    <Button
                                        onClick={toggleDrawer(anchor, true)}
                                    >
                                        <span className="text-red-200">
                                            <HamburgerMenuIcon />
                                        </span>
                                    </Button>
                                    <StyledDrawer
                                        anchor={anchor}
                                        open={state[anchor]}
                                        onClose={toggleDrawer(anchor, false)}
                                    >
                                        <div className="flex items-center px-[8px] pt-4 border-b border-b-[#303030] pb-4">
                                            <Link href="/">
                                                <UzdIcon />
                                            </Link>
                                        </div>
                                        {list(anchor)}
                                    </StyledDrawer>
                                </React.Fragment>
                            ))}
                        {!setSearch && (
                            <Link href="/">
                                <UzdIcon
                                    onClick={() =>
                                        dispatch(setSearchAction(false))
                                    }
                                />
                            </Link>
                        )}
                    </div>
                    {hideSearchIcon ? (
                        ''
                    ) : (
                        <div className="flex items-center">
                            <ClickAwayListener
                                onClickAway={() => setNotifActive(false)}
                            >
                                <span
                                    className="cursor-pointer hidden md:block mr-4"
                                    onClick={() => setNotifActive(!notifActive)}
                                >
                                    <Notifications
                                        notificationsUnread={
                                            notificationsUnread
                                        }
                                        notifications={notifications}
                                    />
                                </span>
                            </ClickAwayListener>
                            {!setSearch && (
                                <span
                                    onClick={() =>
                                        dispatch(setSearchAction(true))
                                    }
                                >
                                    <SearchIcon />
                                    {/* {searchOpen && (
                            <HeaderSearch
                                searchOpen={searchOpen}
                                setSearchOpen={setSearchOpen}
                            />
                        )} */}
                                </span>
                            )}
                        </div>
                    )}
                </div>
                {setSearch && (
                    <div className="flex justify-between items-center p-[16px]">
                        <div className="flex justify-between items-center h-10 border-[1.5px]  border-mainColor rounded-xl w-full bg-[#211F29] mr-[10px]">
                            <div className="flex justify-between items-center w-full h-[100%]">
                                <div className="ml-[10px] mx-2 align-middle">
                                    <SearchIcon />
                                </div>
                                <input
                                    ref={refClear}
                                    className={cls.searchInputMobile}
                                    type="text"
                                    autoFocus
                                    onChange={(e) =>
                                        dispatch(setSearchValue(e.target.value))
                                    }
                                    placeholder={t('Movies_people_genres')}
                                />
                            </div>
                        </div>
                        <div
                            className={`${cls.cancelText} whitespace-nowrap`}
                            onClick={() => {
                                refClear.current.value = ''
                                dispatch(setSearchAction(false))
                                dispatch(setSearchValue(''))
                            }}
                        >
                            {t('cancel')}
                        </div>
                    </div>
                )}
            </div>
            {open && (
                <InfoModal
                    open={open}
                    icon={<LogoutIcon />}
                    mainButton={t('logout')}
                    bgColorMain="bg-[#383641]"
                    bgColorCencel="bg-[#E1DAE01]"
                    textColorMain="text-[#fff]"
                    setOpen={setOpen}
                    title={t('logout_title')}
                    text={t('logout_text')}
                    onClick={logout}
                />
            )}
        </>
    )
}

export default MobileHeader
