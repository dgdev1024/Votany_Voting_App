///
/// \file   register.js
/// \brief  Actions related to local user registration and verification.
///

// Imports
import Axios from "axios";
import {push} from "react-router-redux";
import {FlashType, deployFlash} from "./flash";

// Action Types
export const LocalRegister = {
    STARTED: "LOCAL_REGISTER_STARTED",
    SUCCESS: "LOCAL_REGISTER_SUCCESS",
    FAILED: "LOCAL_REGISTER_FAILED"
};

export const LocalVerify = {
    STARTED: "LOCAL_VERIFY_STARTED",
    SUCCESS: "LOCAL_VERIFY_SUCCESS",
    FAILED: "LOCAL_VERIFY_FAILED"
};

// Local Action Creators
function localRegisterStarted () {
    return {
        type: LocalRegister.STARTED,
        registering: true,
        registered: false
    };
}

function localRegisterSuccess (message) {
    return {
        type: LocalRegister.SUCCESS,
        registering: false,
        registered: true,
        message
    };
}

function localRegisterFailed (message) {
    return {
        type: LocalRegister.FAILED,
        registering: false,
        registered: false,
        message
    };
}

function localVerifyStarted () {
    return {
        type: LocalVerify.STARTED,
        verifying: true,
        verified: false
    };
}

function localVerifySuccess (message) {
    return {
        type: LocalVerify.SUCCESS,
        verifying: false,
        verified: true,
        message
    };
}

function localVerifyFailed (message) {
    return {
        type: LocalVerify.FAILED,
        verifying: false,
        verified: false,
        message
    };
}

// Exported Action Creators
function localRegister (credentials) {
    return dispatch => {
        dispatch(localRegisterStarted());

        Axios.post("/api/user/register", {
            screenName: credentials.screenName,
            emailAddress: credentials.emailAddress,
            password: credentials.password,
            confirm: credentials.confirm
        }).then(response => {
            const { message } = response.data;

            dispatch(localRegisterSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push("/"));
        }).catch(err => {
            const { message, details } = err.response.data.error;

            dispatch(localRegisterFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));
        });
    };
}

export function localVerify (verifyId) {
    return dispatch => {
        dispatch(localVerifyStarted());

        Axios.get(`/api/user/verify/${verifyId}`)
            .then(response => {
                const { message } = response.data;

                dispatch(localVerifySuccess(message));
                dispatch(deployFlash(message, [], FlashType.OK));
                dispatch(push("/login"));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(localVerifyFailed(message));
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(push("/"));
            });
    };
}