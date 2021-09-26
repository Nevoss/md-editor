import { EditorValue } from '../types';
import { isSelectionIsActive } from '../utils';

export default function bold({ value, selection }: EditorValue): EditorValue {
    if (!isSelectionIsActive(selection)) {
        return getNonSelectedReturnValue({ value, selection });
    }

    const selectedValue = value.slice(selection.start, selection.end);
    const shouldRemove = isApplied(selectedValue);

    const replacedValue = shouldRemove
        ? selectedValue.replace(/^\*\*/, '').replace(/\*\*$/, '')
        : `**${selectedValue}**`;

    const newValue = value.replace(
        new RegExp(
            `^(.{${selection.start}})(.{${selection.end - selection.start}})`,
            'sm'
        ),
        `$1${replacedValue}`
    );

    return {
        value: newValue,
        selection: {
            start: selection.start,
            end: selection.end + (shouldRemove ? -4 : 4),
        },
    };
}

function isApplied(value: string) {
    return new RegExp('^\\*\\*.*\\*\\*$', 'm').test(value);
}

function getNonSelectedReturnValue({ value, selection }: EditorValue) {
    return {
        value: [
            value.slice(0, selection.start),
            '****',
            value.slice(selection.start),
        ].join(''),
        selection: {
            start: selection.start + 2,
            end: selection.end + 2,
        },
    };
}
