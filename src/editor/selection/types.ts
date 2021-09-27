export interface HTMLElementWithSelection extends HTMLElement {
    setSelectionRange: (start: number, end: number) => void;
}
