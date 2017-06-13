///
/// \file   regex.js
/// \brief  The regular expressions used by this backend.
///

// Export our regular expressions.
module.exports = {
    capitalLetters: /[A-Z]/,
    numbers: /[0-9]/,
    symbols: /[$-/:-?{-~!"^_`\[\]]/,
    emailAddresses: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    mongooseDuplicateError: /index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i
};