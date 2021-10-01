import KeyboardCommand from '../core/keyboard-command';
import { Node, Transforms } from 'slate';
import { DEFAULT_ELEMENT_TYPE } from '../core/elements';

export default KeyboardCommand.create({
    pattern: { key: 'Enter' },
    apply: (editor) => {
        const selectedLeaf = Node.leaf(editor, editor.selection.anchor.path);

        // Cursor at the end of the line or in the begging of the line
        if (
            selectedLeaf.text.length === editor.selection.anchor.offset ||
            editor.selection.anchor.offset === 0
        ) {
            Transforms.insertNodes(editor, {
                type: DEFAULT_ELEMENT_TYPE,
                children: [{ text: '' }],
            });

            return;
        }

        Transforms.splitNodes(editor);
        Transforms.setNodes(editor, { type: DEFAULT_ELEMENT_TYPE });
    },
});
