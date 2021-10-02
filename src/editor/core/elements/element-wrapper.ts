import { FC } from 'react';
import { RenderElementProps } from './types';
import { Editor, Element, Node, Path, Transforms } from 'slate';
import { CombineEditor } from '../../types';
import { DEFAULT_ELEMENT_TYPE } from './index';

interface ElementWrapperOptions<T extends Element> {
    type: ElementWrapper<T>['type'];
    component: ElementWrapper<T>['component'];
    isInline?: ElementWrapper<T>['isInline'];
    regex?: ElementWrapper<T>['regex'];
}

interface SingleMatchGroup {
    value: string;
    position: [number, number];
}

interface SingleMatch {
    fullMatch: SingleMatchGroup;
    indicators: SingleMatchGroup[];
}

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

    matchAll(value: string): SingleMatch[] {
        if (!this.regex) {
            return [];
        }

        const regex = new RegExp(this.regex, 'gdm');

        return Array.from(value.matchAll(regex), (m) => {
            const [fullMatch, ...indicators] = m;
            // @ts-ignore
            const [fullMatchRange, ...indicatorsRange]: [number, number][] = m.indices;

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
        });
    }

    isElement(value: any): value is T {
        return Element.isElement(value) && value.type === this.type;
    }

    transformInto(editor: CombineEditor, node: Node, path: Path): void {
        const matches = this.matchAll(Node.leaf(node, [0]).text);

        matches.forEach((singleMatch) => {
            if (!this.isInline) {
                Transforms.wrapNodes(
                    editor,
                    { type: this.type, children: [] },
                    {
                        at: path,
                    }
                );
                Transforms.unwrapNodes(editor, { at: [...path, 0] });
            }

            singleMatch.indicators.forEach(({ position }) => {
                Transforms.wrapNodes(
                    editor,
                    { type: 'indicator', children: [] },
                    {
                        at: {
                            anchor: { path: [...path, 0], offset: position[0] },
                            focus: { path: [...path, 0], offset: position[1] },
                        },
                        split: true,
                    }
                );
            });
        });
    }

    transformBack(editor: CombineEditor, node: Node, path: Path): void {
        if (!this.isElement(node)) {
            return;
        }

        node.children.forEach((child, index) => {
            if (Element.isElement(child) && child.type === 'indicator') {
                Transforms.unwrapNodes(editor, { at: [...path, index] });
            }
        });

        if (!this.isInline) {
            Transforms.wrapNodes(
                editor,
                { type: DEFAULT_ELEMENT_TYPE, children: [] },
                {
                    at: path,
                }
            );
            Transforms.unwrapNodes(editor, { at: [...path, 0] });
        }
    }
}
