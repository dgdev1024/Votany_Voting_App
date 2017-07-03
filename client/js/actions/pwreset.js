///
/// \file   pwreset.js
/// \brief  Actions related to password reset.
///

// Imports
import Axios from "axios";
import {push} from "react-router-redux";
import {FlashType, deployFlash} from "./flash";

// Action Types
export const ResetRequest = {
    STARTED: "RESET_REQUEST_STARTED",
    SUCCESS: "RESET_REQUEST_SUCCESS",
    FAILED: "RESET_REQUEST_FAILED"
};

export const ResetAuth = {
    STARTED: "RESET_AUTH_STARTED",
    SUCCESS: "RESET_AUTH_SUCCESS",
    FAILED: "RESET_AUTH_FAILED"
};

export const PasswordChange = {
    STARTED: "PW_CHANGE_STARTED",
    SUCCESS: "PW_CHANGE_SUCCESS",
    FAILED: "PW_CHANGE_FAILED"
};

// Local Action Creators
function resetRequestStarted () {
    return {
        type: ResetRequest.STARTED,
        requesting: true,
        requested: false
    };
}

function resetRequestSuccess (message) {
    return {
        type: ResetRequest.SUCCESS,
        requesting: false,
        requested: true,
        message
    };
}

function resetRequestFailed (message) {
    return {
        type: ResetRequest.FAILED,
        requesting: false,
        requested: false,
        message
    };
}

function resetAuthStarted () {
    return {
        type: ResetAuth.STARTED,
        authenticating: true,
        authenticated: false
    };
}

function resetAuthSuccess (message) {
    return {
        type: ResetAuth.SUCCESS,
        authenticating: false,
        authenticated: true,
        message
    };
}

function resetAuthFailed (message) {
    return {
        type: ResetAuth.FAILED,
        authenticating: false,
        authenticated: false,
        message
    };
}

function passwordChangeStarted () {
    return {
        type: PasswordChange.STARTED,
        changing: true,
        changed: false
    };
}

function passwordChangeSuccess (message) {
    return {
        type: PasswordChange.SUCCESS,
        changing: false,
        changed: true,
        message
    };
}

function passwordChangeFailed (message) {
    return {
        type: PasswordChange.FAILED,
        changing: false,
        changed: false,
        message
    };
}

// Exported Action Creators
export function resetRequest (emailAddress) {
    return dispatch => {
        dispatch(resetRequestStarted());

        Axios.post("/api/user/requestPasswordReset", {
            emailAddress: emailAddress
        }).then(response => {
            const { message } = response.data;

            dispatch(resetRequestSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push("/"));
        }).catch(err => {
            const { message } = err.response.data.error;

            dispatch(resetRequestFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));
        });
    }
}

export function resetAuth (authenticateId) {
    return dispatch => {
        dispatch(resetAuthStarted());

        Axios.get(`/api/user/authenticatePasswordReset/${authenticateId}`)
            .then(response => {
                const { message } = response.data;

                dispatch(resetAuthSuccess(message));
                dispatch(deployFlash(message, [], FlashType.OK));
                dispatch(push("/"));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(resetAuthFailed(message));
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(push("/"));
            });
    }
}

export function passwordChange (authenticateId, password, confirm) {
    return dispatch => {
        dispatch(passwordChangeStarted);

        Axios.post(`/api/user/changePassword/${authenticateId}`, {
            newPassword: password,
            confirmedPassword: confirm
        }).then(response => {
            const { message } = response.data;

            dispatch(passwordChangeSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push("/"));
        }).catch(err => {
            const { message } = err.response.data.error;

            dispatch(passwordChangeFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));
            dispatch(push("/"));
        });
    }
}