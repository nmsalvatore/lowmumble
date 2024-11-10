import { Editor } from "@tiptap/core";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

document.addEventListener("DOMContentLoaded", () => {
    const newPostForm = document.querySelector("#new_post_form");
    if (newPostForm) {
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
            ],
        });

        newPostForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const contentInput = document.getElementById("editor_content");
            const content = editor.getHTML();
            contentInput.value = content;
            newPostForm.submit();
        });
    }

    const editPostForm = document.querySelector("#edit_post_form");
    if (editPostForm) {
        const editor = new Editor({
            element: document.querySelector(".editor"),
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: "Say something",
                }),
            ],
            content: postContent,
        });

        editPostForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const contentInput = document.getElementById("editor_content");
            const content = editor.getHTML();
            contentInput.value = content;
            editPostForm.submit();
        });
    }
});
