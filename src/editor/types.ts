import type { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

// Elements
import { ParagraphElement } from './elements/markdown/paragraph';
import { Heading1Element } from './elements/markdown/heading1';
import { Heading2Element } from './elements/markdown/heading2';
import { BoldElement } from './elements/markdown/bold';
import { IndicatorElement } from './elements/misc/indicator';
import { Heading3Element } from './elements/markdown/heading3';
import { Heading4Element } from './elements/markdown/heading4';
import { Heading5Element } from './elements/markdown/heading5';
import { Heading6Element } from './elements/markdown/heading6';
import { InlineCodeElement } from './elements/markdown/inline-code';

// Editor
export type OriginalEditor = BaseEditor & ReactEditor & HistoryEditor;
export type CombineEditor = OriginalEditor;

// Slate module
export type Element =
    | ParagraphElement
    | Heading1Element
    | Heading2Element
    | Heading3Element
    | Heading4Element
    | Heading5Element
    | Heading6Element
    | BoldElement
    | InlineCodeElement
    | IndicatorElement;
export type InlineDescendant = BoldElement | InlineCodeElement | IndicatorElement | Text;
export type Text = { text: string };

declare module 'slate' {
    interface CustomTypes {
        Editor: CombineEditor;
        Element: Element;
        Text: Text;
    }
}
