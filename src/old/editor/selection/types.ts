export interface HTMLElementWithSelection extends HTMLElement {
    setSelectionRange: (start: number, end: number) => void;
}

export interface EditorSelectionRange {
    start: number;
    end: number;
}
