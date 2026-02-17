import type { ToneLevel } from "../overlay/Overlay";

export async function rewriteText(text: string, tone: ToneLevel) {
    await new Promise((r) => setTimeout(r, 500));

    return `${text} - business rewrite in ${tone} Tone level`
}