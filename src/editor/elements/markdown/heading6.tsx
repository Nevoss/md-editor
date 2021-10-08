import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading6Element extends BaseElement {
    type: 'heading6';
}

export default ElementWrapper.create<Heading6Element>({
    type: 'heading6',
    regex: '^(###### ).{1,}$',
    component: ({ children, attributes }) => <h6 {...attributes}>{children}</h6>,
});
