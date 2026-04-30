import { useEffect, useRef, useState } from "react"
import { getActiveTextbox, getTextboxText, pasteText } from "../content/textbox";
import ToneButton from "./ToneButton";
import { startRewriteTextStream } from "../api/rewrite";
import TonePopup from "./TonePopup";
import { WEB_ORIGIN } from "../config/runtime";

export type ToneLevel = "casual" | "business" | "formal";

export default function Overlay() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [tone, setTone] = useState<ToneLevel>("business");
    const [rewrittenText, setRewrittenText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [authRequired, setAuthRequired] = useState(false);
    const [billingRequired, setBillingRequired] = useState(false);
    const [rateLimitUntilMs, setRateLimitUntilMs] = useState<number | null>(null);
    const [countdownNowMs, setCountdownNowMs] = useState(() => Date.now());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const activeBoxRef = useRef<HTMLElement | null>(null);
    const inputTextRef = useRef("");
    const cachedTextRef = useRef("");
    const rewriteCacheRef = useRef<Map<string, string>>(new Map());
    const rewriteRequestIdRef = useRef(0);
    const cancelRewriteRef = useRef<(() => void) | null>(null);

    function getCacheKey(text: string, toneLevel: ToneLevel) {
        return `${toneLevel}::${text}`;
    }

    // helper
    function updateButtonPosition(box: HTMLElement) {
        const rect = box.getBoundingClientRect();

        setButtonPos({
            x: rect.right + window.scrollX - 50,
            y: rect.bottom + window.scrollY - 35,
        })
    }

    useEffect(() => {
        if (!rateLimitUntilMs) return;

        if (rateLimitUntilMs <= Date.now()) {
            setRateLimitUntilMs(null);
            return;
        }

        const intervalId = window.setInterval(() => {
            setCountdownNowMs(Date.now());
        }, 250);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [rateLimitUntilMs]);

    useEffect(() => {
        if (!rateLimitUntilMs) return;
        if (countdownNowMs >= rateLimitUntilMs) {
            setRateLimitUntilMs(null);
        }
    }, [countdownNowMs, rateLimitUntilMs]);

    // detect textbox focus
    useEffect(() => {
        function handleFocus(e: Event) {
            const target = e.target as HTMLElement;

            // ignore clicks inside popup
            if (target.closest("[data-tone-popup]")) return;

            const box = getActiveTextbox();

            if (!box) {
                activeBoxRef.current = null;
                setPopupOpen(false);
                setButtonPos(null);
                return;
            }

            activeBoxRef.current = box;

            const text = getTextboxText(box);
            inputTextRef.current = text;

            updateButtonPosition(box);
        }

        document.addEventListener("focusin", handleFocus);

        return () => {
            document.removeEventListener("focusin", handleFocus);
        };
    }, []);

    useEffect(() => {
        function handleTyping(e: Event) {
            requestAnimationFrame(() => {
                const box = activeBoxRef.current;
                if (!box) return;

                if (!box.contains(e.target as Node)) return;

                inputTextRef.current = getTextboxText(box);
            });
        }

        document.addEventListener("beforeinput", handleTyping, true);
        document.addEventListener("input", handleTyping, true);

        return () => {
            document.removeEventListener("beforeinput", handleTyping, true);
            document.removeEventListener("input", handleTyping, true);
        };
    }, []);

    async function runRewrite(toneLevel: ToneLevel) {
        if (rateLimitUntilMs && rateLimitUntilMs > Date.now()) {
            return;
        }

        const text = inputTextRef.current.trim();
        if (!text) return;

        const cacheKey = getCacheKey(text, toneLevel);
        const cachedRewrite = rewriteCacheRef.current.get(cacheKey);
        if (cachedRewrite) {
            setRewrittenText(cachedRewrite);
            cachedTextRef.current = text;
            return;
        }

        const requestId = rewriteRequestIdRef.current + 1;
        rewriteRequestIdRef.current = requestId;
        cancelRewriteRef.current?.();

        setAuthRequired(false);
        setBillingRequired(false);
        setRateLimitUntilMs(null);
        setErrorMessage(null);
        setRewrittenText("");
        setLoading(true);
        try {
            const stream = startRewriteTextStream(
                text,
                toneLevel,
                (chunk) => {
                    if (rewriteRequestIdRef.current !== requestId) return;
                    setRewrittenText((current) => `${current ?? ""}${chunk}`);
                },
            );
            cancelRewriteRef.current = stream.cancel;

            const { rewrittenText, error, retryAfterSeconds } = await stream.promise;
            if (error) {
                if (error === "Request cancelled") {
                    return;
                }
                console.error("Rewrite failed:", error);
                if (rewriteRequestIdRef.current === requestId) {
                    setRewrittenText(null);
                    setErrorMessage(error);
                    if (isAuthError(error)) {
                        setAuthRequired(true);
                    } else if (isBillingError(error)) {
                        setBillingRequired(true);
                    } else if (isRateLimitError(error)) {
                        const cooldownSeconds = Math.max(1, retryAfterSeconds ?? 1);
                        setRateLimitUntilMs(Date.now() + cooldownSeconds * 1000);
                    }
                }
                return;
            }

            if (!rewrittenText) {
                console.error("Rewrite failed: missing rewrittenText in response");
                if (rewriteRequestIdRef.current === requestId) {
                    setRewrittenText(null);
                }
                return;
            }

            if (rewriteRequestIdRef.current !== requestId) {
                return;
            }

            setRewrittenText(rewrittenText);
            rewriteCacheRef.current.set(cacheKey, rewrittenText);
            cachedTextRef.current = text;
        } finally {
            if (rewriteRequestIdRef.current === requestId) {
                cancelRewriteRef.current = null;
            }
            if (rewriteRequestIdRef.current === requestId) {
                setLoading(false);
            }
        }
    }

    async function openPopup() {
        setPopupOpen(true);
        
        const current = inputTextRef.current.trim();
        const cachedRewrite = rewriteCacheRef.current.get(getCacheKey(current, tone));
        if (cachedRewrite) {
            setRewrittenText(cachedRewrite);
            cachedTextRef.current = current;
            return;
        }
        
        if (rewrittenText && current === cachedTextRef.current) return;
        await runRewrite(tone);
    }
    
    function closePopup() {
        cancelRewriteRef.current?.();
        setPopupOpen(false);

        requestAnimationFrame(() => {
            activeBoxRef.current?.focus();
        })
    }

    function applyRewrite() {
        const box = activeBoxRef.current;
        if (!box || !rewrittenText || loading) return;

        pasteText(box, rewrittenText);
        setPopupOpen(false);
    }

    function handleConnectAccount() {
        window.open(`${WEB_ORIGIN}/connect-extension`, "_blank", "noopener,noreferrer");
    }

    function handleOpenBilling() {
        window.open(`${WEB_ORIGIN}/pricing`, "_blank", "noopener,noreferrer");
    }

    async function handleToneChange(newTone: ToneLevel) {
        setTone(newTone);
        await runRewrite(newTone);
    }

    async function handleRegenerate() {
        await runRewrite(tone);
    }

    return (
        <>
            {buttonPos && (
                <ToneButton 
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onClick={openPopup}
                />
            )}

            {popupOpen && buttonPos &&(
                <TonePopup 
                    x={buttonPos.x}
                    y={buttonPos.y}
                    tone={tone}
                    loading={loading}
                    rewrittenText={rewrittenText}
                    authRequired={authRequired}
                    billingRequired={billingRequired}
                    rateLimitedSecondsRemaining={getRateLimitedSecondsRemaining(
                        rateLimitUntilMs,
                        countdownNowMs,
                    )}
                    errorMessage={errorMessage}
                    onToneSelect={handleToneChange}
                    onRegenerate={handleRegenerate}
                    onApply={applyRewrite}
                    onConnectAccount={handleConnectAccount}
                    onOpenBilling={handleOpenBilling}
                    onClose={closePopup}
                />
            )}
        </>
    )
}

function isAuthError(error: string) {
    const normalized = error.toLowerCase();
    return normalized.includes("not signed in")
        || normalized.includes("connect your account")
        || normalized.includes("unauthorized");
}

function isBillingError(error: string) {
    const normalized = error.toLowerCase();
    return normalized.includes("active subscription or trial is required")
        || normalized.includes("subscription required")
        || normalized.includes("trial is required");
}

function isRateLimitError(error: string) {
    return error.toLowerCase().includes("rate limit exceeded");
}

function getRateLimitedSecondsRemaining(
    rateLimitUntilMs: number | null,
    nowMs: number,
) {
    if (!rateLimitUntilMs) {
        return null;
    }

    return Math.max(1, Math.ceil((rateLimitUntilMs - nowMs) / 1000));
}
