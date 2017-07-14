///
/// \file   profile.js
/// \brief  Actions for fetching user profiles.
///

// Imports
import Axios from "axios";
import {replace} from "react-router-redux";
import {deployFlash, FlashType} from "./flash";

// Action Types
export const FetchProfile = {
    STARTED: "FETCH_PROFILE_STARTED",
    SUCCESS: "FETCH_PROFILE_SUCCESS",
    FAILED: "FETCH_PROFILE_FAILED"
};

// Local Action Creators
function fetchProfileStarted () {
    return {
        type: FetchProfile.STARTED,
        fetching: true,
        fetched: false
    };
}

function fetchProfileSuccess (profile) {
    return {
        type: FetchProfile.SUCCESS,
        fetching: false,
        fetched: true,
        profile
    };
}

function fetchProfileFailed (message) {
    return {
        type: FetchProfile.FAILED,
        fetching: false,
        fetched: false,
        message
    };
}

// Exported Action Creators
export function fetchProfile (screenName) {
    return dispatch => {
        dispatch(fetchProfileStarted());

        Axios.get(`/api/user/profile/${screenName}`)
            .then(response => {
                const { profile } = response.data;

                dispatch(fetchProfileSuccess(profile));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(fetchProfileFailed(message));
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(replace("/"));
            });
    };
}