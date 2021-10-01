import type { RenderElementProps } from 'slate-react';
import type { Descendant } from 'slate';
import React, { FC, useEffect, useState } from 'react';
import { Slate, Editable } from 'slate-react';
import elements from './elements';
import { CombineEditor } from './types';
import { Transforms } from 'slate';
import createEditor from './core/create-editor';
import keyboardCommands from './keyboard-commands';
import { DEFAULT_ELEMENT_TYPE } from './core/elements';

const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

const exampleValue: Descendant[] = [
    { type: 'paragraph', children: [{ text: '# Some text' }] },
    { type: 'paragraph', children: [{ text: '## H2' }] },
    { type: 'paragraph', children: [{ text: '### H3' }] },
    { type: 'paragraph', children: [{ text: '#### H4' }] },
    { type: 'paragraph', children: [{ text: '##### H5' }] },
    { type: 'paragraph', children: [{ text: '###### H6' }] },
    { type: 'paragraph', children: [{ text: '' }] },
    {
        type: 'paragraph',
        children: [
            { text: 'Text is good ' },
            { type: 'bold', children: [{ text: '**BOLD**' }] },
            { text: ' yeah it is' },
        ],
    },
    { type: 'paragraph', children: [{ text: '' }] },
    {
        type: 'paragraph',
        children: [{ text: 'Some text here with **bold** value and *italic* value and `Code`' }],
    },
    { type: 'paragraph', children: [{ text: '' }] },
    { type: 'paragraph', children: [{ text: '- Option 1' }] },
    { type: 'paragraph', children: [{ text: '- Option 2' }] },
    { type: 'paragraph', children: [{ text: '- Option 3' }] },
    { type: 'paragraph', children: [{ text: '' }] },
    { type: 'paragraph', children: [{ text: '1. a' }] },
    { type: 'paragraph', children: [{ text: '2. b' }] },
    { type: 'paragraph', children: [{ text: '3. c' }] },
    { type: 'paragraph', children: [{ text: '' }] },
    { type: 'paragraph', children: [{ text: '[] To' }] },
    { type: 'paragraph', children: [{ text: '[] do' }] },
    { type: 'paragraph', children: [{ text: '' }] },
    { type: 'paragraph', children: [{ text: 'Multi line code:' }] },
    { type: 'paragraph', children: [{ text: '```' }] },
    { type: 'paragraph', children: [{ text: 'const a = 1;' }] },
    { type: 'paragraph', children: [{ text: '```' }] },
];

const renderElement = (props: RenderElementProps): JSX.Element => {
    const ElementComponent =
        elements.find((element) => props.element.type === element.type).component ||
        elements.find(() => props.element.type === DEFAULT_ELEMENT_TYPE).component;

    return <ElementComponent {...props} />;
};

const editor: CombineEditor = createEditor(elements);

const MDEditor: FC = () => {
    const [value, setValue] = useState<Descendant[]>(initialValue);

    useEffect(() => {
        Transforms.removeNodes(editor, { at: [0] });
        Transforms.insertNodes(editor, exampleValue);
    }, []);

    return (
        <Slate editor={editor} value={value} onChange={setValue}>
            <div className="h-full py-12 px-8 mx-auto prose prose-lg max-w-4xl ">
                <Editable
                    renderElement={renderElement}
                    onKeyDown={(e) => {
                        const keyboardCommand = keyboardCommands.find((action) =>
                            action.shouldApply(e)
                        );

                        if (!keyboardCommand) {
                            return;
                        }

                        e.preventDefault();
                        e.stopPropagation();

                        keyboardCommand.apply(editor);
                    }}
                    autoFocus
                />
            </div>
        </Slate>
    );
};

export default MDEditor;