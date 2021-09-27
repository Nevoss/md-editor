import { EditorValue } from '../types';
import { CommandTemplate, EditorCommand } from './types';
import { isSelectionIsActive } from '../utils';

const PLACEHOLDER = '%%__PLACEHOLDER__%%';

const TYPES = {
    BEFORE_AND_AFTER: 'before_and_after',
    BEFORE: 'before',
    AFTER: 'after',
};

const stripeReplacerPattern = {
    [TYPES.BEFORE_AND_AFTER]: '$2',
    [TYPES.BEFORE]: '$2',
    [TYPES.AFTER]: '$1',
};

export default function commandGenerator(
    template: CommandTemplate
): EditorCommand {
    const templateWithPlaceholder = template(PLACEHOLDER);
    const templateType = getTemplateType(templateWithPlaceholder);
    const templateLength = template('').length;
    const templateAppliedRegex = generateAppliedRegex(templateWithPlaceholder);

    return ({ value, selection }: EditorValue): EditorValue => {
        if (!isSelectionIsActive(selection)) {
            return getNonSelectedEditorValue(
                { value, selection },
                templateWithPlaceholder
            );
        }

        const selectedValue = value.slice(selection.start, selection.end);
        const isApplied = templateAppliedRegex.test(selectedValue);

        const replacedValue = isApplied
            ? selectedValue.replace(
                  templateAppliedRegex,
                  stripeReplacerPattern[templateType]
              )
            : template(selectedValue);

        const newValue = value.replace(
            new RegExp(
                `^(.{${selection.start}})(.{${
                    selection.end - selection.start
                }})`,
                'sm'
            ),
            `$1${replacedValue}`
        );

        return {
            value: newValue,
            selection: {
                start: selection.start,
                end:
                    selection.end +
                    (isApplied ? -templateLength : templateLength),
            },
        };
    };
}

function getNonSelectedEditorValue(
    { value, selection }: EditorValue,
    templateWithPlaceholder: string
): EditorValue {
    const placeholderLocation = templateWithPlaceholder.indexOf(PLACEHOLDER);

    return {
        value: [
            value.slice(0, selection.start),
            templateWithPlaceholder.replace(PLACEHOLDER, ''),
            value.slice(selection.start),
        ].join(''),
        selection: {
            start: selection.start + placeholderLocation,
            end: selection.end + placeholderLocation,
        },
    };
}

function getTemplateType(templateWithPlaceholder: string) {
    const splitTemplate = templateWithPlaceholder.split(PLACEHOLDER);

    if (splitTemplate.length === 3) {
        return TYPES.BEFORE_AND_AFTER;
    }

    if (splitTemplate.length === 2 && splitTemplate[0]) {
        return TYPES.BEFORE;
    }

    return TYPES.AFTER;
}

function generateAppliedRegex(templateWithPlaceholder: string): RegExp {
    const regex = templateWithPlaceholder
        .split(PLACEHOLDER)
        .map((text) => {
            text = text
                .split('')
                .map((char) => (/a-zA-Z0-9/.test(char) ? char : `\\${char}`))
                .join('');

            return `(${text})`;
        })
        .join('(.*)');

    return new RegExp(`^${regex}$`);
}
