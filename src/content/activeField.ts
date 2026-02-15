let activeField: HTMLElement | null = null;

export function setupActiveFieldTracking() {
    document.addEventListener("focusin", (e) => {
        const target = e.target as HTMLElement;

        //textarea
        if (target.tagName === "TEXTAREA") {
            activeField = target;
            return;
        }

        //input
        if (target.tagName === "INPUT") {
            activeField = target;
            return;
        }

        //contenteditable
        if (target.isContentEditable) {
            activeField = target;
            return;
        }

        activeField = null;
    });
}

export function getActiveField() {
    return activeField;
}