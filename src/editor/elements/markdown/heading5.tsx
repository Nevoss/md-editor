import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface Heading5Element extends BaseElement {
    type: 'heading5';
}

export default ElementWrapper.create<Heading5Element>({
    type: 'heading5',
    regex: '^(##### ).*$',
    component: ({ children, attributes }) => <h5 {...attributes}>{children}</h5>,
});
