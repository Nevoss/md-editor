import { useEffect, useRef, useState } from 'react';
import { EditorSelectionRange } from '../types';

interface HTMLElementWithSelection extends HTMLElement {
    setSelectionRange: (start: number, end: number) => void;
}

export default function useSelection() {
    const ref = useRef<HTMLElementWithSelection>();
    const [selection, updateSelection] = useState<EditorSelectionRange | null>(
        null
    );

    useEffect(() => {
        if (!selection || !ref.current) {
            return;
        }

        ref.current.focus();
        ref.current.setSelectionRange(selection.start, selection.end);

        updateSelection(null);
    }, [selection]);

    return { ref, updateSelection };
}
