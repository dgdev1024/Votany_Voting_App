///
/// \file   verify.js
/// \brief  Temporary page to show while the backend verifies a new account.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

///
/// \file   VerifyLandingPage
/// \brief  A temporary page to show while the backend verifies a newly-created user account.
///
class VerifyLandingPage extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.localVerify(this.props.match.params.verifyId);
    }

    render () {
        return (
            <div>
                <h2 className="vta-heading">
                    Please Wait...
                </h2>
                <p className="vta-notice">
                    We are verifying your new account. You will be redirected shortly.
                </p>
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
                localVerify: verifyId => dispatch(localVerify(verifyId))
            };
        }
    )(VerifyLandingPage)
);