///
/// \file   email.js
/// \brief  Sets up our email transport and bodies.
///

// Imports
const NodeMailer = require("nodemailer");

// Exports
module.exports = {
    // Create the email transport.
    transport: NodeMailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    }),

    // Our email body functions.
    emailBody: {
        ///
        /// \fn     accountVerification
        /// \brief  Creates an account verification email.
        ///
        /// The "options" parameter will contain the following options:
        ///
        /// screenName              The user's screen name.
        /// emailAddress            The user's email address.
        /// verifyId                The identifying portion of the verification URL.
        ///
        accountVerification: options => {
            // The verification URL.
            const url = `${process.env.SITE_URL}/api/user/verify/${options.verifyId}`;

            // The email's sender, subject, and body.
            const sender = `${process.env.SITE_AUTHOR} <${process.env.EMAIL_ADDRESS}>`;
            const subject = `${process.env.SITE_TITLE}: Verify Your New Account.`;
            const body = `
                <p>
                    Hello, ${options.screenName}! <br /><br />
                    Click on the link below to verify your new account: <br />
                    <a href="${url}">${url}</a><br /><br />
                    Thank you for joining ${process.env.SITE_TITLE}! We hope you enjoy. <br /><br />
                    - ${process.env.SITE_AUTHOR}
                </p>
            `;

            // Return the email object.
            return {
                from: sender,
                to: options.emailAddress,
                subject: subject,
                html: body
            };
        },

        ///
        /// \fn     passwordResetRequested
        /// \brief  An email letting the user know a password reset was requested.
        ///
        /// Options:
        ///
        /// "screenName"                The user's screen name.
        /// "emailAddress"              The user's email address.
        /// "authenticateId"            The ID portion of the authentication link.
        ///
        passwordResetRequested: options => {
            // The link the user will need to click on in order to authenticate
            // the reset request.
            const url = `${process.env.SITE_URL}/api/user/authenticatePasswordReset/${options.authenticateId}`;

            // The email's sender, subject, and body.
            const sender = `${process.env.SITE_AUTHOR} <${process.env.EMAIL_ADDRESS}>`;
            const subject = `${process.env.SITE_TITLE}: Password Reset Requested.`;
            const body = `
                Hello, ${options.screenName}!<br /><br />
                You are receiving this email because you have requested a password reset.<br />
                Click on the link below to authenticate the reset request: <br />
                <a href="${url}">${url}</a><br /><br />
                If you did not make this request, then you can safely ignore this email.<br /><br />
                Thank you for using ${process.env.SITE_TITLE}! We hope you continue enjoying this site!<br /><br />
                - ${process.env.SITE_AUTHOR}
            `;

            // Return the email object.
            return {
                from: sender,
                to: options.emailAddress,
                subject: subject,
                html: body
            };
        },

        ///
        /// \fn     passwordResetComplete
        /// \brief  An email letting the user know their password was changed.
        ///
        /// Options:
        ///
        /// "screenName"                The user's screen name.
        /// "emailAddress"              The user's email address.
        ///
        passwordResetComplete: options => {
            // The email's sender, subject, and body.
            const sender = `${process.env.SITE_AUTHOR} <${process.env.EMAIL_ADDRESS}>`;
            const subject = `${process.env.SITE_TITLE}: Password Changed.`;
            const body = `
                Hello, ${options.screenName}!<br /><br />
                You are receiving this email because your account's password has been changed.<br />
                If this is not you, then please reply to this email.<br /><br />
                Thank you for using ${process.env.SITE_TITLE}! We hope you continue enjoying this site!<br /><br />
                - ${process.env.SITE_AUTHOR}
            `;

            // Return the email object.
            return {
                from: sender,
                to: options.emailAddress,
                subject: subject,
                html: body
            };
        }
    }
}