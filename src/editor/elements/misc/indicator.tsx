import React, { useMemo } from 'react';
import ElementWrapper from '../element-wrapper';
import { BaseElement, indicatorHighlightLevel } from '../types';
import { Text } from 'slate';

export interface IndicatorElement extends BaseElement {
    type: 'indicator';
    children: Text[];
    highlightLevel?: indicatorHighlightLevel;
    value?: string;
    position?: 'before' | 'after';
}

const classNames = {
    light: 'text-gray-300',
    normal: 'text-gray-400',
    strong: 'text-gray-800',
};

export default ElementWrapper.create<IndicatorElement>({
    type: 'indicator',
    isInline: true,
    component: ({ children, attributes, element }) => {
        const className = useMemo(
            () => classNames[element.highlightLevel || 'normal'],
            [element.highlightLevel]
        );

        return (
            <span
                {...attributes}
                className={className}
                style={{ fontSize: element.highlightLevel === 'strong' ? '1em' : '0.8em' }}
            >
                {children}
            </span>
        );
    },
});
