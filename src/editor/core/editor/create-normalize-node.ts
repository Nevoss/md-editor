import type { NodeEntry } from 'slate';
import { OriginalEditor } from '../../types';
import { Element, Node } from 'slate';
import { DEFAULT_ELEMENT_TYPE } from '../elements';
import ElementWrapper from '../elements/element-wrapper';
import { BaseElement } from '../elements/types';

export default function createNormalizeNode(
    editor: OriginalEditor,
    elements: ElementWrapper[]
): (entry: NodeEntry) => void {
    const { normalizeNode } = editor;
    const transformableElements = elements.filter((element) => element.regex);

    return (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
            const text = getFullText(node);

            if (node.type === DEFAULT_ELEMENT_TYPE) {
                const transferToElement = transformableElements.find((element) => {
                    return !element.isInline && element.matchAll(text).length;
                });

                if (transferToElement) {
                    transferToElement.transformInto(editor, node, path);
                    return;
                }
            }

            const currentElement = transformableElements.find((element) => element.isElement(node));

            if (currentElement && !currentElement.matchAll(text).length) {
                currentElement.transformBack(editor, node, path);
            }
        }

        normalizeNode(entry);
    };
}

function getFullText(element: BaseElement): string {
    return element.children.reduce((carry, child) => {
        if (Element.isElement(child)) {
            return carry + getFullText(child);
        }

        return carry + child.text;
    }, '');
}
