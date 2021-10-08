import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface ParagraphElement extends BaseElement {
    type: 'paragraph';
}

export default ElementWrapper.create<ParagraphElement>({
    type: 'paragraph',
    component: ({ children, attributes }) => <p {...attributes}>{children}</p>,
});
