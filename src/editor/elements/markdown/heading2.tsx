import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading2Element extends BaseElement {
    type: 'heading2';
}

export default ElementWrapper.create<Heading2Element>({
    type: 'heading2',
    regex: '^(## ).{1,}$',
    indicatorOptions: {
        highlightLevel: 'light',
    },
    component: ({ children, attributes }) => <h2 {...attributes}>{children}</h2>,
});
