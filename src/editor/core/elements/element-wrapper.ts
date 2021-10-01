import { FC } from 'react';
import { BaseElement, RenderElementProps } from './types';
import { Element } from 'slate';

interface ElementWrapperOptions<T extends BaseElement> {
    type: T['type'];
    component: FC<RenderElementProps<T>>;
    isInline?: boolean;
    patternMatch?: (value: string) => boolean;
}

export default class ElementWrapper<T extends BaseElement = Element> {
    type: T['type'];
    component: FC<RenderElementProps<T>>;
    isInline: boolean;
    patternMatch?: (value: string) => boolean;

    constructor(options: ElementWrapperOptions<T>) {
        this.type = options.type;
        this.component = options.component;
        this.isInline = options.isInline || false;
        this.patternMatch = options.patternMatch;
    }

    static create<T extends BaseElement>(options: ElementWrapperOptions<T>) {
        return new ElementWrapper<T>(options);
    }

    isElement(value: any): value is T {
        return Element.isElement(value) && value.type === this.type;
    }
}
