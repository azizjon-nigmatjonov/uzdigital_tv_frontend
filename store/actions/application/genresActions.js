import applicationActionTypes from './applicationActionTypes'

export const setGenresActions = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_GENRES,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
