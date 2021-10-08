import { FC } from 'react';
import { ElementWrapperOptions, MarkdownSingleMatch, RenderElementProps } from './types';
import { Element } from 'slate';

export default class ElementWrapper<T extends Element = Element> {
    type: T['type'];
    component: FC<RenderElementProps<T>>;
    isInline: boolean;
    regex?: string;

    constructor(options: ElementWrapperOptions<T>) {
        this.type = options.type;
        this.component = options.component;
        this.isInline = options.isInline || false;
        this.regex = options.regex;
    }

    static create<T extends Element>(options: ElementWrapperOptions<T>) {
        return new ElementWrapper<T>(options);
    }

    match(value: string): MarkdownSingleMatch | null {
        if (!this.regex) {
            return null;
        }

        const match = value.match(new RegExp(this.regex, 'dm'));

        if (!match) {
            return null;
        }

        // @ts-ignore
        const [fullMatchRange, ...indicatorsRange]: [number, number][] = match.indices;
        const [fullMatch, ...indicators] = match;

        return {
            fullMatch: {
                value: fullMatch,
                position: fullMatchRange,
            },
            indicators: indicators
                ? indicators.map((value, index) => ({
                      value: value,
                      position: indicatorsRange[index],
                  }))
                : [],
        };
    }

    isElement(value: any): value is T {
        return Element.isElement(value) && value.type === this.type;
    }
}
