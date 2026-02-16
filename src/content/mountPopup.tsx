import ReactDOM from "react-dom/client"
import TonePopup from "../overlay/TonePopup";

let popup: HTMLDivElement | null = null;
let root: ReactDOM.Root | null = null;

export function removePopup() {
  if (popup) {
    popup.remove();
    popup = null;
  }
}

export function showPopup(
  x: number, 
  y: number,
  selectedText: string,
  field: HTMLElement,
) {
  if (!popup) {
    popup = document.createElement("div");
    document.body.appendChild(popup);

    root = ReactDOM.createRoot(popup);
  }

  popup.style.position = "absolute";
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popup.style.zIndex = "999999";

  root!.render(
    <TonePopup 
      selectedText={selectedText}
      field={field}
    />
  );

  // prevent selection collapse
  popup.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
}
