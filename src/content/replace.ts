export function replaceSelection(newText: string) {
    const active = document.activeElement as HTMLElement | null;
    if (!active) return;

    if (active instanceof HTMLTextAreaElement || (active instanceof HTMLInputElement && active.type === "text")) {
        const start = active.selectionStart;
        const end = active.selectionEnd;

        if (start === null || end === null) return;

        const before = active.value.slice(0, start);
        const after = active.value.slice(end);

        active.value = before + newText + after;

        active.selectionStart = active.selectionEnd = start + newText.length;

        return;
    }

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();
    range.insertNode(document.createTextNode(newText));

    selection.removeAllRanges();
}