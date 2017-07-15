///
/// \file   poll.js
/// \brief  Actions for our site's polls.
///

// Imports
import Axios from "axios";
import {replace, push} from "react-router-redux";
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

export const SearchPolls = {
    STARTED: "SEARCH_POLLS_STARTED",
    SUCCESS: "SEARCH_POLLS_SUCCESS",
    FAILED: "SEARCH_POLLS_FAILED",
    CLEAR: "SEARCH_POLLS_CLEAR"
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

// Search For Polls
function searchPollsStarted () {
    return {
        type: SearchPolls.STARTED,
        searching: true,
        searched: false
    };
}

function searchPollsSuccess (polls, lastPage) {
    return {
        type: SearchPolls.SUCCESS,
        searching: false,
        searched: true,
        polls,
        lastPage
    };
}

function searchPollsFailed (message) {
    return {
        type: SearchPolls.FAILED,
        searching: false,
        searched: false,
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
            choices: details.choices,
            keywords: details.keywords
        }, {
            headers: {
                "Authorization": details.jwt ? `Bearer ${details.jwt}` : ""
            }
        }).then(response => {
            const { message, pollId } = response.data;

            dispatch(createPollSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(push(`/poll/${pollId}`));
        }).catch(err => {
            const { status, message, details } = err.response.data.error;

            dispatch(createPollFailed(message));
            dispatch(deployFlash(message, details, FlashType.ERROR));

            if (status === 401) {
                dispatch(replace("/user/login"));
            }
        });
    }
}

export function fetchPoll (pollId) {
    return dispatch => {
        dispatch(fetchPollStarted());

        const token = getLoginToken();
        Axios.get(`/api/poll/${pollId}`, {
            headers: {
                "Authorization": token ? `Bearer ${token.rawToken}` : ""
            }
        })
            .then(response => {
                const { poll } = response.data;

                dispatch(fetchPollSuccess(poll));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(fetchPollFailed(message));
                dispatch(deployFlash(message, [], FlashType.ERROR));
                dispatch(replace("/"));
            });
    };
}

export function searchPolls (query, page) {
    return dispatch => {
        dispatch(searchPollsStarted());

        if (query) {
            Axios.get(`/api/poll/search?q=${query}&page=${page}`)
                .then(response => {
                    const { polls, lastPage } = response.data;

                    dispatch(searchPollsSuccess(polls, lastPage));
                })
                .catch(err => {
                    const { message } = err.response.data.error;

                    dispatch(searchPollsFailed(message));
                    dispatch(deployFlash(message, [], FlashType.ERROR));
                });
        } else {
            Axios.get(`/api/poll/all?page=${page}`)
            .then(response => {
                const { polls, lastPage } = response.data;

                dispatch(searchPollsSuccess(polls, lastPage));
            })
            .catch(err => {
                const { message } = err.response.data.error;

                dispatch(searchPollsFailed(message));
            });
        }
    };
}

export function clearSearchedPolls () {
    return {
        type: SearchPolls.CLEAR,
        searching: false,
        searched: false,
        polls: []
    };
}

export function castVote (details) {
    return dispatch => {
        dispatch(castVoteStarted());

        const token = getLoginToken();
        Axios.put(`/api/poll/vote/${details.pollId}`, {
            index: details.index
        }, {
            headers: {
                "Authorization": token ? `Bearer ${token.rawToken}` : ""
            }
        }).then(response => {
            const { message } = response.data;

            dispatch(castVoteSuccess(message));
            dispatch(deployFlash(message, [], FlashType.OK));
            dispatch(fetchPoll(details.pollId));
        }).catch(err => {
            const { status, message } = err.response.data.error;

            dispatch(castVoteFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));
            
            if (status === 401) {
                dispatch(replace("/user/login"));
            }
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
            dispatch(fetchPoll(details.pollId));
        }).catch(err => {
            const { status, message } = err.response.data.error;

            dispatch(addChoiceFailed(message));
            dispatch(deployFlash(message, [], FlashType.ERROR));

            if (status === 401) {
                dispatch(replace("/user/login"));
            }
        });
    };
}

export function removePoll (details) {
    return dispatch => {
        dispatch(removePollStarted());

        Axios.delete(`/api/poll/delete/${details.pollId}`, {
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
                dispatch(replace("/user/login"));
            }
        });
    };
}