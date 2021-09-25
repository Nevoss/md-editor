export interface EditorKeyboardEvent {
    ctrlKey: boolean;
    code: string;
}

interface HandlerResult {
    cursorLocation: number;
    value: string;
}

interface HandlerOptions {
    selectionStart: number;
    selectionEnd: number;
}

export interface Action {
    id: string;
    label: string;
    handler: (value: string, options: HandlerOptions) => HandlerResult;
    onKeyDown?: (event: EditorKeyboardEvent) => boolean;
}
