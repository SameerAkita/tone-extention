let button: HTMLButtonElement | null = null;

export function removeToneButton() {
    if (button) {
        button.remove();
        button = null;
    }
}

export function showToneButton(
    field: HTMLElement,
    onClick: () => void,
) {
    removeToneButton();

    button = document.createElement("button");
    button.innerText = "T",
    
    button.style.position = "fixed";
    button.style.padding = "6px 10px";
    button.style.borderRadius = "10px";
    button.style.border = "none";
    button.style.background = "black";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.zIndex = "999999"

    const rect = field.getBoundingClientRect();

    button.style.left = `${rect.right - 60}px`;
    button.style.top = `${rect.bottom - 35}px`;

    button.addEventListener("mouseup", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
    });

    document.body.appendChild(button);
}