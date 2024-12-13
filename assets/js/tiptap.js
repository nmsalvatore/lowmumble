import { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { MarkdownLink } from "./markdown_link.js";

(() => {
    const form = document.querySelector("form:has(.editor)");
    const editedContentExists = typeof editedContent !== "undefined";

    let postContent = "";
    let hasUnsavedChanges;

    const cachedPost = JSON.parse(localStorage.getItem("cached_post"));
    if (cachedPost) {
        const title = document.getElementById("id_title");
        postContent = cachedPost.content;
        title.value = cachedPost.title;
    } else if (editedContentExists) {
        postContent = editedContent;
    }

    const editor = new Editor({
        element: document.querySelector(".editor"),
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
            }),
            Placeholder.configure({
                placeholder: "Write something",
            }),
            MarkdownLink,
        ],
        content: postContent,
    });

    window.addEventListener("beforeunload", checkForUnsavedChanges);
    form.addEventListener("input", debounce(savePostToLocalStorage, 1000));
    form.addEventListener("input", () => (hasUnsavedChanges = true));
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        hasUnsavedChanges = false;
        savePostToLocalStorage();
        const contentInput = document.getElementById("editor_content");
        const content = editor.getHTML();
        const contentWithUpdatedHeadings = content
            .replace(/<h[1-6]/g, "<h2")
            .replace(/<\/h[1-6]>/g, "</h2>");
        contentInput.value = contentWithUpdatedHeadings;
        form.submit();
    });

    function savePostToLocalStorage() {
        const title = document.getElementById("id_title").value;
        const tags = document.getElementById("tag_data").value;
        const content = editor.getHTML();
        localStorage.setItem(
            "cached_post",
            JSON.stringify({ title, tags, content }),
        );
    }

    function checkForUnsavedChanges(e) {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = "";
        }
    }
})();

function debounce(func, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}
