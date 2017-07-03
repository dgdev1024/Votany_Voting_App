///
/// \file   main.js
/// \brief  The entry point for our application's frontend.
///

// All React, React Router, and Redux imports go here.
import React from "react";
import ReactDOM from "react-dom";
import {createStore, applyMiddleware} from "redux";
import Thunk from "redux-thunk";
import {Provider} from "react-redux";
import {ConnectedRouter, routerMiddleware} from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import MasterReducer from "./js/reducers";

// React Component Imports
import App from "./js/components/app";

// SCSS Imports
// ...

// Create the browser history and hook it into the router middleware.
const browserHistory = createHistory();
const browserRouter = routerMiddleware(browserHistory);

// Create the store.
const reduxStore = createStore(
    MasterReducer,
    applyMiddleware(
        browserRouter, Thunk
    )
);

// Render our app to the DOM.
ReactDOM.render(
    <Provider store={reduxStore}>
        <ConnectedRouter history={browserHistory}>
            <App />
        </ConnectedRouter>
    </Provider>,
    document.getElementById("content")
);