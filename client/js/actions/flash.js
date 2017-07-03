///
/// \file   flash.js
/// \brief  Actions related to our flash messages system.
///

// Flash Duration
let flashTimeout = null;

// Error Message Type Constants
export const FlashType = {
    DEFAULT: "DEFAULT",
    OK: "OK",
    ERROR: "ERROR"
};

// Set Message Actions
export const FlashActions = {
    TEXT: "SET_FLASH_TEXT",
    TYPE: "SET_FLASH_TYPE",
    DETAILS: "SET_FLASH_DETAILS",
    CLEAR: "CLEAR_FLASH"
};

// Action Creators
function setFlashText (flashText) {
    return {
        type: FlashActions.TEXT,
        flashText
    };
}

function setFlashType (flashType) {
    return {
        type: FlashActions.TYPE,
        flashType
    };
}

function setFlashDetails (flashDetails) {
    return {
        type: FlashActions.DETAILS,
        flashDetails
    };
}

function clearFlash () {
    return {
        type: FlashActions.CLEAR
    };
}

export function deployFlash (flashText, flashDetails, flashType) {
    return dispatch => {
        clearTimeout(flashTimeout);
        dispatch(setFlashText(flashText));
        dispatch(setFlashDetails(flashDetails));
        dispatch(setFlashType(flashType));

        if (!flashDetails || flashDetails.length > 0) {
            flashTimeout = setTimeout(() => dispatch(clearFlash()), 10000);
        } else {
            flashTimeout = setTimeout(() => dispatch(clearFlash()), 20000);
        }
    };
}