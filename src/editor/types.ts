export interface EditorSelectionRange {
    start: number;
    end: number;
}

export interface EditorValue {
    value: string;
    selection: EditorSelectionRange;
}

export interface EditorKeyboardEvent {
    ctrlKey: boolean;
    shiftKey: boolean;
    code: string;
}
