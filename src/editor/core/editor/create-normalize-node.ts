import type { NodeEntry } from 'slate';
import { OriginalEditor } from '../../types';
import { Element, Node, Transforms } from 'slate';
import { DEFAULT_ELEMENT_TYPE } from '../elements';
import ElementWrapper from '../elements/element-wrapper';

export default function createNormalizeNode(
    editor: OriginalEditor,
    elements: ElementWrapper[]
): (entry: NodeEntry) => void {
    const { normalizeNode } = editor;
    const transformableElements = elements.filter((element) => element.patternMatch);

    return (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
            const nonInlineMarkdownElements = transformableElements.filter(
                (element) => !element.isInline
            );

            if (node.type === DEFAULT_ELEMENT_TYPE) {
                const transferToElement = nonInlineMarkdownElements.find((element) =>
                    element.patternMatch(Node.leaf(node, [0]).text)
                );

                if (transferToElement) {
                    Transforms.unwrapNodes(editor, { at: path });
                    Transforms.wrapNodes(
                        editor,
                        { type: transferToElement.type, children: [] },
                        { at: path }
                    );

                    return;
                }
            }

            const elementWrapper = nonInlineMarkdownElements.find(({ type }) => type === node.type);

            if (elementWrapper && !elementWrapper.patternMatch(Node.leaf(node, [0]).text)) {
                Transforms.unwrapNodes(editor, { at: path });
                Transforms.wrapNodes(
                    editor,
                    { type: DEFAULT_ELEMENT_TYPE, children: [] },
                    { at: path }
                );

                return;
            }
        }

        normalizeNode(entry);
    };
}
