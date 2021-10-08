import type { NodeEntry } from 'slate';
import { OriginalEditor } from '../../types';
import normalizeFunctions from './normalize-functions';

export default function createNormalizeNode(editor: OriginalEditor): (entry: NodeEntry) => void {
    const { normalizeNode } = editor;

    return (entry) => {
        const shouldReturn = normalizeFunctions.some((func) => func(editor, entry));

        if (shouldReturn) {
            return;
        }

        normalizeNode(entry);
    };
}
