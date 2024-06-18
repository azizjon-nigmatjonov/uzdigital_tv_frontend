import { useState, useEffect, useRef } from 'react'
import { BreadcrumbArrow, CheckIcon, ClearIconDark } from 'components/svg'
import { useTranslation } from 'i18n'
import cls from './menu.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setGenresActions } from 'store/actions/application/genresActions'
import { filterMoviesAction } from 'store/actions/application/filterMoviesAction'
import { genresSingleAction } from 'store/actions/application/genresSingleAction'
import { countrySingleAction } from 'store/actions/application/countrySingleAction'
import { yearSingleAction } from 'store/actions/application/yearSingleAction'
import { setCountriesActions } from 'store/actions/application/countriesAction'
import { yearsAction } from 'store/actions/application/yearsAction'

export default function FilterMovies({
    filterdetails,
    setFilterCountries,
    setFilterGenres,
    setFilterYear,
    filteredData,
    setUserPage,
    setMovies,
    setUserYearId,
    setCurrentPage,
    setIsFullMegogo,
    setIsFullPremier,
}) {
    const FilterMovies = useSelector((state) => state.filterMoviesReducer.data)
    const singleGenre = useSelector((state) => state.genresSingleReducer.data)
    const singleYear = useSelector((state) => state.yearsSingleReducer.data)
    const setYearsData = useSelector((state) => state.yearsReducer.data)
    const setGenresData = useSelector((state) => state.genresReducer.data)
    const setCountriesData = useSelector((state) => state.countriesReducer.data)
    const singleCountry = useSelector(
        (state) => state.countriesSingleReducer.data,
    )

    const [detectHover, setDetectHover] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const genreRef = useRef(null)
    const countryRef = useRef(null)
    const yearRef = useRef(null)
    const integrationRef = useRef(null)

    const [genreSelectActive, setgenreSelectActive] = useState(false)
    const [countrySelectActive, setCountrySelectActive] = useState(false)
    const [yearSelectActive, setYearSelectActive] = useState(false)

    const [integrationSelectActive, setIntegrationSelectActive] =
        useState(false)

    const [movieGenres, setMovieGenres] = useState({
        title: t('genres'),
    })

    const [movieCountry, setMovieCountry] = useState({
        name: t('Countries'),
    })
    const [movieYear, setMovieYear] = useState({
        slug: t('years'),
    })
    const [movieStudio, setMovieStudio] = useState({
        title: t('studio'),
    })

    const [copyGenres, setCopyGenres] = useState([])
    const [copyCountries, setCopyCountries] = useState([])
    const [copyYears, setCopyYears] = useState([])
    const [copyIntegrations, setCopyIntegrations] = useState([])
    const [selectedThings, setSelectedThings] = useState([])

    const integrations = [
        { title: 'Megogo', slug: 'Megogo' },
        { title: 'Premier', slug: 'Premier' },
        { title: t('others'), slug: 'others' },
    ]

    useEffect(() => {
        if (filterdetails?.genres) {
            setCopyGenres(
                filterdetails?.genres?.map((item) => ({
                    ...item,
                    isActive: false,
                    is_genre: true,
                })),
            )
        }
        if (filterdetails?.countries) {
            setCopyCountries(
                filterdetails?.countries?.map((item) => ({
                    ...item,
                    isActive: false,
                    is_country: true,
                })),
            )
        }
        if (integrations) {
            setCopyIntegrations(
                integrations?.map((item) => ({
                    ...item,
                    isActive: false,
                    is_integration: true,
                })),
            )
        }
    }, [filterdetails, filteredData])

    useEffect(() => {
        if (filteredData) {
            setCopyYears(
                filteredData?.map((item) => ({
                    ...item,
                    isActive: false,
                    is_year: true,
                })),
            )
        }
    }, [filteredData])

    const handleFilter = (id, type) => {
        let currentYear = ''
        if (type === 'genre') {
            const modifiedData = copyGenres?.find((item) => item.id === id)
            if (modifiedData?.isActive === false || !setGenresData) {
                modifiedData.isActive = true
                dispatch(genresSingleAction(modifiedData))
                // setMovieGenres(modifiedData)
            } else {
                setMovies([])
                if (setUserPage) {
                    setUserPage(null)
                }
                if (setUserYearId) {
                    setUserYearId(null)
                }
                setCurrentPage(1)
                if (setIsFullMegogo || setIsFullPremier) {
                    setIsFullMegogo(false)
                    setIsFullPremier(false)
                }
                modifiedData.isActive = false
                dispatch(genresSingleAction(modifiedData))
                // setMovieGenres(modifiedData)
            }
        } else if (type === 'country') {
            const modifiedData = copyCountries?.find((item) => item.slug === id)

            if (modifiedData?.isActive === false || !setCountriesData) {
                modifiedData.isActive = true
                dispatch(countrySingleAction(modifiedData))
                // setMovieCountry(modifiedData)
            } else {
                setMovies([])
                if (setUserPage) {
                    setUserPage(null)
                }
                setUserYearId(null)
                setCurrentPage(1)
                if (setIsFullMegogo || setIsFullPremier) {
                    setIsFullMegogo(false)
                    setIsFullPremier(false)
                }
                modifiedData.isActive = false
                dispatch(countrySingleAction(modifiedData))
                // setMovieCountry(modifiedData)
            }
        } else if (type === 'year') {
            const modifiedData = copyYears?.find((item) => item.slug === id)

            if (modifiedData?.isActive === false || !setYearsData) {
                modifiedData.isActive = true
                dispatch(yearSingleAction(modifiedData))
                // setMovieYear(modifiedData)
                currentYear = modifiedData?.slug
            } else {
                setMovies([])
                if (setUserPage) {
                    setUserPage(null)
                }
                setUserYearId(null)
                setCurrentPage(1)
                if (setIsFullMegogo || setIsFullPremier) {
                    setIsFullMegogo(false)
                    setIsFullPremier(false)
                }
                modifiedData.isActive = false
                dispatch(yearSingleAction(modifiedData))
                // setMovieYear({
                //     slug: t('years'),
                // })
                currentYear = ''
            }
        } else if (type === 'integration') {
            const modifiedData = copyIntegrations?.find(
                (item) => item.slug === id,
            )
            if (!modifiedData?.isActive) {
                modifiedData.isActive = true
                // setMovieStudio(modifiedData)
            } else {
                modifiedData.isActive = false
                // setMovieStudio(modifiedData)
            }
        }
        sendData(currentYear)
    }

    const sendData = (currentYear) => {
        const selectedGenres = []
        const selectedCountries = []
        const selectedYears = []
        const selectedIntegrations = []
        let result = []

        if (copyGenres && copyGenres?.length > 0) {
            for (let i = 0; i < copyGenres.length; i++) {
                if (copyGenres[i].isActive) {
                    selectedGenres.push(copyGenres[i]?.id)
                    result.push(copyGenres[i])
                }
            }
        } else {
            selectedGenres = null
        }

        if (copyCountries && copyCountries?.length > 0) {
            for (let i = 0; i < copyCountries.length; i++) {
                if (copyCountries[i].isActive) {
                    selectedCountries.push(copyCountries[i]?.name)
                    result.push(copyCountries[i])
                }
            }
        }

        if (copyYears && copyYears?.length > 0) {
            for (let i = 0; i < copyYears.length; i++) {
                if (copyYears[i].isActive) {
                    selectedYears.push(copyYears[i].slug)
                }
            }
        }

        if (copyIntegrations && copyIntegrations?.length > 0) {
            for (let i = 0; i < copyIntegrations.length; i++) {
                if (copyIntegrations[i].isActive) {
                    selectedIntegrations.push(copyIntegrations[i].slug)
                    result.push(copyIntegrations[i])
                } else {
                }
            }
        }
        dispatch(setGenresActions(selectedGenres?.join(',')))
        setFilterGenres(selectedGenres?.join(','))
        if (setFilterYear) {
            dispatch(yearsAction(currentYear))
            setFilterYear(currentYear)
        }
        if (setFilterCountries) {
            dispatch(setCountriesActions(selectedCountries?.join(',')))
            setFilterCountries(selectedCountries)
        }
        dispatch(filterMoviesAction(result))
        setSelectedThings(result)
    }

    useEffect(() => {
        document.addEventListener('click', detectClick, true)
    }, [])

    const detectClick = (e) => {
        if (genreRef?.current == e.target) {
            setgenreSelectActive((prev) => !prev)
        } else {
            setgenreSelectActive(false)
        }
        if (e.target == countryRef?.current) {
            setCountrySelectActive((prev) => !prev)
        } else {
            setCountrySelectActive(false)
        }
        if (e.target == yearRef?.current) {
            setYearSelectActive((prev) => !prev)
        } else {
            setYearSelectActive(false)
        }
        if (e.target == integrationRef?.current) {
            setIntegrationSelectActive((prev) => !prev)
        } else {
            setIntegrationSelectActive(false)
        }
    }

    useEffect(() => {
        if (!FilterMovies?.length) {
            setMovieGenres({
                title: t('genres'),
            })
            setMovieCountry({
                name: t('Countries'),
            })
            setMovieStudio({
                title: t('studio'),
            })
        }
    }, [FilterMovies])

    return (
        <div className="bg-[#1C192C] rounded-[12px] p-3 md:p-6 text-white">
            <div className="flex items-center gap-5 flex-wrap">
                {/* filter by genre */}
                <div className="min-w-full md:min-w-[220px] h-[56px] relative">
                    <button className="bg-white w-full h-full bg-opacity-10 text-left rounded-[12px] relative">
                        <p
                            ref={genreRef}
                            className="flex items-center w-full h-full px-5"
                        >
                            {movieGenres.title === singleGenre?.title
                                ? singleGenre?.title
                                : movieGenres.title}
                        </p>
                        <span
                            className={`absolute right-5 top-1/2 -translate-y-1/2 duration-300 ${
                                genreSelectActive ? '-rotate-90' : 'rotate-90'
                            }`}
                        >
                            <BreadcrumbArrow
                                className="rotate-3"
                                width="10"
                                height="14"
                            />
                        </span>
                    </button>

                    <div
                        className={`${detectHover ? cls.basicSelect : ''} ${
                            genreSelectActive
                                ? 'h-[160px] opacity-100 z-[99]'
                                : 'h-0 opacity-0 z-[-2]'
                        } bg-[#333041] w-full absolute left-0 top-[62px] rounded-[12px] duration-200`}
                        onMouseEnter={() => setDetectHover(true)}
                        onMouseLeave={() => setDetectHover(false)}
                    >
                        <ul className="flex flex-col space-y-[6px] h-full overflow-y-scroll py-2">
                            {copyGenres?.map((item, ind) => (
                                <li
                                    onClick={() =>
                                        handleFilter(item?.id, 'genre')
                                    }
                                    key={ind}
                                    className="py-[4px] px-5 cursor-pointer flex items-center justify-between"
                                >
                                    <span
                                        className={
                                            item?.isActive
                                                ? 'text-[#5086EC]'
                                                : ''
                                        }
                                    >
                                        {item?.title}
                                    </span>
                                    {item?.isActive && (
                                        <CheckIcon fill="#5086EC" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* filter by countries */}
                <div
                    className={`min-w-full md:min-w-[220px] h-[56px] relative ${
                        setFilterCountries ? '' : 'hidden'
                    }`}
                >
                    <button className="bg-white w-full h-full bg-opacity-10 text-left rounded-[12px] relative">
                        <p
                            ref={countryRef}
                            className="flex items-center w-full h-full px-5"
                        >
                            {singleCountry?.name === movieCountry?.name
                                ? singleCountry?.name
                                : movieCountry?.name}
                        </p>
                        <span
                            className={`absolute right-5 top-1/2 -translate-y-1/2 duration-300 ${
                                countrySelectActive ? '-rotate-90' : 'rotate-90'
                            }`}
                        >
                            <BreadcrumbArrow
                                className="rotate-3"
                                width="10"
                                height="14"
                            />
                        </span>
                    </button>
                    <div
                        className={`${detectHover ? cls.basicSelect : ''} ${
                            countrySelectActive
                                ? 'h-[160px] opacity-100 z-[99]'
                                : 'h-0 opacity-0 z-[-2]'
                        } bg-[#333041] w-full absolute left-0 top-[62px] rounded-[12px] duration-200`}
                        onMouseEnter={() => setDetectHover(true)}
                        onMouseLeave={() => setDetectHover(false)}
                    >
                        <ul className="flex flex-col space-y-[6px] h-full overflow-y-scroll py-2">
                            {copyCountries?.map((item, ind) => (
                                <li
                                    onClick={() =>
                                        handleFilter(item?.slug, 'country')
                                    }
                                    key={ind}
                                    className="py-[4px] px-5 cursor-pointer flex items-center justify-between"
                                >
                                    <span
                                        className={
                                            item?.isActive
                                                ? 'text-[#5086EC]'
                                                : ''
                                        }
                                    >
                                        {item?.name}
                                    </span>
                                    {item?.isActive && (
                                        <CheckIcon fill="#5086EC" />
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* filter by year */}
                <div
                    className={`min-w-full md:min-w-[220px] h-[56px] relative ${
                        setFilterYear ? '' : 'hidden'
                    }`}
                >
                    <button className="bg-white w-full h-full bg-opacity-10 text-left rounded-[12px] relative">
                        <p
                            ref={yearRef}
                            className="flex items-center w-full h-full px-5"
                        >
                            {singleYear?.slug === movieYear?.slug
                                ? singleYear?.slug === '-1969'
                                    ? 'до 1969'
                                    : singleYear?.slug
                                : movieYear?.slug === '-1969'
                                ? 'до 1969'
                                : movieYear?.slug}
                        </p>
                        <span
                            className={`absolute right-5 top-1/2 -translate-y-1/2 duration-300 ${
                                yearSelectActive ? '-rotate-90' : 'rotate-90'
                            }`}
                        >
                            <BreadcrumbArrow
                                className="rotate-3"
                                width="10"
                                height="14"
                            />
                        </span>
                    </button>
                    <div
                        className={`${detectHover ? cls.basicSelect : ''} ${
                            yearSelectActive
                                ? 'h-[160px] opacity-100 z-[99]'
                                : 'h-0 opacity-0 z-[-2]'
                        } bg-[#333041] w-full absolute left-0 top-[62px] rounded-[12px] duration-200`}
                        onMouseEnter={() => setDetectHover(true)}
                        onMouseLeave={() => setDetectHover(false)}
                    >
                        <ul className="flex flex-col space-y-[6px] h-full overflow-y-scroll py-2">
                            {copyYears?.map((item, ind) => (
                                <li
                                    onClick={() =>
                                        handleFilter(item?.slug, 'year')
                                    }
                                    key={ind}
                                    className="py-[4px] px-5 cursor-pointer flex items-center justify-between"
                                >
                                    <span
                                        className={
                                            item.slug == singleYear?.slug &&
                                            item?.isActive
                                                ? 'text-[#5086EC]'
                                                : ''
                                        }
                                    >
                                        {item.slug === '-1969'
                                            ? 'до 1969'
                                            : item.slug}
                                    </span>
                                    {item.slug == singleYear?.slug &&
                                        item.isActive && (
                                            <CheckIcon fill="#5086EC" />
                                        )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {/* mapping filters */}
            <div
                className={`flex overflow-x-scroll md:overflow-x-auto md:flex-wrap gap-[10px] scroll ${
                    FilterMovies?.length > 0 ? 'mt-6' : ''
                } ${
                    !FilterMovies?.length && singleYear?.isActive ? 'mt-6' : ''
                }`}
            >
                {FilterMovies?.map((item, ind) => {
                    return (
                        <div
                            onClick={() => {
                                if (item?.is_genre) {
                                    handleFilter(item.id, 'genre')
                                } else if (item?.is_country) {
                                    handleFilter(item.slug, 'country')
                                } else if (item?.is_year) {
                                    handleFilter(item.slug, 'year')
                                } else {
                                    handleFilter(item.slug, 'integration')
                                }
                            }}
                            key={ind}
                            className={`${
                                item?.isActive
                                    ? 'bg-white'
                                    : 'border-[1.5px] border-white border-opacity-10'
                            } bg-opacity-10 h-[48px] px-[17px] flex items-center rounded-full cursor-pointer`}
                        >
                            {console.log(FilterMovies)}
                            {item?.title ? item?.title : item?.name}
                            {item?.isActive && (
                                <span className="ml-3">
                                    <ClearIconDark />
                                </span>
                            )}
                        </div>
                    )
                })}
                {setYearsData && (
                    <div
                        onClick={() => {
                            handleFilter(singleYear?.slug, 'year')
                        }}
                        className={`${
                            singleYear?.isActive
                                ? 'bg-white'
                                : 'border-[1.5px] border-white border-opacity-10'
                        } bg-opacity-10 h-[48px] px-[17px] flex items-center rounded-full cursor-pointer`}
                    >
                        {singleYear?.slug === '-1969'
                            ? 'до 1969'
                            : singleYear?.slug}
                        {singleYear?.isActive && (
                            <span className="ml-3">
                                <ClearIconDark />
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
