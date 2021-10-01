import { createEditor as createBaseEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { CombineEditor, OriginalEditor } from '../types';
import createNormalizeNode from './editor/create-normalize-node';
import ElementWrapper from './elements/element-wrapper';

export default function createEditor(elements: ElementWrapper[]): CombineEditor {
    const instance: OriginalEditor = withHistory(withReact(createBaseEditor()));

    instance.isInline = (element) => elements.find(({ type }) => type === element.type)?.isInline;
    instance.normalizeNode = createNormalizeNode(instance, elements);

    return instance;
}
