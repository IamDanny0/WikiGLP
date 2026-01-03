import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const viewerRoot = path.resolve(scriptDir, '..')
const repoRoot = path.resolve(viewerRoot, '..')
const distDir = path.join(viewerRoot, 'dist')
const docsDir = path.join(repoRoot, 'docs')

if (!fs.existsSync(distDir)) {
  console.error('dist directory is missing. Run "npm run build -- --base=/WikiGLP/" first.')
  process.exit(1)
}

fs.rmSync(docsDir, { recursive: true, force: true })
fs.mkdirSync(docsDir, { recursive: true })

const copyRecursive = (source, target) => {
  const entries = fs.readdirSync(source, { withFileTypes: true })
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)
    if (entry.isDirectory()) {
      fs.mkdirSync(targetPath, { recursive: true })
      copyRecursive(sourcePath, targetPath)
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath)
    }
  }
}

copyRecursive(distDir, docsDir)
console.log('Copied dist to docs/')

const indexPath = path.join(docsDir, 'index.html')
const fallbackPath = path.join(docsDir, '404.html')

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, fallbackPath)
  console.log('Created SPA fallback 404.html')
} else {
  console.warn('Index file missing; skipping 404 fallback')
}

fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')
console.log('Ensured .nojekyll for GitHub Pages')

const rootCnamePath = path.join(repoRoot, 'CNAME')
const docsCnamePath = path.join(docsDir, 'CNAME')
const envCname = process.env.DEPLOY_CNAME

if (fs.existsSync(rootCnamePath)) {
  fs.copyFileSync(rootCnamePath, docsCnamePath)
  console.log('Copied root CNAME to docs/')
} else if (envCname) {
  fs.writeFileSync(docsCnamePath, envCname, 'utf-8')
  console.log('Created docs/CNAME from DEPLOY_CNAME')
} else {
  console.log('No CNAME configured; skipping')
}
