import { Mark } from "@tiptap/core";

export const MarkdownLink = Mark.create({
    name: "markdownLink",
    inclusive: false,

    addAttributes() {
        return {
            href: {
                default: null,
            },
            target: {
                default: "_blank",
            },
            rel: {
                default: "noopener noreferrer",
            },
        };
    },

    parseHTML() {
        return [{ tag: "a[href]" }];
    },

    renderHTML({ HTMLAttributes }) {
        return ["a", HTMLAttributes, 0];
    },

    addInputRules() {
        return [
            {
                find: /\[([^\]]+)\]\(([^)]+)\)\s$/,
                handler: ({ state, range, match }) => {
                    const linkText = match[1].trim();
                    const linkUrl = match[2].trim();
                    const start = range.from;
                    const end = range.to;

                    const tr = state.tr;
                    tr.deleteRange(start, end)
                        .insertText(linkText, start)
                        .addMark(
                            start,
                            start + linkText.length,
                            this.type.create({ href: linkUrl }),
                        )
                        .insertText(" ", start + linkText.length);

                    return tr;
                },
            },
        ];
    },
});
