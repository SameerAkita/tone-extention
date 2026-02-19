import type { ToneLevel } from "../overlay/Overlay";

export async function rewriteText(text: string, tone: ToneLevel) {
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