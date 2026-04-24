#!/usr/bin/env node
/*
 * Post-build CSP hash sweeper.
 *
 * Walks every static HTML file under site/out/, collects the content of every
 * inline <script> tag (excluding `type="application/ld+json"` which is data,
 * not executable), computes SHA-256 hashes, and rewrites
 * out/staticwebapp.config.json so the `script-src` directive lists the hashes
 * and drops `'unsafe-inline'`.
 *
 * Why this exists: Next.js App Router static export inlines React Server
 * Component streaming payloads as <script>self.__next_f.push(...)</script>
 * plus a next-themes anti-FOUC bootstrap. Those inline scripts are legitimate
 * but require either a nonce (runtime) or a hash (build-time) in the CSP.
 * Azure Static Web Apps has no middleware / runtime, so hashes are the only
 * viable path. Reclaims the MDN Observatory CSP deduction (-20 points).
 *
 * The sweeper is idempotent and has no external dependencies (pure Node
 * stdlib: fs, path, crypto). Runs as the last step of `site` build.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const OUT_DIR = path.resolve(__dirname, '..', 'site', 'out');
const CONFIG_FILE = path.join(OUT_DIR, 'staticwebapp.config.json');

// External sources the CSP already allows. Kept alongside the hash list so
// the final script-src directive covers both inline (by hash) and external
// (by origin) scripts. Mirrors the template in site/public/staticwebapp.config.json.
const EXTERNAL_SCRIPT_SOURCES = [
  "'self'",
  'https://challenges.cloudflare.com',
  'https://static.cloudflareinsights.com',
];

function walkHtml(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkHtml(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

// Conservative inline-script matcher. We deliberately skip src-only tags
// (<script src="..."></script>) and JSON-LD (<script type="application/ld+json">),
// and avoid DOMParser to stay dependency-free. The regex is anchored on
// `<script` and captures up to the matching closing tag — good enough for
// the well-formed HTML Next.js emits from static export.
const INLINE_SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

function extractInlineScripts(html) {
  const scripts = [];
  let match;
  INLINE_SCRIPT_RE.lastIndex = 0;
  while ((match = INLINE_SCRIPT_RE.exec(html)) !== null) {
    const attrs = match[1] || '';
    const body = match[2] || '';
    // Skip external-src tags — the body is empty and the src is governed by
    // 'self' / host-source entries, not hashes.
    if (/\bsrc\s*=/i.test(attrs)) continue;
    // Skip non-executable JSON-LD (and anything else with an unusual type).
    if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs)) continue;
    if (body.length === 0) continue;
    scripts.push(body);
  }
  return scripts;
}

function sha256Base64(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('base64');
}

function rewriteScriptSrc(directive, hashTokens) {
  // Replace (or insert) the script-src directive with the supplied token list.
  const sources = [...EXTERNAL_SCRIPT_SOURCES, ...hashTokens].join(' ');
  const nextDirective = `script-src ${sources}`;

  if (/(^|;\s*)script-src\s+[^;]+/i.test(directive)) {
    return directive.replace(/(^|;\s*)script-src\s+[^;]+/i, (_m, sep) => `${sep}${nextDirective}`);
  }
  // If somehow absent, append.
  return directive.trim().replace(/;\s*$/, '') + '; ' + nextDirective;
}

function dropUnsafeInlineFromStyleSrc(directive) {
  return directive.replace(/(style-src\s+)([^;]+)/i, (_m, head, body) => {
    const cleaned = body
      .split(/\s+/)
      .filter((tok) => tok && tok !== "'unsafe-inline'")
      .join(' ');
    return head + cleaned;
  });
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    console.error(`[csp-hashes] Expected build output at ${OUT_DIR} — run "next build" first.`);
    process.exit(1);
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error(`[csp-hashes] Missing ${CONFIG_FILE} — is staticwebapp.config.json in site/public/?`);
    process.exit(1);
  }

  const htmlFiles = walkHtml(OUT_DIR);
  if (htmlFiles.length === 0) {
    console.error(`[csp-hashes] No HTML files found under ${OUT_DIR}.`);
    process.exit(1);
  }

  const hashSet = new Set();
  let totalInline = 0;
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const scripts = extractInlineScripts(html);
    totalInline += scripts.length;
    for (const body of scripts) {
      hashSet.add(`'sha256-${sha256Base64(body)}'`);
    }
  }

  const hashTokens = [...hashSet].sort();

  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  const currentCsp = config.globalHeaders?.['Content-Security-Policy'];
  if (!currentCsp || typeof currentCsp !== 'string') {
    console.error(`[csp-hashes] globalHeaders["Content-Security-Policy"] missing in ${CONFIG_FILE}.`);
    process.exit(1);
  }

  let nextCsp = rewriteScriptSrc(currentCsp, hashTokens);
  nextCsp = dropUnsafeInlineFromStyleSrc(nextCsp);
  // Collapse any accidental double spaces introduced by the replacer.
  nextCsp = nextCsp.replace(/\s{2,}/g, ' ').trim();

  if (nextCsp === currentCsp) {
    console.log('[csp-hashes] CSP already up-to-date, nothing to write.');
    return;
  }

  config.globalHeaders['Content-Security-Policy'] = nextCsp;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', 'utf8');

  console.log(
    `[csp-hashes] Scanned ${htmlFiles.length} HTML file(s), ${totalInline} inline script tag(s), ${hashTokens.length} unique hash(es).`
  );
  console.log(`[csp-hashes] Rewrote ${CONFIG_FILE}.`);
}

main();
