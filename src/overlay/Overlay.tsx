import { useEffect, useState } from "react"
import { getActiveTextbox, getTextboxText, setTextboxText } from "../content/textbox";
import ToneButton from "./ToneButton";
import { rewriteText } from "../api/rewrite";
import TonePopup from "./TonePopup";

export type ToneLevel = "casual" | "business" | "formal";

export default function Overlay() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [activeBox, setActiveBox] = useState<HTMLElement | null>(null);

    const [tone, setTone] = useState<ToneLevel>("business");

    const [inputText, setInputText] = useState("");
    const [cachedText, setCachedText] = useState("");
    const [rewrittenText, setRewrittenText] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        function handleFocus(e: Event) {
            const target = e.target as HTMLElement;

            if (target.closest("[data-tone-popup]")) return;

            const box = getActiveTextbox();

            if (!box) {
                setPopupOpen(false);
                setActiveBox(null);
                setButtonPos(null);
                return;
            }

            const rect = box.getBoundingClientRect();

            setActiveBox(box);
            setButtonPos({
                x: rect.right + window.scrollX - 50,
                y: rect.bottom + window.scrollY - 35,
            });

            const text = getTextboxText(box);
            setInputText(text);

            if (text !== cachedText) {
                setRewrittenText(null);
            }
        }

        document.addEventListener("focusin", handleFocus);

        return () => {
            document.removeEventListener("focusin", handleFocus);
        };
    }, [cachedText])

    async function handleRewrite(text: string, toneLevel: ToneLevel) {
        setLoading(true);
        await rewriteText(text, toneLevel).then((result) => {
            setRewrittenText(result);
            setCachedText(inputText);
        });
        setLoading(false);

        return `[${toneLevel.toUpperCase}] ${text}`;
    }

    useEffect(() => {
        if (!popupOpen || !activeBox) return;

        if (rewrittenText && inputText == cachedText) {
            return; //cache hit
        }

        handleRewrite(inputText, tone);
    }, [popupOpen]);

    async function handleToneChange(newTone: ToneLevel) {
        setTone(newTone);

        if (!inputText) return;

        handleRewrite(inputText, newTone);
    }

    function applyRewrite() {
        if (!activeBox || !rewrittenText) return;

        setTextboxText(activeBox, rewrittenText);
        setPopupOpen(false);
    }

    return (
        <>
            {buttonPos && (
                <ToneButton 
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onClick={() => setPopupOpen(!popupOpen)}
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
                    onClose={() => setPopupOpen(false)}
                />
            )}
        </>
    )
}