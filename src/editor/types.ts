import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Elements
import { ParagraphElement } from './elements/markdown/paragraph';
import { Heading1Element } from './elements/markdown/heading1';
import { BoldElement } from './elements/markdown/bold';

// Editor
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface EditorInterface {}

export type OriginalEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CombineEditor = EditorInterface & OriginalEditor;

// Slate module
export type Element = ParagraphElement | Heading1Element | BoldElement;
export type InlineDescendant = BoldElement | Text;
export type Text = { text: string };

declare module 'slate' {
    interface CustomTypes {
        Editor: CombineEditor;
        Element: Element;
        Text: Text;
    }
}
