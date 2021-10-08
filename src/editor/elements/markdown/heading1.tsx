import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading1Element extends BaseElement {
    type: 'heading1';
}

export default ElementWrapper.create<Heading1Element>({
    type: 'heading1',
    regex: '^(# ).{1,}$',
    indicatorOptions: {
        highlightLevel: 'light',
    },
    component: ({ children, attributes }) => <h1 {...attributes}>{children}</h1>,
});
