import SEO from 'components/SEO'
import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import MoviesPage from 'components/pages/movies/MoviesPage'
import { i18n } from 'i18n'
import { useSelector } from 'react-redux'

export default function Megogo({ filterdetails, idCategory }) {
    const setGenresData = useSelector((state) => state.genresReducer.data)
    const setCountriesData = useSelector((state) => state.countriesReducer.data)
    const setYearsData = useSelector((state) => state.yearsReducer.data)

    const [movies, setMovies] = useState([])
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [userAgeId, setUserAgeId] = useState(null)
    const [userPage, setUserPage] = useState(null)
    const [userYearId, setUserYearId] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)

    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    const [filterGenre, setFilterGenres] = useState(null)
    const [filterYear, setFilterYear] = useState(null)
    const [filterCountries, setFilterCountries] = useState(null)
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(false)

    const uniqueIds = []

    const unique = movies.filter((element) => {
        const isDuplicate = uniqueIds.includes(element.id)

        if (!isDuplicate) {
            uniqueIds.push(element.id)
            return true
        }

        return false
    })

    useEffect(() => {
        if (!movies?.length && !isLoading) {
            setTimeout(() => {
                setIsError(true)
            }, 500)
        }
    }, [movies, isLoading])

    useEffect(() => {
        setMovies([])
        setUserPage(null)
        setUserYearId(null)
        setCurrentPage(1)
    }, [filterYear, filterCountries, filterGenre])

    useEffect(() => {
        if (idCategory) {
            getMegogoData(idCategory)
        } else {
            setIsLoading(false)
            setIsError(true)
        }
    }, [currentPage, idCategory, filterCountries, filterGenre, filterYear])

    const getMegogoData = (id) => {
        setLoading(true)
        const { yearFrom, yearTill } = computeYears(setYearsData)

        axios
            .get(
                `/megogo/catalog/objects${
                    setGenresData ? `?genre=${setGenresData}` : ''
                }`,
                {
                    params: {
                        age:
                            CurrentUserData?.profile_type == 'children'
                                ? CurrentUserData?.profile_age
                                : '',
                        age_limit: userAgeId,
                        category_id: id,
                        country: setCountriesData,
                        lang: i18n?.language,
                        limit: currentPage == 1 ? 16 : 8,
                        page: currentPage === 1 ? null : userPage,
                        sort: 'recommended',
                        year_from: yearFrom,
                        year_to: yearTill,
                        year_id: userYearId,
                    },
                },
            )
            .then((res) => {
                if (res?.data?.data?.groups[0]?.videos) {
                    setUserAgeId(res.data.data.groups[0].age_limit)
                    setUserPage(res.data.data.groups[0].next_page)
                    setUserYearId(res.data.data.groups[0].year_id)
                    let result = res.data.data.groups[0].videos.map((item) => ({
                        is_megogo: true,
                        ...item,
                    }))

                    setMovies((prev) => [...prev, ...result])
                } else {
                    setMovies([])
                }
            })
            .catch(() => {
                setIsError(true)
                setIsLoading(false)
            })
            .finally(() => {
                setIsLoading(false)
                setLoading(false)
            })
    }

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

    return (
        <>
            <SEO />
            <div className="text-white mt-7">
                <MoviesPage
                    filterdetails={filterdetails ? filterdetails : []}
                    movies={unique}
                    currentPage={currentPage}
                    setFilterGenres={setFilterGenres}
                    setFilterYear={setFilterYear}
                    setFilterCountries={setFilterCountries}
                    filteredData={filteredData}
                    loading={loading}
                    isLoading={isLoading}
                    setUserPage={setUserPage}
                    setMovies={setMovies}
                    setUserYearId={setUserYearId}
                    setCurrentPage={setCurrentPage}
                    // isError={isError}
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
