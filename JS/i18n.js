const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '..');
const ES_JSON_PATH = path.join(__dirname, '../locales/es/translation.json');
const EN_JSON_PATH = path.join(__dirname, '../locales/en/translation.json');
const PT_JSON_PATH = path.join(__dirname, '../locales/pt/translation.json'); // 👈 Agregado para Portugués
const MISSING_VALUE = 'MISSING_TRANSLATIONS';
const REMOVE_OBSOLETE_KEYS = false;
const DEBUG = process.argv.includes('--debug');

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function stripNoise(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')                            // comentarios HTML
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, (m) => {
      const openTagMatch = m.match(/^<script[^>]*>/i);
      return openTagMatch ? openTagMatch[0] + '</script>' : '';
    })
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, (m) => {
      const openTagMatch = m.match(/^<style[^>]*>/i);
      return openTagMatch ? openTagMatch[0] + '</style>' : '';
    });
}

function parseAttributes(attrString) {
  const attrs = {};
  const attrRegex = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let m;
  while ((m = attrRegex.exec(attrString)) !== null) {
    if (!m[1]) continue;
    const name = m[1];
    const value = m[2] !== undefined ? m[2] : m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : '';
    attrs[name] = value;
  }
  return attrs;
}

function extractKeysFromHtml(rawContent, fileName) {
  const content = stripNoise(rawContent);
  const keys = new Set();

  const tagRegex = /<([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/g;
  let match;
  let tagsScanned = 0;
  let matchesFound = 0;

  while ((match = tagRegex.exec(content)) !== null) {
    tagsScanned++;
    const tagName = match[1].toLowerCase();
    const attrs = parseAttributes(match[2]);
    const tagEndIndex = tagRegex.lastIndex;

    if (Object.prototype.hasOwnProperty.call(attrs, 'data-i18n-attr') || Object.prototype.hasOwnProperty.call(attrs, 'data-i18n-placeholder')) {
      const targetAttr = attrs['data-i18n-attr'] || 'placeholder';
      if (targetAttr && Object.prototype.hasOwnProperty.call(attrs, targetAttr)) {
        const text = attrs[targetAttr].trim();
        if (text) {
          keys.add(text);
          matchesFound++;
          if (DEBUG) console.log(`   [${fileName}] attr <${tagName}> -> "${text}"`);
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(attrs, 'data-i18n') && !VOID_ELEMENTS.has(tagName)) {
      const closeTagIndex = content.indexOf(`</${tagName}`, tagEndIndex);
      if (closeTagIndex !== -1) {
        const innerText = content.slice(tagEndIndex, closeTagIndex).trim();
        if (innerText) {
          keys.add(innerText);
          matchesFound++;
          if (DEBUG) console.log(`   [${fileName}] text <${tagName}> -> "${innerText}"`);
        }
      }
    }
  }

  if (DEBUG) console.log(`   [${fileName}] tags escaneados: ${tagsScanned}, keys encontradas: ${matchesFound}`);
  return keys;
}

function findHtmlFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      findHtmlFiles(fullPath, files);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

function updateSpanishJson() {
  console.log('PASO 1: Escaneando archivos HTML...');
  const htmlFiles = findHtmlFiles(HTML_DIR);
  console.log(`   Archivos encontrados: ${htmlFiles.length}`);

  let htmlKeys = new Set();
  for (const file of htmlFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const found = extractKeysFromHtml(content, path.relative(HTML_DIR, file));
    found.forEach(k => htmlKeys.add(k));
  }
  console.log(`   Total de frases únicas encontradas: ${htmlKeys.size}`);

  const esExisting = loadJsonSafe(ES_JSON_PATH);
  const esOutput = {};
  let newInEs = 0;

  for (const key of htmlKeys) {
    esOutput[key] = key;
    if (!Object.prototype.hasOwnProperty.call(esExisting, key)) {
      newInEs++;
    }
  }

  ensureDirExists(ES_JSON_PATH);
  fs.writeFileSync(ES_JSON_PATH, JSON.stringify(sortObject(esOutput), null, 2), 'utf-8');
  console.log(`   es/translation.json actualizado (${newInEs} nuevas)\n`);

  return esOutput;
}

function syncLanguageJson(esData, langPath, langName) {
  console.log(`Sincronizando ${langName} (${langPath})...`);
  const existing = loadJsonSafe(langPath);
  const output = {};
  let newKeys = 0;
  let keptKeys = 0;

  for (const key of Object.keys(esData)) {
    if (Object.prototype.hasOwnProperty.call(existing, key) && existing[key] && existing[key] !== MISSING_VALUE) {
      output[key] = existing[key];
      keptKeys++;
    } else {
      output[key] = MISSING_VALUE;
      newKeys++;
    }
  }

  ensureDirExists(langPath);
  fs.writeFileSync(langPath, JSON.stringify(sortObject(output), null, 2), 'utf-8');
  console.log(`   ${langName}/translation.json actualizado — traducidas/conservadas: ${keptKeys}, pendientes: ${newKeys}\n`);
}

function loadJsonSafe(filePath) {
  if (fs.existsSync(filePath)) {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
    catch (e) { console.warn(`No se pudo parsear ${filePath}`); }
  }
  return {};
}

function ensureDirExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sortObject(obj) {
  return Object.keys(obj).sort((a, b) => a.localeCompare(b))
    .reduce((acc, k) => { acc[k] = obj[k]; return acc; }, {});
}

function main() {
  const esData = updateSpanishJson();
  syncLanguageJson(esData, EN_JSON_PATH, 'en');
  syncLanguageJson(esData, PT_JSON_PATH, 'pt'); 
  console.log('¡Sincronización completa para ES, EN y PT!');
}

main();