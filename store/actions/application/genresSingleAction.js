import applicationActionTypes from './applicationActionTypes'

export const genresSingleAction = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_SINGLE_GENRE,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
