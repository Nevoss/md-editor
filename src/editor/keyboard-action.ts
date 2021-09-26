import { EditorKeyboardEvent, EditorValue } from './types';

interface ApplyFunction {
    (value: EditorValue): Promise<EditorValue | void>;
}

export class KeyboardAction {
    public apply: ApplyFunction;
    protected pattern: EditorKeyboardEvent;

    constructor(apply: ApplyFunction, pattern: Partial<EditorKeyboardEvent>) {
        this.apply = apply;
        this.pattern = {
            ctrlKey: false,
            shiftKey: false,
            code: null,
            ...pattern,
        };
    }

    static create({
        apply,
        pattern,
    }: {
        apply: ApplyFunction;
        pattern: Partial<EditorKeyboardEvent>;
    }) {
        return new KeyboardAction(apply, pattern);
    }

    shouldApply(event: EditorKeyboardEvent) {
        return Object.entries(this.pattern).every(
            ([key, val]: [keyof EditorKeyboardEvent, boolean | string]) =>
                event[key] === val
        );
    }
}
