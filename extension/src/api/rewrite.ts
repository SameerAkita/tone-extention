import type { ToneLevel } from "../overlay/Overlay";

export async function rewriteText(text: string, tone: ToneLevel) {
    const res = await fetch("http://localhost:3000/api/rewrite", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            tone,
        }),
    });

    if (!res.ok) {
        throw new Error("Rewrite request failed");
    }

    const data = await res.json();
    console.log(data);
    return data.result;
}