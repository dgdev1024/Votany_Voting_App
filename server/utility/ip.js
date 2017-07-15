///
/// \file   ip.js
/// \brief  Contains a function for getting a client's IP address.
///

///
/// \brief  Gets the client's IP address from a request header.
///
/// \param  request             The request header.
///
/// \return The IP address string.
///
module.exports = request => {
    // Try to fetch the "X-Forwarded-For" request header.
    const forwardedFor = request.headers["x-forwarded-for"];

    // Check to see if the header was found.
    if (forwardedFor) {
        // Split the string into commas and return the first element of
        // the resulting array.
        return forwardedFor.split(",")[0].trim();
    } else {
        // Otherwise, return the connection's remote address.
        return request.connection.remoteAddress;
    }
};