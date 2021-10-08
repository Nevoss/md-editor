import { createEditor as createBaseEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { CombineEditor, OriginalEditor } from '../types';
import createNormalizeNode from './normalize-node/create-normalize-node';
import elements from '../elements';

export default function createEditor(): CombineEditor {
    const instance: OriginalEditor = withHistory(withReact(createBaseEditor()));

    instance.isInline = (element) => elements.find(({ type }) => type === element.type)?.isInline;
    instance.normalizeNode = createNormalizeNode(instance);

    return instance;
}
