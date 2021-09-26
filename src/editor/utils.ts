import { EditorSelectionRange } from './types';

export function isSelectionIsActive(selection: EditorSelectionRange) {
    return selection.end > selection.start;
}
