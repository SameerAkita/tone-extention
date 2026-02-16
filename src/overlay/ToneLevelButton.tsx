function ToneLevelButton({
    label,
    active,
    onClick,
}: {
    label: string,
    active: boolean,
    onClick: () => void,
}) {
    return (
        <button
            onClick={onClick}
            style={{
                flex: 1,
                padding: "6px 8px",
                borderRadius: 10,
                border: active ? "2px solid black" : "1px solid #ddd",
                background: active ? "#000" : "#fff",
                color: active ? "white" : "black",
                cursor: "pointer",
                fontSize: 13,
            }}
        >
            {label}
        </button>
    );
}