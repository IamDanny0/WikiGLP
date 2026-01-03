import { useEffect, useState } from 'react'

type Route =
  | { kind: 'home' }
  | { kind: 'entry'; categoryPath: string; slug: string }

const parseRoute = (): Route => {
  const path = window.location.pathname.replace(/\/+$/, '')
  if (!path || path === '/') return { kind: 'home' }
  const parts = path.split('/').filter(Boolean)
  if (parts.length >= 2) {
    return { kind: 'entry', categoryPath: parts[0], slug: parts[1] }
  }
  return { kind: 'home' }
}

export const navigate = (to: string) => {
  const next = to.startsWith('/') ? to : `/${to}`
  window.history.pushState(null, '', next)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export const useRoute = (): Route => {
  const [route, setRoute] = useState<Route>(() => parseRoute())

  useEffect(() => {
    const handler = () => setRoute(parseRoute())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  return route
}
