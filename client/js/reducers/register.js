///
/// \file   register.js
/// \brief  Reducer functions for our register and verify actions.
///

// Imports
import {LocalRegister, LocalVerify} from "../actions/register";

// Initial States
const registerInitialState = {
    registering: false,
    registered: false,
    message: ""
};

const verifyInitialState = {
    verifying: false,
    verified: false,
    message: ""
};

// Reducer Functions
export function registerReducer (state = registerInitialState, action) {
    switch (action.type) {
        case LocalRegister.STARTED:
            return Object.assign({}, state, {
                registering: action.registering,
                registered: action.registered
            });
        case LocalRegister.SUCCESS:
            return Object.assign({}, state, {
                registering: action.registering,
                registered: action.registered,
                message: action.message
            });
        case LocalRegister.FAILED:
            return Object.assign({}, state, {
                registering: action.registering,
                registered: action.registered,
                message: action.message
            });
        default:
            return state;
    }
}

export function verifyReducer (state = verifyInitialState, action) {
    switch (action.type) {
        case LocalVerify.STARTED:
            return Object.assign({}, state, {
                verifying: action.verifying,
                verified: action.verified
            });
        case LocalVerify.SUCCESS:
            return Object.assign({}, state, {
                verifying: action.verifying,
                verified: action.verified,
                message: action.message
            });
        case LocalVerify.FAILED:
            return Object.assign({}, state, {
                verifying: action.verifying,
                verified: action.verified,
                message: action.message
            });
        default:
            return state;
    }
}