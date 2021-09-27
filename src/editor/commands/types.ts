import { EditorValue } from '../types';

export interface EditorCommand {
    (value: EditorValue): EditorValue | void;
}

export interface CommandTemplate {
    (value: string): string;
}
