import transformIntoInlineElement from './transform-into-inline-element';
import transformIntoDefaultElement from './transform-into-default-element';
import { normalizeFunction } from '../types';
import transformIntoBlockElement from './transform-into-block-element';

const normalizeFunctions: normalizeFunction[] = [
    transformIntoBlockElement,
    transformIntoInlineElement,
    transformIntoDefaultElement,
];

export default normalizeFunctions;
