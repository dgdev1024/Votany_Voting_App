///
/// \file   poll.controller.js
/// \brief  Controller functions for the poll database model.
///

const Waterfall         = require("async").waterfall;
const Mongoose          = require("mongoose");
const PollModel         = require("../models/poll.model");
const UserModel         = require("../models/user.model");

// Export our controller functions.
module.exports = {
    ///
    /// \fn     createPoll
    /// \brief  Creates a new poll with the given options.
    ///
    /// The "options" object contains the following:
    /// "author" is the screen name of the poll's author.
    /// "issue" is the issue the voters will be voting on.
    /// "choices" is an array of the choices the voters will vote on.
    ///
    /// \param  options         The aforementioned objects object.
    /// \param  callback        A callback function to run when this function finishes.
    ///
    createPoll: (options, callback) => {
        Waterfall([
            // Validate our poll's details.
            next => {
                let validationErrors = [];

                if (!options.issue) { validationErrors.push("Please enter an issue to vote on!"); }
                if (!options.choices || options.choices.length < 2) {
                    validationErrors.push("Polls must have at least two choices.");
                }

                if (validationErrors.length > 0) {
                    return next({
                        status: 400,
                        message: "The submitted poll does not pass validation.",
                        details: validationErrors
                    });
                } else {
                    return next(null);
                }
            },

            // Verify that the author exists in the database.
            next => {
                UserModel.findOne({ screenName: options.author }, (err, user) => {
                    // Any errors searching the database?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching user database. Try again later."
                        });
                    }

                    // Was the user found and verified?
                    if (!user) {
                        return next({
                            status: 404,
                            message: "The poll's author is not a registered user."
                        });
                    }

                    if (user.verified === false) {
                        return next({
                            status: 401,
                            message: "You may not create polls until you verify your new account."
                        });
                    }

                    // We're good. Pass the user object to the next function.
                    return next(null, user);
                });
            },

            // Create the poll.
            (user, next) => {
                // Create the poll object and fill in the details.
                let poll = new PollModel();
                poll.author = options.author;
                poll.issue = options.issue;

                // Populate the poll's choices array.
                options.choices.forEach(val => {
                    poll.choices.push({ body: val });
                });

                // Now save the poll to the database.
                poll.save(err => {
                    // Any errors saving the poll?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error saving poll. Try again later."
                        });
                    }

                    // All done.
                    return next(null, poll._id.toString());
                });
            }
        ], (err, id) => {
            // Any errors posting the poll?
            if (err) {
                return callback(err);
            }

            // Done.
            return callback(null, {
                message: "Your poll has been posted!",
                pollId: id
            });
        });
    },

    ///
    /// \fn     fetchPoll
    /// \brief  Fetches the statistics on a poll.
    ///
    /// \param  pollId              The database ID of the poll.
    /// \param  voter               The voter viewing this poll.
    /// \param  callback            A callback function to run when this function finishes.
    ///
    fetchPoll: (pollId, voter, callback) => {
        // Grab the poll from the database.
        PollModel.findById(pollId, (err, poll) => {
            // Any errors fetching the poll?
            if (err) {
                return callback({
                    status: 500,
                    message: "Error searching poll database. Try again later."
                });
            }

            // Was the poll found?
            if (!poll) {
                return callback({
                    status: 404,
                    message: "Poll not found."
                });
            }

            // Find out which choice the viewing user voted for, if any.
            const votedOnChoiceIndex = poll.voterVotedFor(voter);

            // Return the poll as an object.
            return callback(null, {
                pollId: poll._id.toString(),
                issue: poll.issue,
                author: poll.author,
                postDate: poll.postDate,
                totalVotes: poll.totalVotes,
                choices: poll.choices.map((choice, index) => {
                    return { index: index, body: choice.body, votes: choice.votes }
                }),
                votedFor: votedOnChoiceIndex
            });
        });
    },

    ///
    /// \fn     castVote
    /// \brief  Casts a vote on the poll.
    ///
    /// The options object contains:
    /// "pollId" is the ID of the poll being voted on.
    /// "voter" is the screen name or IP address of the voting user.
    /// "index" is the numeric index of the choice being voted for.
    ///
    /// \param  options         The aforementioned options object.
    /// \param  callback        A function to run when this finishes.
    ///
    castVote: (options, callback) => {
        Waterfall([
            // Find the poll in the database.
            next => {
                // Find it.
                PollModel.findById(options.pollId, (err, poll) => {
                    // Any errors finding the poll?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching the poll database. Try again later."
                        });
                    }

                    // Was the poll found?
                    if (!poll) {
                        return next({
                            status: 404,
                            message: "Poll not found."
                        });
                    }

                    // Send the poll to the next function.
                    return next(null, poll);
                });
            },

            // Attempt to cast the vote.
            (poll, next) => {
                // Vote on the poll.
                const result = poll.castVote(options.voter, options.index);
                if (result === "AUTHOR") {
                    return next({
                        status: 403,
                        message: "You are the author of this poll. Be partial!"
                    });
                }
                else if (result === "ALREADY_VOTED") {
                    return next({
                        status: 409,
                        message: "You already voted on this poll!"
                    });
                }
                else if (result === "OUT_OF_BOUNDS") {
                    return next({
                        status: 400,
                        message: "Choice index is out of bounds!"
                    });
                }

                // Update the poll in the database.
                poll.save(err => {
                    // Any errors updating the poll?
                    if (err) {
                        return callback({
                            status: 500,
                            message: "Error updating the poll. Try again later."
                        });
                    }

                    // Done.
                    return next(null);
                });
            }
        ], err => {
            // Any errors at all?
            if (err) {
                return callback(err);
            }

            return callback(null, {
                message: "Your vote has been cast!"
            });
        });
    },

    ///
    /// \fn     addPollChoice
    /// \brief  Adds a new choice to the poll.
    ///
    /// The options object contains the following.
    /// "pollId" is the ID of the poll to be updated.
    /// "voter" is the name of the registered user updating the poll.
    /// "choice" is the new choice to be added to the poll.
    ///
    /// \param  options         The aforementioned options object.
    /// \param  callback        The function to run when this async op finishes.
    ///
    addPollChoice: (options, callback) => {
        Waterfall([
            // Find the poll in the database.
            next => {
                // Find it.
                PollModel.findById(options.pollId, (err, poll) => {
                    // Any errors finding the poll?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching the poll database. Try again later."
                        });
                    }

                    // Was the poll found?
                    if (!poll) {
                        return next({
                            status: 404,
                            message: "Poll not found."
                        });
                    }

                    // Send the poll to the next function.
                    return next(null, poll);
                });
            },

            // Add the choice to the poll.
            (poll, next) => {
                const result = poll.addChoice(options.voter, options.choice);
                if (result === "ALREADY_VOTED") {
                    return next({
                        status: 409,
                        message: "You already voted on this poll!"
                    });
                }
                else if (result === "NO_CHOICE") {
                    return next({
                        status: 400,
                        message: "Please provide a choice."
                    });
                }

                // Update the poll.
                poll.save(err => {
                    // Errors saving the poll?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error updating the poll database. Try again later."
                        });
                    }

                    // Done
                    if (poll.author === options.voter) {
                        return next(null, "Your poll has been updated!");
                    } else {
                        return next(null, "Your choice has been added, and your vote has been cast!")
                    }
                });
            }
        ], (err, message) => {
            // Any errors?
            if (err) {
                return callback(err);
            }

            return callback(null, {
                message: message
            });
        });
    },

    ///
    /// \fn     removePoll
    /// \brief  Attempts to remove a poll from the database.
    ///
    /// Options object:
    /// "screenName" is the screen name of the deleting user. Authentication purposes.
    /// "pollId" is the ID of the poll to be removed.
    ///
    /// \param  options         The options object.
    /// \param  callback        Run when this function finishes.
    ///
    removePoll: (options, callback) => {
        Waterfall([
            // Find the poll in the database.
            next => {
                PollModel.findById(options.pollId, (err, poll) => {
                    // Any errors finding the poll
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching the poll database. Try again later."
                        });
                    }
                    
                    // Was the poll found?
                    if (!poll) {
                        return next({
                            status: 404,
                            message: "Poll not found."
                        });
                    }

                    // Is this user the poll's author?
                    if (poll.author !== options.screenName) {
                        return next({
                            status: 403,
                            message: "You are not the author of this poll."
                        });
                    }

                    // Next function.
                    return next(null, poll);
                });
            },

            // Remove the poll.
            (poll, next) => {
                poll.remove(err => {
                    // Any errors removing the poll?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error removing the poll from the database. Try again later."
                        });
                    }

                    // Done.
                    return next(null);
                });
            }
        ], err => {
            // Any errors?
            if (err) {
                return callback(err);
            }

            return callback(null, {
                message: "Your poll has been deleted."
            });
        });
    }
};