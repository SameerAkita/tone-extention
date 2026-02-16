export function getActiveTextbox(): HTMLElement | null {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return null;

    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return el;

    if (el.getAttribute("contenteditable") === "true") return el;

    return null;
}

export function getTextboxText(el: HTMLElement): string {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) return el.value;

    return el.innerText;
}

export function setTextboxText(el: HTMLElement, text: string) {
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
        el.value = text;
        return;
    }

    el.innerText = text;
}