///
/// \file   viewPoll.js
/// \brief  Presents a poll to the user.
///

// Imports
import React from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Pie as PieChart} from "react-chartjs-2";
import {checkLogin} from "../actions/login";
import {fetchPoll, castVote, addChoice, removePoll} from "../actions/poll";
import {getLoginToken} from "../utility/jwt";
import {randomColor} from "../utility/random";

///
/// \file   ViewPollPage
/// \brief  Presents a poll to the user.
///
class ViewPollPage extends React.Component {
    onCastVoteClicked () {
        this.props.castVote({
            pollId: this.props.poll.pollId,
            index: this.state.selectedChoice
        });
        scrollTo(0, 0);
    }

    onDeleteClicked () {
        const ays = confirm("Are you sure you want to delete this poll?");

        if (ays === true) {
            const token = getLoginToken();
            this.props.removePoll({
                pollId: this.props.poll.pollId,
                jwt: token.rawToken
            });
        }
    }

    onNewChoiceInput (ev) {
        this.setState({ newChoice: ev.target.value });
    }
    
    onChoiceClicked (index) {
        this.setState({ selectedChoice: index });
    }

    onAddChoiceClicked (ev) {
        ev.preventDefault();

        const token = getLoginToken();
        this.props.addChoice({
            pollId: this.props.poll.pollId,
            choice: this.state.newChoice,
            jwt: token.rawToken
        });
        
        this.setState({ newChoice: "" });
        scrollTo(0, 0);
    }

    constructor (props) {
        super(props);

        this.state = {
            selectedChoice: -1,
            newChoice: ""
        };
    }

    componentDidMount () {
        this.props.checkLogin(false, false);
        this.props.fetchPoll(this.props.match.params.pollId);
    }

    componentWillReceiveProps (next) {
        if (next.match.params.pollId !== this.props.match.params.pollId) {
            this.props.checkLogin(false, false);
            this.props.fetchPoll(next.match.params.pollId);
        }
    }

    renderChoices (isAuthor) {
        let mapped = null;
        if (isAuthor || this.props.poll.votedFor !== -1) {
            mapped = this.props.poll.choices.map(choice => {
                let cardClass = "vta-card vta-card-no-hover";
                if (this.props.poll.votedFor === choice.index) {
                    cardClass += " vta-card-voted";
                }

                return (
                    <div className={cardClass} key={choice.index}>
                        <p>
                            {choice.body} - <em>{choice.votes} votes</em>
                        </p>
                    </div>
                );
            });
        } else {
            mapped = this.props.poll.choices.map(choice => {
                let cardClass = "vta-card";
                if (this.state.selectedChoice === choice.index) {
                    cardClass += " vta-card-voted";
                }

                return (
                    <div className={cardClass} key={choice.index} onClick={this.onChoiceClicked.bind(this, choice.index)}>
                        <p>
                            {choice.body} - <em>{choice.votes} votes</em>
                        </p>
                    </div>
                );
            });
        }

        return (
            <div>
                {mapped}
                <div className="vta-button-group">
                {
                    isAuthor === false && this.props.poll.votedFor === -1 &&
                    (
                        <button className="vta-button vta-submit" onClick={this.onCastVoteClicked.bind(this)}>
                            Cast Vote
                        </button>
                    )
                }
                {
                    isAuthor === true &&
                    (
                        <button className="vta-button vta-danger" onClick={this.onDeleteClicked.bind(this)}>
                            Delete Poll
                        </button>
                    )
                }
                </div>
                <div className="vta-button-group">
                    <a className="vta-button vta-twitter"
                        href={`https://twitter.com/intent/tweet?url=${this.props.poll.fullUrl}&hashtags=Votany`}
                        target="_blank">
                        Share on Twitter
                    </a>
                </div>
            </div>
        );
    }

    renderAddChoiceDialog () {
        if (this.props.poll.votedFor !== -1 || this.props.screenName === "") {
            return null;
        }

        return (
            <div>
                <h2 className="vta-heading">
                    Add a Choice
                </h2>
                <div className="vta-form-element">
                    <label htmlFor="newChoice">
                    {
                        this.props.poll.author === this.props.screenName ?
                            "Want to add another choice? Type it below: " :
                            "Don't like the above choices? Add your own below: "
                    }
                    </label>
                    <input className="vta-form-input"
                        id="newChoice"
                        type="text"
                        value={this.state.newChoice}
                        onChange={this.onNewChoiceInput.bind(this)} />
                </div>
                <div className="vta-button-group">
                    <button className="vta-button vta-submit" onClick={this.onAddChoiceClicked.bind(this)}>
                        Add Choice
                    </button>
                </div>
            </div>
        );
    }

    renderPieChart () {
        const chartData = {
            labels: this.props.poll.choices.map(choice => choice.body),
            datasets: [{
                data: this.props.poll.choices.map(choice => choice.votes),
                backgroundColor: this.props.poll.choices.map(choice => randomColor())
            }]
        };

        return (
            <div>
                <h2 className="vta-heading">Chart View</h2>
                {
                    this.props.poll.totalVotes > 0 ?
                        <PieChart data={chartData} /> :
                        <p><em>No votes yet!</em></p>
                }
            </div>
        );
    }

    render () {
        if (!this.props.poll || this.props.checkingLogin) {
            return null;
        }

        return (
            <div className="vta-form">
                <h2 className="vta-heading">
                    View Poll
                </h2>
                <p>Issue: {this.props.poll.issue}</p>
                {this.renderChoices(
                    this.props.screenName === this.props.poll.author
                )}
                {this.renderAddChoiceDialog()}
                {this.renderPieChart()}
            </div>
        );
    }
};

// Exports
export default withRouter(connect(
    state => {
        return {
            poll: state.fetchPoll.poll,
            checkingLogin: state.checkLogin.checking,
            screenName: state.checkLogin.screenName
        };
    },
    dispatch => {
        return {
            checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
            fetchPoll: pollId => dispatch(fetchPoll(pollId)),
            castVote: details => dispatch(castVote(details)),
            addChoice: details => dispatch(addChoice(details)),
            removePoll: details => dispatch(removePoll(details))
        };
    }
)(ViewPollPage));