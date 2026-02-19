import { theme } from "../constants/colors";

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
                padding: "5px 10px",
                borderRadius: "25px",
                background: theme.colors.primary,
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
        >
            T
        </button>
    );
}