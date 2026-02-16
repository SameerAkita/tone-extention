
export function replaceText(field: HTMLElement, newText: string) {
    if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
        field.value = newText;
        field.dispatchEvent(new Event("input", { bubbles: true }));
        return;
    }

    if (field.isContentEditable) {
        field.innerText = newText;
        field.dispatchEvent(new Event("input", { bubbles: true }));
    }
}