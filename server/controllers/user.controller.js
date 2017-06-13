///
/// \file   user.controller.js
/// \brief  Controller functions for the user database model.
///

// Imports
const Waterfall         = require("async").waterfall;
const Mongoose          = require("mongoose");
const Passport          = require("passport");
const UserModel         = require("../models/user.model.js");
const ResetTokenModel   = require("../models/pwtoken.model.js");
const Email             = require("../utility/email.js");
const Validate          = require("../utility/validate.js");

// Export Controller Functions
module.exports = {
    ///
    /// \fn     registerLocalUser
    /// \brief  Registers a new user for login with the local strategy.
    ///
    /// The 'parameters' object contains the following:
    /// 
    /// screenName              The new user's screen name.
    /// emailAddress            The new user's email address.
    /// password                The new user's password.
    /// confirm                 The new user's confirmed password.
    ///
    /// \param  parameters          The object containing the parameters shown above.
    /// \param  callback            A function to run once this function finishes.
    ///
    registerLocalUser: (parameters, callback) => {
        Waterfall([
            // 0. Validate the submitted credentials.
            (next) => {
                // Track errors.
                let validationErrors = [];

                // Validate our credentials.
                const screenNameError = Validate.screenName(parameters.screenName);
                const emailError = Validate.emailAddress(parameters.emailAddress);
                const passwordError = Validate.password(parameters.password, parameters.confirm);

                // Check for errors.
                if (screenNameError) { validationErrors.push(screenNameError); }
                if (emailError) { validationErrors.push(emailError); }
                if (passwordError) { validationErrors.push(passwordError); }

                // Early out if any errors were found.
                if (validationErrors.length > 0) {
                    return next({
                        status: 400,
                        message: "Failed to validate registration credentials.",
                        details: validationErrors
                    });
                }

                // Next function.
                return next(null);
            },

            // 1. Create the user.
            (next) => {
                // Create the user object.
                let user = new UserModel();
                user.screenName = parameters.screenName;
                user.emailAddress = parameters.emailAddress;
                user.setPassword(parameters.password);
                user.generateVerifyId();

                // Save the user to the database.
                user.save(err => {
                    // Any errors saving the user?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error saving user. Try again later."
                        });
                    }

                    // Send the user object to the next function.
                    return next(null, user);
                });
            },

            // 2. Send an email asking the user to verify their account.
            (user, next) => {
                // Send the email.
                Email.transport.sendMail(
                    Email.emailBody.accountVerification({
                        screenName: user.screenName,
                        emailAddress: user.emailAddress,
                        verifyId: user.verifyId
                    }), err => {
                        // Any errors sending the email?
                        if (err) {
                            user.remove();
                            return next({
                                status: 500,
                                message: "Error sending email. Try again later."
                            });
                        }

                        // All done.
                        return next(null);
                    }
                );
            }
        ], err => {
            // Any errors?
            if (err) {
                return callback(err);
            }

            // User registered.
            return callback(null, {
                message: "An account verification email has been sent. Check your email."
            });
        });
    },

    ///
    /// \fn     verifyLocalUser
    /// \brief  Verifies a newly-created local user account.
    ///
    /// \param  verifyId            The account's verification ID.
    /// \param  callback            A function to run once this function finishes.
    ///
    verifyLocalUser: (verifyId, callback) => {
        // Only one async operation necessary here, so no waterfall.
        //
        // Find the unverified user account with this ID.
        UserModel.findOneAndUpdate({
            verifyId: verifyId
        }, {
            verified: true,
            verifyId: null,
            verifyExpiry: null
        }, {
            new: true
        }, (err, user) => {
            // Any errors finding the user?
            if (err) {
                return callback({
                    status: 500,
                    message: "Error searching database. Try again later."
                });
            }

            // Was the unverified user found?
            if (!user) {
                return callback({
                    status: 404,
                    message: "Unverified user not found."
                });
            }

            // User verified.
            return callback(null, {
                message: "Your account is now verified. You may now log in."
            });
        });
    },

    ///
    /// \fn     issuePasswordResetToken
    /// \brief  Issues a password reset token to the user.
    ///
    /// If a user ever forgets their password, or otherwise wants to change it, a
    /// password reset token associated with the user will be added to the database.
    /// The user will need to authenticate the token by clicking a link in an email
    /// sent to them, before they can actually reset their password.
    ///
    /// \param  emailAddress        The user's email address.
    /// \param  callback            A function to run once this function finishes.
    ///
    issuePasswordResetToken: (emailAddress, callback) => {
        Waterfall([
            // 1. Find a user with this email address.
            (next) => {
                UserModel.findOne({ emailAddress: emailAddress }, (err, user) => {
                    // Any errors searching the database?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching database. Try again later."
                        });
                    }

                    // Was the user found?
                    if (!user) {
                        return next({
                            status: 404,
                            message: "User not found."
                        });
                    }

                    // Send the user object to the next function now.
                    return next(null, user);
                });
            },

            // 2. Create a password reset token and add it to the database.
            (user, next) => {
                // Create the token.
                let token = new ResetTokenModel();
                token.emailAddress = user.emailAddress;
                token.generateAuthenticateId();

                // Save it to the database.
                token.save(err => {
                    // Any errors saving the token?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error saving token. Try again later."
                        });
                    }

                    // Token created. Send it and the user object to the next function.
                    return next(null, user, token);
                });
            },

            // 3. Send the user an email letting them know the request was made.
            (user, token, next) => {
                // Send the user an email letting them know a password reset request
                // was made.
                Email.transport.sendMail(
                    Email.emailBody.passwordResetRequested({
                        screenName: user.screenName,
                        emailAddress: user.emailAddress,
                        authenticateId: token.authenticateId
                    }), err => {
                        // Any errors sending the email?
                        if (err) {
                            token.remove();
                            return next({
                                status: 500,
                                message: "Error sending email. Try again later."
                            });
                        }

                        // All done.
                        return next(null);
                    }
                )
            }
        ], err => {
            // Any errors?
            if (err) {
                return callback(err);
            }

            // Success.
            return callback(null, {
                message: "Password reset request made. Check your email."
            });
        });
    },

    ///
    /// \fn     authenticatePasswordResetToken
    /// \brief  Authenticates a password reset token issued to the user.
    ///
    /// Before actually changing their password, the user will need to authenticate
    /// the password reset token given to them. This will be done by clicking a link
    /// in an email sent to them. This, and the actual password change, will need to
    /// be done in short order, because the token will expire 10 minutes after it is
    /// issued.
    ///
    /// \param  authenticateId      The token's authentication ID.
    /// \param  callback            A function to run once this function finishes.
    ///
    authenticatePasswordResetToken: (authenticateId, callback) => {
        Waterfall([
            // 1. Find the reset token with this ID in the database.
            (next) => {
                // Search the database for the token.
                ResetTokenModel.findOne({ authenticateId: authenticateId }, (err, token) => {
                    // Any errors searching the database?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching database. Try again later."
                        });
                    }

                    // Was the token found in the database?
                    if (!token) {
                        return next({
                            status: 404,
                            message: "Token not found."
                        });
                    }

                    // Has the token been authenticated already?
                    if (token.authenticated === true) {
                        return next({
                            status: 409,
                            message: "This token has already been authenticated."
                        });
                    }

                    // Pass the token to the next function.
                    return next(null, token);
                });
            },

            // 2. Authenticate the token.
            (token, next) => {
                // Set the token's authenticated flag to true.
                token.authenticated = true;

                // Save the updated token to the database.
                token.save(err => {
                    // Any errors saving the token?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error saving token. Try again later."
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
                message: "Your password reset request has been authenticated."
            });
        });
    },

    ///
    /// \fn     changePassword
    /// \brief  Changes the user's password.
    ///
    /// After the user authenticates the password reset token, they will be allowed
    /// to change their password. They will need to do this in short order, though, as
    /// the token's expiration date is still in effect even after authentication.
    ///
    /// The 'parameters' object contains the following:
    /// "authenticateId"            The ID of the authenticated password reset token.
    /// "newPassword"               The user's new password.
    /// "confirmedPassword"         The user's new, confirmed password.
    ///
    /// \param  parameters          The aforementioned parameters object.
    /// \param  callback            A callback function to run once this function finishes.
    ///
    changePassword: (parameters, callback) => {
        Waterfall([
            // 0. Validate our password.
            (next) => {
                // Check for password errors.
                const passwordError = Validate.password(parameters.newPassword, parameters.confirmedPassword);

                // Early out if an error was found.
                if (passwordError) {
                    return next({
                        status: 400,
                        message: passwordError
                    });
                }

                // Next function.
                return next(null);
            },

            // 1. Find the authenticated reset token in the database.
            next => {
                ResetTokenModel.findOne({ authenticateId: parameters.authenticateId }, (err, token) => {
                    // Any errors searching the database?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching database. Try again later."
                        });
                    }

                    // Could the token be found?
                    if (!token) {
                        return next({
                            status: 404,
                            message: "Token not found."
                        });
                    }

                    // Has the token been authenticated?
                    if (token.authenticated === false) {
                        return next({
                            status: 401,
                            message: "This token has not been authenticated."
                        });
                    }

                    // Is the token expended?
                    if (token.expended === true) {
                        return next({
                            status: 401,
                            message: "This reset token has already been expended."
                        });
                    }

                    // Pass the token to the next function.
                    return next(null, token);
                });
            },

            // 2. Find the user associated with the email address stored in the token.
            (token, next) => {
                UserModel.findOne({ emailAddress: token.emailAddress }, (err, user) => {
                    // Any errors searching the database?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error searching user database. Try again later."
                        });
                    }

                    // Just to be sure, make sure a verified user was found.
                    if (!user) {
                        return next({
                            status: 404,
                            message: "User not found."
                        });
                    }
                    else if (user.verified === false) {
                        return next({
                            status: 401,
                            message: "This user is not yet verified."
                        });
                    }

                    // Pass the user document and token to the next function.
                    return next(null, user, token);
                });
            },

            // 3. Change the user's password.
            (user, token, next) => {
                // Save the new password.
                user.setPassword(parameters.newPassword);

                // Now save the user in the database.
                user.save(err => {
                    // Any errors saving the user?
                    if (err) {
                        return next({
                            status: 500,
                            message: "Error saving user. Try again later."
                        });
                    }

                    // User saved to database. Pass the user and token to the next function.
                    return next(null, user, token);
                });
            },

            // 4. Mark the token as expended, so that it cannot be used again to
            // change password.
            (user, token, next) => {
                // Mark the token as expended.
                token.expended = true;

                // Save the token to the database.
                token.save(err => {
                    // Regardless of errors, the password has been changed. Pass the user to
                    // the next function.
                    return next(null, user);
                });
            },

            // 5. Finally, send the user an email indicating their password has been changed.
            (user, next) => {
                Email.transport.sendMail(
                    Email.emailBody.passwordResetComplete({
                        screenName: user.screenName,
                        emailAddress: user.emailAddress
                    }), err => {
                        // Ignore errors here.
                        return next(null);
                    }
                );
            }
        ], err => {
            // Any errors at all?
            if (err) {
                return callback(err);
            }

            // Password changed.
            return callback(null, {
                message: "Your password has been changed."
            });
        });
    }
};