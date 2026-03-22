import type { ToneLevel } from "../overlay/Overlay";

export interface RewriteResponse {
    rewrittenText?: string;
    error?: string;
}

type RewriteStreamEvent =
    | { type: "chunk"; chunk: string }
    | { type: "done"; rewrittenText: string }
    | { type: "error"; error: string };

export async function rewriteText(
    text: string,
    tone: ToneLevel,
    onChunk?: (chunk: string) => void,
): Promise<RewriteResponse> {
    if (!onChunk) {
        return rewriteTextOnce(text, tone);
    }

    return new Promise((resolve, reject) => {
        const port = chrome.runtime.connect({ name: "rewrite-stream" });

        port.onMessage.addListener((message: RewriteStreamEvent) => {
            if (message.type === "chunk") {
                onChunk(message.chunk);
                return;
            }

            if (message.type === "done") {
                port.disconnect();
                resolve({ rewrittenText: message.rewrittenText });
                return;
            }

            port.disconnect();
            resolve({ error: message.error });
        });

        port.onDisconnect.addListener(() => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            }
        });

        port.postMessage({
            type: "REWRITE_STREAM_START",
            text,
            tone,
        });
    });
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
