import { useState } from "react";
import type { ToneLevel } from "./Overlay";
import { theme } from "../constants/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
    x: number;
    y: number;
    tone: ToneLevel;
    loading: boolean;
    rewrittenText: string | null;
    showRefresh: boolean;

    onToneSelect: (tone: ToneLevel) => void;
    onRefresh: () => void;
    onApply: () => void;
    onClose: () => void;
};

export default function TonePopup({
    x,
    y,
    tone,
    loading,
    rewrittenText,
    showRefresh,
    onToneSelect,
    onRefresh,
    onApply,
    onClose,
}: Props) {
    const [hover, setHover] = useState(false);

    return (
        <div
            data-tone-popup="true"
            style={{
                position: "absolute",
                left: x - 300,
                top: y,
                transform: "translateY(-100%)",
                width: 300,
                padding: 14,
                borderRadius: 14,
                background: "white",
                border: "1px solid #ddd",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                zIndex: 999999,
            }}
        >
            <div 
                style={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontWeight: "bold", 
                    color: "#004225" ,
                    fontSize: 24,
                }}
            >
                Tone
                <div
                    style={{
                        position: "relative",
                        display: "inline-block"
                    }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <button
                        onClick={onRefresh}
                        disabled={!showRefresh}
                        style={{
                        padding: "6px 8px",
                        borderRadius: 10,
                        border: "none",
                        background: "#fff",
                        color: showRefresh ? "black" : "#ddd",
                        cursor: showRefresh ? "pointer" : "",
                        fontSize: 13,
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowsRotate} />
                    </button>
                    {hover && (<div
                        style={{
                            position: "absolute",
                            bottom: "130%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "black",
                            color: "white",
                            padding: "6px 8px",
                            borderRadius: 8,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                            zIndex: 999999,
                        }}
                        className="tooltip"
                    >
                        {showRefresh ? "Input changed - click to update rewrite" : "Type something new to enable rewrite"}
                    </div>)}
                </div>
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: "auto",
                        border: "none",
                        background: "#fff",
                        color: "black",
                        cursor: "pointer",
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <ToneLevelButton
                    label="Casual"
                    active={tone==="casual"}
                    onClick={() => onToneSelect("casual")}
                />
                <ToneLevelButton
                    label="Business"
                    active={tone==="business"}
                    onClick={() => onToneSelect("business")}
                />
                <ToneLevelButton
                    label="Formal"
                    active={tone==="formal"}
                    onClick={() => onToneSelect("formal")}
                />
            </div>
            <div
                style={{
                    marginTop: 12,
                    padding: 10,
                    borderRadius: 10,
                    background: "#f7f7f7",
                    fontSize: 13,
                    minHeight: 80,
                    maxHeight: 200,
                    overflowY: "auto",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                }}
            >
                {loading && "Rewriting..."}
                {!loading && showRefresh && (
                    rewrittenText
                        ? rewrittenText
                        : "Input changed and no saved rewrite exists for this tone. Click refresh to rewrite current input."
                )}
                {!loading && !showRefresh && rewrittenText}
            </div>
            <button
                onClick={onApply}
                disabled={!rewrittenText || showRefresh}
                style={{
                    marginTop: 12,
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "none",
                    background: theme.colors.primary,
                    color: "white",
                    cursor: "pointer",
                }}
            >
                Apply
            </button>
        </div>
    )
}

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
                border: active ? `2px solid ${theme.colors.primary}` : "1px solid #ddd",
                background: active ? theme.colors.primary : "#fff",
                color: active ? "white" : "black",
                cursor: "pointer",
                fontSize: 13,
            }}
        >
            {label}
        </button>
    );
}
