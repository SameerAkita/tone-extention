import { getSavedRange, clearSavedRange } from "./selectionStore";

export function replace(newText: string) {
    const range = getSavedRange();
    if (!range) return;

    range.deleteContents();

    range.insertNode(document.createTextNode(newText));

    clearSavedRange();

    const selection = window.getSelection();
    selection?.removeAllRanges();
}