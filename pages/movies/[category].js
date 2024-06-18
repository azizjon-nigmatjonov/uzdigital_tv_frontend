import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

import MoviesPage from 'components/pages/movies/MoviesPage'
import SEO from 'components/SEO'
import Typography from '@mui/material/Typography'
import AllMovies from 'components/pages/movies/tabs/AllMovies'
import Megogo from 'components/pages/movies/tabs/Megogo'
import Premier from 'components/pages/movies/tabs/Premier'
import axios from '../../utils/axios'

import { useEffect, useState } from 'react'
import { useTranslation } from 'i18n'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setMoviesTabCurrent } from 'store/actions/application/moivesTabActions'
import { PremierIcon, MegagoIcon } from 'components/svg'
import {
    setCategoriesMegogo,
    setCategoriesPremier,
} from 'store/actions/application/categoriesActions'
import { setGenresActions } from 'store/actions/application/genresActions'
import { yearsAction } from 'store/actions/application/yearsAction'
import { setCountriesActions } from 'store/actions/application/countriesAction'
import { filterMoviesAction } from 'store/actions/application/filterMoviesAction'
import { yearSingleAction } from 'store/actions/application/yearSingleAction'
import { genresSingleAction } from 'store/actions/application/genresSingleAction'
import { countrySingleAction } from 'store/actions/application/countrySingleAction'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
    tabs: {
        backgroundColor: 'transparent !important',
    },
})

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
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function Movies() {
    const router = useRouter()
    const pathFeatured = router.query.featured
    const { i18n, t } = useTranslation()
    const dispatch = useDispatch()
    const [filterdetails, setFilterDetails] = useState(null)
    const [movies, setMovies] = useState([])
    const [featured, setFeatured] = useState([])
    const QueryCategory = router?.query?.category
    const CurrentUserData = useSelector(
        (state) => state.recommend.recommendation_value,
    )
    const [currentPage, setCurrentPage] = useState(1)
    const categories = useSelector((state) => state.categories.categories_value)
    const categoriesMegogo = useSelector(
        (state) => state.categories.categories_value_megogo,
    )
    const categoriesPremier = useSelector(
        (state) => state.categories.categories_value_premier,
    )
    const [params, setParams] = useState(null)

    const [megogoCategory, setMegogoCategory] = useState(null)
    const [premierCategory, setPremierCategory] = useState(null)
    const [textTab, setTextTab] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const moviesTab = useSelector(
        (state) => state.moviesTabCurrent.movies_tab_value,
    )
    const handleChange = (event, newValue) => {
        dispatch(setMoviesTabCurrent(newValue))
    }
    const classes = useStyles()

    const tabStyles = {
        width: '100%',
        display: 'inline-flex',
        textColor: '#fff',
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

    const clearFilter = () => {
        dispatch(setGenresActions())
        dispatch(yearsAction())
        dispatch(setCountriesActions())
        dispatch(filterMoviesAction())
        dispatch(genresSingleAction())
        dispatch(countrySingleAction())
        dispatch(yearSingleAction())
    }

    useEffect(() => {
        if (i18n?.language) {
            if (pathFeatured) {
                if (QueryCategory) {
                    if (
                        CurrentUserData &&
                        CurrentUserData?.profile_type === 'children'
                    ) {
                        axios
                            .get(
                                `/featured-list/${QueryCategory}?lang=${i18n.language}&age_restriction=${CurrentUserData?.profile_age}&page=${currentPage}&limit=16`,
                            )
                            .then((response) => {
                                if (currentPage === 1) {
                                    setFeatured(
                                        response?.data?.featured_list?.movies,
                                    )
                                } else {
                                    if (response?.data?.featured_list?.movies) {
                                        setFeatured((prev) => [
                                            ...prev,
                                            ...response.data.featured_list
                                                ?.movies,
                                        ])
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                    } else {
                        axios
                            .get(
                                `/featured-list/${QueryCategory}?lang=${
                                    i18n.language
                                }&age_restriction=${0}&page=${currentPage}&limit=16`,
                            )
                            .then((response) => {
                                if (currentPage === 1) {
                                    setFeatured(
                                        response?.data?.featured_list?.movies,
                                    )
                                } else {
                                    if (response?.data?.featured_list?.movies) {
                                        setFeatured((prev) => [
                                            ...prev,
                                            ...response.data.featured_list
                                                .movies,
                                        ])
                                    }
                                }
                            })
                            .catch((error) => {
                                console.error(error)
                            })
                    }
                }
            }
        }
    }, [QueryCategory, i18n?.language, currentPage, CurrentUserData])

    useEffect(() => {
        if (router?.query?.type === 'user') {
            if (i18n?.language) {
                if (
                    CurrentUserData &&
                    CurrentUserData?.favourite_genres &&
                    CurrentUserData?.profile_type !== 'children'
                ) {
                    axios
                        .get('/movies', {
                            params: {
                                genre: CurrentUserData?.favourite_genres,
                                lang: i18n?.language,
                            },
                        })
                        .then((res) => {
                            setMovies(res?.data.movies)
                        })
                } else {
                    setMovies(null)
                }
            }
        }
    }, [i18n.language, router])

    useEffect(() => {
        if (i18n?.language && router?.query?.type !== 'user') {
            axios
                .get(`/filter-details?lang=${i18n.language}`)
                .then((response) => {
                    setFilterDetails(response?.data)
                })
                .catch((error) => {
                    console.error(error)
                })
        }
    }, [i18n?.language])

    useEffect(() => {
        if (categoriesMegogo && categoriesPremier) {
            if (
                router?.query?.type == 'multfilm' ||
                router?.query?.type == 'multfilmy'
            ) {
                setTextTab(t('allCartoons'))
                setMegogoCategory(
                    categoriesMegogo.find((item) => item.path == 'mult'),
                )

                setPremierCategory(
                    categoriesPremier.find(
                        (item) => item.name == 'Мультфильмы',
                    ),
                )
            } else if (
                router?.query?.type == 'tele-show' ||
                router?.query?.type == 'filmy'
            ) {
                setTextTab(t('allMovies'))
                setMegogoCategory(
                    categoriesMegogo.find((item) => item.path == 'films'),
                )

                setPremierCategory(
                    categoriesPremier.find((item) => item.name == 'Фильмы'),
                )
            } else if (
                router?.query?.type == 'test' ||
                router?.query?.type == 'serialy'
            ) {
                setTextTab(t('allSeasons'))
                setMegogoCategory(
                    categoriesMegogo.find((item) => item.path == 'series'),
                )

                setPremierCategory(
                    categoriesPremier.find((item) => item.name == 'Сериалы'),
                )
            }
        }
    }, [categoriesMegogo, router, categoriesPremier])

    useEffect(() => {
        if (router?.query?.type !== 'user' && !pathFeatured) {
            axios
                .get(`megogo/configuration?lang=${i18n?.language}`)
                .then((response) => {
                    dispatch(
                        setCategoriesMegogo(response?.data?.data?.categories),
                    )
                })

            axios.get(`premier/videos/categories`).then((response) => {
                dispatch(setCategoriesPremier(response?.data))
            })
        }
    }, [i18n, router])

    const [fromBanner, setFromBanner] = useState(false)
    useEffect(() => {
        if (router?.query?.featured || router?.query?.type == 'user') {
            setFromBanner(true)
        }
    }, [router])

    return (
        <>
            <SEO />

            {!fromBanner && (
                <div className="mt-7 wrapper moviesPageTab">
                    <ThemeProvider theme={customTheme}>
                        <Tabs
                            sx={tabStyles}
                            value={moviesTab}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="secondary"
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="scrollable force tabs example"
                        >
                            <Tab
                                label={textTab}
                                {...a11yProps(0)}
                                onClick={() => clearFilter()}
                                className={classes.tabs}
                            />
                            <Tab
                                label={<MegagoIcon />}
                                {...a11yProps(0)}
                                onClick={() => clearFilter()}
                                className={classes.tabs}
                            />
                            <Tab
                                label={<PremierIcon />}
                                {...a11yProps(1)}
                                onClick={() => clearFilter()}
                                className={classes.tabs}
                            />
                        </Tabs>
                        <TabPanel
                            sx={{ padding: 0 }}
                            value={moviesTab}
                            index={0}
                        >
                            <Box sx={{ flexGrow: 1 }}>
                                <AllMovies
                                    filterdetails={filterdetails}
                                    idCategoryMegogo={megogoCategory?.id}
                                    idCategoryPremier={premierCategory?.id}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={moviesTab} index={1}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Megogo
                                    filterdetails={filterdetails}
                                    idCategory={megogoCategory?.id}
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={moviesTab} index={2}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Premier
                                    filterdetails={filterdetails}
                                    idCategory={premierCategory?.id}
                                />
                            </Box>
                        </TabPanel>
                    </ThemeProvider>
                </div>
            )}

            {fromBanner && (
                <div className="wrapper">
                    <MoviesPage
                        categories={
                            categories?.categories ? categories?.categories : []
                        }
                        filterdetails={filterdetails ? filterdetails : []}
                        movies={
                            router?.query?.type === 'user'
                                ? movies
                                : pathFeatured === 'true'
                                ? featured
                                : featured
                                ? movies
                                : movies
                        }
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        setParams={setParams}
                        setMovies={setMovies}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                        isError={isError}
                        fromBanner={fromBanner}
                    />
                </div>
            )}
        </>
    )
}
