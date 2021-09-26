import { EditorSelectionRange, EditorValue } from '../types';

export interface History {
    current: EditorValue[];
    temp: EditorValue[];
    lastAction: 'push' | 'undo' | 'redo' | null;
}

export interface HistoryReducerActions {
    [key: string]: (prev: History, payload: HistoryReducerAction) => History;
}

export interface HistoryPushReducerActionPayload {
    values: EditorValue[];
    lastSelection?: EditorSelectionRange;
}

export interface HistoryReducerAction<T = any> {
    type: string;
    payload?: T;
}
