import { useEffect, useRef, useState } from "react"
import { getActiveTextbox, getTextboxText, pasteText } from "../content/textbox";
import ToneButton from "./ToneButton";
import { rewriteText } from "../api/rewrite";
import TonePopup from "./TonePopup";
import { WEB_ORIGIN } from "../config/runtime";

export type ToneLevel = "casual" | "business" | "formal";

export default function Overlay() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [tone, setTone] = useState<ToneLevel>("business");
    const [rewrittenText, setRewrittenText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [showRefresh, setShowRefresh] = useState(false);
    const [authRequired, setAuthRequired] = useState(false);
    const [billingRequired, setBillingRequired] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const activeBoxRef = useRef<HTMLElement | null>(null);
    const inputTextRef = useRef("");
    const cachedTextRef = useRef("");
    const rewriteCacheRef = useRef<Map<string, string>>(new Map());
    const popupOpenRef = useRef(false); // ref to check state in useEffect that tracks typing - TODO: create useTextboxTracker hook to manage inputText, cachedText etc
    const rewriteRequestIdRef = useRef(0);

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
        popupOpenRef.current = popupOpen;
    }, [popupOpen])

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

    // Typing listener
    useEffect(() => {
        function handleTyping(e: Event) {
            requestAnimationFrame(() => {
                const box = activeBoxRef.current;
                if (!box) return;

                if (!box.contains(e.target as Node)) return;

                inputTextRef.current = getTextboxText(box);

                if (popupOpenRef.current && inputTextRef.current !== cachedTextRef.current) {
                    setShowRefresh(true);
                }
            });
        }

        document.addEventListener("beforeinput", handleTyping, true);
        document.addEventListener("input", handleTyping, true)

        return () => {
            document.removeEventListener("beforeinput", handleTyping, true);
            document.removeEventListener("input", handleTyping, true);

        }
    }, []);

    async function runRewrite(toneLevel: ToneLevel) {
        const text = inputTextRef.current.trim();
        if (!text) return;

        const cacheKey = getCacheKey(text, toneLevel);
        const cachedRewrite = rewriteCacheRef.current.get(cacheKey);
        if (cachedRewrite) {
            setRewrittenText(cachedRewrite);
            cachedTextRef.current = text;
            setShowRefresh(false);
            return;
        }

        const requestId = rewriteRequestIdRef.current + 1;
        rewriteRequestIdRef.current = requestId;

        setAuthRequired(false);
        setBillingRequired(false);
        setErrorMessage(null);
        setRewrittenText("");
        setLoading(true);
        try {
            const { rewrittenText, error } = await rewriteText(
                text,
                toneLevel,
                (chunk) => {
                    if (rewriteRequestIdRef.current !== requestId) return;
                    setRewrittenText((current) => `${current ?? ""}${chunk}`);
                },
            );
            if (error) {
                console.error("Rewrite failed:", error);
                if (rewriteRequestIdRef.current === requestId) {
                    setRewrittenText(null);
                    setErrorMessage(error);
                    if (isAuthError(error)) {
                        setAuthRequired(true);
                    } else if (isBillingError(error)) {
                        setBillingRequired(true);
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
            setShowRefresh(false);
        } finally {
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
            setShowRefresh(false);
            return;
        }
        
        if (rewrittenText && current === cachedTextRef.current) return;
        console.log("input: ", inputTextRef.current);
        console.log("cache: ", cachedTextRef.current);
        
        
        await runRewrite(tone);
    }
    
    function closePopup() {
        setPopupOpen(false);
        setShowRefresh(false);

        requestAnimationFrame(() => {
            activeBoxRef.current?.focus();
        })
    }

    function applyRewrite() {
        const box = activeBoxRef.current;
        if (!box || !rewrittenText || loading) return;

        pasteText(box, rewrittenText);
        setPopupOpen(false);
        setShowRefresh(false);
    }

    function handleConnectAccount() {
        window.open(`${WEB_ORIGIN}/connect-extension`, "_blank", "noopener,noreferrer");
    }

    function handleOpenBilling() {
        window.open(`${WEB_ORIGIN}/pricing`, "_blank", "noopener,noreferrer");
    }

    async function handleToneChange(newTone: ToneLevel) {
        setTone(newTone);
        if (showRefresh) {
            const cachedRewrite = rewriteCacheRef.current.get(
                getCacheKey(cachedTextRef.current, newTone),
            );
            if (cachedRewrite) {
                setRewrittenText(cachedRewrite);
            } else {
                setRewrittenText(null);
            }
            return;
        }
        await runRewrite(newTone);
    }

    async function handleRefresh() {
        await runRewrite(tone);
        setShowRefresh(false);
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
                    showRefresh={showRefresh}
                    authRequired={authRequired}
                    billingRequired={billingRequired}
                    errorMessage={errorMessage}
                    onToneSelect={handleToneChange}
                    onRefresh={handleRefresh}
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
