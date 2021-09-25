import { EditorValue } from '../types';

export interface History {
    current: EditorValue[];
    temp: EditorValue[];
    lastAction: 'push' | 'undo' | 'redo' | null;
}

export interface HistoryReducerActions {
    [key: string]: (prev: History, payload: HistoryReducerAction) => History;
}

export interface HistoryReducerAction {
    type: string;
    payload?: any;
}
