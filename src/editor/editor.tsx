import React, { FC, useEffect, useRef, useState } from 'react';
import useHistory from './history/use-history';
import useSelection from './selection/use-selection';
import { EditorValue } from './types';
import { KeyboardAction } from './keyboard-action';
import { bold, italic } from './commands/';
import usePushToHistory from './history/use-push-to-history';

interface OnChangeFunction {
    (value: string): void;
}

interface EditorProps {
    value: string;
    onChange: OnChangeFunction;
}

const Editor: FC<EditorProps> = ({ value, onChange }) => {
    const history = useHistory();
    const pushToHistory = usePushToHistory(history);
    const { ref, updateSelection, currentSelection } = useSelection();
    const shouldUpdateSelection = useRef<boolean>(false);
    const [localValue, setLocalValue] = useState(value || '');

    const keyboardActions: KeyboardAction[] = [
        KeyboardAction.create({
            apply: async () => history.undo(),
            pattern: { ctrlKey: true, code: 'KeyZ' },
        }),
        KeyboardAction.create({
            apply: async () => history.redo(),
            pattern: { ctrlKey: true, shiftKey: true, code: 'KeyZ' },
        }),
        KeyboardAction.create({
            apply: async (value) => bold(value),
            pattern: { ctrlKey: true, code: 'KeyB' },
        }),
        KeyboardAction.create({
            apply: async (value) => italic(value),
            pattern: { ctrlKey: true, code: 'KeyI' },
        }),
    ];

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

                    const editorValue: EditorValue = {
                        value: currentTarget.value,
                        selection: {
                            start: currentTarget.selectionStart,
                            end: currentTarget.selectionEnd,
                        },
                    };

                    pushToHistory(editorValue, currentSelection.current, { debounced: true });
                }}
                onSelect={({ currentTarget: { selectionStart: start, selectionEnd: end } }) =>
                    (currentSelection.current = { start, end })
                }
                onKeyDown={async (e) => {
                    const action = keyboardActions.find((action) => action.shouldApply(e));

                    if (!action) {
                        return;
                    }

                    pushToHistory.flush();
                    e.preventDefault();
                    e.stopPropagation();

                    shouldUpdateSelection.current = true;

                    const { currentTarget } = e;

                    const editorValue = await action.apply({
                        value: currentTarget.value,
                        selection: currentSelection.current,
                    });

                    if (!editorValue) {
                        return;
                    }

                    pushToHistory(editorValue, currentSelection.current);
                }}
                autoFocus
            />
        </div>
    );
};

export default Editor;
