import assert from 'node:assert/strict';
import {test} from 'node:test';
import config from '../config/reel.json';
import {reelSchema} from '../src/schema';
import {buildTimeline,captionsForClip,captionPages} from '../src/timeline';
const getProps=()=>reelSchema.parse(structuredClone(config));

test('demo is 18 seconds with no timeline gaps and CTA after speech',()=>{
 const t=buildTimeline(getProps(),30);
 assert.deepEqual(t.clips.map(c=>[c.from,c.duration]),[[0,150],[150,150],[300,120]]);
 assert.equal(t.bodyFrames,420);assert.equal(t.totalFrames,540);
});
test('trim, reorder and repeat preserve source caption alignment',()=>{
 const captions=[{text:'Pierwsze',startMs:900,endMs:1200,timestampMs:1000,confidence:null},{text:'Drugie',startMs:1700,endMs:2100,timestampMs:1900,confidence:null},{text:'Poza',startMs:2200,endMs:2500,timestampMs:null,confidence:null}];
 const mapped=captionsForClip(captions,30,30,30);
 assert.deepEqual(mapped.map(c=>[c.text,c.startMs,c.endMs]),[['Pierwsze',0,200],['Drugie',700,1000]]);
 const p=getProps();p.hookSeconds=1;p.clips=[{...p.clips[0],startSeconds:16,endSeconds:20},{...p.clips[0],startSeconds:0,endSeconds:5},{...p.clips[0],startSeconds:16,endSeconds:20}];
 const t=buildTimeline(p,30);
 assert.deepEqual(t.clips.map(c=>c.from),[0,120,270]);
 const pages=t.clips.map(c=>captionsForClip(p.captions,c.startFrame,c.duration,30));
 assert.deepEqual(pages[0],pages[2]);assert.equal(pages[0][0].text,'Uporządkuj');
});
test('caption pages split on pauses and explicit breaks',()=>{
 const cap=(text:string,startMs:number,endMs:number,pageBreakAfter=false)=>({text,startMs,endMs,timestampMs:null,confidence:null,pageBreakAfter});
 const pages=captionPages([cap('A',0,400),cap('B',400,800,true),cap('C',900,1100),cap('D',1500,1800)]);
 assert.deepEqual(pages.map(p=>p.words.map(w=>w.text)),[['A','B'],['C'],['D']]);
});
test('rejects reversed clips, out of source clips, short hook and overlapping captions',()=>{
 for(const edit of [
  (p:ReturnType<typeof getProps>)=>{p.clips[0].endSeconds=0;},
  (p:ReturnType<typeof getProps>)=>{p.clips[1].endSeconds=30;},
  (p:ReturnType<typeof getProps>)=>{p.clips[0].endSeconds=1;},
  (p:ReturnType<typeof getProps>)=>{p.captions[1].startMs=0;},
 ]){const p=getProps();edit(p);assert.throws(()=>buildTimeline(p,30));}
});
test('rejects traversal, remote asset URLs and oversized typography inputs',()=>{
 for(const source of ['../secret.mp4','https://example.com/a.mp4','/tmp/a.mp4','media/../../a.mp4']) assert.equal(reelSchema.safeParse({...getProps(),source}).success,false);
 assert.equal(reelSchema.safeParse({...getProps(),hook:'A'.repeat(91)}).success,false);
});
test('duration follows frame rate, fractional trims round once',()=>{
 const p=getProps();assert.equal(buildTimeline(p,60).totalFrames,1080);
 p.clips[1].startSeconds=7.017;p.clips[1].endSeconds=12.01;
 const t=buildTimeline(p,30);assert.equal(t.clips[1].startFrame,211);assert.equal(t.clips[1].duration,149);assert.equal(t.totalFrames,539);
});
