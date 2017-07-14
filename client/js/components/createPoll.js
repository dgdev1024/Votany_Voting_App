///
/// \file   createPoll.js
/// \brief  Presents the Create Poll form to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {createPoll} from "../actions/poll";
import {checkLogin} from "../actions/login";
import {deployFlash, FlashType} from "../actions/flash";
import {getLoginToken} from "../utility/jwt";

///
/// \class  CreatePollPage
/// \brief  Presents the Create Poll Page to the user.
///
class CreatePollPage extends React.Component {
    onIssueInput (ev) {
        this.setState({ issue: ev.target.value });
    }

    onChoiceInput (ev) {
        this.setState({ choice: ev.target.value });
    }

    onKeywordInput (ev) {
        this.setState({ keywords: ev.target.value });
    }

    onChoiceSubmit (ev) {
        ev.preventDefault();

        if (this.state.choice === "") {
            this.props.deployFlash("Please specify a choice to submit.", [], FlashType.ERROR);
            this.refs.choice.focus();
        } else {
            let choices = this.state.submittedChoices.slice();
            choices.push(this.state.choice);

            this.setState({
                submittedChoices: choices,
                choice: "",
                keywords: this.state.keywords
            });
        }
    }

    onChoiceDeleteClicked (index) {
        let choices = this.state.submittedChoices.slice();
        choices.splice(index, 1);

        this.setState({
            submittedChoices: choices
        });
    }

    onPollSubmit (ev) {
        ev.preventDefault();

        if (this.state.issue === "") {
            this.props.deployFlash("Please specify an issue to vote on.", [], FlashType.ERROR);
            this.refs.issue.focus();
        }
        else if (this.state.submittedChoices.length < 2) {
            this.props.deployFlash("Please specify at least two choices to vote for.", [], FlashType.ERROR);
            this.refs.choice.focus();
        }
        else if (!this.state.keywords) {
            this.props.deployFlash("Please specify some keywords, so others can look for your poll!", [], FlashType.ERROR);
            this.refs.keywords.focus();
        }
        else {
            const token = getLoginToken();
            this.props.createPoll({
                author: token.screenName,
                issue: this.state.issue,
                keywords: this.state.keywords,
                choices: this.state.submittedChoices,
                jwt: token.rawToken
            });
        }
    }

    onResetClicked () {
        const ays = confirm("Are you sure you wish to reset the form?");

        if (ays) {
            this.setState({
                issue: "",
                choice: "",
                keywords: "",
                submittedChoices: []
            });
        }
    }

    constructor (props) {
        super(props);

        this.state = {
            issue: "",
            choice: "",
            keywords: "",
            submittedChoices: []
        };
    }

    componentDidMount () {
        this.props.checkLogin(true, false);
    }

    renderChoices () {
        const mapped = this.state.submittedChoices.map((choice, index) => {
            return (
                <li key={index}>
                    <button className="vta-button vta-danger" onClick={this.onChoiceDeleteClicked.bind(this, index)}>
                        Delete
                    </button>
                    {choice}
                </li>
            );
        });

        return (
            <div>
                {
                    this.state.submittedChoices.length < 2 &&
                        <p><em>Please submit at least two choices.</em></p>
                }
                <ul>
                    {mapped}
                </ul>
            </div>
        )
    }

    render () {
        if (this.props.checkingLogin) {
            return null;
        }

        return (
            <div className="vta-form">
                <h2 className="vta-heading">Create a New Poll</h2>
                <div className="vta-form-element">
                    <label htmlFor="issue">The issue to be voted on:</label>
                    <input className="vta-form-input"
                           id="issue"
                           ref="issue"
                           type="text"
                           value={this.state.issue}
                           onChange={this.onIssueInput.bind(this)}
                           required />
                </div>
                <form onSubmit={this.onChoiceSubmit.bind(this)}>
                    <div className="vta-form-element">
                        <label htmlFor="choice">Enter a choice to vote for here: </label>
                        <input className="vta-form-input"
                            id="choice"
                            ref="choice"
                            type="text"
                            value={this.state.choice}
                            onChange={this.onChoiceInput.bind(this)} />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Add Choice</button>
                    </div>
                </form>
                <h2>Submitted Choices</h2>
                {this.renderChoices()}
                <div className="vta-form-element">
                    <label htmlFor="issue">Enter some keywords:</label>
                    <input className="vta-form-input"
                           id="keywords"
                           ref="keywords"
                           type="text"
                           value={this.state.keywords}
                           onChange={this.onKeywordInput.bind(this)}
                           required />
                </div>
                <div className="vta-button-group">
                    <button className="vta-button vta-submit" onClick={this.onPollSubmit.bind(this)}>
                        Submit Poll
                    </button>
                    <button className="vta-button vta-danger" onClick={this.onResetClicked.bind(this)}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
};

// Exports
export default withRouter(connect(
    state => {
        return {
            checkingLogin: state.checkLogin.checking
        };
    },
    dispatch => {
        return {
            createPoll: details => dispatch(createPoll(details)),
            checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
            deployFlash: (text, details, type) => dispatch(deployFlash(text, details, type))
        };
    }
)(CreatePollPage));