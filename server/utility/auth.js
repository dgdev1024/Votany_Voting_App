///
/// \file   auth.js
/// \brief  Functions and objects for authentication purposes.
///

// Imports
const Mongoose              = require("mongoose");
const ExpressJWT            = require("express-jwt");
const UserModel             = require("../models/user.model.js");

// Exports
module.exports = {
    // The JWT authentication object.
    jwtAuthenticator: ExpressJWT({
        secret: process.env.JWT_SECRET,
        userProperty: "payload",
        credentialsRequired: false  
    }),

    ///
    /// \fn     testLogin
    /// \brief  Tests a JWT payload to see if a user is logged in.
    ///
    /// \param  request         The HTTP request header to check.
    /// \param  callback        A callback function to run when this async function finishes.
    ///
    testLogin: (request, callback) => {
        // Check to see if there is a JWT payload inside the request, and that
        // request contains a valid user ID.
        if (!request.payload || !request.payload._id) {
            return callback({
                status: 401,
                message: "You need to be logged in to use this feature."
            });
        }

        // Search for the user ID in the database.
        UserModel.findById(request.payload._id, (err, user) => {
            // Any errors searching the database?
            if (err) {
                return callback({
                    status: 500,
                    message: "Due to an error on our side, we were unable to check your login status. Try again later."
                });
            }

            // Was the user found?
            if (!user || user.verified === false) {
                return callback({
                    status: 401,
                    message: "Your login token has expired. You need to log in again."
                });
            }

            // Found the user.
            return callback(null, {
                message: `You are logged in as ${user.screenName}.`,
                screenName: user.screenName
            });
        });
    },

    // The Passport login strategies.
    loginStrategies: {
        ///
        /// \fn     local
        /// \brief  The Passport local login strategy.
        ///
        /// This login strategy allows the user to log in with a traditional
        /// username-and-password approach.
        ///
        /// \param  screenName          The user's screen name.
        /// \param  password            The user's password.
        /// \param  callback            A function to run when the async operation finishes.
        ///
        local: (screenName, password, callback) => {
            // Find the user in the database.
            UserModel.findOne({ screenName: screenName }, (err, user) => {
                // Any errors searching the database?
                if (err) {
                    return callback(err);
                }

                // Was the user found in the database?
                if (!user) {
                    return callback(null, false, {
                        message: `User "${screenName}" not found.`
                    });
                }

                // Has the user verified their account, yet?
                if (user.verified === false) {
                    return callback(null, false, {
                        message: "This account is not yet verified."
                    });
                }

                // Did the user submit the correct password?
                if (user.checkPassword(password) === false) {
                    return callback(null, false, {
                        message: "The password submitted is incorrect."
                    });
                }

                // Login successful.
                return callback(null, user);
            });
        }
    }
};