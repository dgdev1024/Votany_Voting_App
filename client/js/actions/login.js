///
/// \file   login.js
/// \brief  Actions related to user login.
///

// Imports
import Axios from "axios";
import {push} from "react-router-redux";
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
        passed: false,
        screenName: ""
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
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push("/"));
        }).catch(err => {
            const { message, details } = err.response.data.error;

            dispatch(localLoginFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));
        });
    };
};

export function checkLogin (redirect) {
    return dispatch => {
        dispatch(checkLoginStarted());

        // Get the login token. Check to see if it is good.
        const token = getLoginToken();
        if (!token) {
            dispatch(checkLoginFailed("You are not logged in."));

            if (redirect === true) {
                dispatch(deployFlash("You need to be logged in to use this feature.", [], FlashType.ERROR));
                dispatch(push("/login"));
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
        }).catch(err => {
            const { message } = err.response.data.error;

            dispatch(checkLoginFailed(message));

            if (redirect === true) {
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(push("/login"));
            }
        });
    }
};