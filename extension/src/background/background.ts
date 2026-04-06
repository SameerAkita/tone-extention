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

    if (msg.type === "EXT_AUTH_STATUS") {
        void (async () => {
            const authToken = await getAuthToken();
            sendResponse({ connected: Boolean(authToken) });
        })();
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

chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== "rewrite-stream") return;

    port.onMessage.addListener((msg) => {
        if (msg?.type !== "REWRITE_STREAM_START") return;

        void streamRewrite(port, msg.text, msg.tone);
    });
});

async function streamRewrite(
    port: chrome.runtime.Port,
    text: string,
    tone: string,
) {
    const startedAt = Date.now();
    const abortController = new AbortController();
    let disconnected = false;

    port.onDisconnect.addListener(() => {
        disconnected = true;
        abortController.abort();
    });

    try {
        const authToken = await getAuthToken();
        if (!authToken) {
            port.postMessage({ type: "error", error: "Not signed in. Connect your account first." });
            return;
        }

        const res = await fetch(REWRITE_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
            },
            body: JSON.stringify({ text, tone }),
            signal: abortController.signal,
        });

        const contentType = res.headers.get("content-type") ?? "";

        if (!res.ok) {
            const data = contentType.includes("application/json")
                ? await res.json().catch(() => null)
                : null;
            const retryAfterSeconds = parseRetryAfterSeconds(
                res.headers.get("retry-after"),
            );
            port.postMessage({
                type: "error",
                error:
                    data?.error
                    ?? (contentType.includes("text/html")
                        ? "Rewrite endpoint returned an HTML page instead of rewrite text."
                        : `Rewrite failed with status ${res.status}`),
                retryAfterSeconds,
            });
            return;
        }

        if (!res.body) {
            port.postMessage({ type: "error", error: "Rewrite response was not streamable" });
            return;
        }

        if (contentType.includes("text/html")) {
            port.postMessage({
                type: "error",
                error: "Rewrite endpoint returned an HTML page instead of rewrite text.",
            });
            return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let rewrittenText = "";
        let firstChunkAt: number | null = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            if (!chunk) continue;

            if (firstChunkAt === null) {
                firstChunkAt = Date.now();
                console.log("extension rewrite first chunk", {
                    tone,
                    inputChars: text.length,
                    timeToFirstChunkMs: firstChunkAt - startedAt,
                });
            }

            rewrittenText += chunk;
            if (!disconnected) {
                port.postMessage({ type: "chunk", chunk });
            }
        }

        const finalChunk = decoder.decode();
        if (finalChunk) {
            rewrittenText += finalChunk;
            if (!disconnected) {
                port.postMessage({ type: "chunk", chunk: finalChunk });
            }
        }

        console.log("extension rewrite completed", {
            tone,
            inputChars: text.length,
            outputChars: rewrittenText.length,
            timeToFirstChunkMs:
                firstChunkAt === null ? null : firstChunkAt - startedAt,
            elapsedMs: Date.now() - startedAt,
        });

        if (!disconnected) {
            port.postMessage({ type: "done", rewrittenText });
        }
    } catch (err) {
        if (abortController.signal.aborted) {
            console.log("rewrite aborted", { tone, inputChars: text.length });
            return;
        }

        console.log("rewrite failed: ", err);
        if (!disconnected) {
            port.postMessage({ type: "error", error: "Backend call failed" });
        }
    }
}

function parseRetryAfterSeconds(value: string | null) {
    if (!value) return undefined;

    const seconds = Number(value);
    if (!Number.isFinite(seconds) || seconds <= 0) {
        return undefined;
    }

    return Math.ceil(seconds);
}

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
