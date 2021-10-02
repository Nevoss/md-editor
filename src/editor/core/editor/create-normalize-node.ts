import type { NodeEntry } from 'slate';
import { OriginalEditor } from '../../types';
import { Element, Node, Text, Transforms, Editor } from 'slate';
import { DEFAULT_ELEMENT_TYPE } from '../elements';
import ElementWrapper from '../elements/element-wrapper';
import { BaseElement } from '../elements/types';
import elements from '../../elements/markdown';

interface normalizeFunction {
    (entry: NodeEntry, editor: Editor): boolean;
}

export default function createNormalizeNode(
    editor: OriginalEditor,
    elements: ElementWrapper[]
): (entry: NodeEntry) => void {
    const { normalizeNode } = editor;
    const transformableElements = elements.filter((element) => element.regex);
    const normalizeFunctions: normalizeFunction[] = [transformIntoInlineElement];

    return (entry) => {
        const shouldReturn = normalizeFunctions.some((func) => func(entry, editor));

        if (shouldReturn) {
            return;
        }

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

const transformIntoInlineElement: normalizeFunction = ([node, path], editor) => {
    if (!Text.isText(node)) {
        return false;
    }

    const element = elements.find(
        (element) => element.isInline && element.regex && element.match(node.text)
    );

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

        let prefixForStart = match.fullMatch.position[0];
        let prefixForEnd = match.fullMatch.position[0];
        let index = 0;

        match.indicators.forEach((indicator) => {
            Transforms.wrapNodes(
                editor,
                { type: 'indicator', children: [] },
                {
                    at: {
                        anchor: {
                            path: [...newPath, index],
                            offset: indicator.position[0] - prefixForStart,
                        },
                        focus: {
                            path: [...newPath, index],
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

    return true;
};

function getFullText(element: BaseElement): string {
    return element.children.reduce((carry, child) => {
        if (Element.isElement(child)) {
            return carry + getFullText(child);
        }

        return carry + child.text;
    }, '');
}

function generateId() {
    return (Date.now() + Math.floor(Math.random() * 100)).toString();
}
