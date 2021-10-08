import { normalizeFunction } from '../types';
import { Element, Transforms } from 'slate';
import elements from '../../../elements/markdown';
import { getElementFullText, wrapIndicators } from '../utils';
import { DEFAULT_ELEMENT_TYPE } from '../../../elements';

const blockElements = elements.filter((element) => !element.isInline && element.regex);

const transformIntoBlockElement: normalizeFunction = (editor, [node, path]) => {
    if (!Element.isElement(node) || node.type !== DEFAULT_ELEMENT_TYPE) {
        return false;
    }

    const fullText = getElementFullText(node);
    const element = blockElements.find((element) => element.match(fullText));

    if (!element) {
        return false;
    }

    const match = element.match(fullText);

    Transforms.wrapNodes(
        editor,
        { type: element.type, children: [] },
        {
            at: [...path],
            split: true,
        }
    );

    Transforms.unwrapNodes(editor, { at: [...path, 0] });

    wrapIndicators(editor, match, path);

    return true;
};

export default transformIntoBlockElement;
