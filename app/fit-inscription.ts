import { layoutNextLine, measureNaturalWidth, prepareWithSegments, type PreparedTextWithSegments } from '@chenglou/pretext';

const preparedCache = new Map<string, PreparedTextWithSegments>();
function prepared(words: string, font: string) {
  const key = `${font}\n${words}`;
  let value = preparedCache.get(key);
  if (!value) {
    value = prepareWithSegments(words, font);
    preparedCache.set(key, value);
  }
  return value;
}

// Called only after the named local font has loaded. Every fitted inscription
// ends at a complete word; very short wall returns remain deliberately blank.
export function fitInscription(words: string, font: string, capacity: number) {
  if (capacity < 8 || !words.trim()) return { text: '', width: 0 };
  const normalized = words.trim().replace(/\s+/g, ' ');
  const line = layoutNextLine(prepared(normalized, font), { segmentIndex: 0, graphemeIndex: 0 }, capacity);
  if (!line) return { text: '', width: 0 };
  let text = line.text.trimEnd();
  if (text.length < normalized.length && /\S/.test(normalized[text.length])) {
    const boundary = text.lastIndexOf(' ');
    text = boundary < 0 ? '' : text.slice(0, boundary);
  }
  text = text.replace(/[·,;&]+\s*$/, '').trimEnd();
  return { text, width: text ? Math.min(capacity, measureNaturalWidth(prepared(text, font))) : 0 };
}
