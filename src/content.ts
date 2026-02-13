let button: HTMLButtonElement | null = null;

function removeButton() {
  if (button) {
    button.remove();
    button = null;
  }
}

function isEditableSelection(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    const container = range.startContainer;

    const element =
        container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : (container as HTMLElement);

    if (!element) return false;

    const editableParent = element.closest(
        "textarea, input, [contenteditable='true']"
    )

    return editableParent !== null;
}

document.addEventListener("mouseup", (e) => {
    if (button && e.target === button) {
        return;
        }

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!text) {
        removeButton();
        return;
    }

    if (!isEditableSelection()) {
        removeButton();
        return;
    }

    const range = selection!.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    removeButton();

    button = document.createElement("button");
    button.innerText = "Tone";

    button.style.position = "absolute";
    button.style.left = `${rect.right + window.scrollX}px`;
    button.style.top = `${rect.bottom + window.scrollY}px`;

    button.style.padding = "6px 10px";
    button.style.borderRadius = "8px";
    button.style.border = "none";
    button.style.background = "black";
    button.style.color = "white";
    button.style.cursor = "pointer";
    button.style.zIndex = "999999";

    button.addEventListener("mousedown", (e) => {
        e.preventDefault();
    });

    button.onclick = () => {
        alert("Tone button clicked!");
        console.log("Tone button clicked!")
    };

    document.body.appendChild(button);
});
