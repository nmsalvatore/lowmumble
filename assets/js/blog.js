(() => {
    setTitleInputSize();
    checkForCachedTags();
    setTagListeners();
    setFormSubmitAction();
    setDeletePostListener();
    setChangePublishDateListener();
})();

function setChangePublishDateListener() {
    const changePublishDateButton = document.getElementById(
        "change_publish_date_button",
    );
    if (changePublishDateButton) {
        changePublishDateButton.addEventListener("click", (e) => {
            e.preventDefault();
            const dialog = document.getElementById(
                "change_publish_date_dialog",
            );
            const cancel = dialog.querySelector(".cancel");
            dialog.showModal();
            cancel.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
            });
        });
    }
}

function setDeletePostListener() {
    const deleteButton = document.getElementById("delete_button");
    if (deleteButton) {
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault();
            const dialog = document.getElementById("delete_dialog");
            const cancel = dialog.querySelector(".cancel");
            dialog.showModal();
            cancel.addEventListener("click", (e) => {
                e.preventDefault();
                dialog.close();
            });
        });
    }
}

function setFormSubmitAction() {
    const actionInput = document.getElementById("submit_action");
    const options = document.querySelectorAll(
        "main form + div.admin-options button[type='submit']",
    );

    for (const option of options) {
        console.log(option);
        option.addEventListener("click", (e) => {
            const action = e.target.name;
            actionInput.value = action;
        });
    }
}

function setTitleInputSize() {
    const title = document.getElementById("id_title");
    if (title) {
        const calculateHeight = (scrollHeight) =>
            Math.floor(scrollHeight / 31) * 38.5;
        title.style.height = calculateHeight(title.scrollHeight) + "px";
        title.addEventListener("input", function () {
            this.style.height = "auto";
            this.style.height = calculateHeight(this.scrollHeight) + "px";
        });
    }
}

function checkForCachedTags() {
    const form = document.querySelector("form:has(.editor)");
    if (form) {
        const cachedPost = getCachedPost();
        if (cachedPost) {
            const tags = !cachedPost.tags ? [] : cachedPost.tags.split(",");
            document.querySelector(".current-tags").innerHTML = "";
            renderTags(tags);
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
            const tags = !tagData ? [] : tagData.split(",");
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
