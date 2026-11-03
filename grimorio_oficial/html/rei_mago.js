/* Rei Mago — montagem própria; folhas completas, bordas separadas e abertura registrada. */
(() => {
'use strict';
const W=1536,H=1024,SPINE=768,BOARD=662;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const endingOutline=new Path2D('M 143 27 L 166 30 L 779 132 L 795 136 L 817 129 L 1377 63 L 1400 57 L 1420 60 L 1430 72 L 1434 132 L 1435 209 L 1440 297 L 1446 375 L 1448 406 L 1473 407 Q 1485 406 1487 415 L 1488 429 L 1483 434 L 1485 452 L 1489 459 L 1488 469 L 1483 469 L 1484 507 Q 1491 512 1489 519 L 1471 524 L 1459 522 L 1460 595 L 1465 689 L 1470 780 L 1475 864 L 1477 894 L 1483 966 L 1470 975 L 1450 976 L 819 945 L 795 944 L 776 940 L 754 932 L 56 869 L 52 856 L 58 784 L 81 611 L 77 595 L 85 578 L 90 510 L 94 438 L 94 423 L 100 402 L 108 247 L 110 237 L 111 222 L 122 205 L 129 80 L 130 53 Z');
const coverBody=new Path2D('M 110 1203 L 110 80 Q 113 48 147 43 L 184 42 L 198 48 L 208 46 L 237 45 L 257 43 L 570 35 L 606 27 L 617 35 L 980 45 L 1018 45 L 1037 50 L 1049 71 L 1054 101 L 1052 517 L 1052 1124 L 1052 1197 L 1044 1214 L 1024 1221 L 201 1221 L 185 1212 L 184 1218 Q 143 1231 111 1210 Z');
const boardQuads={
 left:[{x:141,y:27},{x:704,y:127},{x:666,y:939},{x:52,y:866}],
 right:[{x:704,y:127},{x:1427,y:58},{x:1482,y:975},{x:666,y:939}],
 endLeft:[{x:141,y:27},{x:797,y:137},{x:795,y:943},{x:52,y:866}],
 endRight:[{x:797,y:137},{x:1427,y:58},{x:1482,y:975},{x:795,y:943}]
};
const paperQuads={intro:[{x:740,y:146},{x:1346,y:100},{x:1363,y:854},{x:710,y:851}],ending:[{x:217,y:61},{x:776,y:154},{x:769,y:848},{x:181,y:807}]};
function bilinear(quad,u,v){const [A,B,C,D]=quad;return {x:(A.x*(1-u)+B.x*u)*(1-v)+(D.x*(1-u)+C.x*u)*v,y:(A.y*(1-u)+B.y*u)*(1-v)+(D.y*(1-u)+C.y*u)*v};}
// Projective registration preserves straight photographed edges.
function interpolate(quad,u,v){
 const [A,B,C,D]=quad,dx1=B.x-C.x,dx2=D.x-C.x,dx3=A.x-B.x+C.x-D.x;
 const dy1=B.y-C.y,dy2=D.y-C.y,dy3=A.y-B.y+C.y-D.y,den=dx1*dy2-dx2*dy1;
 const g=Math.abs(den)>1e-9?(dx3*dy2-dx2*dy3)/den:0;
 const h=Math.abs(den)>1e-9?(dx1*dy3-dx3*dy1)/den:0,z=1+g*u+h*v;
 return {x:(A.x+(B.x-A.x+g*B.x)*u+(D.x-A.x+h*D.x)*v)/z,
 y:(A.y+(B.y-A.y+g*B.y)*u+(D.y-A.y+h*D.y)*v)/z};
}
function boardPath(cc,side){
 const x=side===1?SPINE:SPINE-BOARD,y=85,r=18,w=BOARD,h=825;
 cc.beginPath();cc.moveTo(x+r,y);cc.lineTo(x+w-r,y);cc.quadraticCurveTo(x+w,y,x+w,y+r);
 cc.lineTo(x+w,y+h-r);cc.quadraticCurveTo(x+w,y+h,x+w-r,y+h);cc.lineTo(x+r,y+h);
 cc.quadraticCurveTo(x,y+h,x,y+h-r);cc.lineTo(x,y+r);cc.quadraticCurveTo(x,y,x+r,y);cc.closePath();
}
function envelope(points,x){let i=1;while(i<points.length-1&&x>points[i][0])i++;const [a,b]=[points[i-1],points[i]],t=Math.max(0,Math.min(1,(x-a[0])/(b[0]-a[0])));return a[1]+t*(b[1]-a[1]);}

function paperPoint(u,v,side,p=0){
 const a=Math.PI*p,fold=Math.exp(-7*u),lift=Math.sin(a);
 const distance=630*u-14*Math.sin(Math.PI*u)*fold;
 const top=117+26*fold,bottom=878-26*fold;
 return {x:SPINE+side*(distance*Math.cos(a)+lift*58*Math.sin(Math.PI*u)),
  y:top*(1-v)+bottom*v+lift*24*Math.sin(Math.PI*u)*(1-2*v)};
}
function contour(cc,side,p=0){cc.beginPath();for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side,p);j?cc.lineTo(q.x,q.y):cc.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side,p);cc.lineTo(q.x,q.y)}cc.closePath()}
function triangle(cc,im,q,t){const [a,b,c]=q,[A,B,C]=t;const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);const center={x:(a.x+b.x+c.x)/3,y:(a.y+b.y+c.y)/3};const expanded=[a,b,c].map(q=>{const dx=q.x-center.x,dy=q.y-center.y,length=Math.hypot(dx,dy)||1;return {x:q.x+.85*dx/length,y:q.y+.85*dy/length}});cc.save();cc.beginPath();cc.moveTo(expanded[0].x,expanded[0].y);cc.lineTo(expanded[1].x,expanded[1].y);cc.lineTo(expanded[2].x,expanded[2].y);cc.closePath();cc.clip();cc.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const x=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),y=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1),w=Math.min(im.width-x,Math.ceil(Math.max(A.x,B.x,C.x))-x+2),h=Math.min(im.height-y,Math.ceil(Math.max(A.y,B.y,C.y))-y+2);if(w>0&&h>0)cc.drawImage(im,x,y,w,h,x,y,w,h);cc.restore()}
function mesh(cc,im,src,dst,cols,rows){for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){const uv=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]],q=uv.map(([u,v])=>dst(u,v)),t=uv.map(([u,v])=>src(u,v));triangle(cc,im,[q[0],q[1],q[2]],[t[0],t[1],t[2]]);triangle(cc,im,[q[0],q[2],q[3]],[t[0],t[2],t[3]])}}
// Decode once: the animated mesh samples images rather than live canvases.
async function freeze(c){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=c.toDataURL('image/png')})}
function masked(im,path){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const cc=c.getContext('2d');cc.save();cc.clip(path);cc.drawImage(im,0,0);cc.restore();return c}
function sourcePaper(quad,u,v,side,padX=.008,padTop=.01,padBottom=.01){return interpolate(quad,-padX+(side===1?u:1-u)*(1+2*padX),-padTop+v*(1+padTop+padBottom))}
function parchment(cc,side){cc.save();contour(cc,side);cc.clip();const g=cc.createLinearGradient(SPINE,0,SPINE+side*630,0);g.addColorStop(0,'#d0ad79');g.addColorStop(.06,'#eed6ad');g.addColorStop(.35,'#f9e7c8');g.addColorStop(.9,'#f5dfb5');g.addColorStop(1,'#e2bd87');cc.fillStyle=g;cc.fillRect(0,0,W,H);cc.restore()}
async function prepare(raw){
 const finalIndex=raw.length-1;
 const end=await freeze(masked(raw[finalIndex],endingOutline));
 const frame=make(),fc=frame.getContext('2d');
 const cover=make(),cc=cover.getContext('2d');
 const clean=document.createElement('canvas');clean.width=raw[0].width;clean.height=raw[0].height;const cl=clean.getContext('2d');cl.drawImage(raw[0],0,0);cl.drawImage(raw[0],925,810,128,140,925,529,128,140);
 // Straighten the native cover edge instead of copying its uneven silhouette.
 const cleanImage=await freeze(masked(clean,coverBody));
 const upper=[[110,80],[147,43],[184,42],[257,43],[570,35],[606,27],[617,35],[980,45],[1037,50],[1053,101]];
 const lower=[[110,1203],[184,1218],[201,1221],[1024,1221],[1053,1197]];
 cc.save();boardPath(cc,1);cc.clip();cc.fillStyle='#edd3ae';cc.fillRect(SPINE,85,BOARD,825);
 mesh(cc,cleanImage,(u,v)=>{const x=110+943*u;return {x,y:envelope(upper,x)*(1-v)+envelope(lower,x)*v}},(u,v)=>({x:SPINE+BOARD*u,y:85+825*v}),40,16);cc.restore();
 const fitting=make(),fit=fitting.getContext('2d');fit.save();fit.clip(new Path2D('M 1398 393 Q 1430 389 1452 394 Q 1466 396 1466 406 L 1465 414 L 1461 416 L 1463 432 L 1465 437 L 1466 445 L 1465 450 L 1459 450 L 1459 479 Q 1464 482 1464 490 Q 1466 496 1442 499 L 1429 499 L 1404 493 L 1398 489 L 1396 480 Q 1375 469 1378 438 Q 1376 416 1397 405 Z'));mesh(fit,end,(u,v)=>bilinear(boardQuads.endRight,-.025+u*1.12,-.012+v*1.024),(u,v)=>({x:SPINE+BOARD*(-.025+u*1.12),y:75+835*(-.012+v*1.024)}),40,16);fit.restore();
 // Identical, level outer frame on both boards; inside panels are separate.
 fc.clearRect(0,0,W,H);fc.drawImage(cover,0,0);
 fc.save();fc.translate(2*SPINE,0);fc.scale(-1,1);fc.drawImage(cover,0,0);fc.restore();
 for(const side of [-1,1]){
  fc.save();boardPath(fc,side);fc.clip();fc.fillStyle='#f3dfbd';
  fc.fillRect(side===1?SPINE:SPINE-630,110,630,776);fc.restore();
 }
 // Inside boards share one hinge, rather than duplicating the front-cover spine.
 fc.fillStyle='#f3dfbd';fc.fillRect(SPINE-64,85,128,825);
 fc.drawImage(cover,1200,85,50,25,SPINE-64,85,128,25);
 fc.drawImage(cover,1200,885,50,25,SPINE-64,885,128,25);
 // Rounded binding joins the boards behind the sewn leaves.
 fc.save();fc.beginPath();fc.moveTo(SPINE-2,85);fc.lineTo(SPINE+2,85);fc.quadraticCurveTo(SPINE+10,85,SPINE+10,97);fc.lineTo(SPINE+10,891);fc.quadraticCurveTo(SPINE+10,903,SPINE+2,903);fc.lineTo(SPINE-2,903);fc.quadraticCurveTo(SPINE-10,903,SPINE-10,891);fc.lineTo(SPINE-10,97);fc.quadraticCurveTo(SPINE-10,85,SPINE-2,85);fc.closePath();fc.clip();
 const binding=fc.createLinearGradient(SPINE-10,0,SPINE+10,0);
 binding.addColorStop(0,'#e8c99d');binding.addColorStop(.35,'#ab7a43');binding.addColorStop(.5,'#815329');binding.addColorStop(.65,'#ab7a43');binding.addColorStop(1,'#e8c99d');
 fc.fillStyle=binding;fc.fillRect(SPINE-10,85,20,818);
 fc.drawImage(raw[0],113,55,76,40,SPINE-10,85,20,29);
 fc.drawImage(raw[0],113,1169,76,40,SPINE-10,874,20,29);fc.restore();
 const frozenFrame=await freeze(frame),frozenCover=await freeze(cover),frozenFitting=await freeze(fitting);
 const base=make(),bc=base.getContext('2d');bc.drawImage(frozenFrame,0,0);
 for(const side of [-1,1])parchment(bc,side);
 const paperBase=await freeze(base);
 const versoLeft=make(),vl=versoLeft.getContext('2d'),versoRight=make(),vr=versoRight.getContext('2d');
 const versoQuads={left:[{x:180,y:83},{x:678,y:166},{x:643,y:881},{x:132,y:825}],
 right:[{x:815,y:168},{x:1337,y:95},{x:1345,y:858},{x:807,y:878}]};
 for(const [pc,im,quad,side] of [[vl,raw[1],versoQuads.left,-1],[vr,raw[finalIndex],versoQuads.right,1]]){
  parchment(pc,side);pc.save();contour(pc,side);pc.clip();mesh(pc,im,(u,v)=>sourcePaper(quad,u,v,side,.015,.03,.02),(u,v)=>paperPoint(u,v,side),40,16);pc.restore();
 }
 const frozenVersos=[await freeze(versoLeft),await freeze(versoRight)];
 const papers=[null],spreads=[null],unfittedSpreads=[null];
 for(let i=1;i<raw.length;i++){
  const spread=make(),sc=spread.getContext('2d');sc.drawImage(paperBase,0,0);const pair=[];
  for(const side of [-1,1]){
   const c=make(),pc=c.getContext('2d');
   if((i===1&&side===-1)||(i===finalIndex&&side===1)){
    pc.drawImage(frozenVersos[side===1?1:0],0,0);
   }else{
    parchment(pc,side);pc.save();contour(pc,side);pc.clip();
    if(i===1||i===finalIndex){const quad=i===1?paperQuads.intro:paperQuads.ending;mesh(pc,raw[i],(u,v)=>sourcePaper(quad,u,v,side),(u,v)=>paperPoint(u,v,side),36,12)}
    else{
     // Register the complete native leaf to its physical page plane.
     // Transparent padding is excluded; all four decorated borders stay on the leaf.
     const bounds=i===2?[21,36,1752,853]:i===3?[22,34,1753,853]:[21,33,1753,853];
     const [x,y,r,b]=bounds,mid=(x+r)/2;
     mesh(pc,raw[i],(u,v)=>({x:mid+side*(r-x)*.5*u,y:y+(b-y)*v}),(u,v)=>paperPoint(u,v,side),36,12);
    }
    pc.restore();
   }
   // Light and shadow follow the same folded plane as the artwork.
   pc.save();contour(pc,side);pc.clip();
   const shade=pc.createLinearGradient(SPINE,0,SPINE+side*88,0);
   shade.addColorStop(0,'rgba(78,39,16,.36)');shade.addColorStop(.27,'rgba(98,55,26,.13)');shade.addColorStop(.6,'rgba(255,244,209,.09)');shade.addColorStop(1,'rgba(255,244,209,0)');
   pc.fillStyle=shade;pc.fillRect(Math.min(SPINE,SPINE+side*88),100,88,790);pc.restore();
   sc.drawImage(c,0,0);pair.push(await freeze(c));
  }
  unfittedSpreads.push(await freeze(spread));sc.drawImage(frozenFitting,0,0);papers.push(pair);spreads.push(await freeze(spread));
 }
 const covered=make(),coveredContext=covered.getContext('2d');
 coveredContext.drawImage(unfittedSpreads[1],0,0);coveredContext.globalCompositeOperation='destination-in';coveredContext.drawImage(frozenCover,0,0);
 const coveredImage=await freeze(covered);
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
window.GrimorioReiMago={prepare};
})();
