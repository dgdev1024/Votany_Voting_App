///
/// \file   flash.js
/// \brief  Reducer function for our flash message system.
///

// Imports
import {FlashActions, FlashType} from "../actions/flash";

// Initial State
const initialState = {
    flashText: "",
    flashType: FlashType.DEFAULT,
    flashDetails: []
};

// Reducer Function
export default function (state = initialState, action) {
    switch (action.type) {
        case FlashActions.TEXT:
            return Object.assign({}, state, {
                flashText: action.flashText,
                flashDetails: []
            });
        case FlashActions.TYPE:
            return Object.assign({}, state, {
                flashType: action.flashType
            });
        case FlashActions.DETAILS:
            return Object.assign({}, state, {
                flashDetails: action.flashDetails
            });
        case FlashActions.CLEAR:
            return Object.assign({}, state, {
                flashText: "",
                flashType: FlashType.DEFAULT,
                flashDetails: []
            });
        default:
            return state;
    }
};