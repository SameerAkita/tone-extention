import type { ToneLevel } from "../overlay/Overlay";

export interface RewriteResponse {
    rewrittenText?: string;
    error?: string;
    retryAfterSeconds?: number;
}

export interface RewriteStreamHandle {
    promise: Promise<RewriteResponse>;
    cancel: () => void;
}

type RewriteStreamEvent =
    | { type: "chunk"; chunk: string }
    | { type: "done"; rewrittenText: string }
    | { type: "error"; error: string; retryAfterSeconds?: number };

export async function rewriteText(
    text: string,
    tone: ToneLevel,
    onChunk?: (chunk: string) => void,
): Promise<RewriteResponse> {
    if (!onChunk) {
        return rewriteTextOnce(text, tone);
    }

    return startRewriteTextStream(text, tone, onChunk).promise;
}

export function startRewriteTextStream(
    text: string,
    tone: ToneLevel,
    onChunk: (chunk: string) => void,
): RewriteStreamHandle {
    const port = chrome.runtime.connect({ name: "rewrite-stream" });
    let settled = false;
    let cancelled = false;

    const promise = new Promise<RewriteResponse>((resolve, reject) => {
        function finish(result: RewriteResponse) {
            if (settled) return;
            settled = true;
            resolve(result);
        }

        port.onMessage.addListener((message: RewriteStreamEvent) => {
            if (settled) return;

            if (message.type === "chunk") {
                onChunk(message.chunk);
                return;
            }

            if (message.type === "done") {
                finish({ rewrittenText: message.rewrittenText });
                try {
                    port.disconnect();
                } catch {
                    // Port may already be closed; safe to ignore.
                }
                return;
            }

            finish({
                error: message.error,
                retryAfterSeconds: message.retryAfterSeconds,
            });
            try {
                port.disconnect();
            } catch {
                // Port may already be closed; safe to ignore.
            }
        });

        port.onDisconnect.addListener(() => {
            if (settled) return;

            if (cancelled) {
                finish({ error: "Request cancelled" });
                return;
            }

            if (chrome.runtime.lastError) {
                settled = true;
                reject(chrome.runtime.lastError);
                return;
            }

            finish({ error: "Rewrite request disconnected" });
        });

        port.postMessage({
            type: "REWRITE_STREAM_START",
            text,
            tone,
        });
    });

    return {
        promise,
        cancel: () => {
            if (settled) return;
            cancelled = true;
            try {
                port.disconnect();
            } catch {
                // Port may already be closed; safe to ignore.
            }
        },
    };
}

async function rewriteTextOnce(text: string, tone: ToneLevel): Promise<RewriteResponse> {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(
            {
                type: "REWRITE",
                text,
                tone,
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(response);
                }
            }
        );
    });
}
