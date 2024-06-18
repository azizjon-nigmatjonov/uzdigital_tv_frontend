import { LogoIcon, SearchIcon, ClearIconDark } from 'components/svg'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import LoginButton from 'components/button/LoginBtn'
import { useTranslation, Link as I18nLink } from 'i18n'
import DropDawn from '../drop-dawn/DropDawn'
import nookies from 'nookies'
import HeaderSearch from 'components/search/HeaderSearch'
import { ClickAwayListener } from '@material-ui/core'
import Notifications from 'components/cards/Notifications'
import NextLink from 'components/common/link'
import {
    setSearchAction,
    setSearchValue,
} from 'store/actions/application/searchAction'
import { useDispatch, useSelector } from 'react-redux'
import cls from './styles.module.scss'
import { UzDigitalSvgIcon } from '../../components/svg'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'
import { setGenresActions } from 'store/actions/application/genresActions'
import { yearsAction } from 'store/actions/application/yearsAction'
import { setCountriesActions } from 'store/actions/application/countriesAction'
import { filterMoviesAction } from 'store/actions/application/filterMoviesAction'
import { genresSingleAction } from 'store/actions/application/genresSingleAction'
import { countrySingleAction } from 'store/actions/application/countrySingleAction'
import { yearSingleAction } from 'store/actions/application/yearSingleAction'

