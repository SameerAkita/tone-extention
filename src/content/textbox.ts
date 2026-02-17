export function getActiveTextbox(): HTMLElement | null {
    const el = document.activeElement as HTMLElement | null;
    if (!el) return null;

    if (el.tagName === "TEXTAREA" || el.tagName === "INPUT") return el;

    if (el.getAttribute("contenteditable") === "true") return el;

    return null;
}

export function getTextboxText(el: HTMLElement): string {
    let text = el.innerText ?? "";
    text = text.replace(/\n{2,}/g, "\n");
    
    console.log("original", text)
    return text;
}

export function pasteText(el: HTMLElement, text: string) {
    el.focus();
    const clipboardData = new DataTransfer();
    clipboardData.setData("text/plain", text);

    const event = new ClipboardEvent("paste", {
        clipboardData,
        bubbles: true,
    });

    el.dispatchEvent(event);
}