import { Editor } from 'slate';
import type { NodeEntry } from 'slate';

export interface normalizeFunction {
    (editor: Editor, entry: NodeEntry): boolean;
}
