import React from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement } from '../types';

export interface BoldElement extends BaseElement {
    type: 'bold';
}

export default ElementWrapper.create<BoldElement>({
    type: 'bold',
    regex: '(\\*\\*).*(\\*\\*)',
    isInline: true,
    component: ({ children, attributes }) => <b {...attributes}>{children}</b>,
});
