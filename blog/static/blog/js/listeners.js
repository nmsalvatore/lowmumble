setTitleInputSize();
setTagListeners();

let tags = [];

const formattedTags = document.getElementById("formatted_tags");
if (formattedTags.value !== "") {
    tags = tags.concat(formattedTags.value.split(","));
}

const tagElements = document.querySelectorAll(".tag");
for (const tagElement of tagElements) {
    setTagDeleteListener(tagElement);
}

function setTagDeleteListener(tagElement) {
    tagElement.addEventListener("keydown", (e) => {
        if (e.code === "Backspace") {
            e.preventDefault();

            const nextTagElement = tagElement.previousElementSibling;
            const tagText = tagElement.textContent;

            tagElement.remove();
            const tagIndex = tags.indexOf(tagText);
            tags.splice(tagIndex, 1);
            formattedTags.value = tags.join(",");

            if (nextTagElement) {
                nextTagElement.focus();
            } else {
                const tagInput = document.getElementById("id_tags");
                tagInput.focus();
            }
        }
    });
}

function setTagListeners() {
    const currentTags = document.querySelector(".current-tags");
    const tagInput = document.getElementById("id_tags");

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

        if (e.code === "Backspace" && !tagInput.value) {
            e.preventDefault();
            const tagElement = currentTags.lastElementChild;
            if (tagElement) {
                tagElement.focus();
            }
        }
    });

    function createTagElement(text) {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.setAttribute("tabindex", "0");
        tagElement.innerText = text;
        setTagDeleteListener(tagElement);
        return tagElement;
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
