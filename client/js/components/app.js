///
/// \file   app.js
/// \brief  The frontend's primary component.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {Route, Switch, withRouter} from "react-router-dom";
import Flash from "./flash";

///
/// \class  App
/// \brief  The frontend's primary component
///
class App extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="vta-body">
                <h1>Hello, World!</h1>
                <hr />
                <Flash text={this.props.flash.flashText}
                       type={this.props.flash.flashType}
                       details={this.props.flash.flashDetails} />
            </div>
        );
    }
};

// Export
export default withRouter(
    connect(
        state => {
            return {
                flash: state.flash
            };
        }
    )(App)
);