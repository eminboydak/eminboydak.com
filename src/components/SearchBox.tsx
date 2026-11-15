import { useEffect, useRef, useState } from 'preact/hooks';
import type { Dictionary } from '../i18n/tr';

type SearchLabels = Dictionary['search'];

interface PagefindResultData {
  url: string;
  meta?: { title?: string };
}
interface PagefindModule {
  search: (q: string) => Promise<{ results: Array<{ data: () => Promise<PagefindResultData> }> }>;
}
type SearchResult = { title: string; url: string; sub: string };

interface Props {
  labels: SearchLabels;
}

const PAGEFIND_PATH = '/pagefind/pagefind.js';

export default function SearchBox({ labels }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [indexReady, setIndexReady] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pagefindRef = useRef<PagefindModule | null>(null);

  async function loadPagefind(): Promise<PagefindModule | null> {
    if (pagefindRef.current) return pagefindRef.current;
    try {
      const mod = (await import(/* @vite-ignore */ PAGEFIND_PATH)) as PagefindModule;
      pagefindRef.current = mod;
      setIndexReady(true);
      return mod;
    } catch {
      setIndexReady(false);
      return null;
    }
  }

  async function runSearch(value: string) {
    const term = value.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }
    const pf = await loadPagefind();
    if (!pf) return;
    const found = await pf.search(term);
    const items = await Promise.all(found.results.slice(0, 8).map((r) => r.data()));
    setResults(items.map((d) => ({ title: d.meta?.title ?? d.url, url: d.url, sub: d.url })));
    setSearched(true);
  }

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const timer = setTimeout(() => void runSearch(query), 120);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={labels.open}
        class="inline-flex items-center gap-1.5 text-xs border border-base-300 px-2 py-0.5 font-mono text-base-content/60 hover:text-primary hover:border-primary transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        {labels.open}
      </button>

      {open && (
        <div
          class="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div class="w-full max-w-[640px] bg-base-100 border border-base-300" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div class="flex items-center gap-3 px-4 py-3 border-b border-base-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-primary shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                placeholder={labels.placeholder}
                onInput={(e) => setQuery(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results.length > 0) window.location.href = results[0].url;
                }}
                class="flex-1 bg-transparent outline-none text-base-content placeholder:text-base-content/40 text-[17px]"
              />
              {searched && (
                <span class="font-mono text-[11px] text-base-content/50 shrink-0">
                  {labels.results.replace('{n}', String(results.length))}
                </span>
              )}
              <button type="button" aria-label="close" onClick={() => setOpen(false)} class="text-base-content/50 hover:text-primary shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div class="max-h-[50vh] overflow-y-auto">
              {indexReady === false && <div class="px-4 py-5 font-mono text-xs text-base-content/50">{labels.unavailable}</div>}
              {indexReady !== false && searched && results.length === 0 && (
                <div class="px-4 py-5 text-sm text-base-content/60">{labels.empty}</div>
              )}
              {results.map((r) => (
                <a
                  key={r.url}
                  href={r.url}
                  class="flex items-center justify-between gap-4 px-4 py-3 border-b border-base-300 last:border-b-0 hover:bg-base-200 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span class="min-w-0">
                    <span class="block text-[15px] font-medium text-base-content truncate">{r.title}</span>
                    <span class="block font-mono text-[11px] text-base-content/50 truncate">{r.sub}</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-base-content/40 shrink-0">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              ))}
            </div>

            <div class="flex gap-4 px-4 py-2.5 border-t border-base-300 font-mono text-[11px] text-base-content/50">
              <span>{labels.hint}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
