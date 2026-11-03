/* Grimórios de Lore: geometria independente das Trevas. Fontes PNG intactas. */
(() => {
'use strict';
const W=1536,H=1024,SPINE=768;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const spreadPath='M 147 77 L 198 74 Q 480 76 744 91 Q 763 94 768 111 Q 784 92 804 89 L 1342 74 L 1406 73 L 1466 128 L 1470 402 L 1484 403 Q 1490 416 1477 434 L 1496 445 Q 1504 458 1498 477 Q 1495 493 1481 492 L 1485 530 L 1472 538 L 1475 853 L 1420 921 L 1350 927 L 796 930 L 768 923 L 743 930 L 166 925 L 133 922 Q 86 935 60 913 L 59 887 L 65 832 L 64 778 L 59 724 L 66 657 L 61 603 L 65 543 L 65 475 L 68 415 L 68 349 L 67 280 L 71 205 L 71 137 Q 63 88 105 78 Z';
const coverPath='M 174 115 L 204 115 L 248 85 L 324 85 L 337 91 L 892 91 L 905 85 L 974 85 L 1072 177 L 1074 305 L 1065 311 L 1065 550 Q 1087 544 1094 550 Q 1097 554 1082 568 Q 1072 581 1070 595 Q 1103 590 1110 621 Q 1113 644 1096 656 L 1080 657 Q 1080 688 1099 706 Q 1105 715 1093 715 L 1068 711 L 1067 1126 L 1001 1203 L 882 1209 L 864 1205 L 354 1205 L 343 1212 L 228 1210 L 201 1194 L 172 1193 Q 87 1223 76 1195 L 77 1160 L 79 1098 L 78 1028 L 75 963 L 77 893 L 77 825 L 77 752 L 77 681 L 76 612 L 77 536 L 78 465 L 78 396 L 79 326 L 81 255 L 80 184 Q 78 124 126 115 Z';
// Source paper edges are measured separately for every supplied spread.
const sourceProfiles=[null,
 {spine:768,left:158,right:1400,top:92,center:112,bottom:894},
 {spine:768,left:150,right:1395,top:72,center:87,bottom:893},
 {spine:772,left:143,right:1413,top:82,center:99,bottom:904},
 {spine:768,left:154,right:1400,top:91,center:110,bottom:900},
 {spine:769,left:151,right:1401,top:87,center:106,bottom:900}
];
function sourcePoint(profile,u,v,side){return {x:profile.spine+(side===1?profile.right-profile.spine:profile.spine-profile.left)*side*u,y:(profile.top+(profile.center-profile.top)*(1-u)**2)*(1-v)+(profile.bottom-6*(1-u)**2)*v}}
function paperPoint(u,v,side,p=0){const a=Math.PI*p;return {x:SPINE+side*(610*u*Math.cos(a)+Math.sin(a)*22*Math.sin(Math.PI*u)),y:(101+22*(1-u)**2)*(1-v)+(877-5*(1-u)**2)*v+Math.sin(a)*12*Math.sin(Math.PI*u)*(1-2*v)}}
function contour(cc,side){cc.beginPath();for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side);j?cc.lineTo(q.x,q.y):cc.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side);cc.lineTo(q.x,q.y)}cc.closePath()}
function triangle(cc,im,q,t){const [a,b,c]=q,[A,B,C]=t;const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);cc.save();cc.beginPath();cc.moveTo(a.x,a.y);cc.lineTo(b.x,b.y);cc.lineTo(c.x,c.y);cc.closePath();cc.clip();cc.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const x=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),y=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1),w=Math.min(im.width-x,Math.ceil(Math.max(A.x,B.x,C.x))-x+2),h=Math.min(im.height-y,Math.ceil(Math.max(A.y,B.y,C.y))-y+2);if(w>0&&h>0)cc.drawImage(im,x,y,w,h,x,y,w,h);cc.restore()}
function mesh(cc,im,src,dst,cols,rows){for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){const uv=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]],q=uv.map(([u,v])=>dst(u,v)),t=uv.map(([u,v])=>src(u,v));triangle(cc,im,[q[0],q[1],q[2]],[t[0],t[1],t[2]]);triangle(cc,im,[q[0],q[2],q[3]],[t[0],t[2],t[3]])}}
// Decode once: the animated mesh samples images rather than live canvases.
async function freeze(c){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=c.toDataURL('image/png')})}
async function prepare(raw){
 const frame=make(),fc=frame.getContext('2d');fc.save();fc.clip(new Path2D(spreadPath));fc.drawImage(raw[1],0,0);fc.restore();
 const cover=make(),cc=cover.getContext('2d');
 const clean=document.createElement('canvas');clean.width=raw[0].width;clean.height=raw[0].height;const kc=clean.getContext('2d');kc.drawImage(raw[0],0,0);kc.drawImage(raw[0],970,770,97,180,970,542,97,180);
 const bodyPath=coverPath.replace(/L 1065 550.*?L 1067 1126/,'L 1067 550 L 1067 1126');cc.save();cc.translate(SPINE,74);cc.scale(730/1037,856/1128);cc.translate(-75,-85);cc.clip(new Path2D(bodyPath));cc.drawImage(clean,0,0);cc.restore();
 const papers=[null],spreads=[null];
 for(let i=1;i<raw.length;i++){
  const spread=make(),sc=spread.getContext('2d');sc.drawImage(frame,0,0);const pair=[];
  for(const side of [-1,1]){const c=make(),pc=c.getContext('2d');pc.save();contour(pc,side);pc.clip();pc.fillStyle='#e9cd9c';pc.fillRect(0,0,W,H);mesh(pc,raw[i],(u,v)=>sourcePoint(sourceProfiles[i]||sourceProfiles[1],u,v,side),(u,v)=>paperPoint(u,v,side),32,8);pc.restore();sc.drawImage(c,0,0);pair.push(await freeze(c))}
  papers.push(pair);spreads.push(await freeze(spread));
 }
 const frozenFrame=await freeze(frame),frozenCover=await freeze(cover);
 function half(ctx,i,side){ctx.save();contour(ctx,side);ctx.clip();ctx.drawImage(spreads[i],0,0);ctx.restore()}
 function clasp(ctx){ctx.save();ctx.clip(new Path2D('M 1385 474 L 1404 456 L 1420 455 L 1424 439 Q 1450 404 1484 404 Q 1493 407 1480 420 Q 1460 435 1460 452 L 1480 451 Q 1498 452 1502 471 Q 1503 490 1484 494 L 1467 491 Q 1466 519 1488 529 L 1487 536 Q 1456 540 1421 516 L 1403 505 L 1404 490 Z'));ctx.drawImage(frozenFrame,0,0);ctx.restore()}
 function closed(ctx){ctx.drawImage(frozenCover,0,0);clasp(ctx)}
 function opening(ctx,p){
  // Reveal the left interior as the cover moves. At p=0 only the closed silhouette exists.
  const cos=Math.cos(Math.PI*p);
  if(p<=0){closed(ctx);return}
  const reveal=SPINE+685*Math.max(cos,0);
  ctx.save();ctx.beginPath();ctx.rect(reveal,0,W-reveal,H);ctx.clip();ctx.drawImage(spreads[1],0,0);ctx.restore();
  if(cos>=0){ctx.save();ctx.translate(SPINE,0);ctx.scale(cos,1);ctx.translate(-SPINE,0);ctx.drawImage(frozenCover,0,0);ctx.restore()}
  else {ctx.save();ctx.translate(SPINE,0);ctx.scale(-cos,1);ctx.translate(-SPINE,0);ctx.beginPath();ctx.rect(0,0,SPINE,H);ctx.clip();ctx.drawImage(spreads[1],0,0);ctx.restore()}
  clasp(ctx);
 }
 return {render(ctx,state,animation,p){
  if(!animation){if(state===0)closed(ctx);else ctx.drawImage(spreads[state],0,0);return}
  if(animation.from===0||animation.to===0){opening(ctx,animation.to===0?1-p:p);return}
  const direction=animation.to>animation.from?1:-1;
  ctx.drawImage(frozenFrame,0,0);half(ctx,animation.from,-direction);half(ctx,animation.to,direction);
  const src=p<.5?animation.from:animation.to,side=p<.5?direction:-direction;
  mesh(ctx,papers[src][side===1?1:0],(u,v)=>paperPoint(u,v,side),(u,v)=>paperPoint(u,v,direction,p),44,12);
  // Hardware is permanent, and is never included in a moving paper texture.
  ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);for(const side of [-1,1]){for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side);j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side);ctx.lineTo(q.x,q.y)}ctx.closePath()}ctx.clip('evenodd');ctx.drawImage(frozenFrame,0,0);ctx.restore();
 },sourceProfiles};
}
window.GrimorioTrevas={prepare};
})();
