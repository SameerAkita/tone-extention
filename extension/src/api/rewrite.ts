import type { ToneLevel } from "../overlay/Overlay";

export async function rewriteText(text: string, tone: ToneLevel) {
    return await chrome.runtime.sendMessage({
        type: "REWRITE",
        text,
        tone,
    });
}