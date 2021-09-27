import { EditorValue } from '../types';
import { ControlFunctions } from 'use-debounce/lib/useDebouncedCallback';
import { EditorSelectionRange } from '../selection/types';

export interface History {
    state: HistoryState;
    active: EditorValue;
    push: HistoryPushMethod;
    undo: HistoryUndoMethod;
    redo: HistoryRedoMethod;
}

export interface HistoryPushMethod {
    (values: EditorValue[]): void;
}

export interface HistoryUndoMethod {
    (): void;
}

export interface HistoryRedoMethod {
    (): void;
}

export interface HistoryState {
    current: EditorValue[];
    temp: EditorValue[];
}

export interface HistoryReducerMethods {
    [key: string]: (prev: HistoryState, payload: HistoryReducerAction) => HistoryState;
}

export interface HistoryReducerAction<T = any> {
    type: string;
    payload?: T;
}

export interface PushToHistory extends ControlFunctions {
    (
        value: EditorValue,
        currentSelection: EditorSelectionRange,
        options?: { debounced?: boolean }
    ): void;
}
