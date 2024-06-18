import SEO from 'components/SEO'
import Banner from 'components/mainPage/Banner'
import ScrollComponent from 'components/scroll/Scrollcomponent'
import { useTranslation } from 'i18n'
import MoviesHistory from 'components/scroll/MoviesHistory'
import { parseCookies } from 'nookies'
import axios from 'utils/axios'
import { setProfilesList } from 'store/actions/application/profilesAction'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Skeleton from '@mui/material/Skeleton'
import NullData from 'components/errorPopup/NullData'
import { Router } from 'i18n'
import { NullDataSearchIcon } from 'components/svg'
import { setProfile } from 'store/actions/application/profileAction'
import InfiniteScroll from 'react-infinite-scroll-component'
import { userBalanceAction } from 'store/actions/application/userBalanceAction'

export default function Home() {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [recommendMovies, setRecommendMovies] = useState()
    const RecommendationActive = useSelector(
        (state) => state.recommend.recommendation_active,
    )
    const profile = useSelector((state) => state.mainProfile.profile_value)
    const ProfilesList = useSelector((state) => state.profile.profiles_list)
    const listSelected = sessionStorage.getItem('listSelected')
    const userActivation = sessionStorage.getItem('userActivation')
    const { session_id, profile_id } = parseCookies()
    const [featured_lists, setFeaturedLists] = useState([])
    const ScalettonNumber = [1, 2, 3, 4, 5]
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const [movies, setMovies] = useState()
    const [loading, setLoading] = useState(false)
    const [recentlyWatchedMovieToDelete, setRecentlyWatched] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [currentPageBanner, setCurrentPageBanner] = useState(1)
    const [megogo, setMegogo] = useState([])
    const [premier, setPremierData] = useState([])
    const megogoData = megogo?.map((item) => ({ ...item, is_megogo: true }))
    const premierData = premier?.map((item) => ({ ...item, is_premier: true }))
    const categories = useSelector((state) => state.categories.categories_value)
    const [integrationLink, setIntegrationLink] = useState(null)

    const [channelslist, SetChannelsList] = useState([])

    useEffect(() => {
        if (session_id) {
            if (profile && profile?.access_token) {
                if (!userActivation || userActivation == 'false') {
                    axios
                        .post(`count-platform`, {
                            platform_name: 'Веб-сайт',
                        })
                        .then(() => {
                            sessionStorage.setItem('userActivation', 'active')
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }
            }
        }
    }, [profile, userActivation])

    useEffect(() => {
        axios
            .get(`tv/channel`)
            .then((response) => {
                SetChannelsList(response?.data?.tv_channels)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    useEffect(() => {
        if (session_id) {
            axios
                .get('/customer/profile')
                .then((response) => {
                    dispatch(setProfile(response?.data?.customer))
                })
                .catch((error) => {
                    console.error(error)
                })
        } else {
            dispatch(setProfile(null))
        }
    }, [session_id])

    const getRecentlyWatchedMovies = () => {
        if (session_id)
            axios
                .get(
                    `recently-watched-movies?SessionId=${session_id}&profile_id=${
                        CurrentUserData ? CurrentUserData?.id : profile_id
                    }&lang=${i18n?.language}&page=${1}&limit=${20}`,
                )
                .then((res) => {
                    setCount(res?.data?.count)
                    setMovies(res?.data?.user_movies)
                })
    }

    const deleteRecenlyWatchedMovie = (id) => {
        axios
            .delete(
                `recently-watched-movies?profile_id=${
                    CurrentUserData ? CurrentUserData?.id : profile_id
                }`,
                {
                    data: {
                        movie_key: id,
                    },
                },
            )
            .then(() => {
                setTimeout(() => {
                    getRecentlyWatchedMovies()
                }, 0)
            })
    }

    useEffect(() => {
        setLoading(false)
        if (i18n?.language) {
            if (
                CurrentUserData &&
                CurrentUserData?.profile_type === 'children'
            ) {
                axios
                    .get(
                        `/featured-list?lang=${i18n.language}&age_restriction=${
                            CurrentUserData?.profile_age
                        }&page=${currentPageBanner}&limit=${1}`,
                    )
                    .then((response) => {
                        setFeaturedLists((items) => [
                            ...items,
                            ...response?.data?.featured_lists,
                        ])
                    })
                    .catch((error) => {
                        setLoading(true)
                        console.error(error)
                    })
            } else {
                axios
                    .get(
                        `/featured-list?lang=${
                            i18n.language
                        }&page=${currentPageBanner}&limit=${1}`,
                    )
                    .then((response) => {
                        setFeaturedLists((items) => [
                            ...items,
                            ...response?.data?.featured_lists,
                        ])
                    })
                    .catch((error) => {
                        setLoading(true)
                        console.error(error)
                    })
            }
        }

        getRecentlyWatchedMovies()
    }, [CurrentUserData, currentPageBanner])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
        })
    }
    useEffect(() => {
        scrollToTop()
    }, [CurrentUserData])

    useEffect(() => {
        if (session_id) {
            if (profile?.access_token) {
                if (ProfilesList && ProfilesList?.count > 1) {
                    if (!listSelected) {
                        if (listSelected !== 'active') {
                            if (!RecommendationActive) {
                                setTimeout(() => {
                                    location.replace('/profiles')
                                }, 1000)
                            }
                        }
                    }
                }
            }
        }
    }, [])

    useEffect(() => {
        if (session_id) {
            axios
                .get('/profiles', {
                    headers: {
                        SessionId: session_id,
                    },
                })
                .then((res) => {
                    dispatch(setProfilesList(res?.data ? res?.data : null))
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [CurrentUserData])

    useEffect(() => {
        if (
            CurrentUserData &&
            CurrentUserData?.favourite_genres &&
            CurrentUserData?.profile_type !== 'children' &&
            session_id
        ) {
            axios
                .get('/movies', {
                    params: {
                        genre: CurrentUserData?.favourite_genres,
                        lang: i18n?.language,
                    },
                })
                .then((res) => {
                    setRecommendMovies(res?.data)
                })
        } else {
            setRecommendMovies(null)
        }
    }, [CurrentUserData, i18n?.language])

    useEffect(() => {
        axios
            .get(`megogo/catalog/objects`, {
                params: {
                    age:
                        CurrentUserData?.profile_type === 'children'
                            ? CurrentUserData?.profile_age
                            : '',
                    limit: currentPage < 3 ? 30 : 12,
                    lang: i18n?.language,
                },
            })
            .then((res) => {
                if (res?.data) {
                    setMegogo((items) => [
                        ...items,
                        ...res.data.data.groups[0].videos,
                    ])
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }, [currentPage])

    useEffect(() => {
        if (CurrentUserData?.profile_type !== 'children') {
            axios
                .get(`premier/videos`, {
                    params: {
                        limit: currentPage < 3 ? 30 : 12,
                        offset: currentPage * (currentPage < 3 ? 30 : 12),
                        lang: i18n?.language,
                    },
                })
                .then((res) => {
                    if (res?.data?.movies) {
                        setPremierData((items) => [
                            ...items,
                            ...res.data.movies,
                        ])
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [currentPage])

    useEffect(() => {
        if (categories) {
            const item = categories?.categories?.find(
                (item) => item.slug === 'tele-show',
            )
            const item2 = categories?.categories?.find(
                (item) => item.slug === 'filmy',
            )
            if (item?.id || item2?.id) {
                setIntegrationLink(
                    `/movies/${item ? item.id : item2?.id}?type=${
                        item?.slug ? item.slug : item2?.slug
                    }`,
                )
            }
        }
    }, [categories])

    useEffect(() => {
        if (session_id) {
            if (profile && profile?.session_status === false) {
                setTimeout(() => {
                    Router.push('/session-limit-ended?status=offline')
                }, 400)
            }
        }
    }, [profile, session_id, featured_lists])

    return (
        <>
            <SEO />

            <div>
                {loading ? (
                    <div className="my-5 flex justify-center md:my-20">
                        <NullData
                            icon={<NullDataSearchIcon />}
                            title={t('Здесь нет данные')}
                            text={t(
                                'Можете посмотреть другие разделы которые есть данные',
                            )}
                            textButton={t('back')}
                            link={() => Router.push('/')}
                        />
                    </div>
                ) : featured_lists?.length ? (
                    <div>
                        <Banner
                            banners={
                                featured_lists?.find(
                                    (el) => el.slug === 'banner',
                                ) || []
                            }
                        />

                        {movies && (
                            <MoviesHistory
                                movies={movies}
                                count={count}
                                page={page}
                                deleteRecenlyWatchedMovie={
                                    deleteRecenlyWatchedMovie
                                }
                                linkToPage={'/settings?from=watched-history'}
                            />
                        )}
                        {channelslist && (
                            <div className="mt-10 md:mt-0">
                                <ScrollComponent
                                    additionalClassesScroll="lg:pt-10"
                                    dataMovie={channelslist ? channelslist : []}
                                    type="tv"
                                    title={t('allChannels')}
                                    linkToPage={'/tv'}
                                    setCurrentPage={setCurrentPage}
                                    imgWidth="h-[152px] sm:h-[220px]"
                                    layoutWidth="w-[108px] sm:w-[157px]"
                                />
                            </div>
                        )}

                        {recommendMovies?.movies?.length &&
                            profile?.access_token && (
                                <div className="mt-[40px] lg:mt-0 xl:mt-0">
                                    <ScrollComponent
                                        additionalClassesScroll="lg:py-10"
                                        dataMovie={recommendMovies?.movies}
                                        type="recommendation"
                                        title={`${
                                            CurrentUserData?.name
                                                ? CurrentUserData?.name
                                                : ''
                                        }, ${t('recommendYou')}`}
                                        linkToPage={
                                            '/movies/recommandation?type=user'
                                        }
                                        imgWidth="h-[152px] sm:h-[220px]"
                                    />
                                </div>
                            )}

                        {megogoData && (
                            <div className="mt-10 md:mt-0">
                                <ScrollComponent
                                    additionalClassesScroll="lg:pt-10"
                                    dataMovie={megogoData}
                                    type="megogo"
                                    title={`${t('allMovies')}, ${t('megogo')}`}
                                    linkToPage={integrationLink}
                                    setCurrentPage={setCurrentPage}
                                    imgWidth="h-[152px] sm:h-[220px]"
                                    layoutWidth="w-[108px] sm:w-[157px]"
                                    setTab={1}
                                />
                            </div>
                        )}

                        {CurrentUserData?.profile_type !== 'children'
                            ? premierData && (
                                  <div className="mt-10 md:mt-0">
                                      <ScrollComponent
                                          additionalClassesScroll="lg:pt-10"
                                          dataMovie={premierData}
                                          type="premier"
                                          title={`${t('allMovies')}, ${t(
                                              'Premier',
                                          )}`}
                                          linkToPage={integrationLink}
                                          setCurrentPage={setCurrentPage}
                                          imgWidth="sm:h-[220px]"
                                          setTab={2}
                                      />
                                  </div>
                              )
                            : null}

                        <InfiniteScroll
                            dataLength={featured_lists?.length || 0}
                            style={{ overflow: 'visible' }}
                            next={() => {
                                setCurrentPageBanner((pre) => ++pre)
                            }}
                            hasMore={true}
                        >
                            {featured_lists?.length && (
                                <div
                                    className={
                                        recommendMovies?.movies
                                            ? ''
                                            : 'mt-[50px]'
                                    }
                                >
                                    {featured_lists
                                        ?.filter((el) => el.slug !== 'banner')
                                        .sort(
                                            (a, b) =>
                                                parseInt(a.order) -
                                                parseInt(b.order),
                                        )
                                        .map((elem) => {
                                            return (
                                                <ScrollComponent
                                                    dataMovie={elem.movies}
                                                    type="movie"
                                                    title={
                                                        elem.movies.length > 0
                                                            ? elem.title
                                                            : ''
                                                    }
                                                    linkToPage={`/movies/${elem.slug}?lang=${elem.lang}&featured=true`}
                                                    key={elem.id}
                                                    additionalClassesScroll="mt-8"
                                                    imgWidth="sm:h-[220px]"
                                                />
                                            )
                                        })}
                                </div>
                            )}
                        </InfiniteScroll>
                    </div>
                ) : (
                    <div>
                        <div className="h-[50vh] sm:h-[100vh] relative">
                            <div className="w-full absolute bottom-[140px] pl-[56px] hidden sm:block">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        width: '280px',
                                        height: '62px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        mt: '22px',
                                        width: '35%',
                                        height: '30px',
                                        borderRadius: '12px',
                                        marginTop: '16px',
                                    }}
                                    variant="wave"
                                />
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        mt: '22px',
                                        width: '40%',
                                        height: '62px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                                <div className="flex items-center space-x-[22px] mt-3">
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#1C192C',
                                            mt: '22px',
                                            width: '220px',
                                            height: '56px',
                                            borderRadius: '12px',
                                        }}
                                        variant="wave"
                                    />
                                    <Skeleton
                                        sx={{
                                            bgcolor: '#1C192C',
                                            mt: '22px',
                                            width: '180px',
                                            height: '56px',
                                            borderRadius: '12px',
                                        }}
                                        variant="wave"
                                    />
                                </div>
                            </div>
                            <div className="w-full absolute bottom-[40px] flex justify-center flex-col items-center sm:hidden">
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        mt: '22px',
                                        width: '180px',
                                        height: '56px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                                <Skeleton
                                    sx={{
                                        bgcolor: '#1C192C',
                                        mt: '22px',
                                        width: '300px',
                                        height: '25px',
                                        borderRadius: '12px',
                                    }}
                                    variant="wave"
                                />
                            </div>
                        </div>
                        <div className="wrapper mt-[56px]">
                            <Skeleton
                                sx={{
                                    bgcolor: '#1C192C',
                                    mt: '22px',
                                    width: '280px',
                                    height: '40px',
                                    borderRadius: '12px',
                                }}
                                variant="wave"
                            />
                            <div className="mt-5 grid grid-flow-row-dense grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 extraLarge:grid-cols-10 gap-x-2 sm:gap-x-5 gap-y-5 sm:gap-y-10">
                                {ScalettonNumber.map((item) => (
                                    <div
                                        key={item}
                                        className="h-[152px] sm:h-[220px]"
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
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
