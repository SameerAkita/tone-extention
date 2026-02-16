export function getActiveTextbox(): HTMLElement | null {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return null;

    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return el;

    if (el.getAttribute("contenteditable") === "true") return el;

    return null;
}

export function getTextboxRect(el: HTMLElement) {
    return el.getBoundingClientRect();
}