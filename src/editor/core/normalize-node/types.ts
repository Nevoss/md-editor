import { Editor } from 'slate';
import type { NodeEntry } from 'slate';

export interface normalizeFunction {
    (entry: NodeEntry, editor: Editor): boolean;
}
