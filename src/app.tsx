import React, { FC } from 'react';
import MDEditor from './editor/md-editor';

const App: FC = () => {
    return (
        <div className="h-screen">
            <MDEditor />
        </div>
    );
};

export default App;
