import assert from 'node:assert/strict';

export function flattenCopy(value, prefix = '', result = {}) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `Copy group must be an object: ${prefix}`);
  for (const [key, entry] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof entry === 'string') {
      assert.ok(entry.trim(), `Copy must not be empty: ${path}`);
      result[path] = entry;
    } else {
      assert.ok(entry && typeof entry === 'object' && !Array.isArray(entry), `Copy must be text: ${path}`);
      flattenCopy(entry, path, result);
    }
  }
  return result;
}

export function validateCopy(value, contract) {
  const entries = flattenCopy(value);
  assert.deepEqual(Object.keys(entries).sort(), Object.keys(contract).sort(),
    'Copy keys changed: edit wording, keeping the existing keys');
  for (const [key, text] of Object.entries(entries)) {
    const placeholders = [...new Set([...text.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map(match => match[1]))].sort();
    assert.deepEqual(placeholders, contract[key], `Keep the original placeholders in ${key}`);
  }
  return entries;
}
