///
/// \file   home.js
/// \brief  The home page.
///

// Imports
import React from "react";
import Moment from "moment";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import QueryString from "query-string";
import {FlashType, deployFlash} from "../actions/flash";
import {checkLogin} from "../actions/login";
import {searchPolls, clearSearchedPolls} from "../actions/poll";

///
/// \class  HomePage
/// \brief  The home page, where one can search for polls.
///
class HomePage extends React.Component {
    onSearchInput (ev) {
        this.setState({ searchInput: ev.target.value });
    }

    onSearchSubmit (ev) {
        ev.preventDefault();

        if (this.state.searchInput === "") {
            this.props.deployFlash("Please enter a search term!", [], FlashType.ERROR);
            this.refs.searchInput.focus();
            return;
        }

        this.props.history.replace(`/?search=${this.state.searchInput}&page=0`);
    }
  
    onPrevClicked () {
        if (this.state.page > 0) {
            this.props.history.replace(`/?search=${this.state.submittedSearch}&page=${this.state.page - 1}`);
        }
    }
  
    onNextClicked () {
        if (!this.props.searchedPolls.lastPage) {
            this.props.history.replace(`/?search=${this.state.submittedSearch}&page=${this.state.page + 1}`);
        }
    }

    constructor (props) {
        super(props);

        this.state = {
            searchInput: "",
            submittedSearch: "",
            page: 0
        };
    }

    componentDidMount () {
        const parsed = QueryString.parse(this.props.location.search);
        this.props.checkLogin(false, false);
        
        if (parsed.search) {
            this.props.searchPolls(parsed.search, parseInt(parsed.page || 0));
            this.setState({ submittedSearch: parsed.search, page: parseInt(parsed.page || 0) });
        } else {
            this.props.clearSearch();
            this.setState({ submittedSearch: "", page: 0 });
        }
    }

    componentWillReceiveProps (next) {
        if (next.location.search !== this.props.location.search) {
            const parsed = QueryString.parse(next.location.search);
            this.props.checkLogin(false, false);
        
            if (parsed.search) {
                this.props.searchPolls(parsed.search, parseInt(parsed.page || 0));
                this.setState({ submittedSearch: parsed.search, page: parseInt(parsed.page || 0) });
            } else {
                this.props.clearSearch();
                this.setState({ submittedSearch: "", page: 0 });
            }
        }
    }

    renderSearchResults () {
        if (this.props.searchedPolls.length === 0) {
            return null;
        }
      
        console.log(this.props, this.state);

        const mapped = this.props.searchedPolls.map((poll, index) => {
            return (
                <div key={index} className="vta-card vta-card-no-hover">
                    <h3 className="vta-heading">
                        <Link to={`/poll/${poll.pollId}`} className="vta-link">
                            {poll.issue}
                        </Link>
                    </h3>
                    <p>
                        Author: <Link className="vta-link" to={`/user/profile/${poll.author}`}>{poll.author}</Link><br />
                        Posted: {Moment(poll.postDate).format("MMMM Do YYYY, h:mm:ss a")}<br />
                        Votes: {poll.votes}
                    </p>
                </div>
            );
        });

        return (
            <div>
                <h2 className="vta-heading">Search Results</h2>
                <div className="vta-button-group">
                {
                    parseInt(this.state.page) !== 0 &&
                        <button className="vta-button" onClick={this.onPrevClicked.bind(this)}>Previous</button>
                }
                {
                    this.props.lastPage === false &&
                        <button className="vta-button" onClick={this.onNextClicked.bind(this)}>Next</button>
                }
                </div>
                {mapped}
            </div>
        );
    }

    renderSearchPage () {
        if (this.props.checkingLogin) {
            return null;
        }

        return (
            <div className="vta-form">
                <h2 className="vta-heading">
                    Welcome to Votany!
                </h2>
                <form onSubmit={this.onSearchSubmit.bind(this)}>
                    <div className="vta-form-element">
                        <label htmlFor="searchInput">
                            Search for a Poll:
                        </label>
                        <input className="vta-form-input"
                               id="searchInput"
                               ref="searchInput"
                               type="text"
                               value={this.state.searchInput}
                               onChange={this.onSearchInput.bind(this)}
                               required />
                    </div>
                    <div className="vta-button-group">
                        <button className="vta-button vta-submit" type="submit">Search</button>
                    </div>
                </form>
                {this.renderSearchResults()}
            </div>
        );
    }

    render () {
        return this.renderSearchPage();
    }
};

// Exports
export default withRouter(connect(
    state => {
        return {
            checkingLogin: state.checkLogin.checking,
            searchedPolls: state.searchPoll.polls,
            lastPage: state.searchPoll.lastPage
        };
    },
    dispatch => {
        return {
            deployFlash: (text, details, type) => dispatch(deployFlash(text, details, type)),
            checkLogin: (fail, success) => dispatch(checkLogin(fail, success)),
            searchPolls: (query, page) => dispatch(searchPolls(query, page)),
            clearSearch: () => dispatch(clearSearchedPolls())
        };
    }
)(HomePage));