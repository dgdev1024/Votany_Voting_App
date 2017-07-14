///
/// \file   login.js
/// \brief  Actions related to user login.
///

// Imports
import Axios from "axios";
import {push, replace} from "react-router-redux";
import {FlashType, deployFlash} from "./flash";
import {getLoginToken, saveLoginToken, clearLoginToken} from "../utility/jwt";

// Action Types
export const LocalLogin = {
    STARTED: "LOCAL_LOGIN_STARTED",
    SUCCESS: "LOCAL_LOGIN_SUCCESS",
    FAILED: "LOCAL_LOGIN_FAILED"
};

export const CheckLogin = {
    STARTED: "CHECK_LOGIN_STARTED",
    SUCCESS: "CHECK_LOGIN_SUCCESS",
    FAILED: "CHECK_LOGIN_FAILED"
};

// Local Action Creators
function localLoginStarted () {
    return {
        type: LocalLogin.STARTED,
        message: "",
        loggingIn: true,
        loggedIn: false
    };
}

function localLoginSuccess (message, screenName) {
    return {
        type: LocalLogin.SUCCESS,
        loggingIn: false,
        loggedIn: true,
        message,
        screenName
    };
}

function localLoginFailed (message) {
    return {
        type: LocalLogin.FAILED,
        message,
        loggingIn: false,
        loggedIn: false
    };
}

function checkLoginStarted () {
    return {
        type: CheckLogin.STARTED,
        checking: true,
        passed: false
    };
}

function checkLoginSuccess (message, screenName) {
    return {
        type: CheckLogin.SUCCESS,
        checking: false,
        passed: true,
        message,
        screenName
    };
}

function checkLoginFailed (message) {
    return {
        type: CheckLogin.FAILED,
        checking: false,
        passed: false,
        screenName: "",
        message
    };
}

// Asynchronous Action Creators
export function localLogin (screenName, password) {
    return dispatch => {
        dispatch(localLoginStarted());

        Axios.post("/api/user/login", {
            screenName,
            password
        }).then(response => {
            const { message, token, screenName } = response.data;

            // Save the login token in the browser's local storage.
            saveLoginToken(token);

            // Dispatch our actions.
            dispatch(localLoginSuccess(message, screenName));
            dispatch(checkLoginSuccess(message, screenName));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(replace("/"));
        }).catch(err => {
            const { message, details } = err.response.data.error;

            dispatch(localLoginFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));
        });
    };
};

export function logout () {
    return dispatch => {
        clearLoginToken();
        dispatch(checkLoginFailed("You are now logged off."));
        dispatch(deployFlash("You are now logged off.", [], FlashType.OK));
        dispatch(replace("/"));
    };
}

export function checkLogin (redirectOnFail, redirectOnSuccess) {
    return dispatch => {
        dispatch(checkLoginStarted());

        // Get the login token. Check to see if it is good.
        const token = getLoginToken();
        if (!token) {
            dispatch(checkLoginFailed("You are not logged in."));

            if (redirectOnFail === true) {
                dispatch(deployFlash("You need to be logged in to use this feature.", [], FlashType.ERROR));
                dispatch(replace("/user/login"));
            }

            return;
        }

        // Check the token with the server.
        Axios.get("/api/user/testlogin", {
            headers: {
                "Authorization": `Bearer ${token.rawToken}`
            }
        }).then(response => {
            const { message, screenName } = response.data;

            dispatch(checkLoginSuccess(message, screenName));

            if (redirectOnSuccess === true) {
                dispatch(deployFlash("You need to be logged out to access this page.", [], FlashType.DEFAULT))
                dispatch(replace("/"));
            }
        }).catch(err => {
            const { message } = err.response.data.error;

            clearLoginToken();
            dispatch(checkLoginFailed(message));

            if (redirectOnFail === true) {
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(replace("/user/login"));
            }
        });
    }
};