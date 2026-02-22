import ReactDOM from "react-dom/client";
import Overlay from "../overlay/Overlay"

function mountOverlay() {
    if (window.location.pathname === "/connect-extension") return;

    const root = document.createElement("div");
    root.id = "tone-extension-root";

    document.body.appendChild(root);

    ReactDOM.createRoot(root).render(<Overlay />);
}

mountOverlay();

window.addEventListener("message", (event) => {
    if (window.location.pathname !== "/connect-extension") return;
    if (event.source !== window) return;
    if (event.origin !== window.location.origin) return;

    const data = event.data as { type?: string; token?: string } | null;
    if (!data || data.type !== "TONE_EXTENSION_AUTH_SET") return;

    const token = typeof data.token === "string" ? data.token.trim() : "";
    if (!token) {
        window.postMessage(
            { type: "TONE_EXTENSION_AUTH_RESULT", error: "Missing token" },
            window.location.origin,
        );
        return;
    }

    const runtime = globalThis.chrome?.runtime;
    if (!runtime?.sendMessage) {
        window.postMessage(
            {
                type: "TONE_EXTENSION_AUTH_RESULT",
                error: "Extension runtime is unavailable on this page. Check extension site access and reload extension.",
            },
            window.location.origin,
        );
        return;
    }

    runtime.sendMessage({ type: "EXT_AUTH_SET", token }, (response) => {
        const runtimeError = runtime.lastError?.message;
        if (runtimeError) {
            window.postMessage(
                { type: "TONE_EXTENSION_AUTH_RESULT", error: runtimeError },
                window.location.origin,
            );
            return;
        }

        if (response?.error) {
            window.postMessage(
                { type: "TONE_EXTENSION_AUTH_RESULT", error: response.error },
                window.location.origin,
            );
            return;
        }

        window.postMessage(
            { type: "TONE_EXTENSION_AUTH_RESULT", ok: true },
            window.location.origin,
        );
    });
});
