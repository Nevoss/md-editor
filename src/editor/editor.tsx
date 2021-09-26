import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useHistory from './use-history';
import useSelection from './use-selection';
import {
    EditorKeyboardEvent,
    EditorSelectionRange,
    EditorValue,
} from './types';

interface OnChangeFunction {
    (value: string): void;
}

interface EditorProps {
    value: string;
    onChange: OnChangeFunction;
}

const Editor: FC<EditorProps> = ({ value, onChange }) => {
    const history = useHistory();
    const { ref, updateSelection } = useSelection();
    const [localValue, setLocalValue] = useState(value || '');
    const [lastSelection, setLastSelection] =
        useState<EditorSelectionRange | null>(null);

    const keyboardActions = [
        {
            shouldApply: (e: EditorKeyboardEvent) =>
                e.ctrlKey && !e.shiftKey && e.code === 'KeyZ',
            apply: history.undo,
        },
        {
            shouldApply: (e: EditorKeyboardEvent) =>
                e.ctrlKey && e.shiftKey && e.code === 'KeyZ',
            apply: history.redo,
        },
    ];

    const pushToHistory = useCallback(
        (values: EditorValue[], LastItemSelection?: EditorSelectionRange) =>
            history.push(values, LastItemSelection),
        [history.push]
    );

    const pushToHistoryDebounced = useDebouncedCallback(pushToHistory, 700);

    useEffect(() => {
        const { current, lastAction } = history.state;
        const active = current[0];
        const value = active?.value || '';

        setLocalValue(value);
        onChange(value);

        if (['undo', 'redo'].includes(lastAction) && active) {
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

                    if (lastSelection.start !== lastSelection.end) {
                        pushToHistory([editorValue], lastSelection);

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
                onKeyDown={(e) => {
                    const action = keyboardActions.find((action) =>
                        action.shouldApply(e)
                    );

                    if (!action) {
                        return;
                    }

                    e.preventDefault();
                    e.stopPropagation();

                    action.apply();
                }}
                autoFocus
            />
        </div>
    );
};

export default Editor;
