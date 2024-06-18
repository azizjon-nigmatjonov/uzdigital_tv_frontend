import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const countriesReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_COUNTRIES:
            return {
                data: payload,
            }
        default:
            return state
    }
}

export default countriesReducer
