import * as React from 'react';
import './styles/index.css';

import type { Content, Editor } from '@tiptap/react';
import type { UseMinimalTiptapEditorProps } from './hooks/use-minimal-tiptap';
import { EditorContent } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { SectionOne } from './components/section/one';
import { SectionTwo } from './components/section/two';
import { SectionThree } from './components/section/three';
import { SectionFour } from './components/section/four';
import { LinkBubbleMenu } from './components/bubble-menu/link-bubble-menu';
import { useMinimalTiptapEditor } from './hooks/use-minimal-tiptap';
import { MeasuredContainer } from './components/measured-container';

export interface MinimalTiptapProps extends Omit<UseMinimalTiptapEditorProps, 'onUpdate'> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
}

const Toolbar = ({ editor, className }: { editor: Editor; className?: string }) => (
  <div className={cn('border-border shrink-0 overflow-x-auto border-b p-2', className)}>
    <div className='flex w-max items-center gap-px'>
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation='vertical' className='mx-2 h-7' />

      <SectionTwo
        editor={editor}
        activeActions={['bold', 'italic', 'underline', 'strikethrough', 'code', 'clearFormatting']}
        mainActionCount={3}
      />

      <Separator orientation='vertical' className='mx-2 h-7' />

      <SectionThree editor={editor} />

      <Separator orientation='vertical' className='mx-2 h-7' />

      <SectionFour
        editor={editor}
        activeActions={['orderedList', 'bulletList']}
        mainActionCount={0}
      />
    </div>
  </div>
);

export const MinimalTiptapEditor = React.forwardRef<HTMLDivElement, MinimalTiptapProps>(
  ({ value, onChange, className, editorContentClassName, ...props }, ref) => {
    const editor = useMinimalTiptapEditor({
      value,
      onUpdate: onChange,
      ...props,
    });

    if (!editor) {
      return null;
    }

    const handleEditorClick = (e: React.MouseEvent) => {
      const isToolbarClick = (e.target as HTMLElement).closest('.tiptap-toolbar');

      if (editor && !editor.isFocused && !isToolbarClick) {
        editor.commands.focus('end');
      }
    };

    return (
      <MeasuredContainer
        as='div'
        name='editor'
        ref={ref}
        className={cn(
          'focus-within:border-primary flex h-auto min-h-72 w-full cursor-text flex-col rounded-md',
          className
        )}
        onClick={handleEditorClick}
      >
        <Toolbar editor={editor} className='tiptap-toolbar' />
        <EditorContent
          editor={editor}
          className={cn('minimal-tiptap-editor flex-grow cursor-text', editorContentClassName)}
          onClick={handleEditorClick}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    );
  }
);

MinimalTiptapEditor.displayName = 'MinimalTiptapEditor';

export default MinimalTiptapEditor;
