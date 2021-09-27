import { EditorValue } from '../types';

export interface EditorCommand {
    (value: EditorValue): EditorValue;
}

export interface CommandTemplate {
    (value: string): string;
}
