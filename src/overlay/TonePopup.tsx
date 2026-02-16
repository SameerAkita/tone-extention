type Props = {
    x: number;
    y: number;
    tone: number;
    loading: boolean;
    rewrittenText: string | null;

    onToneChange: (v: number) => void;
    onApply: () => void;
    onClose: () => void;
};

export default function TonePopup({
    x,
    y,
    tone,
    loading,
    rewrittenText,
    onToneChange,
    onApply,
    onClose,
}: Props) {
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y - 240,
                width: 300,
                padding: 14,
                borderRadius: 14,
                background: "white",
                border: "1px solid #ddd",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                zIndex: 999999,
            }}
        >
            <div style={{ fontWeight: "bold" }}>Tone Rewrite</div>
            <div style={{ marginTop: 10 }}>
                Tone Level: <b>{tone}</b>
            </div>
            <input 
                style={{ width: "100%" }}
                type="range"
                min={0}
                max={10}
                value={tone}
                onChange={(e) => onToneChange(Number(e.target.value))}
            />
            <div
                style={{
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 10,
                    background: "#f7f7f7",
                    minHeight: 70,
                    fontSize: 13,
                }}
            >
                {loading && "Rewriting..."}
                {!loading && rewrittenText}
            </div>
            <button
                onClick={onApply}
                disabled={!rewrittenText}
                style={{
                    marginTop: 12,
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background: "black",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Apply
            </button>

            <button
                onClick={onClose}
                style={{
                    marginTop: 6,
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #ddd",
                    background: "white",
                    cursor: "pointer",
                }}
            >
                Close
            </button>
        </div>
    )
}

