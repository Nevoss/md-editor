import { Dispatch, useCallback, useMemo, useReducer } from 'react';
import { EditorSelectionRange, EditorValue } from '../types';
import {
    History,
    HistoryPushReducerActionPayload,
    HistoryReducerAction,
    HistoryReducerActions,
} from './types';

const isFirstItem = (val: EditorValue, index: number) => index === 0;
const isNotFirstItem = (val: EditorValue, index: number) => !isFirstItem(val, index);

const actions: HistoryReducerActions = {
    push: (
        { current }: History,
        {
            payload: { value, previousSelection },
        }: HistoryReducerAction<HistoryPushReducerActionPayload>
    ): History => {
        const values = [value];
        const [activeItem] = current;
        const newValueLength = value.value.length - (activeItem?.value?.length || 0);
        const newValueStartingPosition = value.selection.start - newValueLength;

        if (
            activeItem &&
            (previousSelection || activeItem.selection.start !== newValueStartingPosition)
        ) {
            values.push({
                value: activeItem.value,
                selection: previousSelection,
            });
        }

        return {
            current: [...values, ...current],
            temp: [],
        };
    },
    undo: (prev: History): History => {
        const lastValue = prev.current.find(isFirstItem);

        if (!lastValue) {
            return prev;
        }

        return {
            current: prev.current.filter(isNotFirstItem),
            temp: [lastValue, ...prev.temp],
        };
    },
    redo: (prev: History): History => {
        const lastTempValue = prev.temp.find(isFirstItem);

        if (!lastTempValue) {
            return prev;
        }

        return {
            current: [lastTempValue, ...prev.current],
            temp: prev.temp.filter(isNotFirstItem),
        };
    },
};

const initialHistory: History = {
    current: [],
    temp: [],
};

export default function useHistory() {
    const [state, dispatch]: [History, Dispatch<HistoryReducerAction>] = useReducer(
        (state: History, { type, payload }: HistoryReducerAction) => {
            if (!actions[type]) {
                throw new Error('Action not founded');
            }

            return actions[type](state, { type, payload });
        },
        initialHistory
    );

    const push = useCallback(
        (value: EditorValue, previousSelection?: EditorSelectionRange) =>
            dispatch({ type: 'push', payload: { value, previousSelection } }),
        [dispatch]
    );

    const undo = useCallback(() => dispatch({ type: 'undo' }), [dispatch]);
    const redo = useCallback(() => dispatch({ type: 'redo' }), [dispatch]);

    const active = useMemo(() => state.current[0] || null, [state.current]);

    return { state, active, push, undo, redo };
}
