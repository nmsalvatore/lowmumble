window.clearCachedPost = () => {
    if (localStorage.getItem("cached_post")) {
        localStorage.removeItem("cached_post");
    }
};
