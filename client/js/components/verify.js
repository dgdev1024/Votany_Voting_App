///
/// \file   verify.js
/// \brief  A landing page shown while the new user is verified.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {localVerify} from "../actions/register";

///
/// \class  VerifyPage
/// \brief  Presents the verify page to the user.
///
class VerifyPage extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.localVerify(this.props.match.params.verifyId);
    }

    render () {
        return null;
    }
};

// Exports
export default withRouter(
    connect(
        null,
        dispatch => {
            return {
                localVerify: id => dispatch(localVerify(id))
            };
        }
    )(VerifyPage)
);