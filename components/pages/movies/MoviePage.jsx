import React, { useEffect, useState, useRef } from 'react'
import ScrollComponent from 'components/scroll/Scrollcomponent'
import { useIsMobile } from 'hooks/useIsMobile'
import VideoPlayer from 'components/video/VideoPlayer'
import { Router } from 'i18n'
import { useTranslation } from 'i18n'
import { parseCookies } from 'nookies'
import axios from '../../../utils/axios'
import {
    ExpredIcon,
    SuccessSybscriptionIcon,
    PlusIconSmall,
    NullDataSearchIcon,
} from 'components/svg'
import { showAlert } from 'store/reducers/alertReducer'
import ErrorPopup from 'components/errorPopup/Popup'
import { useDispatch } from 'react-redux'
import router from 'next/router'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import CommentsModal from '../../../components/modal/CommentsModal'
import Skeleton from '@mui/material/Skeleton'
import Staff from 'components/cards/Staff'
import ScrollSubscriotion from 'components/scroll/scrollSubscription'
import TrailerAll from 'components/cards/TrailerAll'
import NullData from 'components/errorPopup/NullData'
import { clearFilterAction } from 'store/actions/application/filterMoviesAction'
function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const MoviePage = ({
    el,
    related,
    profile,
    CurrentUserData,
    loading,
    errorCase,
    styles
}) => {
    const [isMobile] = useIsMobile()
    const [expired, setExpired] = useState(false)
    const [tvotModal, setTvotModal] = useState(false)
    const [buyFreeTrail, setBuyFreeTrail] = useState(false)
    const dispatch = useDispatch()
    const [purchase, setPurchase] = useState('')
    const [filterGenres, setFilterGenres] = useState([])
    const [subscription, setSubscription] = useState([])
    const [checkSubscription, setCheckSubscription] = useState({})
    const [text, setText] = useState('')
    const { access_token, user_id, session_id } = parseCookies()

    const { t, i18n } = useTranslation()
    const [sessionsLimin, setSessionsLimin] = useState()
    const [commentsLike, setCommentsLike] = useState([])
    const [commentsDislike, setCommentsDislike] = useState([])
    const [typeOfComment, setTypeOfComment] = useState('like')
    const [feedbacks, setFeedbacks] = useState([])
    const languageOfWebsite = i18n?.language
    const [currentPage, setCurrentPage] = useState(1)
    const pathFeatured = router.query.featured
    const subscriptionRef = useRef(null)
    const [megago_genres, setMegagoGenres] = useState(null)

    useEffect(() => {
        if (router?.query?.movie && router?.query?.type === 'megogo') {
            axios
                .get(`megogo/configuration?lang=${i18n?.language}`)
                .then((response) => {
                    setMegagoGenres(response?.data?.data?.genres)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [router?.query, i18n?.language])

    const getAllComments = () => {
        axios
            .get(
                `/movie-comment?movie_key=${
                    el?.is_premier || el?.is_megogo ? el?.id : el?.slug
                }&limit=${100}&page=${currentPage}`,
            )
            .then(function (response) {
                setFeedbacks(response?.data)
            })
            .catch(() => {})
    }
    const getAllCommentTypeLike = () => {
        axios
            .get('/comments', {
                params: {
                    type: 'like',
                },
            })
            .then(function (response) {
                if (languageOfWebsite == 'ru') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.ru,
                    }))
                    setCommentsLike(data)
                } else if (languageOfWebsite == 'uz') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.uz,
                    }))
                    setCommentsLike(data)
                } else {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.en,
                    }))
                    setCommentsLike(data)
                }
            })
            .catch(() => {})
    }

    const getAllCommentTypeDislike = () => {
        axios
            .get('/comments', {
                params: {
                    type: 'dislike',
                },
            })
            .then(function (response) {
                if (languageOfWebsite == 'ru') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.ru,
                    }))
                    setCommentsDislike(data)
                } else if (languageOfWebsite == 'uz') {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.uz,
                    }))
                    setCommentsDislike(data)
                } else {
                    const data = response?.data?.comments?.map((item) => ({
                        checked: false,
                        id: item.id,
                        name: item.name.en,
                    }))
                    setCommentsDislike(data)
                }
            })
            .catch(() => {})
    }

    const toggleComment = (id) => {
        const copyProducts = [...commentsLike]
        const modifiedProducts = copyProducts.map((product) => {
            if (id === product.id) {
                product.checked = !product.checked
            }

            return product
        })

        setCommentsLike(modifiedProducts)
    }

    const toggleCommentDislike = (id) => {
        const copyProducts = [...commentsDislike]
        const modifiedProducts = copyProducts.map((product) => {
            if (id === product.id) {
                product.checked = !product.checked
            }

            return product
        })

        setCommentsDislike(modifiedProducts)
    }

    const sendLikesData = () => {
        let data = commentsLike
            .filter((item) => !!item.checked)
            .map((item) => item.id)

        axios
            .post('/movie-comment', {
                comment_id: data.toString(),
                comment_type: typeOfComment,
                movie_key: el?.is_megogo || el?.is_premier ? el?.id : el?.slug,
                profile_id: CurrentUserData?.id
                    ? CurrentUserData?.id
                    : profile?.id,
                profile_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
                user_id: user_id,
                user_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
            })
            .then(function (response) {
                setCommentsModalOpen(false)
                getAllCommentTypeLike()
                getAllComments()
            })
            .catch(() => {})
    }

    const sendDislikesData = () => {
        let data = commentsDislike
            .filter((item) => !!item.checked)
            .map((item) => item.id)

        axios
            .post('/movie-comment', {
                comment_id: data.toString(),
                comment_type: typeOfComment,
                movie_key: el?.is_premier || el?.is_megogo ? el?.id : el?.slug,
                profile_id: CurrentUserData?.id
                    ? CurrentUserData?.id
                    : profile.id,
                profile_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
                user_id: user_id,
                user_name: CurrentUserData?.name
                    ? CurrentUserData?.name
                    : profile?.name,
            })
            .then(function (response) {
                setCommentsModalOpen(false)
                getAllCommentTypeDislike()
                getAllComments()
            })
            .catch(() => {})
    }

    const [value, setValue] = useState(0)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        if (
            checkSubscription?.has_access &&
            checkSubscription?.purchase_notification
        ) {
            dispatch(showAlert(t('sabscription_active_text'), 'success'))
        }
    }, [checkSubscription])

    useEffect(() => {
        if (el?.payment_type === 'tvod') {
            if (session_id) {
                axios
                    .post(`/check-purchase-access?SessionId=${session_id}`, {
                        movie_slug: el?.slug,
                    })
                    .then((res) => {
                        setPurchase(res?.data?.has_access)
                    })
                    .catch(() => {})
            }
        }
    }, [el, router, session_id])

    useEffect(() => {
        if (megago_genres) {
            el?.genres?.forEach((elem) => {
                const foundGenre = megago_genres.find((id) => id.id === elem)
                setFilterGenres((old) => [...old, foundGenre])
            })
        }
    }, [el, megago_genres])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [el])

    useEffect(() => {
        if (access_token) {
            if (el?.payment_type === 'svod') {
                axios
                    .post(
                        `check-subscription-access`,
                        {
                            key: el?.is_premier
                                ? 'premier'
                                : el?.is_megogo
                                ? 'megogo'
                                : `${el.category.slug}`,
                        },
                        { Authorization: access_token },
                    )
                    .then((res) => {
                        setCheckSubscription(res?.data)
                        setTimeout(() => {
                            setExpired(!res?.data?.has_access)
                        }, 1300)
                        if (res?.data?.has_access) {
                            setText('Смотреть')
                            if (el.access_message === 'SESSION_LIMIT_ENDED') {
                                axios
                                    .post(
                                        'get-user-sessions',
                                        {
                                            key: el?.is_premier
                                                ? 'premier'
                                                : `${el.category.slug}`,
                                        },
                                        // {
                                        //     Authorization: access_token,
                                        //     SessionId: session_id,
                                        // },
                                    )
                                    .then((res) => {
                                        setSessionsLimin(res?.data)
                                    })
                            }
                        } else {
                            axios
                                .get(
                                    `subscription/category?key=${
                                        el?.is_premier
                                            ? 'premier'
                                            : el?.is_megogo
                                            ? 'megogo'
                                            : el.category.slug
                                    }`,
                                )
                                .then((response) => {
                                    setSubscription(response?.data?.categories)
                                })

                            if (res?.data?.is_watched_free_trial) {
                                setText(t('buy_subscription'))
                            } else {
                                setText(t('start_free'))
                            }
                        }
                    })
            }
        }
    }, [access_token, el?.payment_type, router])

    const ganres = () => {
        if (!el?.is_megogo) {
            const genres = el?.genres?.map((item) => {
                const stuff = `${item.title}`
                return stuff
            })

            const ganre = genres?.join(', ')
            return ganre
        } else {
            const genres = filterGenres?.map((megago_genres) => {
                const stuff = `${megago_genres.title}`
                return stuff
            })

            const ganre = genres.join(', ')
            return ganre
        }
    }

    function useWindowSize() {
        const [size, setSize] = useState([window.innerWidth])
        return size
    }
    const [windowWidth] = useWindowSize()
    let MenuActive = true
    if (windowWidth > 540) {
        MenuActive = false
    } else {
        MenuActive = true
    }
    const tabStyles = {
        width: MenuActive ? '100%' : 'auto',
        display: 'inline-flex',
        textColor: '#fff',
        borderBottom: 1,
        borderColor: '#ffffff55',
    }
    const customTheme = createTheme({
        palette: {
            primary: {
                main: '#ffffff55',
            },
            secondary: {
                main: '#fff',
            },
        },
    })

    const [commentsModalOpen, setCommentsModalOpen] = useState(false)

    const handleClickCommentsModalOpen = () => {
        setCommentsModalOpen(true)
    }

    const handleCloseCommentsModalClose = () => {
        setCommentsModalOpen(false)
    }

    const [descriptionMore, setdescriptionMore] = useState(false)
    const [descriptionActive, setDescriptionActive] = useState(false)
    const [descriptionItem, setDescriptionItem] = useState('')
    useEffect(() => {
        if (el?.description?.length > 400) {
            setdescriptionMore(true)
            setDescriptionItem(el?.description?.trim().substring(0, 305) + '. ')
        } else {
            setdescriptionMore(false)
            setDescriptionItem(el?.description)
        }
    }, [el?.description])
    const openDescriptionItem = () => {
        setDescriptionItem(el?.description?.trim().substring(0, 305) + '. ')
        setDescriptionActive(!descriptionActive)
    }
    const closeDescriptionItem = () => {
        setDescriptionItem(el?.description + ' ')
        setDescriptionActive(!descriptionActive)
    }

    const ScalettonNumber = [1, 2, 3, 4, 5]

    const scrollToSubscription = () => {
        window.scrollTo(0, subscriptionRef?.current?.offsetTop - 100)
    }

    useEffect(() => {
        getAllCommentTypeLike()
        getAllComments()
        getAllCommentTypeDislike()
    }, [el])

    useEffect(() => {
        if (
            router?.query?.from === 'banner' &&
            router?.query?.paymentType === 'svod'
        ) {
            setTimeout(() => {
                scrollToSubscription()
            }, 500)
        }
    }, [el, router])

    return (
        <>
            {!loading && !errorCase ? (
                <div id="moviePage">
                    <div className="flex flex-col mb-8 sm:mb-[72px]">
                        <div className={`${!isMobile && 'mt-[-80px]'}`}>
                            <VideoPlayer
                                CurrentUserData={CurrentUserData}
                                setTvotModal={setTvotModal}
                                tvotModal={tvotModal}
                                el={el}
                                purchase={purchase ? purchase : ''}
                                filterGenres={filterGenres}
                                subscription={subscription}
                                checkSubscription={checkSubscription}
                                link={scrollToSubscription}
                            />
                        </div>

                        {el?.description && (
                            <div className="wrapper text-[#EBEBEB] mt-5">
                                <div className="md:w-1/2 sm:mt-10 2xl:mt-20">
                                    <h2 className="single-page-section-title hidden sm:block mb-8">
                                        {t('description')}
                                    </h2>
                                    {descriptionItem && (
                                        <span className="text-lg leading-15 font-normal">
                                            {descriptionMore ? (
                                                <div>
                                                    <span>
                                                        {descriptionItem}
                                                    </span>
                                                    {descriptionActive ? (
                                                        <span
                                                            className="text-white text-opacity-[0.6] border-b border-opacity-[0.6] cursor-pointer"
                                                            onClick={() =>
                                                                openDescriptionItem()
                                                            }
                                                        >
                                                            {t('close')}
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="text-white text-opacity-[0.6] border-b border-opacity-[0.6] cursor-pointer"
                                                            onClick={() =>
                                                                closeDescriptionItem()
                                                            }
                                                        >
                                                            {t('read_more')}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>
                                                    <span>
                                                        {descriptionItem
                                                            ? descriptionItem
                                                            : el?.description}
                                                    </span>
                                                    <div className="block sm:hidden mt-2">
                                                        {el?.rating_imdb
                                                            ?.rating_imdb && (
                                                            <span className="text-[15px] font-bold text-[#A9A7B4] mr-2.5 flex sm:hidden">
                                                                IMDb
                                                                <span className="ml-[7px]">
                                                                    {' '}
                                                                    {
                                                                        el
                                                                            ?.rating_imdb
                                                                            ?.rating_imdb
                                                                    }
                                                                </span>
                                                            </span>
                                                        )}
                                                        {el?.is_megogo && (
                                                            <span className="text-[15px] font-bold text-[#A9A7B4] mr-2.5 flex sm:hidden">
                                                                IMDb
                                                                <span className="ml-[7px]">
                                                                    {' '}
                                                                    {el?.rating}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {checkSubscription?.has_access === false &&
                            subscription?.length > 0 && (
                                <div
                                    ref={subscriptionRef}
                                    className="mt-8 xl:mt-20 text-white wrapper"
                                >
                                    <h2 className="single-page-section-title mb-8 sm:mb-11">
                                        {t('subscription')}
                                    </h2>
                                    <div>
                                        <ScrollSubscriotion
                                            el={
                                                subscription ? subscription : []
                                            }
                                            setBuyFreeTrail={setBuyFreeTrail}
                                            checkSubscription={
                                                checkSubscription
                                            }
                                            setSubscription={setSubscription}
                                            type="subscription"
                                            text={text}
                                            title={t('subscription')}
                                            additionalClasses="w-[350px]"
                                            cost={subscription?.subscriptions}
                                        />
                                    </div>
                                </div>
                            )}

                        {el?.is_serial && el?.seasons && (
                            <div className="mt-8 sm:mt-20">
                                <ScrollComponent
                                    seasonsProperty="w-[300px] h-[200px] hover:scale-105 duration-300"
                                    el={el ? el : {}}
                                    setTvotModal={setTvotModal}
                                    tvotModal={tvotModal}
                                    purchase={purchase}
                                    checkSubscription={checkSubscription}
                                    subscription={subscription}
                                    type="season"
                                    title="Сезон"
                                    additionalClasses="mt-5"
                                />
                            </div>
                        )}

                        {!el?.is_premier ? (
                            <div className="mt-8 xl:mt-20 text-white">
                                <h2 className="single-page-section-title wrapper mb-3">
                                    {t('creators')}
                                </h2>
                                <div>
                                    <Staff el={el ? el : []} />
                                </div>
                            </div>
                        ) : null}

                        {el?.is_megogo && (
                            <div>
                                {el?.trailer && (
                                    <div className="mt-8 xl:mt-20 text-white">
                                        <h2 className="single-page-section-title wrapper">
                                            {t('trailers')}
                                        </h2>
                                        <TrailerAll
                                            additionalClasses="w-[280px] h-[180px]"
                                            trailerData={el?.trailer}
                                            elem={el}
                                            ind={0}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {el && !el?.is_megogo && (
                            <div>
                                {el?.trailer && (
                                    <div>
                                        {el?.trailer[0]?.videos && (
                                            <div className="text-white mt-20">
                                                <h2 className="single-page-section-title wrapper">
                                                    {t('trailers')}
                                                </h2>
                                                <div className="inline-block">
                                                    {' '}
                                                    {el?.trailer[0]?.videos ? (
                                                        el?.trailer[0]
                                                            ?.videos[0]
                                                            ?.file_name
                                                            ?.length > 0 ? (
                                                            <ScrollComponent
                                                                el={el}
                                                                type="trailer"
                                                                additionalClassesScroll="lg:py-5"
                                                                trailerPorperties="w-[280px] h-[180px] hover:scale-105 duration-300 group-hover:opacity-[0.5] rounded-[8px]"
                                                                paddingTrailer="py-5"
                                                            />
                                                        ) : (
                                                            ''
                                                        )
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div
                            className={`text-white min-h-[170px] mt-8 sm:mt-0 ${
                                el?.trailer ? '' : 'mt-20'
                            }`}
                        >
                            <div className="flex items-center justify-between wrapper">
                                <h2 className="single-page-section-title">
                                    {t('reviews')}
                                </h2>
                                <button
                                    className="bg-[#1C192C] flex items-center font-normal text-white text-[15px] sm:text-[17px] pl-[16px] px-[20px] py-[17px] leading-[20px] rounded-[12px]"
                                    type="button"
                                    onClick={() =>
                                        handleClickCommentsModalOpen()
                                    }
                                >
                                    <PlusIconSmall />
                                    {t('write_review')}
                                </button>
                            </div>
                            {feedbacks?.movie_comments && (
                                <ScrollComponent
                                    dataMovie={
                                        feedbacks
                                            ? feedbacks?.movie_comments
                                            : ''
                                    }
                                    type="feedbacks"
                                    setCurrentPage={setCurrentPage}
                                />
                            )}
                        </div>
                    </div>

                    {!el?.is_premier ? (
                        el?.is_megogo ? (
                            <ScrollComponent
                                dataMovie={
                                    el?.is_megogo ? el?.related_movies : related
                                }
                                type="movie"
                                title={t('resemblant')}
                                megogoType={true}
                                imgWidth="h-[152px] sm:h-[220px]"
                            />
                        ) : (
                            <ScrollComponent
                                dataMovie={
                                    el?.is_megogo ? el?.related_movies : related
                                }
                                type="movie"
                                title={t('resemblant')}
                                imgWidth="h-[152px] sm:h-[220px]"
                            />
                        )
                    ) : null}

                    {checkSubscription.has_access === false &&
                        checkSubscription.is_watched_free_trial &&
                        checkSubscription?.message === 'FREE_TRIAL_EXPIRED' &&
                        router?.router?.asPath.substring(0, 8) !== '/premier' &&
                        expired && (
                            <ErrorPopup
                                openModal={expired}
                                setOpenModal={setExpired}
                                link={() => {
                                    setExpired((prev) => !prev)
                                    setTimeout(() => {
                                        scrollToSubscription()
                                    }, 200)
                                }}
                                title={t('expired')}
                                textButton={`${t('activate')} `}
                                text={t('expired_text')}
                                icon={<ExpredIcon />}
                            />
                        )}
                    {checkSubscription.has_access === false &&
                        checkSubscription.is_watched_free_trial &&
                        checkSubscription?.message === 'INACTIVE' &&
                        expired && (
                            <ErrorPopup
                                openModal={expired}
                                setOpenModal={setExpired}
                                link={() => {
                                    setExpired((prev) => !prev)
                                    setTimeout(() => {
                                        scrollToSubscription()
                                    }, 200)
                                }}
                                title={t('expired')}
                                textButton={t('activate')}
                                text={t('expired_follow')}
                                icon={<ExpredIcon />}
                            />
                        )}
                    {buyFreeTrail && (
                        <ErrorPopup
                            openModal={expired}
                            setOpenModal={setExpired}
                            link={() => {
                                if (el?.is_serial) {
                                    Router.push(
                                        `  /video-player?key=${el.slug}&ind=0&seasonNumber=1&episodeNumber=1`,
                                    )
                                } else {
                                    Router.push(
                                        el?.is_megogo
                                            ? `/video-player?id=${el.id}&type=megogo&ind=0`
                                            : `/video-player?key=${el.slug}&ind=0`,
                                    )
                                }
                            }}
                            title={t('Congratulations')}
                            textButton={t('start_watch')}
                            text={t('active_free_trail')}
                            icon={<SuccessSybscriptionIcon />}
                        />
                    )}
                    <CommentsModal
                        commentsDislike={commentsDislike}
                        toggleCommentDislike={toggleCommentDislike}
                        sendDislikesData={sendDislikesData}
                        setTypeOfComment={setTypeOfComment}
                        sendLikesData={sendLikesData}
                        toggleComment={toggleComment}
                        commentsLike={commentsLike}
                        commentsModalOpen={commentsModalOpen}
                        handleCloseCommentsModalClose={
                            handleCloseCommentsModalClose
                        }
                    />
                </div>
            ) : (
                !errorCase && (
                    <div>
                        <div className="h-[50vh] sm:h-[100vh] relative">
                            <div className="absolute left-[56px] bottom-[140px] w-full hidden sm:block">
                                <Skeleton
                                    sx={styles}
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
                            <div className="grid grid-flow-row-dense grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 extraLarge:grid-cols-10 grid-rows-3 gap-x-2 sm:gap-x-5 gap-y-5 sm:gap-y-10 my-[56px]">
                                {ScalettonNumber.map((item) => (
                                    <div key={item} className="h-[220px]">
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
                )
            )}
            {/* errorCase && !loading */}
            {errorCase && !loading && (
                <div className="my-5 flex justify-center md:my-20 w-[40%] mx-auto">
                    <NullData
                        icon={<NullDataSearchIcon />}
                        title={t('noData')}
                        // text={t(
                        //     'Можете посмотреть другие разделы которые есть данные',
                        // )}
                        textButton={t('back')}
                        link={() => {
                            Router.push(`/movies/${Router?.query?.from}`)
                            dispatch(clearFilterAction())
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default MoviePage
