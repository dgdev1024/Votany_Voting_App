///
/// \file   viewProfile.js
/// \brief  Presents the Profile View to the user.
///

// Imports
import React from "react";
import Moment from "moment";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {checkLogin} from "../actions/login";
import {fetchProfile} from "../actions/profile";

///
/// \class  ViewProfilePage
/// \brief  Presents the profile view page to the user.
///
class ViewProfilePage extends React.Component {
    onPrevClicked () {
        this.setState({ page: this.state.page - 1 });
    }

    onNextClicked () {
        this.setState({ page: this.state.page + 1 });
    }

    constructor (props) {
        super(props);

        this.state = { page: 0 };
    }

    componentDidMount () {
        this.props.checkLogin(false, false);
        this.props.fetchProfile(this.props.match.params.screenName);
    }

    componentWillReceiveProps (next) {
        if (next.match.params.screenName !== this.props.match.params.screenName) {
            this.props.checkLogin(false, false);
            this.props.fetchProfile(this.props.match.params.screenName);
            this.setState({ page: 0 });
        }
    }

    renderPollLinks () {
        const pageStart = this.state.page * 10;
        const pageEnd = pageStart + 9;
        let lastPage = false;

        const mapped = this.props.profile.polls.map((poll, index) => {
            if (index < pageStart || index > pageEnd) {
                return null;
            }
            else if (index + 1 === this.props.profile.polls.length) {
                lastPage = true;
            }

            return (
                <div key={index} className="vta-card vta-card-no-hover">
                    <h3 className="vta-heading">
                        <Link className="vta-link" to={`/poll/${poll.pollId}`}>
                            {poll.issue}
                        </Link>
                    </h3>
                    <p>
                        Posted: {Moment(poll.postDate).format("MMMM Do YYYY, h:mm:ss a")}<br />
                        Votes: {poll.totalVotes}
                    </p>
                </div>
            );
        });

        return (
            <div>
                <h2 className="vta-heading">
                    Posted Polls
                </h2>
                {mapped}
                <div className="vta-button-group">
                {
                    this.state.page > 0 &&
                        <button className="vta-button" onClick={this.onPrevClicked.bind(this)}>Previous</button>
                }
                {
                    lastPage === false &&
                        <button className="vta-button" onClick={this.onNextClicked.bind(this)}>Next</button>
                }
                </div>
            </div>
        );
    }

    render () {
        if (this.props.checkingLogin || !this.props.profile) {
            return null;
        }

        return (
            <div className="vta-form">
                <h2 className="vta-heading">{this.props.profile.screenName}'s Profile</h2>
                <ul>
                    <li>
                        Joined: {Moment(this.props.profile.joinDate).format("MMMM Do YYYY, h:mm:ss a")}
                    </li>
                    <li>
                        Email Address: {this.props.profile.emailAddress}
                    </li>
                </ul>
                {this.renderPollLinks()}
            </div>
        );
    }
};

// Exports
export default withRouter(connect(
    state => {
        return {
            checkingLogin: state.checkLogin.checking,
            profile: state.fetchProfile.profile
        };
    },
    dispatch => {
        return {
            checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
            fetchProfile: screenName => dispatch(fetchProfile(screenName))
        };
    }
)(ViewProfilePage));