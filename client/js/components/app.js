///
/// \file   app.js
/// \brief  The frontend's primary component.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import {checkLogin} from "../actions/login";
import Topbar from "./topbar";
import Flash from "./flash";
import HomePage from "./home";
import LoginPage from "./login";
import LogoutPage from "./logout";
import RegisterPage from "./register";
import VerifyPage from "./verify";
import ResetRequestPage from "./resetRequest";
import ResetAuthPage from "./resetAuth";
import ChangePasswordPage from "./changePassword";
import ViewProfilePage from "./viewProfile";
import CreatePollPage from "./createPoll";
import ViewPollPage from "./viewPoll";

///
/// \class  App
/// \brief  The primary component for our application's frontend.
///
class App extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.checkLogin(false);
    }

    render () {
        return (
            <div>
                <Topbar screenName={this.props.checkedLogin.screenName}
                        checkingLogin={this.props.checkedLogin.checking} />
                <div className="vta-body">
                    <Flash text={this.props.flash.flashText}
                           type={this.props.flash.flashType}
                           details={this.props.flash.flashDetails} />
                    <Switch>
                        <Route exact path="/" component={HomePage} />
                        <Route path="/user/login" component={LoginPage} />
                        <Route path="/user/logout" component={LogoutPage} />
                        <Route path="/user/register" component={RegisterPage} />
                        <Route path="/user/verify/:verifyId" component={VerifyPage} />
                        <Route path="/user/requestPasswordReset" component={ResetRequestPage} />
                        <Route path="/user/authenticatePasswordReset/:authenticateId" component={ResetAuthPage} />
                        <Route path="/user/changePassword/:authenticateId" component={ChangePasswordPage} />
                        <Route path="/user/profile/:screenName" component={ViewProfilePage} />
                        <Route path="/poll/create" component={CreatePollPage} />
                        <Route path="/poll/:pollId" component={ViewPollPage} />
                    </Switch>
                </div>
                <p className="vta-footer">
                    Coded by Dennis Griffin.
                </p>
            </div>
        );
    }
};

// Exports
export default withRouter(
    connect(
        state => {
            return {
                checkedLogin: state.checkLogin,
                flash: state.flash
            };
        },
        dispatch => {
            return {
                checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
                deployFlash: (tx, dt, ty) => dispatch(deployFlash(tx, dt, ty))
            };
        }
    )(App)
);