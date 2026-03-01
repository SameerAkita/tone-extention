import type { ToneLevel } from "../../../../../extension/src/overlay/Overlay"

export interface RewriteResponse {
    rewrittenText?: string;
    error?: string;
}

export async function rewriteText(text: string, tone: ToneLevel): Promise<RewriteResponse> {
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