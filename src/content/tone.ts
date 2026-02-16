import { getActiveField } from "./activeField";
import { showToneButton } from "./button";
import { showPopup } from "./mountPopup";

export function setupTone() {
    setInterval(() => {
        const field = getActiveField();
        if (!field) return;

        showToneButton(field, () => {
            const text = field instanceof HTMLTextAreaElement ? field.value : field.innerText;

            const rect = field.getBoundingClientRect();

            showPopup(
                rect.right - 270,
                rect.bottom - 220,
                text,
                field,
            )
        })
    }, 500);
}