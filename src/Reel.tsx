import {useEffect,useMemo,useState} from 'react';
import {AbsoluteFill,Sequence,continueRender,delayRender,interpolate,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Video} from '@remotion/media';
import {AnimatedCaptions,Brand,CutTransition,DemoFootage,Hook,Outro,SafeArea,Speaker} from './components';
import {type ReelProps} from './schema';
import {buildTimeline,captionsForClip,frames} from './timeline';
import {theme as t,clamp} from './theme';
import './fonts.css';

function FontReady(){
 const [handle]=useState(()=>delayRender('Ładowanie lokalnych fontów'));
 useEffect(()=>{let active=true; Promise.all([document.fonts.load('600 96px "League Spartan"','Zażółć gęślą jaźń'),document.fonts.load('600 42px "Montserrat"','Zażółć gęślą jaźń'),document.fonts.load('700 52px "Montserrat"','Zażółć gęślą jaźń'),document.fonts.load('500 32px "Montserrat"','Zażółć gęślą jaźń')]).then(()=>{if(active)continueRender(handle);});return()=>{active=false;continueRender(handle);};},[handle]);
 return null;
}

type ShotProps={props:ReelProps;clip:ReturnType<typeof buildTimeline>['clips'][number];index:number};
function Shot({props:p,clip,index}:ShotProps){
 const f=useCurrentFrame();const {fps}=useVideoConfig();
 const captions=useMemo(()=>captionsForClip(p.captions,clip.startFrame,clip.duration,fps),[p.captions,clip.startFrame,clip.duration,fps]);
 return <AbsoluteFill style={{overflow:'hidden'}}>
   <AbsoluteFill style={{scale:interpolate(f,[0,Math.max(1,clip.duration-1)],[clip.zoomFrom,clip.zoomTo],clamp),transformOrigin:`${clip.focusX}% ${clip.focusY}%`}}>
    {p.source ? <Video src={staticFile(p.source)} trimBefore={clip.startFrame} durationInFrames={clip.duration} premountFor={fps} volume={p.volume} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:`${clip.focusX}% ${clip.focusY}%`}}/> : <DemoFootage/>}
   </AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(23,33,33,.85) 0%,rgba(23,33,33,.25) 35%,transparent 50%,rgba(23,33,33,.5) 90%,#172121 100%)'}}/>
   <AnimatedCaptions captions={captions} mode={p.captionsStyle} fontSize={p.captionFontSize} bottom={p.captionsBottom} hideUntil={index===0?frames(p.hookSeconds,fps):0}/>
 </AbsoluteFill>;
}

export function Reel(props:ReelProps){
 const {fps}=useVideoConfig();const timeline=useMemo(()=>buildTimeline(props,fps),[props,fps]);
 return <AbsoluteFill style={{background:t.ink,color:t.white,fontFamily:t.body}}>
  <FontReady/>
  {/* Config-driven clips intentionally share one source template. Edit the JSON to reorder/cut. */}
  {timeline.clips.map((clip,i)=><Sequence key={`${i}-${clip.from}`} name={clip.label} from={clip.from} durationInFrames={clip.duration} premountFor={fps}><Shot props={props} clip={clip} index={i}/></Sequence>)}
  <Sequence name="Brand" durationInFrames={timeline.bodyFrames} premountFor={fps}>
   <div style={{position:'absolute',left:80,top:180,right:160}}><Brand logo={props.logo}/><div style={{fontSize:21,letterSpacing:3,color:t.gold,marginTop:20}}>{props.topic.toLocaleUpperCase('pl')}</div></div>
  </Sequence>
  <Sequence name="Hook" durationInFrames={frames(props.hookSeconds,fps)} premountFor={fps}><Hook text={props.hook} duration={frames(props.hookSeconds,fps)}/></Sequence>
  {timeline.bodyFrames>frames(props.hookSeconds,fps)?<Sequence name="Ekspert" from={frames(props.hookSeconds,fps)} durationInFrames={Math.min(frames(2.8,fps),timeline.bodyFrames-frames(props.hookSeconds,fps))} premountFor={fps}><Speaker name={props.speaker} role={props.role}/></Sequence>:null}
  {timeline.clips.slice(1).map((clip,i)=>clip.transition==='dip'?<Sequence key={`transition-${i}`} name="Przejście" from={clip.from-4} durationInFrames={9} premountFor={fps}><CutTransition/></Sequence>:null)}
  <Sequence name="CTA" from={timeline.bodyFrames} durationInFrames={frames(props.cta.seconds,fps)} premountFor={fps}><Outro cta={props.cta} logo={props.logo}/></Sequence>
  {props.showSafeArea?<SafeArea/>:null}
 </AbsoluteFill>;
}
