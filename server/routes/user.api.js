///
/// \file   user.api.js
/// \brief  Routinng functions for our user controller.
///

// Imports
const Express           = require("express");
const Passport          = require("passport");
const PassportLocal     = require("passport-local").Strategy;
const UserModel         = require("../models/user.model.js");
const UserController    = require("../controllers/user.controller.js");
const Auth              = require("../utility/auth.js");

// Express Router
const Router = Express.Router();

// Login Strategies
Passport.use(new PassportLocal({ usernameField: "screenName" }, Auth.loginStrategies.local));

// POST: Registers a new user.
Router.post("/register", (req, res) => {
    // Register the user.
    UserController.registerLocalUser({
        screenName: req.body.screenName,
        emailAddress: req.body.emailAddress,
        password: req.body.password,
        confirm: req.body.confirm
    }, (err, ok) => {
        // Any errors registering the user?
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        // User registered.
        return res.status(200).json(ok);
    });
});

// GET: Verifies a new user account.
Router.get("/verify/:userId", (req, res) => {
    // Verify the account.
    UserController.verifyLocalUser(req.params.userId, (err, ok) => {
        // Any errors verifying?
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        // User verified.
        res.status(200).json(ok);
    });
});

// POST: Requests a password reset token.
Router.post("/requestPasswordReset", (req, res) => {
    // Request the token.
    UserController.issuePasswordResetToken(req.body.emailAddress, (err, ok) => {
        // Any errors requesting the token?
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        return res.status(200).json(ok);
    });
});

// GET: Authenticates a password reset token.
Router.get("/authenticatePasswordReset/:authenticateId", (req, res) => {
    // Authenticate the token.
    UserController.authenticatePasswordResetToken(req.params.authenticateId, (err, ok) => {
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        return res.status(200).json(ok);
    });
});

// POST: Changes a user's password.
Router.post("/changePassword/:authenticateId", (req, res) => {
    // Change the password.
    UserController.changePassword({
        authenticateId: req.params.authenticateId,
        newPassword: req.body.password,
        confirmedPassword: req.body.confirm
    }, (err, ok) => {
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        return res.status(200).json(ok);
    });
});

// GET: Views a user profile.
Router.get("/profile/:screenName", (req, res) => {
    UserController.viewProfile(req.params.screenName, (err, profile) => {
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        return res.status(200).json(profile);
    });
});

// GET: Views the logged-in user's profile.
Router.get("/me", Auth.jwtAuthenticator, (req, res) => {
    // We obviously need to be logged in here.
    Auth.testLogin(req, (err, user) => {
        if (err) {
            return res.status(err.status).json({ error: err });
        }

        UerController.viewProfile(user.screenName, (err, profile) => {
            if (err) {
                return res.status(err.status).json({ error: err });
            }

            return res.status(200).json(profile);
        });
    });
});

// POST: Logs a user in locally.
Router.post("/login", (req, res) => {
    // Let Passport handle the user's authentication.
    Passport.authenticate("local", (err, user, info) => {
        // Any errors with authentication?
        if (err) {
            return res.status(500).json({
                error: { status: 500, message: "Authentication error. Try again later." }
            });
        }

        // Was the authentication successful?
        if (!user) {
            return res.status(401).json({
                error: { status: 401, message: info.message }
            });
        }

        // Autentication successful. Generate and return a JWT token.
        const token = user.generateJWT();
        return res.status(200).json({
            message: `Welcome, ${user.screenName}!`,
            screenName: user.screenName,
            token: token
        });
    })(req, res);
});

// GET: Tests a user's login.
Router.get("/testlogin", Auth.jwtAuthenticator, (req, res) => {
    Auth.testLogin(req, (err, ok) => {
        if (err) {
            return res.status(err.status).json({
                error: err
            });
        }

        return res.status(200).json(ok);
    });
});

// Export Router
module.exports = Router;