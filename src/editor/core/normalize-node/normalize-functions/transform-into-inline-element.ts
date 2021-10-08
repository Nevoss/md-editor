import { normalizeFunction } from '../types';
import { Element, Node, Text, Transforms } from 'slate';
import elements from '../../../elements/markdown';
import { generateId, wrapIndicators } from '../utils';

const inlineElements = elements.filter((element) => element.isInline && element.regex);

const transformIntoInlineElement: normalizeFunction = (editor, [node, path]) => {
    if (!Text.isText(node)) {
        return false;
    }

    const element = inlineElements.find((element) => element.match(node.text));
    const parentPosition = path.slice(0, -1);

    let parent = Node.descendant(editor, parentPosition);

    if (!element || element.isElement(parent)) {
        return false;
    }

    const match = element.match(node.text);

    const id = generateId();

    Transforms.wrapNodes(
        editor,
        { type: element.type, children: [], id },
        {
            at: {
                anchor: { path, offset: match.fullMatch.position[0] },
                focus: { path, offset: match.fullMatch.position[1] },
            },
            split: true,
        }
    );

    parent = Node.descendant(editor, parentPosition);

    if (parent && Element.isElement(parent)) {
        const newNodePosition = parent.children.findIndex(
            (node) => Element.isElement(node) && node.id === id
        );

        const newPath = [...parentPosition, newNodePosition];

        wrapIndicators(editor, match, newPath);
    }

    return true;
};

export default transformIntoInlineElement;
