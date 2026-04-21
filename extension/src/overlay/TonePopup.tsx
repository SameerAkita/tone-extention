import { useState } from "react";
import type { RegenerateOption, ToneLevel } from "./Overlay";
import { theme } from "../constants/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons/faArrowsRotate";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
    x: number;
    y: number;
    tone: ToneLevel;
    regenerateOption: RegenerateOption | null;
    loading: boolean;
    rewrittenText: string | null;
    showRefresh: boolean;
    authRequired: boolean;
    billingRequired: boolean;
    rateLimitedSecondsRemaining: number | null;
    errorMessage: string | null;

    onToneSelect: (tone: ToneLevel) => void;
    onRefresh: () => void;
    onApply: () => void;
    onConnectAccount: () => void;
    onOpenBilling: () => void;
    onClose: () => void;
};

export default function TonePopup({
    x,
    y,
    tone,
    regenerateOption,
    loading,
    rewrittenText,
    showRefresh,
    authRequired,
    billingRequired,
    rateLimitedSecondsRemaining,
    errorMessage,
    onToneSelect,
    onRefresh,
    onApply,
    onConnectAccount,
    onOpenBilling,
    onClose,
}: Props) {
    const [hover, setHover] = useState(false);

    if (authRequired) {
        return (
            <div
                data-tone-popup="true"
                style={popupStyle(x, y)}
            >
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 14,
                        paddingTop: 8,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 18,
                            background: theme.colors.primary,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            fontWeight: 700,
                            boxShadow: "0 10px 20px rgba(0,66,37,0.18)",
                        }}
                    >
                        T
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: theme.colors.primary,
                            lineHeight: 1,
                        }}
                    >
                        Tone
                    </div>
                    <div
                        style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            background: "#f7f7f7",
                            color: "#2f2f2f",
                            fontSize: 13,
                            lineHeight: 1.5,
                        }}
                    >
                        {errorMessage
                            ?? "Sign in required to rewrite text. Connect your account to keep using Tone."}
                    </div>
                    <button
                        onClick={onConnectAccount}
                        style={primaryButtonStyle}
                    >
                        Connect Account
                    </button>
                </div>
            </div>
        );
    }

    if (billingRequired) {
        return (
            <div
                data-tone-popup="true"
                style={popupStyle(x, y)}
            >
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 14,
                        paddingTop: 8,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 18,
                            background: theme.colors.primary,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            fontWeight: 700,
                            boxShadow: "0 10px 20px rgba(0,66,37,0.18)",
                        }}
                    >
                        T
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: theme.colors.primary,
                            lineHeight: 1,
                        }}
                    >
                        Tone
                    </div>
                    <div
                        style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            background: "#f7f7f7",
                            color: "#2f2f2f",
                            fontSize: 13,
                            lineHeight: 1.5,
                        }}
                    >
                        {errorMessage
                            ?? "A paid subscription or trial is required to rewrite text. Open pricing to subscribe or manage billing."}
                    </div>
                    <button
                        onClick={onOpenBilling}
                        style={primaryButtonStyle}
                    >
                        View Plans
                    </button>
                </div>
            </div>
        );
    }

    if (rateLimitedSecondsRemaining !== null) {
        return (
            <div
                data-tone-popup="true"
                style={popupStyle(x, y)}
            >
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 14,
                        paddingTop: 8,
                    }}
                >
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 18,
                            background: theme.colors.primary,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 24,
                            fontWeight: 700,
                            boxShadow: "0 10px 20px rgba(0,66,37,0.18)",
                        }}
                    >
                        T
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: theme.colors.primary,
                            lineHeight: 1,
                        }}
                    >
                        Tone
                    </div>
                    <div
                        style={{
                            padding: "12px 14px",
                            borderRadius: 12,
                            background: "#f7f7f7",
                            color: "#2f2f2f",
                            fontSize: 13,
                            lineHeight: 1.5,
                        }}
                    >
                        Too many rewrites in a short time. Try again in {rateLimitedSecondsRemaining}s.
                    </div>
                    <button
                        disabled
                        style={{
                            ...primaryButtonStyle,
                            cursor: "not-allowed",
                            opacity: 0.75,
                        }}
                    >
                        Try again in {rateLimitedSecondsRemaining}s
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            data-tone-popup="true"
            style={popupStyle(x, y)}
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
                    style={closeButtonStyle}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <ToneLevelButton
                    label="Coworker"
                    active={tone==="casual"}
                    onClick={() => onToneSelect("casual")}
                />
                <ToneLevelButton
                    label="Boss"
                    active={tone==="business"}
                    onClick={() => onToneSelect("business")}
                />
                <ToneLevelButton
                    label="Client"
                    active={tone==="formal"}
                    onClick={() => onToneSelect("formal")}
                />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <RegenerateOptionButton
                    label="More Polite"
                    active={regenerateOption=="polite"}
                    onClick={() => {}}
                />
                <RegenerateOptionButton
                    label="Softer"
                    active={regenerateOption=="soft"}
                    onClick={() => {}}
                />
                <RegenerateOptionButton
                    label="Shorter"
                    active={regenerateOption=="short"}
                    onClick={() => {}}
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
                {loading && rewrittenText && rewrittenText}
                {loading && !rewrittenText && "Rewriting..."}
                {!loading && showRefresh && (
                    rewrittenText
                        ? rewrittenText
                        : "Input changed and no saved rewrite exists for this tone. Click refresh to rewrite current input."
                )}
                {!loading && !showRefresh && rewrittenText}
            </div>
            <button
                onClick={onApply}
                disabled={!rewrittenText || showRefresh || loading}
                style={primaryButtonStyle}
            >
                Apply
            </button>
        </div>
    )
}

function popupStyle(x: number, y: number) {
    return {
        position: "absolute" as const,
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
    };
}

const closeButtonStyle = {
    marginLeft: "auto",
    border: "none",
    background: "#fff",
    color: "black",
    cursor: "pointer",
} as const;

const primaryButtonStyle = {
    marginTop: 12,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    background: theme.colors.primary,
    color: "white",
    cursor: "pointer",
} as const;

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

function RegenerateOptionButton({
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
                border: active ? `1px solid ${theme.colors.primary}` : "1px solid #ddd",
                // background: active ? theme.colors.primary : "#fff",
                color: active ? theme.colors.primary : "black",
                cursor: "pointer",
                fontSize: 11,
            }}
        >
            {label}
        </button>
    );
}
