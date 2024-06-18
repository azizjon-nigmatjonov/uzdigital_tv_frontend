import React, { useEffect, useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import NoBoughtMovies from 'components/errorPopup/NoBoughtMovies'
import NextLink from 'components/common/link'
import axios from '../../../../../utils/axios'

import { Router } from 'i18n'
import { parseCookies } from 'nookies'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useTranslation } from 'i18n'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
    boughtImage: {
        width: '149px',
        height: '204px',
        borderRadius: '4px',
        boxSizing: 'border-box',
    },
})

export default function BoughtMovies() {
    const { session_id } = parseCookies()
    console.log(session_id)
    const [movies, setMovies] = useState([])
    const { t } = useTranslation()
    const ScalettonNumber = [1, 2, 3, 4, 5]
    useEffect(() => {
        axios
            .get('/bought-films', {
                params: {
                    SessionId: session_id,
                    limit: 10,
                    page: 1,
                },
            })
            .then(function (res) {
                setMovies(res.data.purchases)
                console.log(res.data.purchases)
            })
            .catch(function (error) {
                console.log(error)
            })
    }, [])

    const classes = useStyles()
    const [isShimmerActive, setShimmerActive] = useState(false)
    useEffect(() => {
        setTimeout(() => {
            setShimmerActive(true)
        }, 400)
    }, [])
    return (
        <>
            {movies?.length > 0 ? (
                <div className="w-full">
                    {isShimmerActive ? (
                        <div className="w-full movies-grid-colums">
                            {movies?.map((item, i) => (
                                <div
                                    key={item.movie_slug}
                                    className="inline-block w-full"
                                >
                                    <NextLink
                                        href={`/movie/${item.movie_slug}`}
                                    >
                                        <a>
                                            <div className="rounded-[4px] w-full overflow-hidden hover:scale-105 duration-300">
                                                <LazyLoadImage
                                                    className="object-cover gridImagesProperties w-full"
                                                    src={item.logo_image}
                                                ></LazyLoadImage>
                                            </div>
                                            <p className="mt-[8px] text-[15px] font-medium">
                                                {item.title}
                                            </p>
                                            <p className="mt-[8px] text-[12px]">
                                                {item.title}
                                            </p>
                                        </a>
                                    </NextLink>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="movies-grid-colums first-letter:w-full">
                            {ScalettonNumber.map((item) => (
                                <div
                                    key={item}
                                    className="gridImagesProperties"
                                >
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#1C192C',
                                            width: '100%',
                                            height: '100%',
                                            borderRadius: '8px',
                                        }}
                                        variant="wave"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <NoBoughtMovies
                    title={t('oops')}
                    subtitle={t('lets_buy')}
                    link={() => Router.push('/')}
                    text={t('buy_film')}
                />
            )}
        </>
    )
}
