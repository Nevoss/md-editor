import React from 'react';
import ElementWrapper from '../../core/elements/element-wrapper';
import { BaseElement } from '../../core/elements/types';
import { Text } from 'slate';

export interface IndicatorElement extends BaseElement {
    type: 'indicator';
    children: Text[];
}

export default ElementWrapper.create<IndicatorElement>({
    type: 'indicator',
    isInline: true,
    component: ({ children, attributes }) => (
        <span {...attributes} className="text-gray-300" style={{ fontSize: '0.8em' }}>
            {children}
        </span>
    ),
});