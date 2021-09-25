import React, { FC, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import useHistory from './use-history';
import useSelection from './use-selection';
import { SelectionRange } from './types';

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
    const [lastSelection, setLastSelection] = useState<SelectionRange | null>(
        null
    );
    const [localValue, setLocalValue] = useState(value || '');

    const pushToHistoryDebounced = useDebouncedCallback(
        (
            { value, selectionStart, selectionEnd }: HTMLTextAreaElement,
            currentLastSelection?: SelectionRange
        ) =>
            history.push(
                {
                    value,
                    selection: { start: selectionStart, end: selectionEnd },
                },
                currentLastSelection
            ),
        700
    );

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
            <div>
                <button onClick={() => history.undo()}> Undo </button>
                <button onClick={() => history.redo()}> Redo </button>
            </div>
            <textarea
                ref={(el) => (ref.current = el)}
                name="editor"
                id="editor"
                value={localValue}
                onChange={({ target }) => {
                    setLocalValue(target.value);
                    pushToHistoryDebounced(
                        target,
                        lastSelection.start !== lastSelection.end
                            ? lastSelection
                            : null
                    );
                }}
                onSelect={(e) => {
                    // @ts-ignore
                    const target: HTMLTextAreaElement = e.target;

                    setLastSelection({
                        start: target.selectionStart,
                        end: target.selectionEnd,
                    });
                }}
                className="w-full border-0 resize-none h-full focus:outline-none p-6 flex-1"
            />
        </div>
    );
};

export default Editor;
