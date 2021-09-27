import { EditorSelectionRange } from './selection/types';

export interface EditorValue {
    value: string;
    selection: EditorSelectionRange;
}
