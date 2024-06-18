import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialCartState = {
    data: null,
}

const genresSingleReducer = (state = initialCartState, action) => {
    const { payload } = action
    switch (action.type) {
        case applicationActionTypes.SET_SINGLE_GENRE:
            return {
                data: payload,
            }
        default:
            return state
    }
}

export default genresSingleReducer
