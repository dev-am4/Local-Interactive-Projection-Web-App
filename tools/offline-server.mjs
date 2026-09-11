import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootArg = process.argv[2] || 'dist'
const port = Number(process.argv[3] || process.env.PORT || 4173)
const host = '127.0.0.1'
const root = path.resolve(process.cwd(), rootArg)
const pidFile = path.resolve(process.cwd(), '.offline-server.pid')

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

if (!fs.existsSync(root)) {
  console.error(`[offline-server] Missing folder: ${root}`)
  process.exit(1)
}

const safeResolve = (pathname) => {
  const decoded = decodeURIComponent(pathname).replace(/^\/+/, '')
  const target = path.resolve(root, decoded || 'index.html')
  if (target !== root && !target.startsWith(root + path.sep)) return null
  return target
}

const sendFile = (req, res, filePath) => {
  const stat = fs.statSync(filePath)
  const ext = path.extname(filePath).toLowerCase()
  const headers = {
    'Content-Type': mime[ext] || 'application/octet-stream',
    'Cache-Control': 'no-store, max-age=0',
    'Access-Control-Allow-Origin': '*',
  }

  const range = req.headers.range
  if (range && stat.size > 0 && ['.mp4', '.webm'].includes(ext)) {
    const match = /bytes=(\d+)-(\d*)/.exec(range)
    if (match) {
      const start = Number(match[1])
      const end = match[2] ? Number(match[2]) : stat.size - 1
      if (start <= end && end < stat.size) {
        res.writeHead(206, {
          ...headers,
          'Accept-Ranges': 'bytes',
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Content-Length': end - start + 1,
        })
        fs.createReadStream(filePath, { start, end }).pipe(res)
        return
      }
    }
  }

  res.writeHead(200, { ...headers, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${host}:${port}`)

  if (url.pathname === '/__health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify({ ok: true, mode: 'offline-kiosk', root, port }))
    return
  }

  let target = safeResolve(url.pathname)
  if (!target) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  try {
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html')
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      sendFile(req, res, target)
      return
    }

    if (!path.extname(url.pathname)) {
      const fallback = path.join(root, 'index.html')
      if (fs.existsSync(fallback)) {
        sendFile(req, res, fallback)
        return
      }
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' })
    res.end('Not found')
  } catch (error) {
    console.error('[offline-server]', error)
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('Server error')
  }
})

const cleanup = () => {
  try {
    if (fs.existsSync(pidFile)) fs.unlinkSync(pidFile)
  } catch {}
}

server.listen(port, host, () => {
  fs.writeFileSync(pidFile, String(process.pid), 'utf8')
  console.log(`[offline-server] http://${host}:${port}`)
  console.log(`[offline-server] serving ${root}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => {
      cleanup()
      process.exit(0)
    })
  })
}

process.on('exit', cleanup)
