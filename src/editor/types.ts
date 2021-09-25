export interface SelectionRange {
    start: number;
    end: number;
}

export interface EditorValue {
    value: string;
    selection: SelectionRange;
}
