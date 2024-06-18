import applicationActionTypes from './applicationActionTypes'

export const setProfile = (data) => {
    return {
        type: applicationActionTypes.SET_PROFILE,
        payload: data,
    }
}

export const setProfileType = (data) => {
    return {
        type: applicationActionTypes.SET_PROFILE_TYPE,
        payload: data,
    }
}
