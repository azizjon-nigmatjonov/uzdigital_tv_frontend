import React, { useEffect, useState } from 'react'
import axios from 'utils/axios'
import { useTranslation } from 'i18n'
import { parseCookies } from 'nookies'
import { useSelector } from 'react-redux'
import NoCards from 'components/errorPopup/NoCards'
import { FavoriteLikeIcon, PremierTag } from 'components/svg'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import NextLink from 'components/common/link'
import Skeleton from '@mui/material/Skeleton'
import MegaGoTag from '../../../../../public/vectors/MegagoTag.svg'
import { motion } from 'framer-motion'

export default function Favorites() {
    const { profile_id } = parseCookies()
    const [favourites, setFavourites] = useState([])

    const [loading, setLoading] = useState(false)
    const { t, i18n } = useTranslation()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )

    const [currentPage, setCurrentPage] = useState(1)
    const ScalettonNumber = [1, 2, 3, 4]
    const [error, setEror] = useState(false)
    const [marquee, setMarque] = useState(false)
    const [windowWidth] = useWindowSize()

    function useWindowSize() {
        const size = useState([window.innerWidth])
        return size
    }
    useEffect(() => {
        if (i18n?.language) {
            setLoading(true)
            if (CurrentUserData || profile_id) {
                axios
                    .get(
                        `/favourites/profile/${
                            CurrentUserData?.id
                                ? CurrentUserData?.id
                                : profile_id
                        }?lang=${
                            i18n?.language
                        }&limit=${16}&page=${currentPage}`,
                    )
                    .then((res) => {
                        setFavourites(res?.data?.favourites)
                    })
                    .catch(() => {
                        setEror(true)
                        setLoading(false)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }, [CurrentUserData, currentPage])

    return (
        <div className="min-h-[70vh]">
            <div>
                {favourites?.length > 0 && !loading && !error && (
                    <ul className={`movies-grid-colums animationTextScroll`}>
                        {favourites?.map((elem, ind) => (
                            <motion.div
                                key={ind}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 50 }}
                                transition={{
                                    duration: 0.3,
                                    delay: 0.05 * ind,
                                    ease: [0.1, 0.01, -0.05, 0.9],
                                }}
                            >
                                <li className="inline-block w-full hover:scale-110 duration-300">
                                    <NextLink
                                        href={
                                            elem?.is_premier
                                                ? `/movie/${elem?.movie_id}?type=premier`
                                                : elem?.is_megogo
                                                ? `/movie/${elem?.movie_id}?type=megogo`
                                                : `/movie/${elem?.slug}`
                                        }
                                    >
                                        <a>
                                            <div
                                                className={`gridImagesProperties group w-full rounded-[4px] cursor-pointer overflow-hidden relative`}
                                            >
                                                {elem?.is_megogo && (
                                                    <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute right-2 top-2 text-white uppercase text-[13px] font-semibold flex items-center justify-center">
                                                        <MegaGoTag />
                                                    </div>
                                                )}
                                                {elem?.is_premier && (
                                                    <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute right-2 top-2 text-white uppercase text-[14px] font-semibold flex items-center justify-center">
                                                        <PremierTag />
                                                    </div>
                                                )}
                                                <LazyLoadImage
                                                    className="min-w-full min-h-full max-h-full object-cover"
                                                    src={elem?.logo_image}
                                                ></LazyLoadImage>
                                            </div>
                                            <p className="mt-3 text-[12px] sm:text-[15px] font-medium whitespace-nowrap overflow-hidden">
                                                {i18n.language === 'ru'
                                                    ? elem?.title?.title_ru
                                                    : i18n.language === 'en'
                                                    ? elem?.title?.title_en
                                                    : elem?.title?.title_uz ===
                                                      'uz'
                                                    ? elem?.title?.title_uz
                                                    : ''}
                                            </p>

                                            <span className={`text-sm`}>
                                                {elem?.payment_type ===
                                                'tvod' ? (
                                                    <span className="text-[#F50057]">
                                                        {elem?.price / 100 +
                                                            ` ${t('sum')}`}
                                                    </span>
                                                ) : elem?.payment_type ===
                                                      'svod' ||
                                                  elem?.is_megogo ||
                                                  elem?.is_premier ? (
                                                    <span className="text-[#4589FF]">
                                                        {t('svod')}
                                                    </span>
                                                ) : (
                                                    <span className="text-[#ffffff55]">
                                                        {t('free')}
                                                    </span>
                                                )}
                                            </span>
                                        </a>
                                    </NextLink>
                                </li>
                            </motion.div>
                        ))}
                    </ul>
                    // </InfiniteScroll>
                )}
            </div>

            {loading && !error && (
                <div className="movies-grid-colums">
                    {ScalettonNumber.map((item) => (
                        <div key={item} className="gridImagesProperties]">
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

            {favourites?.length === 0 && !loading && (
                <div className="mt-20 w-1/2 mx-auto">
                    <NoCards
                        icon={<FavoriteLikeIcon width="48px" height="48px" />}
                        title={t('no_data_favourite')}
                        text={t('no_data_text_favourite')}
                    />
                </div>
            )}
        </div>
    )
}
