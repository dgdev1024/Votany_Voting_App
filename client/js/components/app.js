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
import LoginPage from "./login";
import LogoutPage from "./logout";
import RegisterPage from "./register";
import VerifyPage from "./verify";
import ResetRequestPage from "./resetRequest";
import ResetAuthPage from "./resetAuth";
import ChangePasswordPage from "./changePassword";

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

    componentWillReceiveProps (next) {
        if (next.checkedLogin.screenName !== this.props.checkedLogin.screenName) {
            console.log(next.checkedLogin.screenName);
        }
    }

    render () {
        return (
            <div>
                <Topbar screenName={this.props.checkedLogin.screenName} />
                <div className="vta-body">
                    <Flash text={this.props.flash.flashText}
                           type={this.props.flash.flashType}
                           details={this.props.flash.flashDetails} />
                    {
                        this.props.checkedLogin.screenName ?
                        (
                            <Switch>
                                <Route path="/user/logout" component={LogoutPage} />
                                <Route path="/user/verify/:verifyId" component={VerifyPage} />
                                <Route path="/user/requestPasswordReset" component={ResetRequestPage} />
                                <Route path="/user/authenticatePasswordReset/:authenticateId" component={ResetAuthPage} />
                                <Route path="/user/changePassword/:authenticateId" component={ChangePasswordPage} />
                                <Redirect from="/user/login" to="/" />
                                <Redirect from="/user/register" to="/" />
                            </Switch>
                        ) : (
                            <Switch>
                                <Route path="/user/login" component={LoginPage} />
                                <Route path="/user/register" component={RegisterPage} />
                                <Route path="/user/verify/:verifyId" component={VerifyPage} />
                                <Route path="/user/requestPasswordReset" component={ResetRequestPage} />
                                <Route path="/user/authenticatePasswordReset/:authenticateId" component={ResetAuthPage} />
                                <Route path="/user/changePassword/:authenticateId" component={ChangePasswordPage} />
                                <Redirect from="/user/logout" to="/" />
                            </Switch>
                        )
                    }
                </div>
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
                checkLogin: redirect => dispatch(checkLogin(redirect)),
                deployFlash: (tx, dt, ty) => dispatch(deployFlash(tx, dt, ty))
            };
        }
    )(App)
);