import React, {useMemo} from 'react';
import {AbsoluteFill, CanvasImage, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Caption} from '@remotion/captions';
import {captionPages} from './timeline';
import type {ReelProps} from './schema';
import {theme as t, clamp} from './theme';

export const Brand = ({logo}: {logo:string}) => logo ? <CanvasImage src={staticFile(logo)} style={{width:260,height:90,objectFit:'contain',objectPosition:'left'}}/> : <div style={{display:'flex',alignItems:'center',gap:22}}><span style={{fontFamily:t.heading,fontSize:78,fontWeight:600,letterSpacing:-3}}>ILT<span style={{color:t.gold}}>.</span></span><span style={{fontSize:22,lineHeight:1.35,letterSpacing:3,fontWeight:600}}>KANCELARIA<br/>PRAWNO-PODATKOWA</span></div>;

// Deliberately abstract demo. No likeness, stock footage or external downloads.
export const DemoFootage = () => {
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:'linear-gradient(130deg, #465451 0%, #263431 40%, #172121 100%)',overflow:'hidden'}}>
   <div style={{position:'absolute',left:-100,top:350,width:1100,height:1100,border:'2px solid #c79a6835',borderRadius:'50%',translate:`${Math.sin(frame/fps/3)*30}px 0px`}}/>
   <div style={{position:'absolute',left:130,top:470,width:760,height:760,border:'1px solid #c79a6850',borderRadius:'50%'}}/>
   <div style={{position:'absolute',width:420,height:950,left:330,top:360,background:'linear-gradient(130deg,#a9b0a440,#c79a6818)',borderRadius:'240px 240px 28px 28px',rotate:'-12deg',translate:`0px ${Math.sin(frame/fps/2)*15}px`}}/>
   <div style={{position:'absolute',left:80,top:860,color:t.paper,fontSize:110,fontFamily:t.heading,lineHeight:.95,fontWeight:600,letterSpacing:-3}}>Wiedza.<br/><span style={{color:t.gold}}>Dobry kierunek.</span></div>
   <div style={{position:'absolute',left:80,top:1120,fontFamily:t.body,fontSize:25,letterSpacing:4,color:'#f2edeb99'}}>MATERIAŁ DEMONSTRACYJNY</div>
 </AbsoluteFill>;
};

export const Hook = ({text,duration}: {text:string;duration:number}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <div data-testid="hook" style={{position:'absolute',left:80,right:160,top:315,opacity:interpolate(f,[0,5,duration-7,duration-1],[.7,1,1,0],clamp),translate:`0px ${interpolate(f,[0,.28*fps],[16,0],clamp)}px`}}>
  <div style={{width:80,height:6,background:t.gold,marginBottom:30}}/>
  <div data-safe-text style={{fontFamily:t.heading,fontSize:text.length>65?84:96,lineHeight:1.03,fontWeight:600,letterSpacing:-1.8,whiteSpace:'pre-line',overflowWrap:'anywhere',textShadow:'0 4px 28px #0009'}}>{text}</div>
 </div>;
};

export const AnimatedCaptions = ({captions,mode,fontSize,bottom,hideUntil=0}: {captions:Caption[];mode:'word'|'phrase';fontSize:number;bottom:number;hideUntil?:number}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig(); const ms=f/fps*1000;
 const pages=useMemo(()=>captionPages(captions),[captions]);
 const page=pages.find(p=>ms>=p.startMs && ms<p.endMs);
 if(!page || f<hideUntil) return null;
 const elapsed=Math.max(0,f-page.startMs/1000*fps);
 return <div data-testid="captions" style={{position:'absolute',left:80,right:160,bottom,display:'flex',justifyContent:'center',opacity:interpolate(elapsed,[0,3],[.8,1],clamp),translate:`0px ${interpolate(elapsed,[0,5],[8,0],clamp)}px`}}>
  <div data-safe-text style={{background:'#172121ed',borderRadius:14,padding:'24px 28px',borderLeft:`5px solid ${t.gold}`,fontFamily:t.body,fontSize,fontWeight:700,lineHeight:1.34,textAlign:'center',overflowWrap:'anywhere',boxShadow:'0 8px 30px #0003'}}>
   {page.words.map((w,i)=><React.Fragment key={`${w.startMs}-${i}`}><span style={{color:mode==='word' && ms>=w.startMs && ms<w.endMs?t.gold:t.white}}>{w.text.trim()}</span>{i<page.words.length-1?' ':''}</React.Fragment>)}
  </div>
 </div>;
};

export const Speaker = ({name,role}: {name:string;role:string}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <div style={{position:'absolute',left:80,right:160,top:360,opacity:interpolate(f,[0,.25*fps,2.5*fps,2.8*fps],[0,1,1,0],clamp),translate:`${interpolate(f,[0,.3*fps],[-12,0],clamp)}px 0px`,borderLeft:`4px solid ${t.gold}`,paddingLeft:24}}>
  <div data-safe-text style={{fontFamily:t.heading,fontSize:50,fontWeight:600,overflowWrap:'anywhere'}}>{name}</div>
  <div data-safe-text style={{fontSize:28,lineHeight:1.4,color:t.paper,marginTop:8,overflowWrap:'anywhere'}}>{role}</div>
 </div>;
};

export const CutTransition = () => {
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:t.ink,pointerEvents:'none',opacity:interpolate(f,[0,4,8],[0,.55,0],clamp)}}/>;
};

export const Outro = ({cta,logo}: {cta:ReelProps['cta'];logo:string}) => {
 const f=useCurrentFrame(); const {fps}=useVideoConfig();
 return <AbsoluteFill style={{background:t.ink,color:t.paper,padding:'180px 160px 320px 80px'}}>
   <Brand logo={logo}/>
   <div style={{position:'absolute',right:-470,top:420,width:1150,height:1150,border:`1px solid ${t.gold}40`,borderRadius:'50%'}}/>
   <div style={{marginTop:235,opacity:interpolate(f,[0,.4*fps],[0,1],clamp),translate:`0px ${interpolate(f,[0,.4*fps],[24,0],clamp)}px`}}>
    <div style={{fontSize:24,letterSpacing:4,color:t.gold,marginBottom:32}}>POROZMAWIAJMY</div>
    <div data-safe-text style={{fontFamily:t.heading,fontSize:cta.title.length>65?84:94,fontWeight:600,lineHeight:1.04,letterSpacing:-1.5,overflowWrap:'anywhere'}}>{cta.title}</div>
    <div style={{width:100,height:5,background:t.gold,marginTop:45,marginBottom:54}}/>
    <div data-safe-text style={{fontSize:42,fontWeight:600,lineHeight:1.3,overflowWrap:'anywhere'}}>{cta.action} <span style={{color:t.gold}}>↗</span></div>
    <div data-safe-text style={{fontSize:32,color:t.gold,marginTop:25,lineHeight:1.4,overflowWrap:'anywhere'}}>{cta.destination}</div>
   </div>
   <div style={{position:'absolute',left:80,bottom:350,fontSize:23,letterSpacing:3,color:'#f2edeb99'}}>PRAWO · PODATKI · BIZNES</div>
 </AbsoluteFill>;
};

export const SafeArea = () => <AbsoluteFill style={{pointerEvents:'none'}}><div style={{position:'absolute',left:80,right:160,top:180,bottom:320,border:'3px dashed #42e6af'}}/><div style={{position:'absolute',left:90,top:145,color:'#42e6af',fontSize:22}}>OBSZAR POMOCNICZY — WYŁĄCZ PRZED EKSPORTEM</div></AbsoluteFill>;
