import { useDebouncedCallback } from 'use-debounce';
import { useMemo } from 'react';
import { isNewValuePushedOnTheMiddleOfTheText, isSelectionActive } from '../selection/utils';
import { History, PushToHistory } from './types';

export default function usePushToHistory(history: History, debounceWait = 500) {
    const pushDebounced = useDebouncedCallback(history.push, debounceWait);

    return useMemo<PushToHistory>(() => {
        const func: PushToHistory = (value, currentSelection, options) => {
            const selectionIsActive =
                isSelectionActive(currentSelection) &&
                !isSelectionActive(history.active?.selection);
            const cursorIsNotAtTheEnd =
                isNewValuePushedOnTheMiddleOfTheText(value, history.active) &&
                !isSelectionActive(currentSelection);

            if (history.active && (selectionIsActive || cursorIsNotAtTheEnd)) {
                history.push([value, { ...history.active, selection: currentSelection }]);

                return;
            }

            options?.debounced ? pushDebounced([value]) : history.push([value]);
        };

        func.flush = pushDebounced.flush;
        func.cancel = pushDebounced.cancel;
        func.isPending = pushDebounced.isPending;

        return func;
    }, [history.push, history.active, pushDebounced]);
}
