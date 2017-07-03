///
/// \file   poll.js
/// \brief  Reducer functions for our poll actions.
///

import {
    CreatePoll,
    FetchPoll,
    UpdatePoll,
    CastVote,
    AddChoice,
    RemovePoll
} from "../actions/poll";

// Initial States
const createInitialState = {
    creating: false,
    created: false,
    message: ""
};

const fetchInitialState = {
    fetching: false,
    fetched: false,
    poll: null,
    message: ""
};

const updateInitialState = {
    updating: false,
    updated: false,
    message: ""
};

const voteInitialState = {
    voting: false,
    voted: false,
    message: ""
};

const choiceInitialState = {
    adding: false,
    added: false,
    message: ""
};

const removeInitialState = {
    removing: false,
    removed: false,
    message: ""
};

// Reducer Functions
export function createReducer (state = createInitialState, action) {    
    switch (action.type) {
        case CreatePoll.STARTED:
            return Object.assign({}, state, {
                creating: action.creating,
                created: action.created,
                message: ""
            });
        case CreatePoll.SUCCESS:
            return Object.assign({}, state, {
                creating: action.creating,
                created: action.created,
                message: ""
            });
        case CreatePoll.FAILED:
            return Object.assign({}, state, {
                creating: action.creating,
                created: action.created,
                message: action.message
            });
        default:
            return state;
    }
}

export function fetchReducer (state = fetchInitialState, action) {
    switch (action.type) {
        case FetchPoll.STARTED:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                poll: null,
                message: ""
            });
        case FetchPoll.SUCCESS:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                poll: action.poll,
                message: ""
            });
        case FetchPoll.FAILED:
            return Object.assign({}, state, {
                fetching: action.fetching,
                fetched: action.fetched,
                poll: null,
                message: action.message
            });
        default:
            return state;
    }
}

export function updateReducer (state = updateInitialState, action) {
    switch (action.type) {
        case UpdatePoll.STARTED:
            return Object.assign({}, state, {
                updating: action.updating,
                updated: action.updated,
                message: ""
            });
        case UpdatePoll.SUCCESS:
            return Object.assign({}, state, {
                updating: action.updating,
                updated: action.updated,
                message: action.message
            });
        case UpdatePoll.FAILED:
            return Object.assign({}, state, {
                updating: action.updating,
                updated: action.updated,
                message: action.message
            });
        default:
            return state;
    }
}

export function voteReducer (state = voteInitialState, action) {
    switch (action.type) {
        case CastVote.STARTED:
            return Object.assign({}, state, {
                voting: action.voting,
                voted: action.voted,
                message: ""
            });

        case CastVote.SUCCESS:
            return Object.assign({}, state, {
                voting: action.voting,
                voted: action.voted,
                message: action.message
            });

        case CastVote.FAILED:
            return Object.assign({}, state, {
                voting: action.voting,
                voted: action.voted,
                message: action.message
            });

        default:
            return state;
    }
}

export function choiceReducer (state = choiceInitialState, action) {
    switch (action.type) {
        case AddChoice.STARTED:
            return Object.assign({}, state, {
                adding: action.adding,
                added: action.added,
                message: ""
            });
        case AddChoice.SUCCESS:
            return Object.assign({}, state, {
                adding: action.adding,
                added: action.added,
                message: action.message
            });
        case AddChoice.FAILED:
            return Object.assign({}, state, {
                adding: action.adding,
                added: action.added,
                message: action.message
            });
        default:
            return state;
    }
}

export function removeReducer (state = removeInitialState, action) {
    switch (action.type) {
        case RemovePoll.STARTED:
            return Object.assign({}, state, {
                removing: action.removing,
                removed: action.removed,
                message: ""
            });
        case RemovePoll.SUCCESS:
            return Object.assign({}, state, {
                removing: action.removing,
                removed: action.removed,
                message: action.message
            });
        case RemovePoll.FAILED:
            return Object.assign({}, state, {
                removing: action.removing,
                removed: action.removed,
                message: action.message
            });
        default:
            return state;
    }
}