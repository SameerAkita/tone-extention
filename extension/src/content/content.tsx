import ReactDOM from "react-dom/client";
import Overlay from "../overlay/Overlay"

const TRUSTED_WEB_ORIGINS = new Set([
    "http://localhost:3001",
]);

function mountOverlay() {
    if (window.location.pathname === "/connect-extension") return;

    const root = document.createElement("div");
    root.id = "tone-extension-root";

    document.body.appendChild(root);

    ReactDOM.createRoot(root).render(<Overlay />);
}

mountOverlay();

window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (!TRUSTED_WEB_ORIGINS.has(event.origin)) return;

    const data = event.data as { type?: string; token?: string } | null;
    if (!data) return;

    if (data.type === "TONE_EXTENSION_AUTH_CLEAR") {
        const runtime = globalThis.chrome?.runtime;
        if (!runtime?.sendMessage) {
            window.postMessage(
                {
                    type: "TONE_EXTENSION_AUTH_RESULT",
                    error: "Extension runtime is unavailable on this page. Check extension site access and reload extension.",
                },
                event.origin,
            );
            return;
        }

        runtime.sendMessage({ type: "EXT_AUTH_CLEAR" }, (response) => {
            const runtimeError = runtime.lastError?.message;
            if (runtimeError) {
                window.postMessage(
                    { type: "TONE_EXTENSION_AUTH_RESULT", error: runtimeError },
                    event.origin,
                );
                return;
            }

            if (response?.error) {
                window.postMessage(
                    { type: "TONE_EXTENSION_AUTH_RESULT", error: response.error },
                    event.origin,
                );
                return;
            }

            window.postMessage(
                { type: "TONE_EXTENSION_AUTH_RESULT", ok: true },
                event.origin,
            );
        });
        return;
    }

    if (data.type !== "TONE_EXTENSION_AUTH_SET") return;

    const token = typeof data.token === "string" ? data.token.trim() : "";
    if (!token) {
        window.postMessage(
            { type: "TONE_EXTENSION_AUTH_RESULT", error: "Missing token" },
            event.origin,
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
            event.origin,
        );
        return;
    }

    runtime.sendMessage({ type: "EXT_AUTH_SET", token }, (response) => {
        const runtimeError = runtime.lastError?.message;
        if (runtimeError) {
            window.postMessage(
                { type: "TONE_EXTENSION_AUTH_RESULT", error: runtimeError },
                event.origin,
            );
            return;
        }

        if (response?.error) {
            window.postMessage(
                { type: "TONE_EXTENSION_AUTH_RESULT", error: response.error },
                event.origin,
            );
            return;
        }

        window.postMessage(
            { type: "TONE_EXTENSION_AUTH_RESULT", ok: true },
            event.origin,
        );
    });
});
