///
/// \file   login.js
/// \brief  Reducer function for our login actions.
///

// Imports
import {LocalLogin, CheckLogin} from "../actions/login";

// Initial State
const loginInitialState = {
    loggingIn: false,
    loggedIn: false,
    message: "",
    screenName: ""
};

const checkLoginInitialState = {
    checking: false,
    passed: false,
    message: "",
    screenName: ""
};

// Reducer Functions
export function loginReducer (state = loginInitialState, action) {
    switch (action.type) {
        case LocalLogin.STARTED:
            return Object.assign({}, state, {
                loggingIn: action.loggingIn,
                loggedIn: action.loggedIn,
                screenName: ""
            });
        case LocalLogin.SUCCESS:
            return Object.assign({}, state, {
                loggingIn: action.loggingIn,
                loggedIn: action.loggedIn,
                screenName: action.screenName
            });
        case LocalLogin.FAILED:
            return Object.assign({}, state, {
                loggingIn: action.loggingIn,
                loggedIn: action.loggedIn,
                message: action.message,
                screenName: ""
            });
        default:
            return state;
    }
}

export function checkLoginReducer (state = checkLoginInitialState, action) {
    switch (action) {
        case CheckLogin.STARTED:
            return Object.assign({}, state, {
                checking: action.checking,
                passed: action.passed,
                message: "",
                screenName: ""
            });
        case CheckLogin.PASSED:
            return Object.assign({}, state, {
                checking: action.checking,
                passed: action.passed,
                message: action.message,
                screenName: action.screenName
            });
        case CheckLogin.FAILED:
            return Object.assign({}, state, {
                checking: action.checking,
                passed: action.passed,
                message: action.message,
                screenName: action.screenName
            });
        default:
            return state;
    }
}