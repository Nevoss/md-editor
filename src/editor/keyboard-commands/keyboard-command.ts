import { Editor } from 'slate';

interface ApplyFunction {
    (editor: Editor): void;
}

interface KeyboardPattern {
    ctrlKey: boolean;
    shiftKey: boolean;
    key: string | null;
}

export default class KeyboardCommand {
    public apply: ApplyFunction;
    protected pattern: KeyboardPattern;

    constructor(apply: ApplyFunction, pattern: Partial<KeyboardPattern>) {
        this.apply = apply;
        this.pattern = {
            ctrlKey: false,
            shiftKey: false,
            key: null,
            ...pattern,
        };
    }

    static create({ apply, pattern }: { apply: ApplyFunction; pattern: Partial<KeyboardPattern> }) {
        return new KeyboardCommand(apply, pattern);
    }

    shouldApply(event: KeyboardPattern) {
        return Object.entries(this.pattern).every(
            ([key, val]: [keyof KeyboardPattern, boolean | string]) => event[key] === val
        );
    }
}
