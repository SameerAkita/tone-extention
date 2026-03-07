const DEFAULT_WEB_ORIGIN = "http://localhost:3000";
const webOriginFromEnv = import.meta.env.VITE_WEB_ORIGIN;
const WEB_ORIGIN =
    webOriginFromEnv && webOriginFromEnv.trim().length > 0
        ? webOriginFromEnv.replace(/\/+$/, "")
        : DEFAULT_WEB_ORIGIN;
const rewriteEndpointFromEnv = import.meta.env.VITE_REWRITE_ENDPOINT;
const REWRITE_ENDPOINT =
    rewriteEndpointFromEnv && rewriteEndpointFromEnv.trim().length > 0
        ? rewriteEndpointFromEnv
        : `${WEB_ORIGIN}/api/extension/rewrite`;

console.log("background service")

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
    if (msg.type === "EXT_AUTH_SET") {
        const token = typeof msg.token === "string" ? msg.token.trim() : "";
        if (!token) {
            sendResponse({ error: "Missing token" });
            return;
        }

        chrome.storage.local.set({ authToken: token }, () => {
            if (chrome.runtime.lastError) {
                sendResponse({ error: chrome.runtime.lastError.message ?? "Failed to store token" });
                return;
            }
            sendResponse({ ok: true });
        });
        return true;
    }

    if (msg.type === "EXT_AUTH_CLEAR") {
        chrome.storage.local.remove(["authToken"], () => {
            if (chrome.runtime.lastError) {
                sendResponse({ error: chrome.runtime.lastError.message ?? "Failed to clear token" });
                return;
            }
            sendResponse({ ok: true });
        });
        return true;
    }

    if (msg.type !== "REWRITE") return;

    console.log("Rewrite request received: ", msg);

    (async () => {
        try {
            const authToken = await getAuthToken();
            if (!authToken) {
                sendResponse({ error: "Not signed in. Connect your account first." });
                return;
            }

            const res = await fetch(REWRITE_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    text: msg.text,
                    tone: msg.tone,
                }),
            });

            const data = await res.json();

            console.log("backend response: ", data);
            sendResponse(data);
        } catch (err) {
            console.log(msg);
            console.log("rewrite failed: ", err);
            sendResponse({ error: "Backend call failed" })
        }
    })();

    return true;
});

function getAuthToken(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(["authToken"], (result) => {
            if (chrome.runtime.lastError) {
                resolve(null);
                return;
            }

            const token = result.authToken;
            resolve(typeof token === "string" ? token : null);
        });
    });
}
