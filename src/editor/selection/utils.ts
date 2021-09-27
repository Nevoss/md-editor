import { EditorSelectionRange, EditorValue } from '../types';

export function isSelectionActive(selection?: EditorSelectionRange) {
    if (!selection) {
        return false;
    }

    return selection.end > selection.start;
}

export function isNewValuePushedOnTheMiddleOfTheText(
    newValue: EditorValue,
    oldValue?: EditorValue
) {
    if (!oldValue) {
        return false;
    }

    const newValueLength = newValue.value.length - oldValue.value.length;
    const newValueStartingPosition = newValue.selection.start - newValueLength;

    return oldValue.selection.start !== newValueStartingPosition;
}
