///
/// \file   topbar.js
/// \brief  Displays a navigation bar at the top of the page.
///

// Imports
import React from "react";
import {Link} from "react-router-dom";

///
/// \class  Topbar
/// \brief  Displays a navigation bar at the top of the screen.
///
class Topbar extends React.Component {
    onMenuToggled () {
        this.setState({ toggled: !this.state.toggled });
    }

    resetMenuToggle () {
        this.setState({ toggled: false });
    }

    constructor (props) {
        super(props);

        this.state = { toggled: false };
        this.resetToggle = this.resetMenuToggle.bind(this);
    }

    render () {
        let menuClass = "vta-topbar-menu";
        if (this.state.toggled === true) {
            menuClass += " vta-topbar-toggled";
        }

        return (
            <div className="vta-topbar" onMouseLeave={this.resetToggle}>
                <Link to="/">
                    <div className="vta-topbar-brand">
                        Votany
                    </div>
                </Link>
                <div className="vta-topbar-menu-icon" onClick={this.onMenuToggled.bind(this)}>
                    &#9776;
                </div>
                <div className={menuClass}>
                    {
                        this.props.screenName ?
                        (
                            <div>
                                <span className="vta-topbar-menu-item vta-topbar-no-hover">
                                    Hello, {this.props.screenName}!
                                </span>
                                <Link className="vta-topbar-menu-item" to="/user/logout" onClick={this.resetToggle}>
                                    Logout
                                </Link>
                            </div>
                        )
                        :
                        (
                            <div>
                                <Link className="vta-topbar-menu-item" to="/user/login" onClick={this.resetToggle}>
                                    Log In
                                </Link>
                                <Link className="vta-topbar-menu-item" to="/user/register" onClick={this.resetToggle}>
                                    Register
                                </Link>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
};

// Exports
export default Topbar;