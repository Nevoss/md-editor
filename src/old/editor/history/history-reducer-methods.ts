import { EditorValue } from '../types';
import { HistoryState, HistoryReducerAction, HistoryReducerMethods } from './types';

const isFirstItem = (val: EditorValue, index: number) => index === 0;
const isNotFirstItem = (val: EditorValue, index: number) => !isFirstItem(val, index);

const methods: HistoryReducerMethods = {
    push: (
        { current }: HistoryState,
        { payload }: HistoryReducerAction<EditorValue[]>
    ): HistoryState => {
        return {
            current: [...payload, ...current],
            temp: [],
        };
    },
    undo: (prev: HistoryState): HistoryState => {
        const lastValue = prev.current.find(isFirstItem);

        if (!lastValue) {
            return prev;
        }

        return {
            current: prev.current.filter(isNotFirstItem),
            temp: [lastValue, ...prev.temp],
        };
    },
    redo: (prev: HistoryState): HistoryState => {
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

export default methods;
