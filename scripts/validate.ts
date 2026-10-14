import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {reelSchema} from '../src/schema';
import {buildTimeline} from '../src/timeline';

const filename=process.argv[2]??'config/reel.json';
try {
 const p=reelSchema.parse(JSON.parse(fs.readFileSync(filename,'utf8')));
 const timeline=buildTimeline(p,30);
 for(const asset of [p.source,p.logo].filter(Boolean)) {
   if(!fs.existsSync(path.join('public',asset))) throw new Error(`Brak pliku: public/${asset}`);
 }
 if(p.source){
   let actual:number;
   try{actual=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',path.join('public',p.source)],{encoding:'utf8'}).trim());}
   catch{throw new Error('Walidacja nagrania wymaga FFmpeg (ffprobe) w PATH.');}
   if(!Number.isFinite(actual)||actual<=0) throw new Error('Nie można ustalić długości nagrania.');
   if(p.clips.some(c=>c.endSeconds>actual)) throw new Error(`Cięcie wykracza poza faktyczny czas nagrania (${actual.toFixed(3)} s).`);
 }
 if(p.showSafeArea) console.warn('UWAGA: włączone linie pomocnicze — wyłącz showSafeArea przed eksportem.');
 console.log(`OK: ${timeline.totalFrames} klatek, ${(timeline.totalFrames/30).toFixed(2)} s, 1080×1920, 30 fps. ${p.source?'Nagranie: '+p.source:'Tryb demonstracyjny, bez nagrania.'}`);
}catch(e){console.error(e instanceof Error?e.message:e);process.exitCode=1;}
