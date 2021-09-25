import React, { FC, useState } from 'react';
import Editor from './editor/editor';
import Preview from './preview/preview';

const App: FC = () => {
    const [value, setValue] = useState('');

    return (
        <div className="flex h-screen divide-x divide-gray-300">
            <div className="flex-1 max-w-">
                <Editor value={value} onChange={setValue} />
            </div>
            <div className="flex-1">
                <Preview value={value} />
            </div>
        </div>
    );
};

export default App;
