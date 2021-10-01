import React from 'react';
import ElementWrapper from '../../core/elements/element-wrapper';
import { BaseElement } from '../../core/elements/types';

export interface BoldElement extends BaseElement {
    type: 'bold';
}

export default ElementWrapper.create<BoldElement>({
    type: 'bold',
    isInline: true,
    component: ({ children, attributes }) => <b {...attributes}>{children}</b>,
});
