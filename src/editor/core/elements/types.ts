import type { BaseElement as SlateElement } from 'slate';
import { InlineDescendant } from '../../types';

export interface BaseElement extends SlateElement {
    type: string;
    children: InlineDescendant[];
    id?: string;
}

export interface RenderElementProps<T extends BaseElement = BaseElement> {
    children: T['children'];
    element: T;
    attributes: {
        'data-slate-node': 'element';
        'data-slate-inline'?: true;
        'data-slate-void'?: true;
        dir?: 'rtl';
        ref: any;
    };
}
