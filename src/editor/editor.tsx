import React, { FC, useEffect, useRef, useState } from 'react';
import useHistory from './history/use-history';
import useSelection from './selection/use-selection';
import { EditorValue } from './types';
import usePushToHistory from './history/use-push-to-history';
import useKeyboardCommands from './commands/keyboard/use-keyboard-commands';

interface OnChangeFunction {
    (value: string): void;
}

interface EditorProps {
    value: string;
    onChange: OnChangeFunction;
}

const Editor: FC<EditorProps> = ({ value, onChange }) => {
    // History
    const history = useHistory();
    const pushToHistory = usePushToHistory(history);

    // Keyboard Commands
    const keyboardCommands = useKeyboardCommands({ undo: history.undo, redo: history.redo });

    // Selection
    const shouldUpdateSelection = useRef<boolean>(false);
    const { ref, updateSelection, currentSelection } = useSelection();

    // Editor Local
    const [localValue, setLocalValue] = useState(value || '');

    useEffect(() => {
        const value = history.active?.value || '';

        setLocalValue(value);
        onChange(value);

        if (history.active && shouldUpdateSelection.current) {
            shouldUpdateSelection.current = false;
            updateSelection(history.active.selection);
        }
    }, [history.active]);

    return (
        <div className="h-full flex flex-col">
            <textarea
                ref={(el) => (ref.current = el)}
                name="editor"
                id="editor"
                value={localValue}
                className="w-full border-0 resize-none h-full focus:outline-none p-6 flex-1"
                onChange={({ currentTarget }) => {
                    setLocalValue(currentTarget.value);

                    const value: EditorValue = {
                        value: currentTarget.value,
                        selection: {
                            start: currentTarget.selectionStart,
                            end: currentTarget.selectionEnd,
                        },
                    };

                    pushToHistory(value, currentSelection.current, { debounced: true });
                }}
                onSelect={({ currentTarget: { selectionStart: start, selectionEnd: end } }) =>
                    (currentSelection.current = { start, end })
                }
                onKeyDown={async (e) => {
                    const keyboardCommand = keyboardCommands.find((action) =>
                        action.shouldApply(e)
                    );

                    if (!keyboardCommand) {
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    pushToHistory.flush();
                    shouldUpdateSelection.current = true;

                    const value = await keyboardCommand.apply({
                        value: e.currentTarget.value,
                        selection: currentSelection.current,
                    });

                    if (value) {
                        pushToHistory(value, currentSelection.current);
                    }
                }}
                autoFocus
            />
        </div>
    );
};

export default Editor;
