///
/// \file   register.js
/// \brief  Presents the Register page to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {checkLogin} from "../actions/login";
import {localRegister} from "../actions/register";

///
/// \class  RegisterPage
/// \brief  Presents the register page to the user.
///
class RegisterPage extends React.Component {
    onScreenNameInput (ev) {
        this.setState({ screenName: ev.target.value });
    }

    onEmailAddressInput (ev) {
        this.setState({ emailAddress: ev.target.value });
    }

    onPasswordInput (ev) {
        this.setState({ password: ev.target.value });
    }

    onConfirmInput (ev) {
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

    onResetClicked () {
        this.setState({
            screenName: "",
            emailAddress: "",
            password: "",
            confirm: ""
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

    componentDidMount () {
        this.props.checkLogin(false, true);
    }

    render () {
        if (this.props.checkingLogin) {
            return null;
        }

        const tooltips = {
            screenName: `Screen names must be between 6 and 20 characters long, and may not contain symbols.`,
            emailAddress: `Email addresses must be in the form "handle@domain". Example: "johndoe32@gmail.com"`,
            password: `Passwords must be between 8 and 32 characters long, and must contain at least one capital letter, one number, and one symbol.`,
            confirm: `The confirm password must match the password you input before.`
        };

        return (
            <div className="vta-form">
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    <h2 className="vta-heading">Register a New Account</h2>
                    <div className="vta-form-element">
                        <label htmlFor="screenName" title={tooltips.screenName}>Screen Name: </label>
                        <input className="vta-form-input"
                               id="screenName"
                               type="text"
                               value={this.state.screenName}
                               onChange={this.onScreenNameInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-form-element">
                        <label htmlFor="emailAddress" title={tooltips.emailAddress}>Email Address: </label>
                        <input className="vta-form-input"
                               id="emailAddress"
                               type="text"
                               value={this.state.emailAddress}
                               onChange={this.onEmailAddressInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-form-element">
                        <label htmlFor="password" title={tooltips.password}>Password: </label>
                        <input className="vta-form-input"
                               id="password"
                               type="password"
                               value={this.state.password}
                               onChange={this.onPasswordInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-form-element">
                        <label htmlFor="confirm" title={tooltips.confirm}>Confirm Password: </label>
                        <input className="vta-form-input"
                               id="confirm"
                               type="password"
                               value={this.state.confirm}
                               onChange={this.onConfirmInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Register</button>
                        <button className="vta-button vta-danger" onClick={this.onResetClicked.bind(this)}>Reset</button>
                    </div>
                </form>
            </div>
        );
    }
};

// Exports
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
                localRegister: credentials => dispatch(localRegister(credentials))
            };
        }
    )(RegisterPage)
);