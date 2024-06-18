import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import alertReducer from './alertReducer'
import applicationReducers from './applicationReducers'
import searchReducer from './searchReducer'
import recommendationReducer from './recommendationReducer'
import profilesReducer from './profilesReducer'
import categoriesReducer from './categoriesReducer'
import profileReducer from './profileReducer'
import notificationReducer from './notificationReducer'
import movieDataReducer from './movieDataReducer'
import moviesTabReducer from './moviesTabReducer'
import bannerReducer from './bannerReducer'
import genresReducer from './genresReducer'
import filterMoviesReducer from './filterMoviesReducer'
import genresSingleReducer from './genresSingleReducer'
import yearsSingleReducer from './yearsSingleReducer'
import countriesSingleReducer from './countriesSingleReducer'
import countriesReducer from './countriesReducer'
import yearsReducer from './yearsReducer'
import userBalanceReducer from './userBalanceReducer'
import myCardsReducer from './myCardsReducer'

const profilePersistConfig = {
    key: 'profile',
    storage,
}

const recommendPersistConfig = {
    key: 'recommend',
    storage,
}

const categoriesPersistConfig = {
    key: 'categories',
    storage,
}

const mainProfilePersistConfig = {
    key: 'mainProfile',
    storage,
}

const notificationPersistConfig = {
    key: 'notification',
    storage,
}

const moviesTabPersistConfig = {
    key: 'moviesTabCurrent',
    storage,
}

const bannerPersistConfig = {
    key: 'banner',
    storage,
}
const genresPersistConfig = {
    key: 'genres',
    storage,
}
const filterMoviesPersistConfig = {
    key: 'filter',
    storage,
}
const genreSinglePersistConfig = {
    key: 'single-genre',
    storage,
}
const yearSinglePersistConfig = {
    key: 'single-year',
    storage,
}
const countrySinglePersistConfig = {
    key: 'single-country',
    storage,
}
const countriestPersistConfig = {
    key: 'single-country',
    storage,
}
const yearsPersistConfig = {
    key: 'years',
    storage,
}
const searchPersistConfig = {
    key: 'search',
    storage,
}
const userBalancePersistConfig = {
    key: 'user-balance',
    storage,
}

const rootReducer = combineReducers({
    application: applicationReducers,
    alert: alertReducer,
    myCardsReducer: myCardsReducer,
    searchReducer: persistReducer(searchPersistConfig, searchReducer),
    recommend: persistReducer(recommendPersistConfig, recommendationReducer),
    profile: persistReducer(profilePersistConfig, profilesReducer),
    categories: persistReducer(categoriesPersistConfig, categoriesReducer),
    yearsSingleReducer: persistReducer(
        yearSinglePersistConfig,
        yearsSingleReducer,
    ),
    countriesSingleReducer: persistReducer(
        countrySinglePersistConfig,
        countriesSingleReducer,
    ),
    userBalanceReducer: persistReducer(
        userBalancePersistConfig,
        userBalanceReducer,
    ),
    countriesReducer: persistReducer(countriestPersistConfig, countriesReducer),
    mainProfile: persistReducer(mainProfilePersistConfig, profileReducer),
    filterMoviesReducer: persistReducer(
        filterMoviesPersistConfig,
        filterMoviesReducer,
    ),
    genresSingleReducer: persistReducer(
        genreSinglePersistConfig,
        genresSingleReducer,
    ),
    yearsReducer: persistReducer(yearsPersistConfig, yearsReducer),
    notification: persistReducer(
        notificationPersistConfig,
        notificationReducer,
    ),
    genresReducer: persistReducer(genresPersistConfig, genresReducer),
    movieData: movieDataReducer,
    moviesTabCurrent: persistReducer(moviesTabPersistConfig, moviesTabReducer),
    bannerData: persistReducer(bannerPersistConfig, bannerReducer),
})

export default rootReducer
