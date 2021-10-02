import React from 'react';
import ElementWrapper from '../../core/elements/element-wrapper';
import { BaseElement } from '../../core/elements/types';

export interface Heading1Element extends BaseElement {
    type: 'heading1';
}

export default ElementWrapper.create<Heading1Element>({
    type: 'heading1',
    regex: '^(# ).*$',
    component: ({ children, attributes }) => <h1 {...attributes}>{children}</h1>,
});
