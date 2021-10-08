import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface ItalicElement extends BaseElement {
    type: 'italic';
}

export default ElementWrapper.create<ItalicElement>({
    type: 'italic',
    regex: ['(\\*).*(\\*)', '(_).*(_)'],
    isInline: true,
    component: ({ children, attributes }) => <i {...attributes}>{children}</i>,
});
