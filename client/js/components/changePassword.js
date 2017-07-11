///
/// \file   changePassword.js
/// \brief  Presents the Change Password form to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {passwordChange} from "../actions/pwreset";

class ChangePasswordPage extends React.Component {
    onPasswordInput (ev) {
        this.setState({ password: ev.target.value });
    }

    onConfirmInput (ev) {
        this.setState({ confirm: ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();

        this.props.passwordChange(
            this.props.match.params.authenticateId,
            this.state.password,
            this.state.confirm
        );
    }

    constructor (props) {
        super(props);

        this.state = {
            password: "",
            confirm: ""
        };
    }

    render () {
        return (
            <div className="vta-form">
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    <h2 className="vta-heading">Change Your Password</h2>
                    <div className="vta-form-element">
                        <label htmlFor="password">New Password: </label>
                        <input className="vta-form-input"
                               id="password"
                               type="password"
                               value={this.state.password}
                               onChange={this.onPasswordInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-form-element">
                        <label htmlFor="confirm">Confirm New Password: </label>
                        <input className="vta-form-input"
                               id="confirm"
                               type="password"
                               value={this.state.confirm}
                               onChange={this.onConfirmInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Change Password</button>
                    </div>
                </form>
            </div>
        );
    }
};

// Exports
export default withRouter(connect(
    null,
    dispatch => {
        return {
            passwordChange: (id, password, confirm) => dispatch(passwordChange(id, password, confirm))
        };
    }
)(ChangePasswordPage));