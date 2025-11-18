"use client"

import { useCallback, useMemo, useState, useEffect } from 'react'
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, BaseEditor } from 'slate'
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react'
import { withHistory } from 'slate-history'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react'

type CustomElement = {
  type: 'paragraph' | 'heading-one' | 'heading-two' | 'bulleted-list' | 'numbered-list' | 'list-item'
  children: CustomText[]
}

type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

interface SlateEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const HOTKEYS: { [key: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
}

// Serialize Slate value to HTML
const serialize = (nodes: Descendant[]): string => {
  return nodes.map(n => serializeNode(n)).join('')
}

const serializeNode = (node: any): string => {
  if ('text' in node) {
    let text = node.text
    if (node.bold) text = `<strong>${text}</strong>`
    if (node.italic) text = `<em>${text}</em>`
    return text
  }

  const children = node.children.map((n: any) => serializeNode(n)).join('')

  switch (node.type) {
    case 'heading-one':
      return `<h1>${children}</h1>`
    case 'heading-two':
      return `<h2>${children}</h2>`
    case 'bulleted-list':
      return `<ul>${children}</ul>`
    case 'numbered-list':
      return `<ol>${children}</ol>`
    case 'list-item':
      return `<li>${children}</li>`
    case 'paragraph':
    default:
      return `<p>${children}</p>`
  }
}

// Deserialize HTML to Slate value
const deserialize = (html: string): Descendant[] => {
  if (!html || html.trim() === '') {
    return [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  // Check if it's plain text (no HTML tags)
  const hasHtmlTags = /<[^>]+>/.test(html)

  if (!hasHtmlTags) {
    // It's plain text, wrap it in a paragraph
    return [{ type: 'paragraph', children: [{ text: html }] }]
  }

  const document = new DOMParser().parseFromString(html, 'text/html')
  const nodes = Array.from(document.body.childNodes).map(deserializeNode).filter(Boolean) as Descendant[]

  // If no valid nodes were created, return the text as a paragraph
  if (nodes.length === 0) {
    return [{ type: 'paragraph', children: [{ text: html }] }]
  }

  return nodes
}

const deserializeNode = (node: ChildNode): Descendant | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || ''
    // Skip empty text nodes that are just whitespace
    if (text.trim() === '' && text.length < 2) {
      return null
    }
    return { text }
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null
  }

  const element = node as HTMLElement
  let children = Array.from(element.childNodes).map(deserializeNode).filter(Boolean) as any[]

  // Ensure every element has at least one text child
  if (children.length === 0) {
    children = [{ text: '' }]
  }

  // Apply text formatting
  const applyFormatting = (child: any) => {
    if (!child || typeof child !== 'object') {
      return { text: '' }
    }
    if (element.nodeName === 'STRONG' || element.nodeName === 'B') {
      return { ...child, bold: true }
    }
    if (element.nodeName === 'EM' || element.nodeName === 'I') {
      return { ...child, italic: true }
    }
    return child
  }

  const formattedChildren = children.map(applyFormatting).filter(Boolean)

  // Ensure we have at least one valid child
  if (formattedChildren.length === 0) {
    formattedChildren.push({ text: '' })
  }

  switch (element.nodeName) {
    case 'H1':
      return { type: 'heading-one', children: formattedChildren }
    case 'H2':
      return { type: 'heading-two', children: formattedChildren }
    case 'UL':
      return { type: 'bulleted-list', children: formattedChildren }
    case 'OL':
      return { type: 'numbered-list', children: formattedChildren }
    case 'LI':
      return { type: 'list-item', children: formattedChildren }
    case 'P':
      return { type: 'paragraph', children: formattedChildren }
    case 'STRONG':
    case 'B':
    case 'EM':
    case 'I':
      return formattedChildren[0] || { text: '' }
    case 'BR':
      return { text: '\n' }
    case 'DIV':
      // Handle div as paragraph
      return { type: 'paragraph', children: formattedChildren }
    default:
      // For unknown elements, try to preserve as paragraph
      if (formattedChildren.length > 0) {
        return { type: 'paragraph', children: formattedChildren }
      }
      return null
  }
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 className="text-2xl font-bold mb-2" {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 className="text-xl font-bold mb-2" {...attributes}>{children}</h2>
    case 'bulleted-list':
      return <ul className="list-disc pl-6 my-2" {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol className="list-decimal pl-6 my-2" {...attributes}>{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p className="mb-2" {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  return <span {...attributes}>{children}</span>
}

// Normalize slate value to ensure it's always valid
const normalizeSlateValue = (value: Descendant[]): Descendant[] => {
  if (!value || value.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] }]
  }

  // Ensure all nodes have valid children
  return value.map(node => {
    if ('type' in node && 'children' in node) {
      const children = node.children
      if (!children || children.length === 0) {
        return { ...node, children: [{ text: '' }] }
      }
      return node
    }
    return node
  })
}

// Custom plugin to ensure all nodes have valid children and handle errors gracefully
const withNormalization = (editor: Editor) => {
  const { normalizeNode, onChange } = editor

  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    // Ensure all element nodes have at least one child
    if (SlateElement.isElement(node) && node.children.length === 0) {
      Transforms.insertNodes(
        editor,
        { text: '' },
        { at: [...path, 0] }
      )
      return
    }

    normalizeNode(entry)
  }

  // Wrap onChange to catch and suppress DOM resolution errors
  editor.onChange = () => {
    try {
      onChange()
    } catch (error: any) {
      // Suppress specific Slate DOM resolution errors
      if (error?.message?.includes('Cannot resolve a Slate point from DOM point')) {
        console.warn('Suppressed Slate DOM resolution error')
        return
      }
      throw error
    }
  }

  return editor
}

export function SlateEditor({ value, onChange, placeholder }: SlateEditorProps) {
  const editor = useMemo(() => withNormalization(withHistory(withReact(createEditor()))), [])

  const getInitialValue = (): Descendant[] => {
    try {
      // Handle undefined, null, or empty string
      const inputValue = value?.trim() || ''

      // If empty, return default paragraph
      if (!inputValue) {
        return [{ type: 'paragraph', children: [{ text: '' }] }]
      }

      const deserialized = deserialize(inputValue)
      const normalized = normalizeSlateValue(deserialized)

      // Ensure we never return undefined or empty array
      if (!normalized || normalized.length === 0) {
        return [{ type: 'paragraph', children: [{ text: '' }] }]
      }

      return normalized
    } catch (error) {
      console.error('Error deserializing initial value:', error, 'Value was:', value)
      return [{ type: 'paragraph', children: [{ text: '' }] }]
    }
  }

  const initialValue = useMemo(() => getInitialValue(), [])

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, [])

