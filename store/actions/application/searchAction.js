import applicationActionTypes from './applicationActionTypes'

export const setSearchAction = (data) => {
    return {
        type: applicationActionTypes.SET_SEARCH,
        payload: data,
    }
}

export const setSearchValue = (data) => {
    return {
        type: applicationActionTypes.SET_SEARCH_VALUE,
        payload: data,
    }
}

export const setTvSearchValue = (data) => {
    return {
        type: applicationActionTypes.SET_TV_SEARCH_VALUE,
        payload: data,
    }
}

export const setTvSearchValueByTyping = (data) => {
    return {
        type: applicationActionTypes.SET_TV_SEARCH_TYPING_VALUE,
        payload: data,
    }
}
