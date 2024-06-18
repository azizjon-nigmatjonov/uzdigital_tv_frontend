import applicationActionTypes from './applicationActionTypes'

export const setCountriesActions = (data) => (dispatch) => {
    try {
        dispatch({
            type: applicationActionTypes.SET_COUNTRIES,
            payload: data,
        })
    } catch (error) {
        console.log(error)
    }
}
