import { normalizeFunction } from '../types';
import elements, { DEFAULT_ELEMENT_TYPE, INDICATOR_ELEMENT_TYPE } from '../../../elements';
import { getElementFullText } from '../utils';
import { Element, Transforms } from 'slate';

const transformableElements = elements.filter((element) => element.regex);

const transformIntoDefaultElement: normalizeFunction = (editor, [node, path]) => {
    if (!Element.isElement(node)) {
        return false;
    }

    const currentElement = transformableElements.find((element) => element.isElement(node));
    const fullText = getElementFullText(node);

    if (!currentElement || currentElement.match(fullText)) {
        return false;
    }

    node.children.forEach((child, index) => {
        if (Element.isElement(child) && child.type === INDICATOR_ELEMENT_TYPE) {
            Transforms.unwrapNodes(editor, { at: [...path, index] });
        }
    });

    if (!currentElement.isInline) {
        Transforms.wrapNodes(
            editor,
            { type: DEFAULT_ELEMENT_TYPE, children: [] },
            { at: [...path] }
        );

        Transforms.unwrapNodes(editor, { at: [...path, 0] });
    } else {
        Transforms.unwrapNodes(editor, { at: [...path] });
    }

    return true;
};

export default transformIntoDefaultElement;
