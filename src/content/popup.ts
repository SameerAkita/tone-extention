import { replaceSelection } from "./replace";

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

  const preview = document.createElement("div");
  preview.innerText = "Replace text..."
  preview.style.marginBottom = "10px";

  const apply = document.createElement("button");
  apply.innerText = "Apply Rewrite";

  apply.style.padding = "6px 10px";
  apply.style.borderRadius = "8px";
  apply.style.border = "none";
  apply.style.cursor = "pointer";
  apply.style.background = "black";
  apply.style.color = "white";

  apply.addEventListener("mouseup", () => {
    replaceSelection("Business rewrite goes here");
    removePopup;
    
  })

  popup.appendChild(preview);
  popup.appendChild(apply);

  document.body.appendChild(popup);

  return popup;
}
