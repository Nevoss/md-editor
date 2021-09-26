import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useHistory from './use-history';
import useSelection from './use-selection';
import { EditorSelectionRange, EditorValue } from './types';
import { KeyboardAction } from './keyboard-action';
import bold from './tools/bold';
import { HistoryPushOptions } from './use-history/types';
import { isSelectionIsActive } from './utils';

interface OnChangeFunction {
    (value: string): void;
}

interface EditorProps {
    value: string;
    onChange: OnChangeFunction;
}

const adjustSelectionHistoryActions = [
    'undo',
    'redo',
    'push-and-adjust-selection',
];

const Editor: FC<EditorProps> = ({ value, onChange }) => {
    const history = useHistory();
    const { ref, updateSelection } = useSelection();
    const [localValue, setLocalValue] = useState(value || '');
    const [lastSelection, setLastSelection] =
        useState<EditorSelectionRange | null>(null);

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
    ];

    const pushToHistory = useCallback(
        (values: EditorValue[], options: HistoryPushOptions = {}) =>
            history.push(values, options),
        [history.push]
    );

    const pushToHistoryDebounced = useDebouncedCallback(pushToHistory, 600);

    useEffect(() => {
        const { current, lastAction } = history.state;
        const active = current[0];
        const value = active?.value || '';

        setLocalValue(value);
        onChange(value);

        if (adjustSelectionHistoryActions.includes(lastAction) && active) {
            updateSelection({
                start: active.selection.start,
                end: active.selection.end,
            });
        }
    }, [history.state]);

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
                onChange={({ target }) => {
                    setLocalValue(target.value);

                    const editorValue: EditorValue = {
                        value: target.value,
                        selection: {
                            start: target.selectionStart,
                            end: target.selectionEnd,
                        },
                    };

                    if (isSelectionIsActive(lastSelection)) {
                        pushToHistory([editorValue], { lastSelection });

                        return;
                    }

                    pushToHistoryDebounced([editorValue]);
                }}
                onSelect={(e) => {
                    // @ts-ignore
                    const target: HTMLTextAreaElement = e.target;

                    setLastSelection({
                        start: target.selectionStart,
                        end: target.selectionEnd,
                    });
                }}
                onKeyDown={async (e) => {
                    const action = keyboardActions.find((action) =>
                        action.shouldApply(e)
                    );

                    if (!action) {
                        return;
                    }

                    pushToHistoryDebounced.flush();
                    e.preventDefault();
                    e.stopPropagation();

                    // @ts-ignore
                    const target: HTMLTextAreaElement = e.target;

                    const newValue = await action.apply({
                        value: target.value,
                        selection: lastSelection,
                    });

                    if (!newValue) {
                        return;
                    }

                    pushToHistory([newValue], {
                        lastSelection: isSelectionIsActive(lastSelection)
                            ? lastSelection
                            : null,
                        adjustSelection: true,
                    });
                }}
                autoFocus
            />
        </div>
    );
};

export default Editor;
