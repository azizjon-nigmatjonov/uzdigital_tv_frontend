import applicationActionTypes from './applicationActionTypes'

export const yearsAction = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_YEAR,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
