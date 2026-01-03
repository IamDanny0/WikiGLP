import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const viewerRoot = path.resolve(scriptDir, '..')
const distDir = path.join(viewerRoot, 'dist')
const docsDir = path.resolve(viewerRoot, '..', 'docs')

if (!fs.existsSync(distDir)) {
  console.error('Missing dist/ folder. Run "npm run build -- --base=/WikiGLP/" first.')
  process.exit(1)
}

fs.rmSync(docsDir, { recursive: true, force: true })
fs.mkdirSync(docsDir, { recursive: true })
fs.cpSync(distDir, docsDir, { recursive: true })
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '')

console.log('Copied dist/ to docs/ and wrote .nojekyll.')
