import ElementWrapper from './element-wrapper';
import markdownElements from './markdown/index';
import miscElements from './misc/index';

export const INDICATOR_ELEMENT_TYPE = 'indicator';
export const DEFAULT_ELEMENT_TYPE = 'paragraph';

const elements: ElementWrapper[] = [...markdownElements, ...miscElements];

export default elements;
