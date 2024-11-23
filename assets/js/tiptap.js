import { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { MarkdownLink } from "./markdown_link.js";

(() => {
    const form = document.querySelector("form:has(.editor)");
    const cachedPost = localStorage.getItem("cached_post");

    let postContent;
    try {
        postContent = editedContent;
    } catch (err) {
        postContent = cachedPost ? JSON.parse(cachedPost).content : "";
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

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("id_title").value;
        const tags = document.getElementById("tag_data").value;
        const content = editor.getHTML();

        localStorage.setItem(
            "cached_post",
            JSON.stringify({ title, tags, content }),
        );

        const contentInput = document.getElementById("editor_content");
        contentInput.value = content;
        form.submit();
    });
})();
