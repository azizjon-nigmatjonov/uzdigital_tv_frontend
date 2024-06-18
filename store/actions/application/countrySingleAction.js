import applicationActionTypes from './applicationActionTypes'

export const countrySingleAction = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_SINGLE_COUNTRY,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
