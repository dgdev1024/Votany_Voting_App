///
/// \file   changePassword.js
/// \brief  Presents the Change Password page to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {passwordChange} from "../actions/pwreset";

///
/// \class  ChangePasswordPage
/// \brief  Presents the Change Password page to the user.
///
class ChangePasswordPage extends React.Component {
    onPasswordInputChanged (ev) {
        this.setState({
            password: ev.target.value
        });
    }

    onConfirmInputChanged (ev) {
        this.setState({
            confirm: ev.target.value
        });
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
        return(
            <div className="vta-form">
                <h2 className="vta-heading">
                    Change Your Password
                </h2>
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    <div className="vta-form-element">
                        <label className="vta-label" htmlFor="password">
                            New Password:
                        </label>
                        <input className="vta-input"
                               id="password"
                               type="password"
                               onChange={this.onPasswordInputChanged.bind(this)}
                               value={this.state.password}
                               required />
                    </div>
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
                    <button className="vta-button" type="submit">
                        Change Password
                    </button>
                </form>
            </div>
        );
    }
};

// Exports
export default withRouter(
    connect(
        null, 
        dispatch => {
            return {
                passwordChange: (id, password, confirm) => dispatch(passwordChange(id, password, confirm))
            };
        }
    )(ChangePasswordPage)
);