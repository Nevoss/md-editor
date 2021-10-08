import { FC } from 'react';
import {
    ElementWrapperIndicatorOptions,
    ElementWrapperOptions,
    MarkdownSingleMatch,
    RenderElementProps,
} from './types';
import { Element } from 'slate';

export default class ElementWrapper<T extends Element = Element> {
    type: T['type'];
    component: FC<RenderElementProps<T>>;
    isInline: boolean;
    regex?: string[];
    indicatorOptions?: ElementWrapperIndicatorOptions;

    constructor(options: ElementWrapperOptions<T>) {
        this.type = options.type;
        this.component = options.component;
        this.indicatorOptions = options.indicatorOptions;
        this.isInline = options.isInline || false;

        if (options.regex) {
            this.regex = Array.isArray(options.regex) ? options.regex : [options.regex];
        }
    }

    static create<T extends Element>(options: ElementWrapperOptions<T>) {
        return new ElementWrapper<T>(options);
    }

    match(value: string): MarkdownSingleMatch | null {
        if (!this.regex) {
            return null;
        }

        let match: RegExpMatchArray | null = null;

        this.regex.some((singleRegex) => {
            match = value.match(new RegExp(singleRegex, 'dm'));

            return match;
        });

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
