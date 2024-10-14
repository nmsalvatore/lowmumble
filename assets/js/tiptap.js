import { Editor } from "@tiptap/core";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";

document.addEventListener("DOMContentLoaded", () => {
    const newPostForm = document.querySelector("#new_post_form");
    if (newPostForm) {
        const editor = new Editor({
            element: document.querySelector(".editor"),
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder: "Say something",
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
});
