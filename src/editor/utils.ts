import type { Descendant, Editor } from 'slate';
import { Element } from 'slate';

export function transformDescendantsIntoString(editor: Editor, descendants: Descendant[]): string {
    return descendants.reduce((carry: string, descendant: Descendant): string => {
        if (Element.isElement(descendant)) {
            const lineBreak = editor.isInline(descendant) ? '' : '\n';

            return carry + transformDescendantsIntoString(editor, descendant.children) + lineBreak;
        }

        return carry + descendant.text;
    }, '');
}