function DesktopHeader({
    navbarActive,
    categories,
    setSearchOpen,
    profile,
    notifications,
    notificationsUnread,
}) {
    const cookies = nookies.get()
    const { t } = useTranslation('common')
    const router = useRouter()
    const [notifActive, setNotifActive] = useState(false)
    const dispatch = useDispatch()
    const refClear = useRef()
    const [detectSearch, setDetectSearch] = useState(false)

    const setSearch = useSelector((state) => state.searchReducer.set_search)
    const searchValue = useSelector((state) => state.searchReducer.search_value)

    useEffect(() => {
        window.addEventListener('popstate', detectHistory)

        function detectHistory() {
            setDetectSearch(true)
        }

        return () => {
            if (searchValue && detectSearch) {
                dispatch(setSearchAction(true))
            }
        }
    }, [detectSearch, searchValue])

    useEffect(() => {
        if (setSearch) {
            refClear.current.focus()
        } else {
            dispatch(setSearchAction(false))
        }
    }, [setSearch])

    useEffect(() => {
        document.addEventListener('keydown', detectKeyPress, true)
    }, [])

    const detectKeyPress = (e) => {
        if (e.keyCode === 27) {
            dispatch(setSearchAction(false))
            dispatch(setSearchValue(''))
        }
    }

    useEffect(() => {
        if (refClear?.current?.value.length < 1) {
            dispatch(setSearchValue(''))
        }
    }, [refClear?.current?.value])

    const clearDesktopFilter = () => {
        dispatch(setGenresActions())
        dispatch(yearsAction())
        dispatch(setCountriesActions())
        dispatch(filterMoviesAction())
        dispatch(genresSingleAction())
        dispatch(countrySingleAction())
        dispatch(yearSingleAction())
    }

    return (
        <div>
            <nav
                className={`text-white h-[80px] flex items-center ${
                    router.pathname === '/' && 'header-gradient'
                } ${navbarActive ? 'header-active' : 'header-inactive'} ${
                    setSearch ? 'header-active' : ''
                }`}
            >
                <div className="wrapper">
                    <div className=" flex justify-between items-center mx-auto">
                        <I18nLink
                            href="/"
                            onClick={() => {
                                dispatch(setSearchAction(false))
                                dispatch(setSearchValue(''))
                                clearDesktopFilter()
                            }}
                        >
                            <a
                                className="2x:mr-24"
                                onClick={() => {
                                    dispatch(setSearchAction(false))
                                    dispatch(setSearchValue(''))
                                    clearDesktopFilter()
                                }}
                            >
                                <UzDigitalSvgIcon />
                            </a>
                        </I18nLink>
                        <div className="flex items-center justify-between">
                            {!setSearch && categories ? (
                                <ul className="flex">
                                    <li>
                                        <I18nLink href="/">
                                            <a
                                                onClick={() => {
                                                    dispatch(
                                                        setSearchAction(false),
                                                    )
                                                    clearDesktopFilter()
                                                }}
                                                className={`nav-link mr-6 ${
                                                    router.route === '/' &&
                                                    'active'
                                                }`}
                                            >
                                                {t('home')}
                                            </a>
                                        </I18nLink>
                                    </li>
                                    <li>
                                        <I18nLink href="/tv">
                                            <a
                                                className={`nav-link whitespace-nowrap mr-8 ${
                                                    router.route === '/tv' &&
                                                    'active'
                                                }`}
                                                onClick={() => {
                                                    clearDesktopFilter()
                                                }}
                                            >
                                                {t('tv_channels')}
                                            </a>
                                        </I18nLink>
                                    </li>
                                    {categories?.map((item, i) => (
                                        <li key={i}>
                                            <NextLink
                                                href={`/movies/${item.id}?type=${item?.slug}`}
                                            >
                                                <a
                                                    onClick={() => {
                                                        dispatch(
                                                            setMoviesTabCurrent(
                                                                0,
                                                            ),
                                                        )
                                                        clearDesktopFilter()
                                                    }}
                                                    className={`nav-link mr-8 ${
                                                        router.query
                                                            .category ===
                                                        item.id
                                                            ? 'active'
                                                            : ''
                                                    }`}
                                                >
                                                    {t(item.title)}
                                                </a>
                                            </NextLink>
                                        </li>
                                    ))}
                                    <li>
                                        <I18nLink href="/selected">
                                            <a
                                                className={`nav-link mr-6 ${
                                                    router.route ===
                                                        '/selected' && 'active'
                                                }`}
                                                onClick={() => {
                                                    clearDesktopFilter()
                                                }}
                                            >
                                                {t('selected')}
                                            </a>
                                        </I18nLink>
                                    </li>
                                    <div
                                        onClick={() => {
                                            !setSearch
                                                ? setSearchOpen(true)
                                                : null
                                            dispatch(setSearchAction(true))
                                        }}
                                        className="flex justify-center items-center cursor-pointer"
                                    >
                                        <SearchIcon />
                                    </div>
                                </ul>
                            ) : (
                                <div className="relative">
                                    <input
                                        ref={refClear}
                                        className={cls.search_input}
                                        type="text"
                                        onChange={(e) => {
                                            dispatch(
                                                setSearchValue(
                                                    e?.target?.value,
                                                ),
                                            )
                                        }}
                                        value={searchValue}
                                        placeholder={t('Movies_people_genres')}
                                    />
                                    <button
                                        onClick={() => {
                                            refClear.current.value = ''
                                            dispatch(setSearchAction(false))
                                            dispatch(setSearchValue(''))
                                        }}
                                        className="absolute right-[15px] top-1/2 -translate-y-1/2 flex items-center py-3 px-4"
                                    >
                                        <ClearIconDark />
                                    </button>
                                    <div className="absolute left-[10px] top-1/2 -translate-y-1/2 flex items-center">
                                        <SearchIcon />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-end">
                            <ClickAwayListener
                                onClickAway={() => setNotifActive(false)}
                            >
                                <div
                                    className="cursor-pointer mr-4"
                                    onClick={() => setNotifActive(!notifActive)}
                                >
                                    <Notifications
                                        notificationsUnread={
                                            notificationsUnread
                                        }
                                        notifications={notifications}
                                    />
                                </div>
                            </ClickAwayListener>
                            {cookies.access_token ? (
                                <DropDawn
                                    profile={profile}
                                    onClick={() => {
                                        clearDesktopFilter()
                                    }}
                                />
                            ) : (
                                <I18nLink href="/registration">
                                    <a>
                                        <LoginButton text={t('login')} />
                                    </a>
                                </I18nLink>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default DesktopHeader
