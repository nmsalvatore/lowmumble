const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        tiptap: "./assets/js/tiptap.js",
        blog: "./assets/js/blog.js",
        htmx: "./assets/js/htmx.js",
        core: "./assets/js/core.js",
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "blog", "static", "blog", "js"),
    },
};
