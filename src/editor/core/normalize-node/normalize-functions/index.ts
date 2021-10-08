import transformIntoInlineElement from './transform-into-inline-element';
import transformIntoDefaultElement from './transform-into-default-element';
import transformIntoBlockElement from './transform-into-block-element';
import avoidWritingAfterIndicators from './avoid-writing-after-indicators';
import avoidWritingBeforeIndicators from './avoid-writing-before-indicators';
import { normalizeFunction } from '../types';

const normalizeFunctions: normalizeFunction[] = [
    transformIntoBlockElement,
    transformIntoInlineElement,
    transformIntoDefaultElement,
    avoidWritingAfterIndicators,
    avoidWritingBeforeIndicators,
];

export default normalizeFunctions;
