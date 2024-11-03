setTitleInputSize();
setTagParsing();

let tags = [];

const formattedTags = document.getElementById("formatted_tags").value;
if (formattedTags) {
    tags = tags.concat(formattedTags);
}

function setTagParsing() {
    const currentTags = document.querySelector(".current-tags");
    const tagInput = document.getElementById("id_tags");
    const formattedTags = document.getElementById("formatted_tags");
    tagInput.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            const tagText = tagInput.value;
            const tagElement = createTagElement(tagText);
            currentTags.appendChild(tagElement);
            tagInput.value = "";
            tags.push(tagText);
            formattedTags.value = tags.join(",");
        }
    });

    function createTagElement(text) {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.innerText = text;
        return tag;
    }
}

function setTitleInputSize() {
    const newPostTitle = document.getElementById("id_title");
    newPostTitle.style.height = newPostTitle.scrollHeight + "px";
    newPostTitle.style.overflowY = "hidden";
    newPostTitle.addEventListener("input", function () {
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";
    });
}
