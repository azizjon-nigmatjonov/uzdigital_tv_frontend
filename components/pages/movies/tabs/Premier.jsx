import SEO from 'components/SEO'
import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import MoviesPage from 'components/pages/movies/MoviesPage'
import { i18n } from 'i18n'
import { useSelector } from 'react-redux'

export default function Premier({ filterdetails, idCategory }) {
    const setGenresData = useSelector((state) => state.genresReducer.data)

    const [movies, setMovies] = useState([])
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const [currentPage, setCurrentPage] = useState(1)
    const [params, setParams] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [filterGenre, setFilterGenres] = useState(null)

    useEffect(() => {
        setCurrentPage(1)
        if (filterGenre) {
            setMovies([])
        }
    }, [filterGenre])

    useEffect(() => {
        if (idCategory) {
            getPremierData(idCategory)
        } else {
            setIsLoading(false)
            setIsError(true)
        }
    }, [currentPage, params, idCategory, filterGenre])

    const getPremierData = (id) => {
        axios
            .get(
                `premier/videos${
                    CurrentUserData?.profile_type === 'children'
                        ? `?age_restriction=${CurrentUserData.profile_age}`
                        : ''
                }`,
                {
                    params: {
                        limit: currentPage == 1 ? 16 : 8,
                        offset: currentPage * (currentPage == 1 ? 0 : 8),
                        lang: i18n?.language,
                        categories: id,
                        genres: setGenresData,
                    },
                },
            )
            .then((res) => {
                if (res?.data?.movies) {
                    setMovies((prev) => [...prev, ...res?.data?.movies])
                }
            })
            .catch(() => {
                setIsLoading(false)
                setIsError(true)
            })
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (!movies?.length && !isLoading) {
            setTimeout(() => {
                setIsError(true)
            }, 500)
        }
    }, [movies, isLoading])

    return (
        <>
            <SEO />
            <div className="text-white mt-7">
                <MoviesPage
                    filterdetails={filterdetails ? filterdetails : []}
                    movies={movies}
                    setCurrentPage={setCurrentPage}
                    setFilterGenres={setFilterGenres}
                    currentPage={currentPage}
                    setParams={setParams}
                    isLoading={isLoading}
                    isError={isError}
                    setMovies={setMovies}
                />
            </div>
        </>
    )
}
