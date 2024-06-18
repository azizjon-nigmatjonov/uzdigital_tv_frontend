import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const filterMoviesReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_FILTER:
            return {
                data: payload,
            }
        case applicationActionTypes.CLEAR_FILM_FILTER:
            return {
                data: null,
            }
        default:
            return state
    }
}

export default filterMoviesReducer
