///
/// \file   authRequest.js
/// \brief  A landing page while the backend authenticates a password reset request.
///

import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {resetAuth} from "../actions/pwreset";

///
/// \class  ResetAuthPage
/// \brief  A landing page to show while the backend verifies a password reset request.
///
class ResetAuthPage extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.resetAuth(this.props.match.params.authenticateId);
    }

    render () {
        return (
            <div>
                <h2 className="vta-heading">
                    Please Wait...
                </h2>
                <p className="vta-notice">
                    Your reset request is being authenticated. You will be redirected shortly.
                </p>
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
                resetAuth: authenticateId => dispatch(resetAuth(authenticateId))
            };
        }
    )(ResetAuthPage)
);