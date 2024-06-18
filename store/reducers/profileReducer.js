import applicationActionTypes from '../actions/application/applicationActionTypes'

const initialState = {
    profile_value: null,
    profile_type: 'adult',
}

const profileReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case applicationActionTypes.SET_PROFILE:
            return {
                ...state,
                profile_value: payload,
            }
        case applicationActionTypes.SET_PROFILE_TYPE:
            return {
                ...state,
                profile_type: payload,
            }
        default:
            return state
    }
}

export default profileReducer
