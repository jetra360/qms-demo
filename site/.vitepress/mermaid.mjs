// Render ```mermaid fences as a container that the client-side Mermaid
// component turns into an SVG. The notes stay plain Markdown — the vault does
// not need to know anything about the website's rendering stack.
//
// The source is base64-encoded in data-source: VitePress collapses literal
// newlines in raw HTML, which would turn a flowchart into one invalid line.

export function mermaidPlugin(md) {
  const defaultFence = md.renderer.rules.fence
    ? md.renderer.rules.fence
    : (tokens, idx, options, env, self) => self.renderToken(tokens, idx, options)

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const lang = token.info.trim().split(/\s+/)[0].toLowerCase()
    if (lang === 'mermaid') {
      const code = token.content.trim()
      const encoded = Buffer.from(code, 'utf8').toString('base64')
      return `<div class="mermaid" data-mermaid data-source="${encoded}"></div>\n`
    }
    return defaultFence(tokens, idx, options, env, self)
  }
}
