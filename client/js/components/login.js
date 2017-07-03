///
/// \file   login.js
/// \brief  Presents the login page to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {localLogin} from "../actions/login";

///
/// \class  LoginPage
/// \brief  Presents the login page to the user.
///
class LoginPage extends React.Component {
    onScreenNameInputChanged (ev) {
        this.setState({ screenName: ev.target.value });
    }

    onPasswordInputChanged (ev) {
        this.setState({ password = ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();

        this.props.localLogin(
            this.state.screenName,
            this.state.password
        );     
    }
    
    constructor (props) {
        super(props);

        this.state = {
            screenName: "",
            password: ""
        };
    }

    render () {
        return (
            <div className="vta-form">
                <h2 className="vta-heading">Log In</h2>
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    {/* The screen name field */}
                    <div className="vta-form-element">
                        <label className="vta-label" htmlFor="screenName">
                            Screen Name:
                        </label>
                        <input className="vta-input"
                               id="screenName"
                               type="text"
                               onChange={this.onScreenNameInputChanged.bind(this)}
                               value={this.state.screenName}
                               required />
                    </div>

                    {/* The password field */}
                    <div className="vta-form-element">
                        <label className="vta-label" htmlFor="password">
                            Password:
                        </label>
                        <input className="vta-input"
                               id="password"
                               type="password"
                               onChange={this.onPasswordInputChanged.bind(this)}
                               value={this.state.password}
                               required />
                    </div>

                    {/* The submit button */}
                    <button className="vta-submit" type="submit">
                        Log In...
                    </button>
                </form>
            </div>
        );
    }
};

// Export
export default withRouter(
    connect(
        null,
        dispatch => {
            return {
                localLogin: (screenName, password) => dispatch(localLogin(screenName, password))
            };
        }
    )(LoginPage)
);