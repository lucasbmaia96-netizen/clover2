/* Perfil individual — Grimório espadas. Registro individual das seis artes; ferragens fora do papel. */
(() => {
'use strict';
const W=1536,H=1024,SPINE=768,BOARD=662;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
function boardPath(cc,side){const x=side===1?768:106,y=85,w=662,h=825,r=12;cc.beginPath();cc.moveTo(x+r,y);cc.lineTo(x+w-r,y);cc.quadraticCurveTo(x+w,y,x+w,y+r);cc.lineTo(x+w,y+h-r);cc.quadraticCurveTo(x+w,y+h,x+w-r,y+h);cc.lineTo(x+r,y+h);cc.quadraticCurveTo(x,y+h,x,y+h-r);cc.lineTo(x,y+r);cc.quadraticCurveTo(x,y,x+r,y);cc.closePath()}
function paperPoint(u,v,side,p=0){const a=Math.PI*p,fold=Math.exp(-6*u),lift=Math.sin(a);return {x:768+side*((624*u-10*Math.sin(Math.PI*u)*fold)*Math.cos(a)+52*lift*Math.sin(Math.PI*u)),y:(116+24*fold)*(1-v)+(879-24*fold)*v+lift*20*Math.sin(Math.PI*u)*(1-2*v)}}
function contour(cc,side,p=0){cc.beginPath();for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side,p);j?cc.lineTo(q.x,q.y):cc.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side,p);cc.lineTo(q.x,q.y)}cc.closePath()}
function interpolate(q,u,v){const [A,B,C,D]=q,dx1=B.x-C.x,dx2=D.x-C.x,dx3=A.x-B.x+C.x-D.x,dy1=B.y-C.y,dy2=D.y-C.y,dy3=A.y-B.y+C.y-D.y,den=dx1*dy2-dx2*dy1,g=Math.abs(den)>1e-9?(dx3*dy2-dx2*dy3)/den:0,h=Math.abs(den)>1e-9?(dx1*dy3-dx3*dy1)/den:0,z=1+g*u+h*v;return {x:(A.x+(B.x-A.x+g*B.x)*u+(D.x-A.x+h*D.x)*v)/z,y:(A.y+(B.y-A.y+g*B.y)*u+(D.y-A.y+h*D.y)*v)/z}}
// Four paper corners per native image, including the complete decorated margin.
const profiles=[null, [[130, 94], [776, 112], [776, 916], [130, 900], [1433, 94], [1433, 900]], [[132, 90], [774, 111], [774, 917], [132, 900], [1429, 90], [1429, 900]], [[135, 95], [774, 110], [774, 917], [135, 901], [1428, 95], [1428, 901]], [[133, 95], [774, 110], [774, 917], [133, 901], [1429, 95], [1429, 901]], [[132, 95], [774, 111], [774, 917], [132, 901], [1428, 95], [1428, 901]]];
function sourcePoint(a,u,v,side){const pts=a.map(([x,y])=>({x,y}));const q=side===-1?pts.slice(0,4):[pts[1],pts[4],pts[5],pts[2]];return interpolate(q,side===1?u:1-u,v)}
function triangle(cc,im,q,t){const [a,b,c]=q,[A,B,C]=t;const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);const center={x:(a.x+b.x+c.x)/3,y:(a.y+b.y+c.y)/3};const expanded=[a,b,c].map(q=>{const dx=q.x-center.x,dy=q.y-center.y,length=Math.hypot(dx,dy)||1;return {x:q.x+.85*dx/length,y:q.y+.85*dy/length}});cc.save();cc.beginPath();cc.moveTo(expanded[0].x,expanded[0].y);cc.lineTo(expanded[1].x,expanded[1].y);cc.lineTo(expanded[2].x,expanded[2].y);cc.closePath();cc.clip();cc.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const x=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),y=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1),w=Math.min(im.width-x,Math.ceil(Math.max(A.x,B.x,C.x))-x+2),h=Math.min(im.height-y,Math.ceil(Math.max(A.y,B.y,C.y))-y+2);if(w>0&&h>0)cc.drawImage(im,x,y,w,h,x,y,w,h);cc.restore()}
function mesh(cc,im,src,dst,cols,rows){for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){const uv=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]],q=uv.map(([u,v])=>dst(u,v)),t=uv.map(([u,v])=>src(u,v));triangle(cc,im,[q[0],q[1],q[2]],[t[0],t[1],t[2]]);triangle(cc,im,[q[0],q[2],q[3]],[t[0],t[2],t[3]])}}
// Decode once: the animated mesh samples images rather than live canvases.
async function freeze(c){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=c.toDataURL('image/png')})}
async function prepare(raw,book={}){
 const registrations=raw.map((_,i)=>i===0?null:(book.pages?.[i-1]?.registration||((raw.length===6)?profiles[i]:null)));
 if(registrations.slice(1).some(p=>!Array.isArray(p)||p.length!==6||p.some(q=>!Array.isArray(q)||q.length!==2||q.some(n=>!Number.isFinite(n)))))throw Error("espadas: registre os seis pontos da nova dupla no catálogo");
 const finalIndex=raw.length-1,cover=make(),cc=cover.getContext('2d');
 const clean=document.createElement('canvas');clean.width=raw[0].width;clean.height=raw[0].height;const cl=clean.getContext('2d');cl.drawImage(raw[0],0,0);cl.drawImage(raw[0],974,818,84,299,974,511,84,299);
 const maskedCover=document.createElement('canvas');maskedCover.width=clean.width;maskedCover.height=clean.height;const mc=maskedCover.getContext('2d');mc.clip(new Path2D("M89 170 Q89 143 116 143 L1033 143 Q1058 144 1058 169 L1058 1169 Q1058 1195 1032 1195 L111 1195 Q89 1195 89 1170 Z"));mc.drawImage(clean,0,0);const sourceCover=await freeze(maskedCover);
 cc.save();boardPath(cc,1);cc.clip();cc.fillStyle='#c7ae78';cc.fillRect(768,85,662,825);
 mesh(cc,sourceCover,(u,v)=>({x:89+969*u,y:143+1052*v}),(u,v)=>({x:768+662*u,y:85+825*v}),40,16);cc.restore();
 const frozenCover=await freeze(cover),frame=make(),fc=frame.getContext('2d');
 // Front and back share one level silhouette; no photographed paper stack remains in the frame.
 fc.drawImage(frozenCover,0,0);fc.save();fc.translate(1536,0);fc.scale(-1,1);fc.drawImage(frozenCover,0,0);fc.restore();
 fc.fillStyle='#e7d2a7';fc.fillRect(140,108,1256,780);fc.fillRect(676,85,184,825);
 fc.drawImage(frozenCover,1250,85,50,23,676,85,184,23);fc.drawImage(frozenCover,1250,888,50,22,676,888,184,22);
 const binding=fc.createLinearGradient(758,0,778,0);binding.addColorStop(0,'#a57c4a');binding.addColorStop(.5,'#4b2817');binding.addColorStop(1,'#cda66e');fc.fillStyle=binding;fc.fillRect(758,138,20,719);
 const fitting=make(),fit=fitting.getContext("2d");fit.save();fit.clip(new Path2D("M1435 440 Q1435 431 1452 432 L1457 414 Q1447 393 1462 366 Q1500 403 1493 427 L1519 404 Q1518 434 1500 450 L1488 475 Q1490 509 1503 541 L1522 565 Q1495 557 1484 537 Q1500 581 1463 612 Q1454 586 1458 564 L1465 532 L1452 530 Q1435 531 1435 516 Z"));fit.drawImage(raw[1],0,0);fit.restore();const fittingImage=await freeze(fitting);fit.clearRect(0,0,W,H);fit.drawImage(fittingImage,-57,-5);
 const frozenFrame=await freeze(frame),frozenFitting=await freeze(fitting);
 const base=make(),bc=base.getContext('2d');bc.drawImage(frozenFrame,0,0);for(const side of [-1,1]){bc.save();contour(bc,side);bc.clip();bc.fillStyle='#e7d2a7';bc.fillRect(0,0,W,H);bc.restore()}
 const paperBase=await freeze(base),papers=[null],spreads=[null],unfittedSpreads=[null];
 for(let i=1;i<raw.length;i++){const spread=make(),sc=spread.getContext('2d');sc.drawImage(paperBase,0,0);const pair=[];
 for(const side of [-1,1]){const c=make(),pc=c.getContext('2d');pc.save();contour(pc,side);pc.clip();pc.fillStyle='#e7d2a7';pc.fillRect(0,0,W,H);mesh(pc,raw[i],(u,v)=>sourcePoint(registrations[i],u,v,side),(u,v)=>paperPoint(u,v,side),40,16);
 const g=pc.createLinearGradient(768,0,768+side*75,0);g.addColorStop(0,'rgba(67,30,14,.26)');g.addColorStop(.4,'rgba(67,30,14,.08)');g.addColorStop(1,'rgba(67,30,14,0)');pc.fillStyle=g;pc.fillRect(Math.min(768,768+side*75),100,75,790);pc.restore();sc.drawImage(c,0,0);pair.push(await freeze(c))}
 unfittedSpreads.push(await freeze(spread));sc.drawImage(frozenFitting,0,0);papers.push(pair);spreads.push(await freeze(spread))}
 const covered=make(),coveredContext=covered.getContext('2d');coveredContext.drawImage(unfittedSpreads[1],0,0);coveredContext.globalCompositeOperation='destination-in';coveredContext.drawImage(frozenCover,0,0);const coveredImage=await freeze(covered);
 function clasp(ctx){ctx.drawImage(frozenFitting,0,0)}
 function closed(ctx){ctx.drawImage(frozenCover,0,0);clasp(ctx)}
 function opening(ctx,p){
  if(p<=0){closed(ctx);return}
  if(p>=1){ctx.drawImage(spreads[1],0,0);return}
  const cos=Math.cos(Math.PI*p),reveal=SPINE;
  ctx.save();ctx.beginPath();ctx.rect(reveal,0,W-reveal,H);ctx.clip();ctx.drawImage(coveredImage,0,0);ctx.restore();
  if(cos>=0){ctx.save();ctx.translate(SPINE,0);ctx.scale(cos,1);ctx.translate(-SPINE,0);ctx.drawImage(frozenCover,0,0);ctx.restore()}
  else{ctx.save();ctx.translate(SPINE,0);ctx.scale(-cos,1);ctx.translate(-SPINE,0);ctx.beginPath();ctx.rect(0,0,SPINE,H);ctx.clip();ctx.drawImage(spreads[1],0,0);ctx.restore()}
  clasp(ctx);
 }
 function half(ctx,i,side){ctx.save();contour(ctx,side);ctx.clip();ctx.drawImage(spreads[i],0,0);ctx.restore()}
 return {presentationScale:2,render(ctx,state,animation,p){
  if(!animation||p<=0||p>=1){const settled=animation?(p>=1?animation.to:animation.from):state;if(settled===0)closed(ctx);else ctx.drawImage(spreads[settled],0,0);return}
  if(animation.from===0||animation.to===0){opening(ctx,animation.to===0?1-p:p);return}
  const direction=animation.to>animation.from?1:-1;
  ctx.drawImage(paperBase,0,0);half(ctx,animation.from,-direction);half(ctx,animation.to,direction);
  const src=p<.5?animation.from:animation.to,side=p<.5?direction:-direction;
  ctx.save();
  ctx.beginPath();ctx.rect(138,114,1260,770);ctx.clip();
  contour(ctx,direction,p);ctx.shadowColor='rgba(55,27,9,.30)';ctx.shadowBlur=16;ctx.shadowOffsetX=direction*8*Math.sin(Math.PI*p);ctx.fillStyle='rgba(55,27,9,.12)';ctx.fill();ctx.restore();
  mesh(ctx,papers[src][side===1?1:0],(u,v)=>paperPoint(u,v,side),(u,v)=>paperPoint(u,v,direction,p),44,12);
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);for(const side of [-1,1]){for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side);j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side);ctx.lineTo(q.x,q.y)}ctx.closePath()}ctx.clip('evenodd');ctx.drawImage(frozenFrame,0,0);ctx.restore();clasp(ctx);
 }};
}
window.GrimorioEspadas={prepare};
})();
