import {
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import { CATEGORIES, entriesByCategory, findEntry, lastEdited } from './wikiIndex'
import { navigate, useRoute } from './router'

const HOME_SLUG = 'home'

const formatDate = (value?: string) => {
  if (!value) return 'unknown'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const splitGeneralContent = (content: string) => {
  const match = content.match(/\n---\s*\n/)
  if (!match || match.index === undefined) {
    return { general: content, rest: '' }
  }
  const general = content.slice(0, match.index).trimEnd()
  const rest = content.slice(match.index + match[0].length).trimStart()
  return { general, rest }
}

const LinkButton = ({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) => (
  <a
    href={to}
    className={className}
    onClick={(event) => {
      event.preventDefault()
      navigate(to)
    }}
  >
    {children}
  </a>
)

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('')
  }
  if (isValidElement(node)) {
    return extractText(node.props.children)
  }
  return ''
}

const slugifyHeading = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

function App() {
  const route = useRoute()
  const currentCategory =
    route.kind === 'entry'
      ? CATEGORIES.find((category) => category.path === route.categoryPath) ??
        CATEGORIES[0]
      : CATEGORIES[0]
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})

  const homeEntry = useMemo(() => findEntry('index', HOME_SLUG), [])
  const entry = useMemo(() => {
    if (route.kind !== 'entry') return null
    return findEntry(route.categoryPath, route.slug)
  }, [route])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [tocItems, setTocItems] = useState<Array<{ id: string; label: string }>>([])
  const galleryImages = entry?.gallery ?? []
  const hasGalleryCard = entry?.gallery !== undefined
  const hasGalleryImages = galleryImages.length > 0
  const contentRef = useRef<HTMLDivElement | null>(null)

  const lastEditedItems = useMemo(
    () => lastEdited.filter((item) => item.slug !== HOME_SLUG),
    [],
  )

  const generalContent = useMemo(() => {
    if (!entry || !hasGalleryCard) return null
    return splitGeneralContent(entry.content)
  }, [entry, hasGalleryCard])

  useEffect(() => {
    setLightboxIndex(null)
  }, [route])

  useEffect(() => {
    if (!currentCategory) return
    setOpenCategories((prev) => ({
      ...prev,
      [currentCategory.key]: true,
    }))
  }, [currentCategory])

  useEffect(() => {
    if (!entry || !contentRef.current) {
      setTocItems([])
      return
    }
    const headings = Array.from(contentRef.current.querySelectorAll('h2[id]'))
    const items = headings
      .map((heading) => ({
        id: heading.id,
        label: heading.textContent?.trim() ?? '',
      }))
      .filter((item) => item.label.length > 0)
    setTocItems(items)
  }, [entry, route, hasGalleryCard])

  useEffect(() => {
    if (lightboxIndex === null) return undefined
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null)
        return
      }
      if (!hasGalleryImages) return
      if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? prev : (prev + 1) % galleryImages.length,
        )
      }
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? prev
            : (prev - 1 + galleryImages.length) % galleryImages.length,
        )
      }
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [lightboxIndex, hasGalleryImages, galleryImages.length])

  const showPrev = () => {
    if (!hasGalleryImages) return
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev - 1 + galleryImages.length) % galleryImages.length,
    )
  }

  const showNext = () => {
    if (!hasGalleryImages) return
    setLightboxIndex((prev) =>
      prev === null ? prev : (prev + 1) % galleryImages.length,
    )
  }

  const slugCounts = new Map<string, number>()
  const getHeadingId = (value: string) => {
    const base = slugifyHeading(value) || 'section'
    const count = slugCounts.get(base) ?? 0
    slugCounts.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
  const markdownComponents = {
    h2: ({ children, ...props }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) => {
      const id = getHeadingId(extractText(children))
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      )
    },
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-title">Game Codex</div>
        <LinkButton
          to="/"
          className={`home-link ${route.kind === 'home' ? 'active' : ''}`}
        >
          Home
        </LinkButton>
        <div className="sidebar-section">Categories</div>
        <nav>
          {CATEGORIES.map((category) => (
            <div key={category.key} className="category">
              <button
                type="button"
                className={`category-label category-toggle ${
                  currentCategory?.key === category.key ? 'active' : ''
                }`}
                onClick={() =>
                  setOpenCategories((prev) => ({
                    ...prev,
                    [category.key]: !prev[category.key],
                  }))
                }
                aria-expanded={!!openCategories[category.key]}
              >
                {category.label}
              </button>
              <div
                className={`entry-list ${
                  openCategories[category.key] ? 'entry-list-open' : 'entry-list-closed'
                }`}
              >
                {(category.key === 'Index'
                  ? entriesByCategory[category.key]?.filter(
                      (item) => item.slug !== HOME_SLUG,
                    )
                  : entriesByCategory[category.key]
                )?.map((item) => (
                  <LinkButton
                    key={item.slug}
                    to={`/${category.path}/${item.slug}`}
                    className={`entry-link ${
                      route.kind === 'entry' &&
                      route.slug === item.slug &&
                      route.categoryPath === category.path
                        ? 'active'
                        : ''
                    }`}
                  >
                    {item.title}
                  </LinkButton>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="content">
        {route.kind === 'home' && (
          <section className="panel">
            {homeEntry && (
              <div className="home-panel">
                <div className="home-title">{homeEntry.title}</div>
                <article className="markdown">
                  <ReactMarkdown>{homeEntry.content}</ReactMarkdown>
                </article>
              </div>
            )}
            <h1>Last edited</h1>
            <div className="muted">Most recently updated entries.</div>
            <div className="last-edited-list">
              {lastEditedItems.map((item) => (
                <LinkButton
                  key={`${item.categoryKey}-${item.slug}`}
                  to={`/${item.categoryPath}/${item.slug}`}
                  className="last-edited-item"
                >
                  <div className="last-edited-title">{item.title}</div>
                  <div className="last-edited-meta">
                    <span>{item.categoryLabel}</span>
                    <span>{formatDate(item.editedAt)}</span>
                  </div>
                </LinkButton>
              ))}
            </div>
          </section>
        )}
        {route.kind === 'entry' && entry && (
          <section className="panel">
            <div className="entry-header">
              <div>
                <div className="entry-title">{entry.title}</div>
                <div className="entry-meta">
                  <span>Edited: {formatDate(entry.editedAt)}</span>
                  <span>Created: {formatDate(entry.createdAt)}</span>
                </div>
              </div>
              <div className="entry-category">{entry.categoryLabel}</div>
            </div>
            {tocItems.length > 0 && (
              <div className="toc-card">
                <div className="toc-title">Inhaltsverzeichnis</div>
                <div className="toc-list">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="toc-link"
                      onClick={() => {
                        const target = document.getElementById(item.id)
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={contentRef}>
              {hasGalleryCard && generalContent ? (
                <>
                <div className="general-layout">
                  <div className="markdown">
                    <ReactMarkdown components={markdownComponents}>
                      {generalContent.general}
                    </ReactMarkdown>
                  </div>
                  <div className="gallery-card">
                    <div className="gallery-title">Gallery</div>
                    {hasGalleryImages ? (
                      <div className="gallery-grid">
                        {galleryImages.map((image, index) => (
                          <button
                            type="button"
                            key={image}
                            className="gallery-thumb"
                            onClick={() => setLightboxIndex(index)}
                          >
                            <img src={image} alt={`${entry.title} ${index + 1}`} />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="gallery-empty">Keine Bilder verfügbar</div>
                    )}
                  </div>
                </div>
                {generalContent.rest && (
                  <article className="markdown">
                    <ReactMarkdown components={markdownComponents}>
                      {generalContent.rest}
                    </ReactMarkdown>
                  </article>
                )}
                </>
              ) : (
              <article className="markdown">
                <ReactMarkdown components={markdownComponents}>
                  {entry.content}
                </ReactMarkdown>
              </article>
            )}
            </div>
          </section>
        )}
        {route.kind === 'entry' && !entry && (
          <section className="panel">
            <h1>Entry not found</h1>
            <p className="muted">Select another item from the sidebar.</p>
          </section>
        )}
      </main>
      {lightboxIndex !== null && hasGalleryImages && (
        <div className="lightbox" onClick={() => setLightboxIndex(null)}>
          <div className="lightbox-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              X
            </button>
            <button
              type="button"
              className="lightbox-nav lightbox-prev"
              onClick={showPrev}
              aria-label="Previous image"
            >
              &lt;
            </button>
            <img
              className="lightbox-image"
              src={galleryImages[lightboxIndex]}
              alt={`${entry?.title ?? 'Gallery'} ${lightboxIndex + 1}`}
            />
            <button
              type="button"
              className="lightbox-nav lightbox-next"
              onClick={showNext}
              aria-label="Next image"
            >
              &gt;
            </button>
            <div className="lightbox-count">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
