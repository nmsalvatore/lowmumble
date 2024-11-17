(() => {
    setTitleInputSize();
    checkForCachedTags();
    setTagListeners();
})();

function setTitleInputSize() {
    const newPostTitle = document.getElementById("id_title");
    newPostTitle.style.height = newPostTitle.scrollHeight + "px";
    newPostTitle.style.overflowY = "hidden";
    newPostTitle.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
}

function checkForCachedTags() {
    const newPostForm = document.getElementById("new_post_form");
    if (newPostForm) {
        const cachedPost = getCachedPost();
        if (cachedPost) {
            const tags = cachedPost.tags.split(",");
            renderTags(tags);
            setTagListeners();
        }
    }
}

function getCachedPost() {
    const cachedPost = localStorage.getItem("cached_post");
    if (!cachedPost) {
        return null;
    }
    return JSON.parse(cachedPost);
}

function renderTags(tags) {
    const tagDataElement = document.getElementById("tag_data");
    const currentTags = document.querySelector(".current-tags");
    tagDataElement.value = tags;
    for (const tag of tags) {
        const tagElement = createTagElement(tag);
        currentTags.appendChild(tagElement);
    }
}

function createTagElement(text) {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.setAttribute("tabindex", "0");
    tagElement.innerText = text;
    return tagElement;
}

function setTagListeners() {
    const currentTags = document.querySelector(".current-tags");
    const tagInput = document.getElementById("id_tags");
    setCreateTagListener();
    setFocusOnNextTagListener();
    setTagDeleteListeners();

    function createTag() {
        const tagDataElement = document.getElementById("tag_data");
        if (tagDataElement) {
            const tagData = tagDataElement.value;
            const tags = tagData === "" ? [] : tagData.split(",");
            const tagText = tagInput.value;
            const tagElement = createTagElement(tagText);
            tags.push(tagText);
            tagDataElement.value = tags.join(",");
            currentTags.appendChild(tagElement);
            tagInput.value = "";
            setTagDeleteListener(tagElement);
        }
    }

    function setFocusOnNextTagListener() {
        tagInput.addEventListener("keydown", (e) => {
            if (e.code === "Backspace" && !tagInput.value) {
                e.preventDefault();
                const tagElement = currentTags.lastElementChild;
                if (tagElement) {
                    tagElement.focus();
                }
            }
        });
    }

    function setCreateTagListener() {
        tagInput.addEventListener("keydown", (e) => {
            if (e.code === "Enter") {
                e.preventDefault();
                createTag();
            }
        });
    }

    function setTagDeleteListeners() {
        const tags = document.querySelectorAll(".tag");
        for (const tag of tags) {
            setTagDeleteListener(tag);
        }
    }

    function setTagDeleteListener(tagElement) {
        tagElement.addEventListener("keydown", (e) => {
            if (e.code === "Backspace") {
                e.preventDefault();
                const tag = tagElement.textContent;
                tagElement.remove();
                removeTagFromData(tag);
                setTagFocus();
            }
        });

        function removeTagFromData(tag) {
            const tagDataElement = document.getElementById("tag_data");
            if (tagDataElement) {
                const tags = tagDataElement.value.split(",");
                const index = tags.indexOf(tag);
                tags.splice(index, 1);
                tagDataElement.value = tags.join(",");
            }
        }

        function setTagFocus() {
            const nextTagElement = tagElement.previousElementSibling;
            if (nextTagElement) {
                nextTagElement.focus();
            } else {
                const tagInput = document.getElementById("id_tags");
                tagInput.focus();
            }
        }
    }
}
