import {z} from 'zod';

const text = (max: number) => z.string().trim().min(1).max(max);
// Asset paths are local to public/. Remote URLs and traversal are deliberately disallowed.
export const assetPath = z.string().refine((s) => s === '' || (!s.includes('..') && !/[\\:?#]/.test(s) && !s.startsWith('/')), 'Podaj ścieżkę względem public/, np. media/ekspert.mp4');
const caption = z.object({
  text: text(80), startMs: z.number().nonnegative(), endMs: z.number().positive(),
  timestampMs: z.number().nullable().default(null), confidence: z.number().min(0).max(1).nullable().default(null),
  pageBreakAfter: z.boolean().optional(),
});
export const reelSchema = z.object({
  source: assetPath.describe('Nagranie w public/. Puste pole uruchamia demonstrację.'),
  sourceDurationSeconds: z.number().positive().describe('Długość pliku źródłowego; sprawdź przed montażem.'),
  hook: text(90),
  hookSeconds: z.number().min(1).max(3),
  speaker: text(45), role: text(65), topic: text(35),
  logo: assetPath.describe('Opcjonalny plik logo w public/; pusty = podpis typograficzny.'),
  cta: z.object({title: text(85), action: text(42), destination: text(45), seconds: z.number().min(3).max(8)}),
  clips: z.array(z.object({
    label: text(40), startSeconds: z.number().nonnegative(), endSeconds: z.number().positive(),
    zoomFrom: z.number().min(1).max(1.12), zoomTo: z.number().min(1).max(1.12),
    focusX: z.number().min(0).max(100), focusY: z.number().min(0).max(100),
    transition: z.enum(['cut','dip']),
  })).min(1).max(60),
  captions: z.array(caption).max(3000).describe('Znaczniki czasu dotyczą oryginalnego nagrania, przed cięciami.'),
  captionsStyle: z.enum(['word','phrase']),
  captionFontSize: z.number().min(44).max(64),
  captionsBottom: z.number().min(320).max(700),
  volume: z.number().min(0).max(1),
  showSafeArea: z.boolean().describe('Linie pomocnicze; wyłącz przed eksportem.'),
});
export type ReelProps = z.infer<typeof reelSchema>;
export type Clip = ReelProps['clips'][number];
