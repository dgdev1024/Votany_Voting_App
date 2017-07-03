///
/// \file   pwreset.js
/// \brief  Reducer functions for our password reset system.
///

// Imports
import {ResetRequest, ResetAuth, PasswordChange} from "../actions/pwreset";

// Initial States
const requestInitialState = {
    requesting: false,
    requested: false,
    message: ""
};

const authInitialState = {
    authenticating: false,
    authenticated: false,
    message: ""
};

const changeInitialState = {
    changing: false,
    changed: false,
    message: ""
};

// Reducer Functions
export function resetRequestReducer (state = requestInitialState, action) {
    switch (action.type) {
        case ResetRequest.STARTED:
            return Object.assign({}, state, {
                requesting: action.requesting,
                requested: action.requested,
                message: ""
            });
        case ResetRequest.SUCCESS:
            return Object.assign({}, state, {
                requesting: action.requesting,
                requested: action.requested,
                message: action.message
            });
        case ResetRequest.FAILED:
            return Object.assign({}, state, {
                requesting: action.requesting,
                requested: action.requested,
                message: action.message
            });
        default:
            return state;
    }
}

export function resetAuthReducer (state = authInitialState, action) {
    switch (action.type) {
        case ResetAuth.STARTED:
            return Object.assign({}, state, {
                authenticating: action.authenticating,
                authenticated: action.authenticated,
                message: ""
            });
        case ResetAuth.SUCCESS:
            return Object.assign({}, state, {
                authenticating: action.authenticating,
                authenticated: action.authenticated,
                message: action.message
            });
        case ResetAuth.FAILED:
            return Object.assign({}, state, {
                authenticating: action.authenticating,
                authenticated: action.authenticated,
                message: action.message
            });
        default:
            return state;
    }
}

export function passwordChangeReducer (state = changeInitialState, action) {
    switch (action.type) {
        case PasswordChange.STARTED:
            return Object.assign({}, state, {
                changing: action.changing,
                changed: action.changed,
                message: ""
            });
        case PasswordChange.SUCCESS:
            return Object.assign({}, state, {
                changing: action.changing,
                changed: action.changed,
                message: action.message
            });
        case PasswordChange.FAILED:
            return Object.assign({}, state, {
                changing: action.changing,
                changed: action.changed,
                message: action.message
            });
        default:
            return state;
    }
}