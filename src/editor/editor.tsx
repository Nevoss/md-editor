import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useHistory from './use-history';
import useSelection from './use-selection';
import { EditorSelectionRange, EditorValue } from './types';
import { KeyboardAction } from './keyboard-action';
import { bold, italic } from './commands/';
import { HistoryPushOptions } from './use-history/types';
import { isSelectionIsActive } from './utils';

interface OnChangeFunction {
    (value: string): void;
}

interface EditorProps {
    value: string;
    onChange: OnChangeFunction;
}

const Editor: FC<EditorProps> = ({ value, onChange }) => {
    const history = useHistory();
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

    const pushToHistory = useCallback(
        (value: EditorValue, previousSelection: EditorSelectionRange) =>
            history.push(value, previousSelection),
        [history.push]
    );

    const pushToHistoryDebounced = useDebouncedCallback(pushToHistory, 600);

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
            {/*<div>*/}
            {/*    <button onClick={() => history.undo()}> Undo </button>*/}
            {/*    <button onClick={() => history.redo()}> Redo </button>*/}
            {/*</div>*/}
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

                    pushToHistoryDebounced(editorValue, currentSelection.current);
                }}
                onSelect={({ currentTarget: { selectionStart: start, selectionEnd: end } }) =>
                    (currentSelection.current = { start, end })
                }
                onKeyDown={async (e) => {
                    const action = keyboardActions.find((action) => action.shouldApply(e));

                    if (!action) {
                        return;
                    }

                    pushToHistoryDebounced.flush();
                    e.preventDefault();
                    e.stopPropagation();

                    shouldUpdateSelection.current = true;

                    const { currentTarget } = e;

                    const newValue = await action.apply({
                        value: currentTarget.value,
                        selection: currentSelection.current,
                    });

                    if (!newValue) {
                        return;
                    }

                    pushToHistory(newValue, currentSelection.current);
                }}
                autoFocus
            />
        </div>
    );
};

export default Editor;
