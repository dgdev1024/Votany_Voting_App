///
/// \file   poll.js
/// \brief  Actions for our site's polls.
///

// Imports
import Axios from "axios";
import {push} from "react-router-redux";
import {FlashType, deployFlash} from "./flash";
import {getLoginToken} from "../utility/jwt";

// Action Types
export const CreatePoll = {
    STARTED: "CREATE_POLL_STARTED",
    SUCCESS: "CREATE_POLL_SUCCESS",
    FAILED: "CREATE_POLL_FAILED"
};

export const FetchPoll = {
    STARTED: "FETCH_POLL_STARTED",
    SUCCESS: "FETCH_POLL_SUCCESS",
    FAILED: "FETCH_POLL_FAILED"
};

export const UpdatePoll = {
    STARTED: "UPDATE_POLL_STARTED",
    SUCCESS: "UPDATE_POLL_SUCCESS",
    FAILED: "UPDATE_POLL_FAILED"
};

export const CastVote = {
    STARTED: "CAST_VOTE_STARTED",
    SUCCESS: "CAST_VOTE_SUCCESS",
    FAILED: "CAST_VOTE_FAILED"
};

export const AddChoice = {
    STARTED: "ADD_CHOICE_STARTED",
    SUCCESS: "ADD_CHOICE_SUCCESS",
    FAILED: "ADD_CHOICE_FAILED"
};

export const RemovePoll = {
    STARTED: "REMOVE_POLL_STARTED",
    SUCCESS: "REMOVE_POLL_SUCCESS",
    FAILED: "REMOVE_POLL_FAILED"
};

// Local Action Creators
// Create Poll
function createPollStarted () {
    return {
        type: CreatePoll.STARTED,
        creating: true,
        created: false
    };
}

function createPollSuccess (message) {
    return {
        type: CreatePoll.SUCCESS,
        creating: false,
        created: true,
        message
    };
}

function createPollFailed (message) {
    return {
        type: CreatePoll.FAILED,
        creating: false,
        created: false,
        message
    };
}

// Fetch Poll
function fetchPollStarted () {
    return {
        type: FetchPoll.STARTED,
        fetching: true,
        fetched: false
    };
}

function fetchPollSuccess (poll) {
    return {
        type: FetchPoll.SUCCESS,
        fetching: false,
        fetched: true,
        poll
    };
}

function fetchPollFailed (message) {
    return {
        type: FetchPoll.FAILED,
        fetching: false,
        fetched: false,
        message
    };
}

// Update Poll
function updatePollStarted () {
    return {
        type: UpdatePoll.STARTED,
        updating: true,
        updated: false
    };
}

function updatePollSuccess (message) {
    return {
        type: UpdatePoll.SUCCESS,
        updating: false,
        updated: true,
        message
    };
}

function updatePollFailed (message) {
    return {
        type: UpdatePoll.FAILED,
        updating: false,
        updated: false,
        message  
    };
}

// Cast Vote
function castVoteStarted () {
    return {
        type: CastVote.STARTED,
        voting: true,
        voted: false
    };
}

function castVoteSuccess (message) {
    return {
        type: CastVote.SUCCESS,
        voting: false,
        voted: true,
        message
    };
}

function castVoteFailed (message) {
    return {
        type: CastVote.FAILED,
        voting: false,
        voted: false,
        message
    };
}

// Add Choice
function addChoiceStarted () {
    return {
        type: AddChoice.STARTED,
        adding: true,
        added: false
    };
}

function addChoiceSuccess (message) {
    return {
        type: AddChoice.SUCCESS,
        adding: false,
        added: true,
        message
    };
}

function addChoiceFailed (message) {
    return {
        type: AddChoice.FAILED,
        adding: false,
        added: false,
        message
    };
}

// Remove Poll
function removePollStarted () {
    return {
        type: RemovePoll.STARTED,
        removing: true,
        removed: false
    };
}

function removePollSuccess (message) {
    return {
        type: RemovePoll.SUCCESS,
        removing: false,
        removed: true,
        message
    };
}

function removePollFailed (message) {
    return {
        type: RemovePoll.FAILED,
        removing: false,
        removed: false,
        message
    };
}

// Asynchronous Action Creators
export function createPoll (details) {
    return dispatch => {
        dispatch(createPollStarted());

        Axios.post("/api/poll/create", {
            author: details.author,
            issue: details.issue,
            choices: details.choices
        }, {
            headers: {
                "Authorization": `Bearer ${details.jwt}`
            }
        }).then(response => {
            const { message, pollId } = response.data;

            dispatch(createPollSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(`/poll/${pollId}`);
        }).catch(err => {
            const { status, message, details } = err.response.data.error;

            dispatch(createPollFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));

            if (status === 401) {
                dispatch(push("/user/login"));
            }
        });
    }
}

export function fetchPoll (pollId) {
    return dispatch => {
        dispatch(fetchPollStarted());

        Axios.get(`api/poll/${pollId}`)
            .then(response => {
                const { poll } = response.data;

                dispatch(fetchPollSuccess(poll));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(fetchPollFailed(message));
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(push("/"));
            });
    };
}

export function updatePoll (details) {
    return dispatch => {
        dispatch(updatePollStarted());

        Axios.put(`/api/poll/update/${details.pollId}`, {
            issue: details.issue,
            choices: details.choices
        }, {
            headers: {
                "Authorization": `Bearer ${details.jwt}`
            }
        }).then(response => {
            const { message } = response.data;

            dispatch(updatePollSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push(`/poll/${details.pollId}`));
        }).catch(err => {
            const { status, message, details } = err.response.data.error;

            dispatch(updatePollFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));

            if (status === 401) {
                dispatch(push("/user/login"));
            }
        });
    }
}

export function castVote (details) {
    return dispatch => {
        dispatch(castVoteStarted());

        const token = getLoginToken();
        Axios.put(`/api/poll/vote/${details.pollId}`, {
            index: details.index
        }, {
            headers: {
                "Authorization": token ? token.rawToken : ""
            }
        }).then(response => {
            const { message } = response.data;

            dispatch(castVoteSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
        }).catch(err => {
            const { status, message } = err.response.data.error;

            dispatch(castVoteFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));
        });
    }
}

export function addChoice (details) {
    return dispatch => {
        dispatch(addChoiceStarted());

        Axios.put(`/api/poll/addchoice/${details.pollId}`, {
            choice: details.choice
        }, {
            headers: {
                "Authorization": `Bearer ${details.jwt}`
            }
        }).then(response => {
            const { message } = response.data;

            dispatch(addChoiceSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
        }).catch(err => {
            const { status, message } = err.response.data.error;

            dispatch(addChoiceFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));

            if (status === 401) {
                dispatch(push("/user/login"));
            }
        });
    };
}

export function removePoll (details) {
    return dispatch => {
        dispatch(removePollStarted());

        Axios.delete(`/api/poll/remove/${details.pollId}`, {
            headers: {
                "Authorization": `Bearer ${details.jwt}`
            }
        }).then(response => {
            const { message } = response.data;

            dispatch(removePollSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push("/"));
        }).catch(err => {
            const { status, message } = err.response.data.error;

            dispatch(removePollFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));

            if (status === 401) {
                dispatch(push("/user/login"));
            }
        });
    };
}