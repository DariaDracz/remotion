import type {Caption} from '@remotion/captions';
import {reelSchema, type ReelProps} from './schema';

export const frames = (seconds: number, fps: number) => Math.round(seconds * fps);
export function buildTimeline(props: ReelProps, fps: number) {
  const p = reelSchema.parse(props);
  let cursor = 0;
  const clips = p.clips.map((clip, i) => {
    const startFrame = frames(clip.startSeconds, fps);
    const endFrame = frames(clip.endSeconds, fps);
    if (endFrame <= startFrame) throw new Error(`Fragment ${i+1}: koniec musi być po początku.`);
    if (clip.endSeconds > p.sourceDurationSeconds) throw new Error(`Fragment ${i+1} wykracza poza czas nagrania.`);
    if (endFrame - startFrame < frames(.5, fps)) throw new Error(`Fragment ${i+1} jest krótszy niż 0,5 s.`);
    const result = {...clip, startFrame, duration: endFrame-startFrame, from: cursor};
    cursor += result.duration;
    return result;
  });
  if (frames(p.hookSeconds,fps) > clips[0].duration) throw new Error('Pierwszy fragment musi pomieścić cały hook.');
  let previousEnd = -1;
  p.captions.forEach((c, i) => {
    if(c.endMs <= c.startMs) throw new Error(`Napis ${i+1}: nieprawidłowy czas.`);
    if(c.startMs < previousEnd) throw new Error(`Napis ${i+1}: napisy muszą być uporządkowane i nie mogą się nakładać.`);
    if(c.endMs > p.sourceDurationSeconds * 1000) throw new Error(`Napis ${i+1} wykracza poza nagranie.`);
    previousEnd = c.endMs;
  });
  return {clips, bodyFrames:cursor, totalFrames:cursor+frames(p.cta.seconds,fps)};
}

// Rebase source timestamps once per clip. Reordering or repeating a clip also moves its captions.
export function captionsForClip(captions: Caption[], startFrame:number, duration:number, fps:number): Caption[] {
  const startMs=startFrame/fps*1000;
  const endMs=(startFrame+duration)/fps*1000;
  return captions.filter(c=>c.endMs>startMs && c.startMs<endMs).map(c=>({
    ...c, startMs:Math.max(c.startMs,startMs)-startMs,
    endMs:Math.min(c.endMs,endMs)-startMs,
    timestampMs:c.timestampMs===null?null:Math.max(0,Math.min(duration/fps*1000,c.timestampMs-startMs)),
  }));
}

export type CaptionPage = {words: Caption[]; startMs:number; endMs:number};
export function captionPages(captions: Caption[]): CaptionPage[] {
  const pages:CaptionPage[]=[];
  let words:Caption[]=[];
  const flush=()=>{if(words.length) pages.push({words,startMs:words[0].startMs,endMs:words[words.length-1].endMs});words=[];};
  for(const c of captions){
    const joined=[...words,c].map(w=>w.text.trim()).join(' ');
    if(words.length && (joined.length>38 || words.length>=5 || c.endMs-words[0].startMs>2400 || c.startMs-words[words.length-1].endMs>250)) flush();
    words.push(c);
    if(c.pageBreakAfter) flush();
  }
  flush();
  return pages;
}
