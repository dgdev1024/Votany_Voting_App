///
/// \file   index.js
/// \brief  The entry point for our applicationn.
///

// Imports
const Mongoose          = require("mongoose");
const UUID              = require("uuid");
const LoadEnv           = require("node-env-file");

// Mongoose Global Promise
Mongoose.Promise = global.Promise;

// Environment Variables
LoadEnv(".env");

// Generate a JWT secret.
process.env.JWT_SECRET = UUID.v4();

// Connect to Database.
Mongoose.connect(process.env.DB_URL)
    .then(require("./server/server.js"))
    .catch(err => {
        // Report Error
        console.error(`[Exception!] ${err}`);

        // Close database and exit program.
        Mongoose.connection.close().then(() => process.exit(1));
    });