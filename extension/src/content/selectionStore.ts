let savedRange: Range | null = null;

export function saveSelectionRange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount == 0) return;

    savedRange = selection.getRangeAt(0).cloneRange();
}

export function getSavedRange(): Range | null {
    return savedRange;
}

export function clearSavedRange() {
    savedRange = null;
}