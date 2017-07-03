///
/// \fn     flash.js
/// \brief  Displays a flash message component to the user.
///

// imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {FlashType} from "../actions/flash";

///
/// \class  Flash
/// \brief  Flashes a message to the user.
///
class Flash extends React.Component {
    constructor (props) {
        super(props);
    }

    renderDetails () {
        // Get the details of our flasher.
        const {details} = this.props;

        // Check to see if the details array exists and is not empty.
        if (!details || details.length > 0) {
            return null;
        }

        // Map out the details and render them as list items.
        const mapped = details.map((item, index) => {
            return <li className="vta-flash-detail" key={index}>{item}</li>;
        });

        return (
            <ul className="vta-flash-detail-list">
                {mapped}
            </ul>
        );
    }

    render () {
        // Get the flash type and text.
        const { type, text } = this.props;

        // Set up the CSS classes for our flash div.
        let flashClass = "vta-flash";
        switch (type) {
            case FlashType.DEFAULT:
                flashClass += " vta-flash-default";
                break;
            case FlashType.OK:
                flashClass += " vta-flash-ok";
                break;
            case FlashType.ERROR:
                flashClass += " vta-flash-error";
                break;
        }

        // Render our flasher.
        return (
            <div className={flashClass}>
                <p className="vta-flash-text">
                    {text}
                </p>
                {this.renderDetails()}
            </div>
        );
    }
};

// Export
export default Flash;