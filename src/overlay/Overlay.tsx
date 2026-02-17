import { useEffect, useRef, useState } from "react"
import { getActiveTextbox, getTextboxText, pasteText } from "../content/textbox";
import ToneButton from "./ToneButton";
import { rewriteText } from "../api/rewrite";
import TonePopup from "./TonePopup";

export type ToneLevel = "casual" | "business" | "formal";

export default function Overlay() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [tone, setTone] = useState<ToneLevel>("business");
    const [rewrittenText, setRewrittenText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);

    const activeBoxRef = useRef<HTMLElement | null>(null);
    const inputTextRef = useRef("");
    const cachedTextRef = useRef("");

    // helper
    function updateButtonPosition(box: HTMLElement) {
        const rect = box.getBoundingClientRect();

        setButtonPos({
            x: rect.right + window.scrollX - 50,
            y: rect.bottom + window.scrollY - 35,
        })
    }

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

        setLoading(true);

        const result = await rewriteText(text, toneLevel);
        setRewrittenText(result);

        cachedTextRef.current = text;

        setLoading(false);
    }

    async function openPopup() {
        setPopupOpen(true);

        const current = inputTextRef.current.trim();

        if (rewrittenText && current === cachedTextRef.current) return;

        await runRewrite(tone);
    }

    function applyRewrite() {
        const box = activeBoxRef.current;
        if (!box || !rewrittenText) return;

        // setTextboxText(box, rewrittenText);
        pasteText(box, rewrittenText);
        setPopupOpen(false);
        //setShowRefresh(false);
    }

    async function handleToneChange(newTone: ToneLevel) {
        setTone(newTone);
        await runRewrite(newTone);
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
                    onToneSelect={handleToneChange}
                    onApply={applyRewrite}
                    onClose={() => setPopupOpen(false)} //setshowrefresh(false)
                />
            )}
        </>
    )
}