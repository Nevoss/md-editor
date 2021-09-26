import { Dispatch, useCallback, useReducer } from 'react';
import { EditorValue, EditorSelectionRange } from '../types';
import {
    History,
    HistoryPushOptions,
    HistoryPushReducerActionPayload,
    HistoryReducerAction,
    HistoryReducerActions,
} from './types';

const isFirstItem = (val: EditorValue, index: number) => index === 0;
const isNotFirstItem = (val: EditorValue, index: number) =>
    !isFirstItem(val, index);

const actions: HistoryReducerActions = {
    push: (
        prev: History,
        { payload }: HistoryReducerAction<HistoryPushReducerActionPayload>
    ): History => {
        let current = [...prev.current];

        // Can update the last item selection if there is a range of selection before creating
        // the new item
        if (payload.lastSelection) {
            current = current.map((val, index) => {
                if (isFirstItem(val, index)) {
                    val.selection = payload.lastSelection;
                }

                return val;
            });
        }

        return {
            current: [...payload.values, ...current],
            temp: [],
            lastAction: payload.adjustSelection
                ? 'push-and-adjust-selection'
                : 'push',
        };
    },
    undo: (prev: History) => {
        const lastValue = prev.current.find(isFirstItem);

        if (!lastValue) {
            return prev;
        }

        return {
            current: prev.current.filter(isNotFirstItem),
            temp: [lastValue, ...prev.temp],
            lastAction: 'undo',
        };
    },
    redo: (prev: History) => {
        const lastTempValue = prev.temp.find(isFirstItem);

        if (!lastTempValue) {
            return prev;
        }

        return {
            current: [lastTempValue, ...prev.current],
            temp: prev.temp.filter(isNotFirstItem),
            lastAction: 'redo',
        };
    },
};

const initialHistory: History = {
    current: [],
    temp: [],
    lastAction: null,
};

export default function useHistory() {
    const [state, dispatch]: [History, Dispatch<HistoryReducerAction>] =
        useReducer(
            (state: History, { type, payload }: HistoryReducerAction) => {
                if (!actions[type]) {
                    throw new Error('Action not founded');
                }

                return actions[type](state, { type, payload });
            },
            initialHistory
        );

    const push = useCallback(
        (
            values: EditorValue[],
            {
                lastSelection = null,
                adjustSelection = false,
            }: HistoryPushOptions
        ) =>
            dispatch({
                type: 'push',
                payload: { values, lastSelection, adjustSelection },
            }),
        [dispatch]
    );

    const undo = useCallback(() => dispatch({ type: 'undo' }), [dispatch]);

    const redo = useCallback(() => dispatch({ type: 'redo' }), [dispatch]);

    return { state, push, undo, redo };
}
