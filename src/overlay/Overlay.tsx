import { useEffect, useState } from "react"
import { getActiveTextbox, getTextboxRect } from "../content/textbox";
import ToneButton from "./ToneButton";

export default function Overlay() {
    const [popupOpen, setPopupOpen] = useState(false);
    const [activeBox, setActiveBox] = useState<HTMLElement | null>(null);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        function handleFocus() {
            const box = getActiveTextbox();

            if (!box) {
                setPopupOpen(false);
                setActiveBox(null);
                setButtonPos(null);
                return;
            }

            const rect = getTextboxRect(box);

            setActiveBox(box);
            setButtonPos({
                x: rect.right + window.scrollX - 50,
                y: rect.bottom + window.scrollY - 35,
            });
        }

        document.addEventListener("focusin", handleFocus);
        document.addEventListener("click", handleFocus);

        return () => {
            document.removeEventListener("focusin", handleFocus);
            document.removeEventListener("click", handleFocus);
        };
    }, [])

    return (
        <>
            {buttonPos && (
                <ToneButton 
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onClick={() => setPopupOpen(!popupOpen)}
                />
            )}

            {popupOpen && (
                <div>
                    popup
                </div>
            )}
        </>
    )
}