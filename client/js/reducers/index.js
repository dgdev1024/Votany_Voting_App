///
/// \file   index.js
/// \brief  Contains our master reducer.
///

// Imports
import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

// Reducer Imports
import flashReducer from "./flash";
import {loginReducer, checkLoginReducer} from "./login";
import {registerReducer, verifyReducer} from "./register";
import {resetRequestReducer, resetAuthReducer, passwordChangeReducer} from "./pwreset";
import {createReducer, fetchReducer, updateReducer, voteReducer, choiceReducer, removeReducer} from "./poll";

// Lump the router reducer, and our application's reducers, into a
// single master reducer. Export that reducer.
export default combineReducers({
    router: routerReducer,
    flash: flashReducer,
    login: loginReducer,
    checkLogin: checkLoginReducer,
    register: registerReducer,
    verify: verifyReducer,
    resetRequest: resetRequestReducer,
    resetAuth: resetAuthReducer,
    passwordChange: passwordChangeReducer,
    createPoll: createReducer,
    fetchPoll: fetchReducer,
    updatePoll: updateReducer,
    voteOnPoll: voteReducer,
    addPollChoice: choiceReducer,
    removePoll: removePoll
});