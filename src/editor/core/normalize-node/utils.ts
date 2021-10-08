import { BaseElement } from '../elements/types';
import { Editor, Element, Path, Transforms } from 'slate';
import { SingleMatch } from '../elements/element-wrapper';
import { INDICATOR_ELEMENT_TYPE } from '../elements';

export function wrapIndicators(editor: Editor, match: SingleMatch, parentPath: Path): void {
    let prefixForStart = match.fullMatch.position[0];
    let prefixForEnd = match.fullMatch.position[0];
    let index = 0;

    match.indicators.forEach((indicator) => {
        Transforms.wrapNodes(
            editor,
            { type: INDICATOR_ELEMENT_TYPE, children: [] },
            {
                at: {
                    anchor: {
                        path: [...parentPath, index],
                        offset: indicator.position[0] - prefixForStart,
                    },
                    focus: {
                        path: [...parentPath, index],
                        offset: indicator.position[1] - prefixForEnd,
                    },
                },
                split: true,
            }
        );

        prefixForStart += indicator.value.length;
        prefixForEnd += indicator.value.length;
        index += 1;
    });
}

export function getElementFullText(element: BaseElement): string {
    return element.children.reduce((carry, child) => {
        if (Element.isElement(child)) {
            return carry + getElementFullText(child);
        }

        return carry + child.text;
    }, '');
}

export function generateId(): string {
    return (Date.now() + Math.floor(Math.random() * 100)).toString();
}
