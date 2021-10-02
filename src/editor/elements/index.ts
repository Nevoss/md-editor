import ElementWrapper from '../core/elements/element-wrapper';
import markdownElements from './markdown/index';
import miscElements from './misc/index';

const elements: ElementWrapper[] = [...markdownElements, ...miscElements];

export default elements;
