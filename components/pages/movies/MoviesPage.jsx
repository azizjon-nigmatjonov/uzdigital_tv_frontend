import React, { useEffect, useState, useRef } from 'react'
import Lottie from 'lottie-web'
import InfiniteScroll from 'react-infinite-scroll-component'
import Skeleton from '@mui/material/Skeleton'
import FilterMovies from 'components/common/FilterMovies'
import NullData from 'components/errorPopup/NullData'
import Movie from '../../cards/Movie'

import { useTranslation, Router } from 'i18n'
import { useRouter } from 'next/router'
import { NullFilter } from 'components/svg'
import { useSelector } from 'react-redux'

import style from './movies.module.scss'

const MoviesPage = ({
    movies,
    filterdetails,
    setParams,
    isLoading,
    isError,
    fromBanner,
    setFilterGenres,
    setFilterYear,
    setFilterCountries,
    filteredData,
    loading,
    setUserPage,
    setMovies,
    setUserYearId,
    setCurrentPage,
    setIsFullMegogo,
    setIsFullPremier,
}) => {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const pathFeatured = router.query.featured
    const bannerText = useSelector((state) => state.bannerData.banner_text)
    const ScalettonNumber = [1, 2, 3, 4, 5, 6, 7, 8]

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [])

    return (
        <div className={`min-h-[80vh] flex flex-col relative`}>
            {!fromBanner ? (
                <span>
                    {!router.query?.featured && (
                        <FilterMovies
                            filterdetails={filterdetails}
                            setParams={setParams}
                            setFilterGenres={setFilterGenres}
                            setFilterYear={setFilterYear}
                            setFilterCountries={setFilterCountries}
                            filteredData={filteredData}
                            setUserPage={setUserPage}
                            setMovies={setMovies}
                            setUserYearId={setUserYearId}
                            setCurrentPage={setCurrentPage}
                            setIsFullMegogo={setIsFullMegogo}
                            setIsFullPremier={setIsFullPremier}
                        />
                    )}
                </span>
            ) : (
                <div className="md:w-1/2 text-white mt-5">
                    <h1 className="text-[22px] sm:text-[34px] font-bold">
                        {bannerText}
                    </h1>
                </div>
            )}

            {movies?.length && !isLoading ? (
                <div>
                    <InfiniteScroll
                        dataLength={movies?.length || 0}
                        style={{ overflow: 'visible' }}
                        next={() => {
                            setCurrentPage((pre) => ++pre)
                        }}
                        hasMore={true}
                    >
                        <div
                            className={`w-full my-[30px] sm:my-[48px] movies-grid-colums`}
                        >
                            {movies.map((el, ind) => (
                                <>
                                    <div key={ind}>
                                        <Movie
                                            text="kino"
                                            el={el}
                                            layoutWidth="w-full"
                                            imgWidth="gridImagesProperties"
                                        />
                                    </div>
                                </>
                            ))}
                            {loading
                                ? ScalettonNumber?.map((item, ind) => (
                                      <div
                                          key={ind}
                                          className="gridImagesProperties w-full"
                                      >
                                          <Skeleton
                                              sx={{
                                                  bgcolor: '#1C192C',
                                                  width: '100%',
                                                  height: '100%',
                                                  borderRadius: '8px',
                                              }}
                                              animation="wave"
                                              variant="rectangular"
                                          />
                                      </div>
                                  ))
                                : ''}
                        </div>
                    </InfiniteScroll>
                </div>
            ) : null}

            {isLoading && (
                <div className="my-[30px] sm:my-7">
                    <div className="h-[400px] w-full">
                        <Skeleton
                            sx={{
                                bgcolor: '#1C192C',
                                width: '100%',
                                height: '100%',
                                borderRadius: '8px',
                            }}
                            animation="wave"
                            variant="rectangular"
                        />
                    </div>
                </div>
            )}
            {/* if not matched any filters, it will show the reset button */}
            {/* {isError && !isLoading && !movies?.length && ( */}
            {isError && isLoading != true && movies.length < 1 && (
                <div className="flex mt-[90px] flex-col items-center">
                    <NullData
                        title={t('no_films')}
                        text={t('no_films_text')}
                        textButton={t('Reset_filters')}
                        icon={<NullFilter />}
                        link={() =>
                            router.replace(`/movies/${router.query.category}`)
                        }
                    />
                </div>
            )}
        </div>
    )
}
export default MoviesPage
