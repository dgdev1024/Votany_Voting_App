///
/// \file   pwtoken.model.js
/// \brief  The database model for our password reset tokens.
///

// Imports
const Mongoose          = require("mongoose");
const UUID              = require("uuid");

// Password Reset Token Schema
const PasswordResetSchema = new Mongoose.Schema({
    // The email address of the requesting user.
    emailAddress: { type: String, required: true, unique: true },

    // The ID portion of the reset authentication link.
    authenticateId: String,

    // Has the reset request been authenticated?
    authenticated: { type: Boolean, default: false },

    // Has this token been expended?
    expended: { type: Boolean, default: false },

    // The token will only be good for a limited time, so the user will
    // need to authenticate this token and change their password in short order.
    issueDate: {
        type: Date,
        default: Date.now,
        expires: 600
    }
});

///
/// \fn     generateAuthenticateId
/// \brief  Generates the ID portion of the reset token's authentication link.
///
/// \return The authentication ID.
///
PasswordResetSchema.methods.generateAuthenticateId = function () {
    this.authenticateId = UUID.v4();
};

// Compile and export the model.
module.exports = Mongoose.model("PasswordResetToken", PasswordResetSchema);