import ReactDOM from "react-dom/client";
import Overlay from "../overlay/Overlay"

function mountOverlay() {
    const root = document.createElement("div");
    root.id = "tone-extension-root";

    document.body.appendChild(root);

    ReactDOM.createRoot(root).render(<Overlay />);
}

mountOverlay();