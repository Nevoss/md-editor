import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading4Element extends BaseElement {
    type: 'heading4';
}

export default ElementWrapper.create<Heading4Element>({
    type: 'heading4',
    regex: '^(#### ).{1,}$',
    indicatorOptions: {
        highlightLevel: 'light',
    },
    component: ({ children, attributes }) => <h4 {...attributes}>{children}</h4>,
});
