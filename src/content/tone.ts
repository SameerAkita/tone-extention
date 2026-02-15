import { getActiveField } from "./activeField";
import { showToneButton } from "./button";

export function setupTone() {
    setInterval(() => {
        const field = getActiveField();
        if (!field) return;

        showToneButton(field, () => {
            console.log("tone button clicked")
        })
    }, 500);
}