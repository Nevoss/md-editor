import React, { FC, useMemo } from 'react';
import marked from 'marked';
import { useSlate } from 'slate-react';
import { transformDescendantsIntoString } from './utils';

const Preview: FC = () => {
    const editor = useSlate();

    const parsedValue = useMemo(() => {
        const textValue = transformDescendantsIntoString(editor, editor.children);

        return marked(textValue);
    }, [editor]);

    return (
        <div
            className="focus:outline-none"
            dangerouslySetInnerHTML={{ __html: parsedValue }}
            tabIndex={0}
        />
    );
};

export default Preview;
