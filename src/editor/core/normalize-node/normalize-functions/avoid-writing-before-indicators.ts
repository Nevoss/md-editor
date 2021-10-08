import { normalizeFunction } from '../types';
import { Element, Node, Text, Transforms } from 'slate';
import elements from '../../../elements/markdown';

const inlineElements = elements.filter((element) => element.isInline && element.regex);

const avoidWritingBeforeIndicators: normalizeFunction = (editor, [node, path]) => {
    if (!Element.isElement(node)) {
        return false;
    }

    const element = inlineElements.find((element) => element.isElement(node));
    const firstElementChild = node.children?.[0];

    if (!element || !Text.isText(firstElementChild) || !firstElementChild.text) {
        return false;
    }

    const insertedText = firstElementChild.text;
    const prevTextPath = [...path.slice(0, -1), path[path.length - 1] - 1];
    const prevTextNode = Node.descendant(editor, prevTextPath);

    if (!prevTextNode || !Text.isText(prevTextNode)) {
        return false;
    }

    Transforms.delete(editor, {
        at: [...path, 0],
    });

    Transforms.insertText(editor, insertedText, {
        at: {
            path: prevTextPath,
            offset: prevTextNode.text.length,
        },
    });

    return true;
};

export default avoidWritingBeforeIndicators;
