import { EditorSelectionRange, EditorValue } from '../types';

export interface History {
    current: EditorValue[];
    temp: EditorValue[];
    lastAction: 'push' | 'push-and-adjust-selection' | 'undo' | 'redo' | null;
}

export interface HistoryReducerActions {
    [key: string]: (prev: History, payload: HistoryReducerAction) => History;
}

export interface HistoryPushReducerActionPayload {
    values: EditorValue[];
    lastSelection?: EditorSelectionRange;
    adjustSelection?: boolean;
}

export interface HistoryPushOptions {
    lastSelection?: EditorSelectionRange;
    adjustSelection?: boolean;
}

export interface HistoryReducerAction<T = any> {
    type: string;
    payload?: T;
}
