import ElementWrapper from '../element-wrapper';
import paragraph from './paragraph';
import heading1 from './heading1';
import heading2 from './heading2';
import heading3 from './heading3';
import heading4 from './heading4';
import heading5 from './heading5';
import heading6 from './heading6';
import bold from './bold';
import italic from './italic';
import inlineCode from './inline-code';

const elements: ElementWrapper[] = [
    paragraph,
    heading1,
    heading2,
    heading3,
    heading4,
    heading5,
    heading6,
    bold,
    italic,
    inlineCode,
];

export default elements;
