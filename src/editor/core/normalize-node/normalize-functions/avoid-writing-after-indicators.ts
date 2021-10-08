import { getElementFullText } from '../utils';
import { normalizeFunction } from '../types';
import indicator from '../../../elements/misc/indicator';
import { Transforms } from 'slate';

const avoidWritingAfterIndicators: normalizeFunction = (editor, [node, path]) => {
    if (!indicator.isElement(node)) {
        return false;
    }

    const text = getElementFullText(node);

    if (text === node.value) {
        return false;
    }

    const value = node.value
        .split('')
        .map((char) => `\\${char}`)
        .join('');

    const match = text.match(new RegExp('^' + value + '(.*)$', 'dm'));

    if (!match) {
        return false;
    }

    // @ts-ignore
    const [, insertedTextLocation]: number[][] = match.indices;

    if (!insertedTextLocation) {
        return false;
    }

    const textInserted = text.slice(insertedTextLocation[0], insertedTextLocation[1]);

    Transforms.delete(editor, {
        at: {
            anchor: {
                path: [...path, 0],
                offset: insertedTextLocation[0],
            },
            focus: {
                path: [...path, 0],
                offset: insertedTextLocation[1],
            },
        },
    });

    const parentLevel = node.position === 'before' ? 1 : 2;

    Transforms.insertText(editor, textInserted, {
        at: {
            path: [...path.slice(0, -parentLevel), path[path.length - parentLevel] + 1],
            offset: 0,
        },
    });

    Transforms.move(editor, {
        distance: textInserted.length,
        unit: 'character',
    });

    return true;
};

export default avoidWritingAfterIndicators;
