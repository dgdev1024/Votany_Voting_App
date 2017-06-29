///
/// \file   server.js
/// \brief  The entry point for our application's backend.
///

// Imports
const Path              = require("path");
const Express           = require("express");
const CookieParser      = require("cookie-parser");
const BodyParser        = require("body-parser");
const Passport          = require("passport");

// Export Server Main Function
module.exports = () => {
    // Create Express App
    const App = Express();

    // Middleware
    App.use(Express.static(Path.join(__dirname, "..", "public")));
    App.use(CookieParser());
    App.use(BodyParser.json());
    App.use(BodyParser.urlencoded({ extended: false }));
    App.use(Passport.initialize());

    // API Routes
    App.use("/api/user", require("./routes/user.api.js"));
    App.use("/api/poll", require("./routes/poll.api.js"));

    // Client Side Routing
    App.use("*", (req, res) => {
        res.sendFile(Path.join(__dirname, "..", "public", "index.html"));
    });

    // Listen
    const Server = App.listen(process.env.PORT || 3000, () => {
        console.log(`${process.env.SITE_TITLE} is now listening on port #${Server.address().port}...`);
    });
};