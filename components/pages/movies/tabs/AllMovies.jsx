import SEO from 'components/SEO'
import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import router from 'next/router'
import MoviesPage from 'components/pages/movies/MoviesPage'
import { i18n } from 'i18n'
import { useSelector } from 'react-redux'

export default function AllMovies({
    filterdetails,
    idCategoryMegogo,
    idCategoryPremier,
}) {
    const setGenresData = useSelector((state) => state.genresReducer.data)
    const setCountriesData = useSelector((state) => state.countriesReducer.data)
    const setYearsData = useSelector((state) => state.yearsReducer.data)

    const [movies, setMovies] = useState([])
    const [afterMovies, setAfterMovies] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(false)

    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const uniqueIds = []

    const unique = movies.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.id)

        if (!isDuplicate) {
            uniqueIds.push(element.id)
            return true
        }

        return false
    })

    const [currentPage, setCurrentPage] = useState(1)
    const [params, setParams] = useState(null)

    const [userAgeId, setUserAgeId] = useState(null)
    const [filterGenre, setFilterGenres] = useState(null)
    const [filterYear, setFilterYear] = useState(null)
    const [filterCountries, setFilterCountries] = useState(null)
    const [userYearId, setUserYearId] = useState(null)

    const [stopUzdigital, setStopUzdigital] = useState(false)
    const [isFullMegogo, setIsFullMegogo] = useState(false)
    const [isFullPremier, setIsFullPremier] = useState(false)
    const [offsetMegogo, setOffsetMegogo] = useState(0)
    const [offsetPremier, setOffsetPremier] = useState(0)

    const [isLoading, setIsLoading] = useState(true)
    const [limitedCount, setLimitedCount] = useState(null)
    const [filterActive, setFilterActive] = useState(false)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    useEffect(() => {
        setMovies([])
        setUserYearId(null)
        setIsFullMegogo(false)
        setIsFullPremier(false)
        setCurrentPage(1)
    }, [filterYear, filterCountries, filterGenre])

    useEffect(() => {
        if (idCategoryMegogo && idCategoryPremier) {
            if (!stopUzdigital && !filterActive) {
                getUzdigitalMovies()
            }
        }
    }, [stopUzdigital, currentPage, idCategoryMegogo, idCategoryPremier])

    useEffect(() => {
        getUzdigitalMovies()
        if (afterMovies) {
            setTimeout(() => {
                getCollectionMovies()
            }, 0)
        }
    }, [
        currentPage,
        filterCountries,
        filterGenre,
        filterYear,
        isFullMegogo,
        isFullPremier,
    ])

    useEffect(() => {
        setMovies([])
        getUzdigitalMovies()
        if (afterMovies) {
            setTimeout(() => {
                getCollectionMovies()
            }, 0)
        }
        setCurrentPage(1)
    }, [filterCountries, filterGenre, filterYear])

    useEffect(() => {
        if (limitedCount && !stopUzdigital && !filterActive) {
            if (afterMovies) {
                setTimeout(() => {
                    getCollectionMovies(limitedCount)
                }, 0)
            }
        }
    }, [limitedCount, stopUzdigital, filterActive])

    useEffect(() => {
        const { yearFrom, yearTill } = computeYears(setYearsData)
        if (yearFrom || yearTill || filterYear) {
            setIsFullPremier(true)
        } else {
            setIsFullMegogo(false)
            setIsFullPremier(false)
        }
    }, [filterYear, filterActive])

    useEffect(() => {
        setIsFullPremier(false)
        setUserYearId('')
        if (filterCountries || filterGenre || filterYear) {
            setFilterActive(true)
        } else {
            setFilterActive(false)
        }
    }, [filterCountries, filterGenre, filterYear])

    useEffect(() => {
        if (afterMovies) {
            if (limitedCount && !stopUzdigital && !filterActive) {
                getCollectionMovies(limitedCount)
            }
        }
    }, [isFullMegogo, isFullPremier, limitedCount])

    useEffect(() => {
        if (!filterCountries || !filterGenre || !filterYear) {
            if (afterMovies) {
                if (limitedCount && !stopUzdigital && !filterActive) {
                    setTimeout(() => {
                        getCollectionMovies()
                    }, 0)
                }
            }
        }
    }, [currentPage, filterCountries, filterGenre])

    const getFilteredMovies = () => {
        axios
            .get('megogo/catalog/filters', {
                params: {
                    show_disabled_items: true,
                    show_title: true,
                },
            })
            .then((res) => {
                setFilteredData(res.data.data.filter_by[3].items)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }

    useEffect(() => {
        getFilteredMovies()
    }, [i18n?.language])

    const getUzdigitalMovies = () => {
        setLoading(true)
        setAfterMovies(true)

        const { yearFrom, yearTill } = computeYears(setYearsData)

        axios
            .get(`/movies`, {
                params: {
                    category: router?.query?.category,
                    countries: setCountriesData,
                    genre: setGenresData,
                    lang: i18n?.language,
                    limit: '16',
                    page: currentPage,
                    release_year_from: yearFrom,
                    release_year_till: yearTill,
                    age_restriction:
                        CurrentUserData?.profile_type === 'children'
                            ? CurrentUserData?.profile_age
                            : 0,
                },
            })
            .then((response) => {
                if (response?.data?.movies) {
                    setMovies((prev) => [...prev, ...response?.data?.movies])
                } else {
                    setMovies([])
                }

                if (response?.data?.movies?.length < 16) {
                    setLimitedCount(16 - response?.data?.movies?.length)
                }
            })
            .finally(() => {
                setLoading(false)
                setIsLoading(false)
            })
    }

    const getCollectionMovies = (limit) => {
        const { yearFrom, yearTill } = computeYears(setYearsData)
        setLoading(true)

        axios
            .get(`integration-collection`, {
                params: {
                    age:
                        CurrentUserData?.profile_type == 'children'
                            ? CurrentUserData?.profile_age
                            : '',
                    age_limit: userAgeId,
                    category_megogo: idCategoryMegogo,
                    category_premier: idCategoryPremier,
                    full_megogo: isFullMegogo ? isFullMegogo : false,
                    full_premier: isFullPremier ? isFullPremier : false,
                    country: setCountriesData,
                    genre: setGenresData,
                    limit: limit,
                    year_max: yearTill,
                    year_min: yearFrom,
                    offset_megogo: currentPage === 1 ? 0 : offsetMegogo,
                    offset_premier: offsetPremier,
                    lang: i18n?.language,
                    year_id: userYearId,
                    sort: 'recommended',
                },
            })
            .then((res) => {
                setOffsetMegogo(res?.data?.offset_megogo)
                setOffsetPremier(res?.data?.offset_premier)
                setIsFullMegogo(res?.data?.full_megogo)
                setIsFullPremier(res?.data?.full_premier)
                setUserAgeId(res?.data?.age_limit)
                setUserYearId(res?.data?.year_id)

                if (yearFrom || yearTill) {
                    const withoutPremier = res?.data?.movies?.filter(
                        (el) => !el.is_premier,
                    )
                    setMovies((prev) => [
                        ...prev,
                        ...(withoutPremier ? withoutPremier : []),
                    ])
                } else {
                    if (res?.data?.movies) {
                        setMovies((prev) => [...prev, ...res?.data?.movies])
                    }
                }
            })
            .finally(() => {
                setStopUzdigital(true)
                setIsLoading(false)
                setLoading(false)
                setLimitedCount(false)
            })
    }

    return (
        <>
            <SEO />
            <div className="mt-7">
                <MoviesPage
                    filterdetails={filterdetails ? filterdetails : []}
                    movies={unique}
                    currentPage={currentPage}
                    setParams={setParams}
                    isLoading={isLoading}
                    setFilterGenres={setFilterGenres}
                    setFilterYear={setFilterYear}
                    setFilterCountries={setFilterCountries}
                    isFullMegogo={isFullMegogo}
                    isFullPremier={isFullPremier}
                    filteredData={filteredData}
                    loading={loading}
                    setMovies={setMovies}
                    setUserYearId={setUserYearId}
                    setIsFullMegogo={setIsFullMegogo}
                    setIsFullPremier={setIsFullPremier}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </>
    )
}

const computeYears = (setYearsData) => {
    if (setYearsData) {
        const yearFrom = parseInt(
            setYearsData === '-1969'
                ? setYearsData.slice(1, 5)
                : setYearsData.includes('-')
                ? setYearsData.split('-')[0]
                : setYearsData,
        )

        const yearTill = parseInt(
            setYearsData === '-1969'
                ? setYearsData.slice(1, 5)
                : setYearsData.includes('-')
                ? setYearsData.split('-')[1]
                : setYearsData,
        )

        return {
            yearFrom,
            yearTill,
        }
    } else {
        return {}
    }
}
