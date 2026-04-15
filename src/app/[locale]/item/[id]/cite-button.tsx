'use client'

import { useState } from 'react'
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react'

interface CiteButtonProps {
  id: string
  url: string
  hieraticNo: string
  hieroglyphNo: string
}

function CopySnippet({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="relative">
      <pre className="text-xs bg-muted rounded p-2 pr-8 whitespace-pre-wrap break-all leading-relaxed font-mono select-all">
        {text}
      </pre>
      <button
        onClick={handle}
        className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-background transition-colors"
        title="Copy"
      >
        {copied
          ? <Check className="w-3.5 h-3.5 text-green-500" />
          : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
    </div>
  )
}

export function CiteButton({ id, url, hieraticNo, hieroglyphNo }: CiteButtonProps) {
  const [open, setOpen] = useState(false)

  const accessDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  const signDesc = [
    hieraticNo && `Hieratic No. ${hieraticNo}`,
    hieroglyphNo && `Hieroglyph No. ${hieroglyphNo}`,
  ].filter(Boolean).join(', ')

  const chicago =
    `"Hieratische Paläographie DB, Item ${id}${signDesc ? ` (${signDesc})` : ''}." ` +
    `Accessed ${accessDate}. ${url}.`

  const bibtexKey = `hpdb${id}`
  const bibtex =
    `@misc{${bibtexKey},\n` +
    `  title        = {Hieratische Paläographie DB, Item ${id}},\n` +
    (signDesc ? `  note         = {${signDesc}},\n` : '') +
    `  howpublished = {\\url{${url}}},\n` +
    `  year         = {${new Date().getFullYear()}},\n` +
    `  urldate      = {${new Date().toISOString().slice(0, 10)}}\n` +
    `}`

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-left"
      >
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        Cite this item
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 font-medium">
              Chicago (recommended)
            </p>
            <CopySnippet text={chicago} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1 font-medium">
              BibTeX
            </p>
            <CopySnippet text={bibtex} />
          </div>
        </div>
      )}
    </div>
  )
}

export function CopyUrlButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      title="Copy URL"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
    </button>
  )
}
