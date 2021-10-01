import React, { FC, useMemo } from 'react';
import marked from 'marked';

interface PreviewProps {
    value: string;
}

const Preview: FC<PreviewProps> = ({ value }) => {
    const parsedValue = useMemo(() => marked(value), [value]);

    return (
        <div
            className="prose p-6"
            dangerouslySetInnerHTML={{ __html: parsedValue }}
        />
    );
};

export default Preview;
