type CategoryDef = {
  key: string
  label: string
  folder: string
  path: string
}

export type WikiEntry = {
  categoryKey: string
  categoryLabel: string
  categoryPath: string
  title: string
  slug: string
  editedAt?: string
  updatedAt?: string
  createdAt?: string
  gallery?: string[]
  content: string
  sourcePath: string
}

export const CATEGORIES: CategoryDef[] = [
  { key: 'Index', label: 'Index', folder: '00_Index', path: 'index' },
  { key: 'Creatures', label: 'Creatures', folder: '01_Creatures', path: 'creatures' },
  { key: 'Classes', label: 'Classes', folder: '02_Classes', path: 'classes' },
  { key: 'Abilities', label: 'Abilities', folder: '03_Abilities', path: 'abilities' },
  { key: 'Traits', label: 'Traits', folder: '04_Traits', path: 'traits' },
  {
    key: 'StatusEffects',
    label: 'Status Effects',
    folder: '05_StatusEffects',
    path: 'status-effects',
  },
  { key: 'World', label: 'World', folder: '06_World', path: 'world' },
  { key: 'Systems', label: 'Systems', folder: '07_Systems', path: 'systems' },
]

const toSlug = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const toTitle = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

type FrontmatterData = Record<string, string | string[]>

const parseFrontmatter = (raw: string) => {
  if (!raw.startsWith('---')) return { data: {}, body: raw }
  const endIndex = raw.indexOf('\n---', 3)
  if (endIndex === -1) return { data: {}, body: raw }
  const header = raw.slice(3, endIndex).trim()
  const body = raw.slice(endIndex + 4).replace(/^\n/, '')
  const data: FrontmatterData = {}
  const lines = header.split('\n')
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const match = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/)
    if (!match) continue
    const key = match[1]
    const value = match[2]
    if (value === '') {
      const items: string[] = []
      let nextIndex = index + 1
      while (nextIndex < lines.length && /^\s*-\s+/.test(lines[nextIndex])) {
        items.push(lines[nextIndex].replace(/^\s*-\s+/, '').trim())
        nextIndex += 1
      }
      if (items.length > 0) {
        data[key] = items
        index = nextIndex - 1
        continue
      }
      data[key] = key === 'gallery' ? [] : ''
      continue
    }
    data[key] = value
  }
  return { data, body }
}

const stripLeadingTitle = (content: string, title: string) => {
  const trimmed = content.trimStart()
  const lines = trimmed.split('\n')
  if (lines[0]?.trim() === `# ${title}`) {
    return lines.slice(1).join('\n').trimStart()
  }
  return content
}

const loadEntries = (): WikiEntry[] => {
  const entries: WikiEntry[] = []
  const creatureImages = import.meta.glob<string>(
    './content/01_Creatures/*.{png,jpg,jpeg,webp}',
    {
      query: '?url',
      import: 'default',
      eager: true,
    },
  )
  const creatureImageUrls = Object.fromEntries(
    Object.entries(creatureImages).map(([sourcePath, url]) => [
      sourcePath.split('/').pop() ?? sourcePath,
      url,
    ]),
  )

  const sets: Array<[CategoryDef, Record<string, string>]> = [
    [
      CATEGORIES[0],
      import.meta.glob<string>('./content/00_Index/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[1],
      import.meta.glob<string>('./content/01_Creatures/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[2],
      import.meta.glob<string>('./content/02_Classes/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[3],
      import.meta.glob<string>('./content/03_Abilities/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[4],
      import.meta.glob<string>('./content/04_Traits/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[5],
      import.meta.glob<string>('./content/05_StatusEffects/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[6],
      import.meta.glob<string>('./content/06_World/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
    [
      CATEGORIES[7],
      import.meta.glob<string>('./content/07_Systems/*.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }),
    ],
  ]

  sets.forEach(([category, files]) => {
    Object.entries(files).forEach(([sourcePath, raw]) => {
      const filename = sourcePath.split('/').pop() ?? ''
      const slug = toSlug(filename)
      const fallbackTitle = toTitle(filename)
      const { data, body } = parseFrontmatter(raw)
      const title = (typeof data.title === 'string' ? data.title : undefined) || fallbackTitle
      const editedAt = typeof data.editedAt === 'string' ? data.editedAt : undefined
      const updatedAt = typeof data.updatedAt === 'string' ? data.updatedAt : undefined
      const createdAt = typeof data.createdAt === 'string' ? data.createdAt : undefined
      const rawGallery =
        Array.isArray(data.gallery) && data.gallery.length > 0
          ? data.gallery
          : typeof data.gallery === 'string' && data.gallery
            ? [data.gallery]
            : undefined
      const gallery =
        rawGallery?.map((item) => {
          const key = item.split('/').pop() ?? item
          return creatureImageUrls[key] ?? item
        }) ?? undefined
      const content = stripLeadingTitle(body, title)

      entries.push({
        categoryKey: category.key,
        categoryLabel: category.label,
        categoryPath: category.path,
        title,
        slug,
        editedAt,
        updatedAt,
        createdAt,
        gallery,
        content,
        sourcePath,
      })
    })
  })

  return entries
}

const allEntries = loadEntries()

export const entriesByCategory = CATEGORIES.reduce<Record<string, WikiEntry[]>>(
  (acc, category) => {
    const items = allEntries
      .filter((entry) => entry.categoryKey === category.key)
      .sort((a, b) => a.title.localeCompare(b.title))
    acc[category.key] = items
    return acc
  },
  {},
)

const lastEditedSort = (a: WikiEntry, b: WikiEntry) => {
  const aTime = a.editedAt ? new Date(a.editedAt).getTime() : 0
  const bTime = b.editedAt ? new Date(b.editedAt).getTime() : 0
  return bTime - aTime
}

export const lastEdited = [...allEntries].sort(lastEditedSort).slice(0, 10)

export const findEntry = (categoryPath: string, slug: string) => {
  const category = CATEGORIES.find(
    (entry) =>
      entry.path.toLowerCase() === categoryPath.toLowerCase() ||
      entry.key.toLowerCase() === categoryPath.toLowerCase(),
  )
  if (!category) return null
  return (
    allEntries.find(
      (entry) =>
        entry.categoryKey === category.key &&
        entry.slug.toLowerCase() === slug.toLowerCase(),
    ) ?? null
  )
}
