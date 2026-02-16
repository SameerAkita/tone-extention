type Props = {
    x: number;
    y: number;
    onClick: () => void;
}

export default function ToneButton({ x, y, onClick }: Props) {
    return (
        <button
            style={{
                position: "absolute",
                left: x,
                top: y,
                zIndex: 999999,
                padding: "6px 10px",
                borderRadius: "8px",
                background: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
        >
            Tone
        </button>
    );
}