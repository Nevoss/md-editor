import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Elements
import { ParagraphElement } from './elements/markdown/paragraph';
import { Heading1Element } from './elements/markdown/heading1';
import { BoldElement } from './elements/markdown/bold';
import { IndicatorElement } from './elements/misc/indicator';

// Editor
export type OriginalEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CombineEditor = OriginalEditor;

// Slate module
export type Element = ParagraphElement | Heading1Element | BoldElement | IndicatorElement;
export type InlineDescendant = BoldElement | IndicatorElement | Text;
export type Text = { text: string };

declare module 'slate' {
    interface CustomTypes {
        Editor: CombineEditor;
        Element: Element;
        Text: Text;
    }
}
