///
/// \file   user.model.js
/// \brief  The database model for our registered users.
///

// Imports
const Crypto            = require("crypto");
const Mongoose          = require("mongoose");
const JWT               = require("jsonwebtoken");
const UUID              = require("uuid");

// User Schema
const UserSchema = new Mongoose.Schema({
    // Users will identify by and log in with their screen names.
    screenName: { type: String, required: true, unique: true },

    // Users will need to provide an email address, too.
    emailAddress: { type: String, required: true, unique: true },

    // Do not store users' passwords directly. Instead, salt them and
    // save the resulting hashes.
    passSalt: String,
    passHash: String,

    // Newly-registered users will need to verify their accounts by clicking
    // the link inside of a verification email that will be sent to them.
    //
    // This will need to be done within a time limit.
    verified: { type: Boolean, default: false },
    verifyId: String,
    verifyExpiry: { type: Date, default: Date.now, expires: 600 },

    // Also record the date the user registered.
    registerDate: { type: Date, default: Date.now },

    // The strategy used to log in.
    loginStrategy: {
        type: String,
        required: true
    },

    // The screen names of the users whom this user is following
    following: [String]
});

///
/// \fn     setPassword
/// \brief  Sets the user's password, salting it, and storing the hash.
///
/// \param  password            The user's new password.
///
UserSchema.methods.setPassword = function (password) {
    // We'll need a salt before we can encode our password.
    this.passSalt = Crypto.randomBytes(16).toString("hex");

    // Use the salt we just created to encode the password submitted.
    // Store the resulting hash instead of the password itself.
    this.passHash = Crypto.pbkdf2Sync(password, this.passSalt, 100000,
                                      64, "sha512").toString("hex");
};

///
/// \fn     checkPassword
/// \brief  Checks a submitted password against the stored password hash.
///
/// \param  password            The user's submitted password
///
/// \return True if the password hashes match.
///
UserSchema.methods.checkPassword = function (password) {
    // Encode the password submitted with the salt already stored in the
    // database.
    const hash = Crypto.pbkdf2Sync(password, this.passSalt,
                                   100000, 64, "sha512").toString("hex");

    // Compare the hashes and return true if they match.
    return hash === this.passHash;
};

///
/// \fn     generateVerifyId
/// \brief  Generates the ID portion of the new account's verification link.
///
UserSchema.methods.generateVerifyId = function () {
    // Generate a UUID to use as the verify ID.
    this.verifyId = UUID.v4();
};

///
/// \fn     generateJWT
/// \brief  Generates a JSON web token in order to verify the user's login.
///
/// \return The signed JWT.
///
UserSchema.methods.generateJWT = function () {
    // Set up the JWT's expiration date.
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 2);

    // Sign and return the JWT.
    return JWT.sign({
        _id: this._id,
        screenName: this.screenName,
        emailAddress: this.emailAddress,
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
};

// Compile and export the model.
module.exports = Mongoose.model("User", UserSchema);