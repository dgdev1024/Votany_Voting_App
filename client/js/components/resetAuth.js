///
/// \file   resetAuth.js
/// \brief  landing page while a password reset request is being authenticated.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {resetAuth} from "../actions/pwreset";

///
/// \class  ResetAuthPage
/// \brief  A landing page to show while the user's password reset request is being authenticated.
///
class ResetAuthPage extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.resetAuth(this.props.match.params.authenticateId);
    }

    render () {
        return null;
    }
};

// Exports
export default withRouter(connect(
    null,
    dispatch => {
        return {
            resetAuth: id => dispatch(resetAuth(id))
        };
    }
)(ResetAuthPage));