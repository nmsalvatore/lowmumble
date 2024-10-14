const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        tiptap: "./assets/js/tiptap.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "blog", "static", "blog", "js"),
    },
};
