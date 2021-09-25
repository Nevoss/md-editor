import actions from './actions/index';
import { useCallback } from 'react';
import { EditorKeyboardEvent } from './types';
import { EditorValue } from '../types';

export default function useActions() {
    const onKeyDown = useCallback(
        (
            event: EditorKeyboardEvent,
            { value, selectionStart, selectionEnd }: EditorValue
        ) => {
            const action = actions.find((action) => action.onKeyDown(event));

            if (!action) {
                return null;
            }

            const actionResult = action.handler(
                value.slice(selectionStart, selectionEnd),
                { selectionStart, selectionEnd }
            );

            const result = value.replace(
                new RegExp(`.{${selectionStart},${selectionEnd}}`, 'm'),
                actionResult.value
            );

            console.log(result);

            return {
                value: result,
                selectionStart,
                selectionEnd,
            };
        },
        []
    );

    return {
        actions,
        onActionKeyDown: onKeyDown,
    };
}
