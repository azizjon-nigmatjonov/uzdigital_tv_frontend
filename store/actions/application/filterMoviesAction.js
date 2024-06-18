import applicationActionTypes from './applicationActionTypes'

export const filterMoviesAction = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_FILTER,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
export const clearFilterAction = () => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.CLEAR_FILM_FILTER,
            payload: [],
        })
    } catch (error) {
        console.log(error)
    }
}
