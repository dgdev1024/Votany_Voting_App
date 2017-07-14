///
/// \file   login.js
/// \brief  Presents the login form to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {localLogin, checkLogin} from "../actions/login";

///
/// \class  LoginPage
/// \brief  Presents the login page to the user.
///
class LoginPage extends React.Component {
    onScreenNameInput (ev) {
        this.setState({ screenName: ev.target.value });
    }

    onPasswordInput (ev) {
        this.setState({ password: ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();
        this.props.localLogin(this.state.screenName, this.state.password);
    }

    onResetClicked () {
        this.setState({ screenName: "", password: "" });
    }

    constructor (props) {
        super(props);
        this.state = {
            screenName: "",
            password: ""
        };
    }

    componentDidMount () {
        this.props.checkLogin(false, true);
    }

    render () {
        if (this.props.checkingLogin) {
            return null;
        }

        return (
            <div className="vta-form">
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    <h2 className="vta-heading">Log In</h2>
                    <div className="vta-form-element">
                        <label htmlFor="screenName">Screen Name: </label>
                        <input className="vta-form-input"
                            id="screenName"
                            type="text"
                            value={this.state.screenName}
                            onChange={this.onScreenNameInput.bind(this)}
                            required />
                    </div>
                    <div className="vta-form-element">
                        <label htmlFor="password">Password: </label>
                        <input className="vta-form-input"
                            id="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onPasswordInput.bind(this)}
                            required />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Log In</button>
                        <button className="vta-button vta-danger" onClick={this.onResetClicked.bind(this)}>Reset</button>
                    </div>
                    <p>
                        If you forgot your password, then <Link className="vta-link" to="/user/requestPasswordReset">click here.</Link><br />
                        Don't have a Votany account? <Link className="vta-link" to="/user/register">It's easy to sign up!</Link>
                    </p>
                </form>
            </div>
        );
    }
};

// Export
export default withRouter(
    connect(
        state => {
            return {
                checkingLogin: state.checkLogin.checking
            };
        },
        dispatch => {
            return {
                checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
                localLogin: (screenName, password) => dispatch(localLogin(screenName, password))
            };
        }
    )(LoginPage)
);