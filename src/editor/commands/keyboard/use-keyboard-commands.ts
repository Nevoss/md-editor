import { bold, italic } from '../index';
import { useMemo } from 'react';
import KeyboardCommand from './keyboard-command';
import { HistoryRedoMethod, HistoryUndoMethod } from '../../history/types';

export default function useKeyboardCommands({
    undo,
    redo,
}: {
    undo: HistoryUndoMethod;
    redo: HistoryRedoMethod;
}) {
    return useMemo<KeyboardCommand[]>(
        () => [
            KeyboardCommand.create({
                apply: async () => undo(),
                pattern: { ctrlKey: true, code: 'KeyZ' },
            }),
            KeyboardCommand.create({
                apply: async () => redo(),
                pattern: { ctrlKey: true, shiftKey: true, code: 'KeyZ' },
            }),
            KeyboardCommand.create({
                apply: async (value) => bold(value),
                pattern: { ctrlKey: true, code: 'KeyB' },
            }),
            KeyboardCommand.create({
                apply: async (value) => italic(value),
                pattern: { ctrlKey: true, code: 'KeyI' },
            }),
        ],
        [undo, redo]
    );
}
