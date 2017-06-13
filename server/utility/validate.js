///
/// \file   validate.js
/// \brief  Contains our credential validation functions.
///

// Imports
const Regex         = require("./regex.js");

// Export our validation functions.
module.exports = {
    ///
    /// \fn     screenName
    /// \brief  Checks for a valid screen name.
    ///
    /// Screen names must be between 6 and 20 characters in length, and
    /// may not contain any symbols.
    ///
    /// \param  screenName          The screen name to be tested.
    ///
    /// \return Null if the screen name passes validation, an error string otherwise.
    ///
    screenName: screenName => {
        // Make sure the user entered a screen name.
        if (!screenName) {
            return "Please enter a screen name.";
        }

        // Make sure the screen name is within the allowed length.
        if (screenName.length < 6 || screenName.length > 20) {
            return "Screen names must be between 6 and 20.";
        }

        // Make sure the screen name doesn't contain any symbols.
        if (Regex.symbols.test(screenName) === true) {
            return "Screen names may not contain symbols.";
        }

        // Valid screen name.
        return null;
    },

    ///
    /// \fn     emailAddress
    /// \brief  Checks for a valid email address.
    ///
    /// Email addresses come in the form "personal_info@domain". Examples include
    /// "johndoe44@hotmail.com" and "brad_smith_55@yahoo.co.uk".
    ///
    /// \param  emailAddress        The email address string to be tested.
    ///
    /// \return Null if the email address is valid; an error string otherwise.
    ///
    emailAddress: emailAddress => {
        // Make sure the user entered an email address.
        if (!emailAddress) {
            return "Please enter an email address.";
        }

        // Make sure the email address is in valid form.
        if (Regex.emailAddresses.test(emailAddress) === false) {
            return "Please enter a valid email address.";
        }

        // Valid email address.
        return null;
    },

    ///
    /// \fn     password
    /// \brief  Checks for a valid, confirmed password.
    ///
    /// Passwords must be between 8 and 32 characters in length, and must contain
    /// at least one capital letter, at least one number, and at least one symbol.
    /// The user must also confirm their new password by re-typing it.
    ///
    /// \param  password            The password to be checked.
    /// \param  confirm             The retyped password.
    ///
    /// \return Null if the password is valid and confirmed; an error string otherwise.
    ///
    password: (password, confirm) => {
        // Make sure the user entered a password.
        if (!password) {
            return "Please enter a password.";
        }

        // Make sure the password and confirmed password match.
        if (password !== confirm) {
            return "The passwords do not match.";
        }

        // Make sure the password is within the proper length.
        if (password.length < 8 || password.length > 32) {
            return "Passwords must be between 8 and 32 characters in length.";
        }

        // Make sure the password has at least one capital letter...
        if (Regex.capitalLetters.test(password) === false) {
            return "Passwords must contain at least one capital letter.";
        }

        // ...one number...
        if (Regex.numbers.test(password) === false) {
            return "Passwords must contain at least one number.";
        }

        // ...and one symbol.
        if (Regex.symbols.test(password) === false) {
            return "Passwords must contain at least one symbol.";
        }

        // Valid and confirmed password.
        return null;
    }
};