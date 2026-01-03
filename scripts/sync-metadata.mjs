import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const viewerRoot = path.resolve(scriptDir, '..')
const gameCodexRoot = path.resolve(viewerRoot, '..')

const categoryMap = new Map([
  ['00_Index', 'Index'],
  ['01_Creatures', 'Creatures'],
  ['02_Classes', 'Classes'],
  ['03_Abilities', 'Abilities'],
  ['04_Traits', 'Traits'],
  ['05_StatusEffects', 'StatusEffects'],
  ['06_World', 'World'],
  ['07_Systems', 'Systems'],
])

const EXCLUDE_DIRS = new Set(['viewer', 'assets', 'node_modules', '.git'])

const toSlug = (filename) =>
  filename
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toTitle = (filename) =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const readFrontmatter = (content) => {
  if (!content.startsWith('---')) return null
  const endIndex = content.indexOf('\n---', 3)
  if (endIndex === -1) return null
  const raw = content.slice(3, endIndex).trim()
  const body = content.slice(endIndex + 4)
  return { raw, body }
}

const parseFrontmatterLines = (raw) => {
  const lines = raw.split('\n')
  const data = new Map()
  const original = [...lines]

  lines.forEach((line) => {
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!match) return
    data.set(match[1], match[2])
  })

  return { data, original }
}

const formatFrontmatter = (lines) => `---\n${lines.join('\n')}\n---\n`

const ensureFrontmatter = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8')
  const stat = fs.statSync(filePath)
  const editedAt = stat.mtime.toISOString()

  const relative = path.relative(gameCodexRoot, filePath)
  const parts = relative.split(path.sep)
  const categoryFolder = parts[0]
  const filename = parts[parts.length - 1]
  const category = categoryMap.get(categoryFolder) ?? 'Unknown'
  const slug = toSlug(filename)
  const title = toTitle(filename)
  const id = `${category}_${slug}`.replace(/[^A-Za-z0-9_-]/g, '_')

  const existing = readFrontmatter(content)
  if (!existing) {
    const lines = [
      `id: ${id}`,
      `title: ${title}`,
      `category: ${category}`,
      `editedAt: ${editedAt}`,
      `updatedAt: ${editedAt}`,
    ]
    const updated = formatFrontmatter(lines) + content.trimStart()
    fs.writeFileSync(filePath, updated, 'utf8')
    return
  }

  const { data, original } = parseFrontmatterLines(existing.raw)
  const updatedLines = [...original]
  const setOrAppend = (key, value) => {
    const idx = updatedLines.findIndex((line) => line.startsWith(`${key}:`))
    if (idx === -1) {
      updatedLines.push(`${key}: ${value}`)
    } else {
      updatedLines[idx] = `${key}: ${value}`
    }
  }

  if (!data.has('id')) setOrAppend('id', id)
  if (!data.has('title')) setOrAppend('title', title)
  if (!data.has('category')) setOrAppend('category', category)
  setOrAppend('editedAt', editedAt)
  if (!data.has('createdAt')) {
    setOrAppend('createdAt', editedAt)
  }
  if (!data.has('updatedAt')) {
    setOrAppend('updatedAt', editedAt)
  }

  const updated = formatFrontmatter(updatedLines) + existing.body.replace(/^\n/, '')
  fs.writeFileSync(filePath, updated, 'utf8')
}

const walk = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) return
      walk(fullPath)
      return
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      ensureFrontmatter(fullPath)
    }
  })
}

walk(gameCodexRoot)
