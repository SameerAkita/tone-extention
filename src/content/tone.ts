import { createToneButton, removeButton, getButtonRect } from "./button";
import { showPopup, removePopup } from "./mountPopup";
import {
  getSelectionText,
  getSelectionRect,
  isEditableSelection,
} from "./selection";

let popupOpen = false;

function updateToneButton() {
  if (popupOpen) return;

  const text = getSelectionText();

  if (!text) {
    removeButton();
    return;
  }

  if (!isEditableSelection()) {
    removeButton();
    return;
  }

  const rect = getSelectionRect();
  if (!rect) return;

  createToneButton(
    rect.right + window.scrollX,
    rect.bottom + window.scrollY,
    () => {
      console.log("Tone button clicked!");

      const buttonRect = getButtonRect();
      if (!buttonRect) return;

      removeButton();
      popupOpen = true;

      showPopup(
        buttonRect.left + window.scrollX,
        buttonRect.top + window.scrollY,
        "hello",
        () => {
            popupOpen = false;
            removePopup();
        }
      );
    }
  );
}

export function setupTone() {
  document.addEventListener("selectionchange", () => {

    const text = getSelectionText();

    if (!text) {
      removeButton();
      removePopup();
      popupOpen = false;
      return;
    }

    if (popupOpen) {
        removePopup();
        popupOpen = false;
    }

    if (!popupOpen) {
      updateToneButton();
    }
  });

  // reset on resize
  window.addEventListener("resize", () => {
    removeButton();
    removePopup();
    popupOpen = false;
  });
}