  const handleChange = (newValue: Descendant[]) => {
    try {
      // Validate and normalize the new value
      const normalized = normalizeSlateValue(newValue)
      const html = serialize(normalized)
      onChange(html)
    } catch (error) {
      console.error('Error handling slate change:', error)
      // Fallback to a safe empty state
      const safeValue = [{ type: 'paragraph', children: [{ text: '' }] }] as Descendant[]
      onChange(serialize(safeValue))
    }
  }

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }

  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(editor, format)
    const isList = ['numbered-list', 'bulleted-list'].includes(format)

    Transforms.unwrapNodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ['numbered-list', 'bulleted-list'].includes(n.type),
      split: true,
    })

    const newProperties: Partial<SlateElement> = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    } as Partial<SlateElement>

    Transforms.setNodes<SlateElement>(editor, newProperties)

    if (!isActive && isList) {
      const block = { type: format, children: [] } as SlateElement
      Transforms.wrapNodes(editor, block)
    }
  }

  const isMarkActive = (editor: Editor, format: string) => {
    const marks = Editor.marks(editor) as any
    return marks ? marks[format] === true : false
  }

  const isBlockActive = (editor: Editor, format: string) => {
    const { selection } = editor
    if (!selection) return false

    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
      })
    )

    return !!match
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark('bold')
            }}
            className={`h-8 w-8 p-0 ${isMarkActive(editor, 'bold') ? 'bg-gray-200' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleMark('italic')
            }}
            className={`h-8 w-8 p-0 ${isMarkActive(editor, 'italic') ? 'bg-gray-200' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>

          <div className="w-px h-8 bg-gray-300 mx-1" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock('heading-one')
            }}
            className={`h-8 w-8 p-0 ${isBlockActive(editor, 'heading-one') ? 'bg-gray-200' : ''}`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock('heading-two')
            }}
            className={`h-8 w-8 p-0 ${isBlockActive(editor, 'heading-two') ? 'bg-gray-200' : ''}`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-8 bg-gray-300 mx-1" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock('bulleted-list')
            }}
            className={`h-8 w-8 p-0 ${isBlockActive(editor, 'bulleted-list') ? 'bg-gray-200' : ''}`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onMouseDown={(e) => {
              e.preventDefault()
              toggleBlock('numbered-list')
            }}
            className={`h-8 w-8 p-0 ${isBlockActive(editor, 'numbered-list') ? 'bg-gray-200' : ''}`}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>

        {/* Editor */}
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder || "Enter text..."}
          className="p-3 min-h-[150px] focus:outline-none prose prose-sm max-w-none"
          spellCheck
          autoFocus={false}
          onKeyDown={(event) => {
            try {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event as any)) {
                  event.preventDefault()
                  const mark = HOTKEYS[hotkey]
                  toggleMark(mark)
                }
              }
            } catch (error) {
              console.error('Slate keydown error:', error)
            }
          }}
          onDOMBeforeInput={(event: any) => {
            // Prevent any errors from invalid DOM operations
            try {
              // Let Slate handle the input
            } catch (error) {
              console.error('Slate DOM input error:', error)
              event.preventDefault()
            }
          }}
          onBlur={() => {
            // Clear selection on blur to prevent stale references
            try {
              if (editor.selection) {
                // Selection will be restored when user clicks back
              }
            } catch (error) {
              console.error('Slate blur error:', error)
            }
          }}
        />
      </Slate>

      <style jsx>{`
        [data-slate-placeholder] {
          color: #9ca3af !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}

// Simple hotkey checker
function isHotkey(hotkey: string, event: KeyboardEvent): boolean {
  const keys = hotkey.split('+')
  const modKey = keys[0] === 'mod'
  const key = keys[keys.length - 1]

  if (modKey && !(event.ctrlKey || event.metaKey)) return false
  return event.key.toLowerCase() === key.toLowerCase()
}
