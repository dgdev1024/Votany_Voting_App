///
/// \file   poll.model.js
/// \brief  The database model for our polls.
///

// Imports
const Mongoose      = require("mongoose");

// Poll Choice Schema
const PollChoiceSchema = new Mongoose.Schema({
    // The choice's body. What is the user voting for?
    body: { type: String, required: true },

    // How many votes has this choice amassed?
    votes: { type: Number, default: 0 }
});

// Poll Schema
const PollSchema = new Mongoose.Schema({
    // The poll's author.
    author: { type: String, required: true },

    // The poll's post date.
    postDate: { type: Date, default: Date.now },

    // The issue being voted on in this poll.
    issue: { type: String, required: true },

    // The list of choices available to voters.
    choices: {
        type: [PollChoiceSchema],
        validate: {
            validator: v => v.length >= 2,
            message: "Polls must have at least two choices."
        }
    },

    // The list of users who have voted on this poll.
    //
    // Registered users will be identified here by their screen names, whereas unregistered
    // users will be identified by their IP addresses.
    voters: [String]
});

// Virtual to tally the total votes on this poll.
PollSchema.virtual("totalVotes").get(function () {
    return this.choices.reduce((acc, val) => {
        return acc + val.votes;
    }, 0);
});

///
/// \fn     castVote
/// \brief  Casts a vote on this poll.
///
/// \param  voter           The handle of the voting user.
/// \param  index           The index of the choice the user votes for.
///
PollSchema.methods.castVote = function (voter, index) {
    // Protect against author bias! Don't allow the poll's author to cast a vote.
    if (voter === this.author) {
        return "AUTHOR";
    }

    // Check to see if the user has already voted in this poll.
    if (this.voters.indexOf(voter) !== -1) {
        return "ALREADY_VOTED";
    }

    // Check to see if the choice index given is in bounds.
    if (index < 0 || index >= this.choices.length) {
        return "OUT_OF_BOUNDS";
    }

    // Cast the vote.
    this.choices[index].votes += 1;
    this.voters.push(voter);

    return "OK";
};

///
/// \fn     addChoice
/// \brief  Adds a new choice to the poll, then votes for it.
///
/// \param  voter           The handle of the voting user.
/// \param  choice          The new choice to be added to the poll.
///
/// \return "OK" if the operation is successful.
///
PollSchema.methods.addChoice = function (voter, choice) {
    // Check to see if this user has already voted on this poll.
    if (voter !== this.author && this.voters.indexOf(voter) !== -1) {
        return "ALREADY_VOTED";
    }

    // Check to see if a choice has been provided.
    if (choice === "") {
        return "NO_CHOICE";
    }    

    // Add the choice to the poll. If the adding user is not the author, this
    // will count as a vote on the poll.
    if (voter !== this.author) {
        this.choices.push({ body: choice, votes: 1 });
        this.voters.push(voter);
    } else {
        this.choices.push({ body: choice, votes: 0 });
    }
        
    return "OK";
};

// Compile and export the model.
module.exports = Mongoose.model("Poll", PollSchema);