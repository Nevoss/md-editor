import { BaseElement, MarkdownSingleMatch } from '../../elements/types';
import { Editor, Element, Path, Transforms } from 'slate';
import { INDICATOR_ELEMENT_TYPE } from '../../elements';
import ElementWrapper from '../../elements/element-wrapper';

export function wrapIndicators(
    editor: Editor,
    match: MarkdownSingleMatch,
    parentPath: Path,
    elementWrapper: ElementWrapper
): void {
    let prefixForStart = match.fullMatch.position[0];
    let prefixForEnd = match.fullMatch.position[0];

    match.indicators.forEach((indicator, index) => {
        Transforms.wrapNodes(
            editor,
            {
                type: INDICATOR_ELEMENT_TYPE,
                children: [],
                value: indicator.value,
                position: index === 0 ? 'before' : 'after',
                highlightLevel: elementWrapper?.indicatorOptions?.highlightLevel,
            },
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
