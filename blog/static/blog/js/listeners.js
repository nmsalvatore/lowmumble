const newPostTitle = document.getElementById("id_title");
newPostTitle.style.height = newPostTitle.scrollHeight + "px";
newPostTitle.style.overflowY = "hidden";
newPostTitle.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
});
