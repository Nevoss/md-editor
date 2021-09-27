import { EditorSelectionRange, EditorValue } from '../types';

export interface History {
    current: EditorValue[];
    temp: EditorValue[];
}

export interface HistoryReducerActions {
    [key: string]: (prev: History, payload: HistoryReducerAction) => History;
}

export interface HistoryPushReducerActionPayload {
    value: EditorValue;
    previousSelection?: EditorSelectionRange;
}

export interface HistoryPushOptions {
    lastSelection?: EditorSelectionRange;
    adjustSelection?: boolean;
}

export interface HistoryReducerAction<T = any> {
    type: string;
    payload?: T;
}
