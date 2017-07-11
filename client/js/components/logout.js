///
/// \file   logout.js
/// \brief  Landing page while the user logs out.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {logout} from "../actions/login";

///
/// \class  LogoutPage
/// \brief  Landing page while a logged in user logs out.
///
class LogoutPage extends React.Component {
    constructor (props) {
        super(props);
    }

    componentDidMount () {
        this.props.logout();
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
                logout: () => dispatch(logout())
            };
        }
    )(LogoutPage)
);