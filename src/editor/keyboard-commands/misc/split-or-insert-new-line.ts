import KeyboardCommand from '../keyboard-command';
import { Node, Transforms } from 'slate';
import { DEFAULT_ELEMENT_TYPE } from '../../elements';

export default KeyboardCommand.create({
    pattern: { key: 'Enter' },
    apply: (editor) => {
        const selectedLeaf = Node.leaf(editor, editor.selection.anchor.path);

        const cursorAtTheEndOfLine = selectedLeaf.text.length === editor.selection.anchor.offset;
        const cursorAtTheBeginningOfLine = editor.selection.anchor.offset === 0;

        if (cursorAtTheEndOfLine || cursorAtTheBeginningOfLine) {
            Transforms.insertNodes(editor, {
                type: DEFAULT_ELEMENT_TYPE,
                children: [{ text: '' }],
            });

            if (cursorAtTheBeginningOfLine) {
                Transforms.move(editor, {
                    distance: 1,
                    unit: 'line',
                });
            }

            return;
        }

        Transforms.splitNodes(editor);
        Transforms.setNodes(editor, { type: DEFAULT_ELEMENT_TYPE });
    },
});
