import applicationActionTypes from './applicationActionTypes'

export const yearSingleAction = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_SINGLE_YEAR,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
