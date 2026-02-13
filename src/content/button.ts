let button: HTMLButtonElement | null = null;

export function removeButton() {
  if (button) {
    button.remove();
    button = null;
  }
}

export function createToneButton(
  x: number,
  y: number,
  onClick: () => void
) {
  removeButton();

  button = document.createElement("button");
  button.innerText = "Tone";

  button.style.position = "absolute";
  button.style.left = `${x}px`;
  button.style.top = `${y}px`;

  button.style.padding = "6px 10px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.background = "black";
  button.style.color = "white";
  button.style.cursor = "pointer";
  button.style.zIndex = "999999";

  // prevent selection collapsing
  button.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  button.addEventListener("mouseup", (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  });

  document.body.appendChild(button);

  return button;
}

export function getButtonRect() {
  return button?.getBoundingClientRect();
}
