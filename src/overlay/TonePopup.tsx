import { useState } from "react";
import { rewriteText } from "../api/rewrite";
import { removePopup } from "../content/mountPopup";
import { replaceText } from "../content/replace";

export default function TonePopup({
    selectedText,
    field,
}: {
    selectedText: string;
    field: HTMLElement;
}) {
    const [tone, setTone] = useState(50);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");

    async function handleRewrite() {
        setLoading(true);

        const rewritten = await rewriteText(selectedText, tone);

        setResult(rewritten);
        setLoading(false);
    }

    function handleApply() {
        if (!result) return;

        replaceText(field, result);
        removePopup();
    }

    return (
        <div
            style={{
                width: 200,
                padding: 12,
                background: "white",
                borderRadius: 12,
                border: "1px solid #ddd",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: 14,
            }}
        >
            <div style={{ marginBottom: 8 }}>
                <strong>Tone Rewrite</strong>
            </div>

            <input 
                type="range"
                min={0}
                max={100}
                value={tone}
                onChange={(e) => setTone(Number(e.target.value))}
            />

            <button
                onClick={handleRewrite}
                style={{ marginTop: 10 }}
            >
                {loading ? "Rewriting..." : "Rewrite"}
            </button>

            {result && (
                <>
                    <p style={{ marginTop: 10 }}>{result}</p>
                    <button onClick={handleApply}>Apply</button>
                </>
            )}
        </div>
    )
}