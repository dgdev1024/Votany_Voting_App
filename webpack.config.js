const Path      = require("path");

module.exports = {
    entry: Path.join(__dirname, "client/main.js"),
    output: {
        path: Path.resolve(__dirname, "public"),
        filename: "bundle.js"
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: [/node_modules/],
            use: [{
                loader: "babel-loader",
                options: {
                    presets: [ "es2015", "stage-2", "react" ]
                }
            }]
        }, 
        {
            test: /\.(sass|scss)$/,
            use: [ "style-loader", "css-loader", "sass-loader" ]
        }]
    }
};