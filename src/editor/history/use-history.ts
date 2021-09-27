import { Dispatch, useCallback, useMemo, useReducer } from 'react';
import { EditorValue } from '../types';
import {
    HistoryState,
    HistoryReducerAction,
    History,
    HistoryUndoMethod,
    HistoryRedoMethod,
    HistoryPushMethod,
} from './types';
import methods from './history-reducer-methods';

const initialHistory: HistoryState = {
    current: [],
    temp: [],
};

export default function useHistory(): History {
    const [state, dispatch]: [HistoryState, Dispatch<HistoryReducerAction>] = useReducer(
        (state: HistoryState, { type, payload }: HistoryReducerAction) => {
            if (!methods[type]) {
                throw new Error('Action not founded');
            }

            return methods[type](state, { type, payload });
        },
        initialHistory
    );

    const undo = useCallback<HistoryUndoMethod>(() => dispatch({ type: 'undo' }), [dispatch]);
    const redo = useCallback<HistoryRedoMethod>(() => dispatch({ type: 'redo' }), [dispatch]);
    const push = useCallback<HistoryPushMethod>(
        (values: EditorValue[]) => dispatch({ type: 'push', payload: values }),
        [dispatch]
    );

    const active: EditorValue | null = useMemo(() => state.current[0] || null, [state.current]);

    return { state, active, push, undo, redo };
}
