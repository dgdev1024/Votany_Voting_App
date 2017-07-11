///
/// \file   resetRequest.js
/// \brief  Presents the Password Reset Request form to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {resetRequest} from "../actions/pwreset";

///
/// \class  ResetRequestPage
/// \brief  Presents the Password Reset Request form to the user.
///
class ResetRequestPage extends React.Component {
    onEmailAddressInput (ev) {
        this.setState({ emailAddress: ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();

        this.props.resetRequest(this.state.emailAddress);
    }

    constructor (props) {
        super(props);

        this.state = { emailAddress: "" };
    }

    render () {
        return (
            <div className="vta-form">
                <form onSubmit={this.onSubmitClicked.bind(this)}>
                    <h2 className="vta-heading">Request a Password Reset</h2>
                    <div className="vta-form-element">
                        <label htmlFor="emailAddress">Email Address: </label>
                        <input className="vta-form-input"
                               id="emailAddress"
                               type="text"
                               value={this.state.emailAddress}
                               onChange={this.onEmailAddressInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Request</button>
                    </div>
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
                resetRequest: emailAddress => dispatch(resetRequest(emailAddress))
            };
        }
    )(ResetRequestPage)
);