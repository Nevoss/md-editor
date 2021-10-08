import type { BaseElement as SlateElement } from 'slate';
import { InlineDescendant } from '../types';
import { Element } from 'slate';
import ElementWrapper from './element-wrapper';

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

export interface ElementWrapperOptions<T extends Element> {
    type: ElementWrapper<T>['type'];
    component: ElementWrapper<T>['component'];
    isInline?: ElementWrapper<T>['isInline'];
    regex?: ElementWrapper<T>['regex'];
}

export interface SingleMatch {
    value: string;
    position: [number, number];
}

export interface MarkdownSingleMatch {
    fullMatch: SingleMatch;
    indicators: SingleMatch[];
}
