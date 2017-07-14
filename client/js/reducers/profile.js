///
/// \file   profile.js
/// \brief  Reducer function for fetching user profiles.
///

// Imports
import {FetchProfile} from "../actions/profile";

// Fetch Initial State
const fetchInitialState = {
    fetching: false,
    fetched: false,
    profile: null,
    message: ""
};

// Reducer Functions
export function fetchProfileReducer (state = fetchInitialState, action) {
    switch (action.type) {
        case FetchProfile.STARTED:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                profile: null,
                message: ""
            });
        case FetchProfile.SUCCESS:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                profile: action.profile,
                message: ""
            });
        case FetchProfile.FAILED:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                profile: null,
                message: action.message
            });
        default:
            return state;
    }
}
