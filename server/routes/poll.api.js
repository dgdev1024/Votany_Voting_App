///
/// \file   poll.api.js
/// \brief  API routing four our poll functions.
///

// Imports
const Express           = require("express");
const PollController    = require("../controllers/poll.controller");
const Auth              = require("../utility/auth");
const IP                = require("../utility/ip");

// Router
const Router = Express.Router();

// POST: Adds a new poll.
Router.post("/create", Auth.jwtAuthenticator, (req, res) => {
    // This requires a JWT authentication.
    Auth.testLogin(req, (err, user) => {
        // Any errors testing the login?
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        // Create the poll.
        PollController.createPoll({
            author: user.screenName,
            issue: req.body.issue,
            choices: req.body.choices
        }, (err, ok) => {
            // Any error?
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            return res.status(200).json(ok);
        });
    });
});

// GET: Fetches a poll.
Router.get("/:pollId", (req, res) => {
    // Fetch the poll.
    PollController.fetchPoll(req.params.pollId, (err, poll) => {
        // Any errors?
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        return res.status(200).json({ poll: poll });
    });
});

// PUT: Updates a poll's details.
Router.put("/update/:pollId", Auth.jwtAuthenticator, (req, res) => {
    // This requires user authentication.
    Auth.testLogin(req, (err, user) => {
        // Any errors with authentication?
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        // Attempt to update the poll.
        PollController.updatePoll({
            screenName: user.screenName,
            pollId: req.params.pollId,
            issue: req.body.issue,
            choices: req.body.choices
        }, (err, ok) => {
            // Any errors?
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            // OK
            return res.status(200).json(ok);
        });
    });
});

// PUT: Casts a vote on a poll.
Router.put("/vote/:pollId", Auth.jwtAuthenticator, (req, res) => {
    // This checks for JWT authentication, but it is not required.
    Auth.testLogin(req, (err, user) => {
        // Any server errors?
        if (err && err.status === 500) {
            return res.status(err.status).json({ error: err });
        }

        // Determine the identity of the voter. If that voter is a registered user, then
        // that ID is their screen name. Otherwise, it is their client IP address.
        let voter = "";
        if (user) {
            voter = user.screenName;
        } else {
            voter = IP(req);
        }

        // Cast the vote.
        PollController.castVote({
            pollId: req.params.pollId,
            voter: voter,
            index: req.body.index
        }, (err, ok) => {
            // Any errors?
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            return res.status(200).json(ok);
        });
    });
});

// PUT: Adds a choice to the poll.
Router.put("/addchoice/:pollId", Auth.jwtAuthenticator, (req, res) => {
    // Adding poll choices requires user authentication.
    Auth.testLogin(req, (err, user) => {
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        // Add the choice.
        PollController.addPollChoice({
            pollId: req.params.pollId,
            voter: user.screenName,
            choice: req.body.choice
        }, (err, ok) => {
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            return res.status(200).json(ok);
        });
    });
});

// DELETE: Removes a poll.
Router.delete("/delete/:pollId", Auth.jwtAuthenticator, (req, res) => {
    // Deleting polls requires authentication.
    Auth.testLogin(req, (err, user) => {
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        // Remove the poll.
        PollController.removePoll({
            screenName: user.screenName,
            pollId: req.params.pollId
        }, (err, ok) => {
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            return res.status(200).json(ok);
        });
    });
});

// Export
module.exports = Router;