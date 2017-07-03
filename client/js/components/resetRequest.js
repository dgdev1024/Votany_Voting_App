///
/// \file   resetRequest.js
/// \brief  Presents the Password Reset Request page to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {resetRequest} from "../actions/pwreset";

///
/// \class  ResetRequestPage
/// \brief  Presents the Password Reset Request page to the user.
///
class ResetRequestPage extends React.Component {
    onEmailAddressInputChanged (ev) {
        this.setState({ emailAddress: ev.target.value });
    }

    onSubmitClicked (ev) {
        ev.preventDefault();

        this.props.resetRequest(this.state.emailAddress);
    }
    
    constructor (props) {
        super(props);

        this.state = {
            emailAddress: ""
        };
    }

    render () {
        return (
            <div className="vta-form">
                <h2 className="vta-heading">
                    Request a Password Reset
                </h2>
                <form onSubmit={this.onSubmitClicked.bind(this)}>
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
                    <button className="vta-submit" type="submit">
                        Request Password Reset
                    </button>
                </form>
            </div>
        )
    }
};

// Export
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