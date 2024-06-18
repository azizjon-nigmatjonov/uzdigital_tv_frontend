import { useTranslation } from 'i18n'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { motion } from 'framer-motion'
import NextLink from 'components/common/link'
import ProgressBar from 'components/common/progress-bar/ProgressBar'
import { useEffect, useMemo, useState } from 'react'
import cls from './Story.module.scss'
import { PlayIconMini, CancelIcon } from 'components/svg'
import router from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { parseCookies } from 'nookies'
import { PremierTag } from 'components/svg'
import axios from 'utils/axios'
import MegaGoTag from '../../public/vectors/MegagoTag.svg'

function LastMovie({
    el,
    episodeKey,
    seasonKey,
    watchedPercentage,
    fullDuration,
    lastTime,
    movieType,
    deleteRecenlyWatchedMovie,
    movieKey,
}) {
    const { t, i18n } = useTranslation()
    const hours = useMemo(() => Math.floor(fullDuration / 60 / 60), [])
    const [showCancel, setShowCancel] = useState(false)
    const minutes = useMemo(
        () => Math.floor(fullDuration / 60) - hours * 60,
        [],
    )
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const { profile_id, access_token } = parseCookies()
    const [subscription, setSubscription] = useState([])
    const [checkSubscription, setCheckSubscription] = useState({})

    const handleDeleteRecentlyWatched = () => {
        if (movieType === 'megogo') {
            deleteRecenlyWatchedMovie(movieKey)
        }
        if (movieType === 'premier') {
            deleteRecenlyWatchedMovie(movieKey)
        }
        if (movieType === 'ordinary') {
            deleteRecenlyWatchedMovie(movieKey)
        }
    }

    const checkAccess = () => {
        axios
            .post(`/check-purchase-access`, {
                movie_slug: movieKey,
            })
            .then((res) => {
                if (!res.data.has_access) {
                    axios
                        .post(`/purchase`, {
                            episode_number: episodeKey ? episodeKey : 0,
                            is_serial: el?.element === 'episode' ? true : false,
                            movie_lang: i18n?.lang,
                            movie_slug: movieKey,
                            season_number: seasonKey ? seasonKey : 0,
                        })
                        .then((res) => {
                            axios
                                .post(`/payme-link`, {
                                    amount: el?.price,
                                    episode_number: episodeKey ? episodeKey : 0,
                                    is_serial:
                                        el?.element === 'episode'
                                            ? true
                                            : false,
                                    lang: i18n?.language,
                                    movie_slug: movieKey,
                                    purchase_id: res.data.purchase_id,
                                    season_number: seasonKey ? seasonKey : 0,
                                    url: process.env.BASE_DOMAIN,
                                })
                                .then((res) =>
                                    window.location.replace(res?.data?.link),
                                )
                                .catch((err) => console.error(err))
                        })
                        .catch((err) => console.error(err))
                } else {
                    handleMovie()
                }
            })
            .catch((err) => console.error(err))
    }

    const handleCheckSubscription = () => {
        if (access_token) {
            if (el?.payment_type === 'svod') {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key:
                                movieType === 'premier'
                                    ? 'premier'
                                    : movieType === 'megogo'
                                    ? 'megogo'
                                    : ``,
                            // el.category.slug
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        if (res?.data?.has_access) {
                            handleMovie()
                        } else {
                            handleMovie()
                            // if (movieType === 'megogo') {
                            //     router.push(
                            //         `/integration/${movieKey}?type=megogo&from=banner&paymentType=svod`,
                            //     )
                            // } else if (movieType === 'premier') {
                            //     router.push(
                            //         `/integration/${movieKey}?from=banner&paymentType=svod`,
                            //     )
                            // } else if (movieType === 'ordinary') {
                            //     router.push(
                            //         `/movie/${movieKey}?from=banner&paymentType=svod`,
                            //     )
                            // }
                        }
                    })
            }
        }
    }

    const handleMovie = () => {
        if (parseInt(el?.season_key) > 0) {
            if (movieType === 'megogo') {
                router.push(
                    `/video-player?id=${movieKey}&episodeId=${el?.episode_id}&ind=0&type=megogo&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            } else if (movieType === 'premier') {
                router.push(
                    `/video-player?id=${movieKey}&episodeId=${
                        el?.episode_id
                    }&trailer=${false}&ind=0&type=premier&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            } else {
                router.push(
                    `/video-player?key=${movieKey}&ind=0&seasonNumber=${seasonKey}&episodeNumber=${episodeKey}&lastTime=${lastTime}`,
                )
            }
        } else {
            if (movieType === 'megogo') {
                router.push(
                    `/video-player?id=${movieKey}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=megogo&lastTime=${lastTime}`,
                )
            }
            if (movieType === 'premier') {
                router.push(
                    `/video-player?id=${movieKey}&ind=0&profile_id=${
                        CurrentUserData?.id ? CurrentUserData?.id : profile_id
                    }&type=premier&lastTime=${lastTime}`,
                )
            }
            if (movieType === 'ordinary') {
                router.push(
                    `/video-player?key=${movieKey}&ind=0&lastTime=${lastTime}`,
                )
            }
        }
    }

    const handleMoviePlay = () => {
        handleMovie()

        // it will be used in the feature, don't get action on this 'junior:)'!
        // if (el?.payment_type === 'free') {
        //     handleMovie()
        // } else if (el?.payment_type === 'tvod') {
        //     checkAccess()
        // } else if (el?.payment_type === 'svod') {
        //     handleCheckSubscription()
        //     if (checkSubscription?.has_access) {
        //         handleMovie()
        //     } else {
        //     if (movieType === 'megogo') {
        //         router.push(
        //             `/integration/${movieKey}?type=megogo&from=banner&paymentType=svod`,
        //         )
        //     } else if (movieType === 'premier') {
        //         router.push(
        //             `/integration/${movieKey}?from=banner&paymentType=svod`,
        //         )
        //     } else if (movieType === 'ordinary') {
        //         router.push(
        //             `/movie/${movieKey}?from=banner&paymentType=svod`,
        //         )
        //     }
        //     }
        // }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.3,
                ease: [0.6, 0.01, -0.05, 0.9],
            }}
        >
            <div className="text-left h-auto transition duration-300 ease-in-out transform md:hover:scale-105 hover:shadow group relative">
                {/* <NextLink
                    href={linkToRecentlyWatched}
                > */}
                <a
                    onClick={() => handleMoviePlay()}
                    // className={cls.historyFilmWrapper}
                    onMouseEnter={() => setShowCancel(el?.id)}
                    onMouseLeave={() => setShowCancel(false)}
                >
                    <div
                        className={`w-[317px] md:w-[317px] h-[178px] mb-[12px] relative ${cls.historyFilmWrapper}`}
                    >
                        {el?.is_megogo && !el?.related_movies && (
                            <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute left-2 top-2 text-white uppercase text-[13px] font-semibold flex items-center justify-center">
                                <MegaGoTag />
                            </div>
                        )}
                        {el?.is_premier && !el?.related_movies && (
                            <div className="bg-[#000] w-[28px] h-[28px] z-[2] rounded-[4px] absolute left-2 top-2 text-white uppercase text-[14px] font-semibold flex items-center justify-center">
                                <PremierTag />
                            </div>
                        )}
                        <LazyLoadImage
                            alt={el?.id}
                            effect="blur"
                            delayTime={10000}
                            className="rounded-[4px] md:rounded-lg object-cover w-full h-[172px]"
                            src={
                                !el?.is_megago
                                    ? `${
                                          el?.logo_image
                                              ? el?.logo_image
                                              : '../vectors/movie-image-vector.svg'
                                      }`
                                    : `${
                                          el?.image?.big
                                              ? el?.image?.big
                                              : el?.image?.small
                                              ? el?.image?.small
                                              : el?.image?.original
                                              ? el?.image?.original
                                              : '../vectors/movie-image-vector.svg'
                                      }`
                                    ? el?.logo_image
                                    : el?.logo_image
                            }
                        />
                        <div
                            className="absolute bottom-[12px] left-[12px] right-[12px] z-[2] overflow-hidden"
                            style={{ width: 'calc(100% - 24px)' }}
                        >
                            <div className="mb-[4px] text-[13px] font-semibold text-white text-right">
                                {hours ? `${hours}  ч. ` : ''}{' '}
                                {minutes ? `${minutes} мин` : ''}{' '}
                                {fullDuration < 60 ? `${fullDuration} сек` : ''}
                            </div>
                            <ProgressBar
                                height="6px"
                                progress={watchedPercentage}
                                bgcolor="#5086EC"
                            />
                        </div>
                        {showCancel == el?.id ? (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <PlayIconMini width="22" height="24" />
                            </div>
                        ) : window.innerWidth < 1030 ? (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                <PlayIconMini width="22" height="24" />
                            </div>
                        ) : null}
                    </div>
                    <div
                        className={`z-[2] relative w-[317px] md:w-[317px] whitespace-nowrap overflow-hidden ${
                            parseInt(seasonKey) > 0 ? 'h-[58px]' : 'h-[42px]'
                        }`}
                    >
                        <span className="text-[15px] text-white md:text-[17px] leading-[22px] md:leading-10 font-medium">
                            {i18n?.language === 'en'
                                ? el?.title?.en
                                : i18n?.language === 'ru'
                                ? el?.title?.ru
                                : el?.title?.uz}
                        </span>

                        {parseInt(seasonKey) > 0 && (
                            <span className="text-white text-[13px] md:text-[15px] leading-[20px] block mt-1">
                                {seasonKey} {t('season')}, {episodeKey}{' '}
                                {t('series')}
                            </span>
                        )}
                    </div>
                </a>
                {/* </NextLink> */}
                {showCancel == el?.id && (
                    <div
                        onMouseEnter={() => setShowCancel(el?.id)}
                        onClick={() => handleDeleteRecentlyWatched()}
                        className={`absolute hover:rotate-90 right-2 top-2 bg-[#100E19] w-[32px] h-[32px] rounded-full z-10 duration-300 flex items-center justify-center`}
                    >
                        <CancelIcon width="12" height="12" />
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default LastMovie
