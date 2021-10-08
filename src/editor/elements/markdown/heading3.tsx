import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading3Element extends BaseElement {
    type: 'heading3';
}

export default ElementWrapper.create<Heading3Element>({
    type: 'heading3',
    regex: '^(### ).{1,}$',
    indicatorOptions: {
        highlightLevel: 'light',
    },
    component: ({ children, attributes }) => <h3 {...attributes}>{children}</h3>,
});
