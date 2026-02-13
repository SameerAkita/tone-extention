let popup: HTMLDivElement | null = null;

export function removePopup() {
  if (popup) {
    popup.remove();
    popup = null;
  }
}

export function showPopup(x: number, y: number) {
  removePopup();

  popup = document.createElement("div");

  popup.innerText = "Rewrite will appear here soon...";

  popup.style.position = "absolute";
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  popup.style.padding = "10px 12px";
  popup.style.borderRadius = "12px";
  popup.style.background = "white";
  popup.style.border = "1px solid #ddd";
  popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  popup.style.zIndex = "999999";
  popup.style.fontSize = "14px";
  popup.style.maxWidth = "250px";

  // prevent selection collapse
  popup.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  document.body.appendChild(popup);

  return popup;
}
