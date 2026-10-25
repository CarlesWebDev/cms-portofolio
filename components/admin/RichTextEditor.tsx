"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";
export function RichTextEditor({ name, initialContent, onHtmlChange, }: {
    name: string;
    initialContent: string;
    onHtmlChange?: (html: string) => void;
}) {
    const [html, setHtml] = useState(initialContent);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                blockquote: false,
                codeBlock: false,
                horizontalRule: false,
                orderedList: false,
                bulletList: false,
                listItem: false,
            }),
            Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
        ],
        content: initialContent || "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "textarea min-h-[10rem]",
            },
        },
        onUpdate: ({ editor: ed }) => {
            const next = ed.isEmpty ? "" : ed.getHTML();
            setHtml(next);
            onHtmlChange?.(next);
        },
    });
    if (!editor)
        return null;
    const setLink = () => {
        const url = window.prompt("URL link (https://…):");
        if (url === null)
            return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        const safe = /^https?:\/\//.test(url) ? url : `https://${url}`;
        editor.chain().focus().extendMarkRange("link").setLink({ href: safe }).run();
    };
    return (<div>
      <div className="flex flex-wrap gap-1 mb-2" role="toolbar" aria-label="Format teks">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`label-mono px-3 py-1.5 border ${editor.isActive("bold") ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"}`} aria-pressed={editor.isActive("bold")}>
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`label-mono px-3 py-1.5 border italic ${editor.isActive("italic") ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"}`} aria-pressed={editor.isActive("italic")}>
          I
        </button>
        <button type="button" onClick={setLink} className={`label-mono px-3 py-1.5 border ${editor.isActive("link") ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--line)]"}`} aria-pressed={editor.isActive("link")}>
          Link
        </button>
        {editor.isActive("link") && (<button type="button" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()} className="label-mono px-3 py-1.5 border border-[var(--line)]">
            Lepas link
          </button>)}
      </div>

      <EditorContent editor={editor}/>
      <input type="hidden" name={name} value={html} readOnly/>
    </div>);
}
