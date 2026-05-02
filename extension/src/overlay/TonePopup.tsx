import type { ToneLevel } from "./Overlay";
import { theme } from "../constants/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
    x: number;
    y: number;
    tone: ToneLevel;
    loading: boolean;
    rewrittenText: string | null;
    canGoBack: boolean;
    canGoForward: boolean;
    draftCount: number;
    currentDraftIndex: number;
    authRequired: boolean;
    billingRequired: boolean;
    rateLimitedSecondsRemaining: number | null;
    errorMessage: string | null;

    onToneSelect: (tone: ToneLevel) => void;
    onRegenerate: () => void;
    onPreviousDraft: () => void;
    onNextDraft: () => void;
    onSelectDraft: (index: number) => void;
    onApply: () => void;
    onConnectAccount: () => void;
    onOpenBilling: () => void;
    onClose: () => void;
};

export default function TonePopup({
    x,
    y,
    tone,
    loading,
    rewrittenText,
    canGoBack,
    canGoForward,
    draftCount,
    currentDraftIndex,
    authRequired,
    billingRequired,
    rateLimitedSecondsRemaining,
    errorMessage,
    onToneSelect,
    onRegenerate,
    onPreviousDraft,
    onNextDraft,
    onSelectDraft,
    onApply,
    onConnectAccount,
    onOpenBilling,
    onClose,
}: Props) {
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
                    fontWeight: "bold", 
                    color: "#004225" ,
                    fontSize: 24,
                }}
            >
                Tone
                <button
                    onClick={onClose}
                    style={closeButtonStyle}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div style={buttonSectionStyle}>
                <p style={sectionLabelStyle}>Who are you writing to?</p>
                <div style={buttonRowStyle}>
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
            </div>
            <button
                onClick={onRegenerate}
                disabled={loading}
                style={secondaryButtonStyle}
            >
                Regenerate
            </button>
            <div style={draftNavigationStyle}>
                <button
                    onClick={onPreviousDraft}
                    disabled={!canGoBack || loading}
                    style={{
                        ...navButtonStyle,
                        opacity: !canGoBack || loading ? 0.45 : 1,
                        cursor: !canGoBack || loading ? "default" : "pointer",
                    }}
                >
                    Back
                </button>
                <button
                    onClick={onNextDraft}
                    disabled={!canGoForward || loading}
                    style={{
                        ...navButtonStyle,
                        opacity: !canGoForward || loading ? 0.45 : 1,
                        cursor: !canGoForward || loading ? "default" : "pointer",
                    }}
                >
                    Forward
                </button>
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
                {!loading && rewrittenText}
            </div>
            {draftCount > 1 && (
                <div style={dotRowStyle}>
                    {Array.from({ length: draftCount }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectDraft(index)}
                            disabled={loading || index === currentDraftIndex}
                            aria-label={`View draft ${index + 1}`}
                            style={{
                                ...dotButtonStyle,
                                background: index === currentDraftIndex ? theme.colors.primary : "#c9d3ce",
                                opacity: loading ? 0.6 : 1,
                                cursor: loading || index === currentDraftIndex ? "default" : "pointer",
                            }}
                        />
                    ))}
                </div>
            )}
            <button
                onClick={onApply}
                disabled={!rewrittenText || loading}
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

const secondaryButtonStyle = {
    marginTop: 12,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: `1px solid ${theme.colors.primary}`,
    background: "white",
    color: theme.colors.primary,
    cursor: "pointer",
} as const;

const draftNavigationStyle = {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
} as const;

const navButtonStyle = {
    flex: 1,
    padding: "7px 10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    color: "#2f2f2f",
    fontSize: 12,
} as const;

const dotRowStyle = {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    gap: 6,
} as const;

const dotButtonStyle = {
    width: 8,
    height: 8,
    padding: 0,
    borderRadius: "50%",
    border: "none",
} as const;

const buttonSectionStyle = {
    marginTop: 10,
} as const;

const sectionLabelStyle = {
    margin: 0,
    marginBottom: 4,
    fontSize: 11,
    fontWeight: 600,
    color: "#5f5f5f",
    lineHeight: 1.3,
} as const;

const buttonRowStyle = {
    display: "flex",
    gap: 8,
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
