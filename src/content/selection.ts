export function getSelectionText(): string {
    return window.getSelection()?.toString().trim() ?? "";
  }
  
  export function getSelectionRect(): DOMRect | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
  
    return selection.getRangeAt(0).getBoundingClientRect();
  }
  
  export function isEditableSelection(): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;
  
    const range = selection.getRangeAt(0);
    const container = range.startContainer;
  
    const element =
      container.nodeType === Node.TEXT_NODE
        ? container.parentElement
        : (container as HTMLElement);
  
    if (!element) return false;
  
    const editableParent = element.closest(
      "textarea, input, [contenteditable='true']"
    );
  
    return editableParent !== null;
  }
  