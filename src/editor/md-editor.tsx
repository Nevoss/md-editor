import type { RenderElementProps } from 'slate-react';
import type { Descendant } from 'slate';
import React, { FC, useEffect, useState } from 'react';
import { Slate, Editable } from 'slate-react';
import elements, { DEFAULT_ELEMENT_TYPE } from './elements';
import { CombineEditor } from './types';
import { Transforms } from 'slate';
import createEditor from './core/create-editor';
import keyboardCommands from './keyboard-commands';

const initialValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];

const exampleValue: Descendant[] = [
    // {
    //     type: 'heading1',
    //     children: [{ type: 'indicator', children: [{ text: '# ' }] }, { text: 'This is heading' }],
    // },
    { type: 'paragraph', children: [{ text: '# H1' }] },
    // { type: 'paragraph', children: [{ text: '## H2' }] },
    // { type: 'paragraph', children: [{ text: '### H3' }] },
    // { type: 'paragraph', children: [{ text: '#### H4' }] },
    // { type: 'paragraph', children: [{ text: '##### H5' }] },
    // { type: 'paragraph', children: [{ text: '###### H6' }] },
    // { type: 'paragraph', children: [{ text: '' }] },
    // { type: 'paragraph', children: [{ text: 'This is a test **bold** and this is a `code`' }] },
    // { type: 'paragraph', children: [{ text: '' }] },
    // {
    //     type: 'paragraph',
    //     children: [
    //         { text: 'Text is good ' },
    //         { type: 'bold', children: [{ text: '**BOLD**' }] },
    //         { text: ' yeah it is' },
    //     ],
    // },
    // {
    //     type: 'paragraph',
    //     children: [{ text: 'Some text here with **bold** value and *italic* value and `Code`' }],
    // },
    // { type: 'paragraph', children: [{ text: '' }] },
    // { type: 'paragraph', children: [{ text: '- Option 1' }] },
    // { type: 'paragraph', children: [{ text: '- Option 2' }] },
    // { type: 'paragraph', children: [{ text: '- Option 3' }] },
    // { type: 'paragraph', children: [{ text: '' }] },
    // { type: 'paragraph', children: [{ text: '1. a' }] },
    // { type: 'paragraph', children: [{ text: '2. b' }] },
    // { type: 'paragraph', children: [{ text: '3. c' }] },
    // { type: 'paragraph', children: [{ text: '' }] },
    // { type: 'paragraph', children: [{ text: '[] To' }] },
    // { type: 'paragraph', children: [{ text: '[] do' }] },
    // { type: 'paragraph', children: [{ text: '' }] },
    // { type: 'paragraph', children: [{ text: 'Multi line code:' }] },
    // { type: 'paragraph', children: [{ text: '```' }] },
    // { type: 'paragraph', children: [{ text: 'const a = 1;' }] },
    // { type: 'paragraph', children: [{ text: '```' }] },
];

const renderElement = (props: RenderElementProps): JSX.Element => {
    const ElementComponent =
        elements.find((element) => props.element.type === element.type).component ||
        elements.find(() => props.element.type === DEFAULT_ELEMENT_TYPE).component;

    return <ElementComponent {...props} />;
};

const editor: CombineEditor = createEditor();

const MDEditor: FC = () => {
    const [value, setValue] = useState<Descendant[]>(initialValue);

    useEffect(() => {
        Transforms.removeNodes(editor, { at: [0] });
        Transforms.insertNodes(editor, exampleValue);
    }, []);

    return (
        <div className="h-full overflow-y-auto">
            <Slate editor={editor} value={value} onChange={setValue}>
                <div className="py-16 px-8 mx-auto max-w-4xl prose prose-editor">
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
        </div>
    );
};

export default MDEditor;
