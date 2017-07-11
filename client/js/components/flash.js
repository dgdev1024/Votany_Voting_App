///
/// \file   flash.js
/// \brief  Presents a flash message to the user.
///

// Imports
import React from "react";
import {FlashType} from "../actions/flash";

///
/// \class  Flash
/// \brief  Presents a flash message to the user.
///
class Flash extends React.Component {
    constructor (props) {
        super(props);
    }

    renderDetails () {
        const {details} = this.props;

        if (!details || details.length === 0) {
            return null;
        }

        const mapped = details.map((detail, index) => {
            return (
                <li key={index}>{detail}</li>
            );
        });

        return (
            <ul>
                {mapped}
            </ul>
        );
    }

    render () {
        const {text, type} = this.props;

        if (!text) {
            return null;
        }

        let flashClass = "vta-flash";
        switch (type) {
            case FlashType.OK: flashClass += " vta-flash-ok"; break;
            case FlashType.ERROR: flashClass += " vta-flash-error"; break;
        }

        return (
            <div className={flashClass}>
                <span className="vta-flash-text">{text}</span>
                {this.renderDetails()}
            </div>
        );
    }
};

export default Flash;