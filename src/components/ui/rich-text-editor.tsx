"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
      onChange(editorRef.current.innerHTML)
    }
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (!selection || !editorRef.current) return

    const range = selection.getRangeAt(0)
    const heading = document.createElement(`h${level}`)
    heading.className = level === 1 ? 'text-2xl font-bold' : level === 2 ? 'text-xl font-bold' : 'text-lg font-semibold'

    try {
      range.surroundContents(heading)
      onChange(editorRef.current.innerHTML)
    } catch (e) {
      // If selection spans multiple nodes, just format as heading
      execCommand('formatBlock', `h${level}`)
    }
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => execCommand("bold")}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => execCommand("italic")}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-8 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertHeading(1)}
          className="h-8 w-8 p-0"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertHeading(2)}
          className="h-8 w-8 p-0"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertHeading(3)}
          className="h-8 w-8 p-0"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px h-8 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => execCommand("insertUnorderedList")}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => execCommand("insertOrderedList")}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-3 min-h-[150px] focus:outline-none prose prose-sm max-w-none"
        data-placeholder={placeholder}
        style={{
          wordBreak: 'break-word',
        }}
      />

      <style jsx>{`
        div[contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
