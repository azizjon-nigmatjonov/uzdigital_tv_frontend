import { ClickAwayListener } from '@material-ui/core'
import React, { useState, useEffect, useRef } from 'react'
import axios from '../../utils/axios'
import ErrorSearch from './ErrorSearch'
import SearchFilters from './SearchFilters'
import cls from './SearchStyle.module.scss'
import lottie from 'lottie-web'
import router from 'next/router'
import { useDebounce } from 'hooks/useDebounce'
import { useTranslation } from 'i18n'
import { setSearchAction } from 'store/actions/application/searchAction'
import { useDispatch, useSelector } from 'react-redux'

export default function HeaderSearch({ setSearchOpen, searchOpen }) {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const [dataUzdigitalTv, setDataUzdigitalTV] = useState([])
    const [dataMegago, setDataMegago] = useState([])
    const [dataPremier, setDataPremier] = useState([])
    const [errorCase, setErrorCase] = useState(false)
    const [resultSearch, setResultSearch] = useState('')
    const serarchValue = useSelector(
        (state) => state.searchReducer.search_value,
    )
    const [loading, setLoading] = useState(false)
    const debouncedSearchTerm = useDebounce(resultSearch || serarchValue, 500)
    const refClear = useRef()
    const loadingAnim = useRef()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [data, setData] = useState([])

    useEffect(() => {
        let result = []
        dataUzdigitalTv?.map((item) => {
            result.push(item)
        })
        dataMegago?.map((item) => {
            result.push(item)
        })
        dataPremier?.map((item) => {
            result.push(item)
        })
        setData(result)
    }, [dataUzdigitalTv, dataMegago, dataPremier])

    useEffect(() => {
        if (debouncedSearchTerm.length > 0) {
            setLoading(true)
            if (i18n?.language) {
                axios
                    .get(
                        `/movies?category=${router.query.id}&lang=${
                            i18n?.language
                        }&search=${debouncedSearchTerm}&age_restriction=${
                            CurrentUserData?.profile_type === 'children'
                                ? CurrentUserData?.profile_age
                                : 0
                        }`,
                    )
                    .then((res) => {
                        setDataUzdigitalTV(res?.data?.movies)
                    })
                    .catch((err) => {})
                    .finally(() => setLoading(false))
                axios
                    .get(
                        `/megogo/search?text=${debouncedSearchTerm}&lang=${
                            i18n?.language
                        }${
                            CurrentUserData?.profile_type === 'children'
                                ? `&age_restriction=${CurrentUserData.profile_age}`
                                : ''
                        }`,
                    )
                    .then((res) => {
                        setDataMegago(res?.data?.movies)
                    })
                    .catch((err) => {})
                    .finally(() => {
                        setLoading(false)
                    })
                axios
                    .get(
                        `premier/videos?search=${debouncedSearchTerm}${
                            CurrentUserData?.profile_type === 'children'
                                ? `&age_restriction=${CurrentUserData.profile_age}`
                                : ''
                        }`,
                    )
                    .then((res) => {
                        setDataPremier(res?.data?.movies)
                    })
                    .catch((err) => {})
                    .finally(() => {
                        setLoading(false)
                    })
            }
        } else {
            setData([])
            setLoading(false)
        }
    }, [debouncedSearchTerm])

    useEffect(() => {
        if (loading)
            lottie.loadAnimation({
                container: loadingAnim.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: require('../../public/data.json'),
            })
    }, [loading])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    useEffect(() => {
        if (debouncedSearchTerm !== '') {
            if (data?.length === 0) {
                setTimeout(() => {
                    setErrorCase(true)
                }, 1000)
            }
        } else {
            setErrorCase(false)
        }
    }, [data, debouncedSearchTerm])

    return (
        <div className={`${cls.search} scroll`}>
            <ClickAwayListener
                onClickAway={() => {
                    // setSearchOpen(false)
                }}
            >
                <div>
                    <div
                        className={
                            searchOpen
                                ? `${cls.fade_in_top} ${cls.search_content}`
                                : `${cls.search_content}`
                        }
                    >
                        <div className={cls.search_center}>
                            {/* <span className={cls.search_icon}>
                                <SearchDarkIcon />
                            </span> */}
                            {/* <input
                                ref={refClear}
                                onChange={handleSearch}
                                className={cls.search_input}
                                type="text"
                                placeholder={t('Movies_people_genres')}
                            /> */}

                            {loading ? (
                                <div
                                    className={`${cls.loading}`}
                                    ref={loadingAnim}
                                />
                            ) : (
                                <button
                                    onClick={() => {
                                        refClear.current.value = ''
                                        setResultSearch('')
                                        dispatch(setSearchAction(false))
                                    }}
                                    className={cls.clear_btn}
                                ></button>
                            )}
                        </div>
                    </div>
                    {!loading && data?.length > 0 && debouncedSearchTerm && (
                        <SearchFilters
                            searchOpen={searchOpen}
                            setSearchOpen={setSearchOpen}
                            data={data}
                        />
                    )}
                    {errorCase && !loading && data?.length === 0 && (
                        <ErrorSearch />
                    )}
                </div>
            </ClickAwayListener>
        </div>
    )
}
