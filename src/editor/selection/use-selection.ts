import { useEffect, useRef, useState } from 'react';
import { EditorSelectionRange, HTMLElementWithSelection } from './types';

export default function useSelection() {
    const ref = useRef<HTMLElementWithSelection>();
    const currentSelection = useRef<EditorSelectionRange>();
    const [selection, updateSelection] = useState<EditorSelectionRange | null>(null);

    useEffect(() => {
        if (!selection || !ref.current) {
            return;
        }

        ref.current.focus();
        ref.current.setSelectionRange(selection.start, selection.end);

        updateSelection(null);
    }, [selection]);

    return { ref, updateSelection, currentSelection };
}
