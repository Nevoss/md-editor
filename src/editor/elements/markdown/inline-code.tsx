import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface InlineCodeElement extends BaseElement {
    type: 'inline-code';
}

export default ElementWrapper.create<InlineCodeElement>({
    type: 'inline-code',
    regex: '(`).{1,}(`)',
    isInline: true,
    indicatorOptions: {
        highlightLevel: 'strong',
    },
    component: ({ children, attributes }) => <code {...attributes}>{children}</code>,
});
