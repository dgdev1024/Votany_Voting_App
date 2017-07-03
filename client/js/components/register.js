///
/// \file   register.js
/// \brief  Presents the register page to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {localRegister} from "../actions/register";

///
/// \class  RegisterPage
/// \brief  Presents the local registration page to the user.
///
class RegisterPage extends React.Component {
    onScreenNameInputChanged (ev) {
        this.setState({ screenName: ev.target.value });
    }

    onEmailAddressInputChanged (ev) {
        this.setState({ emailAddress: ev.target.value });
    }

    onPasswordInputChanged (ev) {
        this.setState({ password: ev.target.value });
    }

    onConfirmInputChanged (ev) {
        this.setState({ confirm: ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();

        this.props.localRegister({
            screenName: this.state.screenName,
            emailAddress: this.state.emailAddress,
            password: this.state.password,
            confirm: this.state.confirm
        });
    }

    constructor (props) {
        super(props);

        this.state = {
            screenName: "",
            emailAddress: "",
            password: "",
            confirm: ""
        };
    }

    render () {
        return (
            <div className="vta-form">
                <h2 className="vta-heading">Register a New User</h2>
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    {/* The screen name field. */}
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

                    {/* The email address field. */}
                    <div className="vta-form-element">
                        <label className="vta-label" htmlFor="emailAddress">
                            Email Address:
                        </label>
                        <input className="vta-input"
                               id="emailAddress"
                               type="text"
                               onChange={this.onEmailAddressInputChanged.bind(this)}
                               value={this.state.emailAddress}
                               required />
                    </div>

                    {/* The password field. */}
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

                    {/* The confirm password field. */}
                    <div className="vta-form-element">
                        <label className="vta-label" htmlFor="confirm">
                            Confirm Password:
                        </label>
                        <input className="vta-input"
                               id="confirm"
                               type="password"
                               onChange={this.onConfirmInputChanged.bind(this)}
                               value={this.state.confirm}
                               required />
                    </div>

                    {/* The submit button */}
                    <button className="vta-submit" type="submit">
                        Submit
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
                localRegister: credentials => dispatch(localRegister(credentials))
            };
        }
    )(RegisterPage)  
);