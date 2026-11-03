/* Grimórios de Lore: geometria própria da Árvore do Mundo. Fontes PNG intactas. */
(() => {
'use strict';
const W=1536,H=1024,SPINE=776;
const make=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c};
const spreadPath='M 158 72 Q 125 59 95 72 Q 82 79 84 103 L 84 225 L 81 237 L 84 254 L 82 377 L 79 398 L 83 414 L 81 483 L 76 487 L 77 508 L 79 526 L 77 654 L 76 669 L 77 688 L 72 784 L 73 805 L 68 883 Q 60 907 64 918 Q 73 937 108 932 L 136 927 Q 150 934 170 933 L 741 947 Q 762 950 776 937 Q 790 948 811 945 L 1392 941 Q 1448 947 1477 914 L 1478 875 L 1473 844 L 1460 754 L 1459 724 Q 1459 707 1463 692 Q 1470 664 1460 643 Q 1456 620 1454 604 L 1454 597 Q 1459 598 1464 592 Q 1469 582 1468 569 Q 1474 561 1474 550 L 1471 539 L 1467 535 L 1470 530 Q 1487 530 1490 521 Q 1495 520 1495 515 Q 1499 510 1494 504 Q 1497 500 1498 492 Q 1497 490 1496 492 Q 1488 495 1478 499 L 1478 487 L 1482 487 Q 1490 487 1490 480 Q 1490 475 1482 473 Q 1476 472 1472 468 L 1470 462 Q 1475 464 1482 460 Q 1487 453 1484 449 Q 1488 442 1488 431 Q 1483 433 1475 435 L 1475 432 Q 1471 419 1473 408 Q 1473 392 1462 380 Q 1465 362 1457 357 L 1458 298 L 1456 214 Q 1462 173 1455 143 L 1453 90 Q 1446 82 1421 81 Q 1395 65 1378 67 L 801 90 Q 780 93 776 108 Q 766 93 747 92 L 191 73 Z';
const coverPath='M 164 109 Q 137 98 112 108 Q 80 111 83 140 L 83 255 L 82 295 L 85 351 Q 79 359 83 380 L 85 469 L 81 513 L 81 620 L 83 659 L 80 682 L 79 744 L 79 838 L 80 898 L 79 1003 L 78 1099 L 77 1176 Q 71 1201 81 1206 Q 94 1218 130 1216 L 164 1210 Q 184 1223 205 1218 Q 298 1209 348 1211 Q 520 1230 614 1221 Q 731 1211 808 1216 Q 908 1241 968 1219 L 1032 1200 Q 1067 1193 1067 1180 L 1067 1080 L 1062 970 L 1063 859 L 1059 792 L 1055 557 L 1052 507 L 1055 400 L 1061 309 L 1061 198 L 1061 143 Q 1033 126 1007 109 Q 968 91 927 102 Q 759 138 635 121 Q 567 98 510 105 Q 405 132 323 105 Q 277 92 219 111 Q 188 117 164 109 Z';
// Source paper edges are measured separately for every supplied spread.
const sourceProfiles=[null,
 {spine:776,left:168,right:1427,top:87,center:116,bottom:924},
 {spine:779,left:166,right:1432,top:78,center:101,bottom:895},
 {spine:767,left:143,right:1412,top:69,center:99,bottom:906},
 {spine:779,left:180,right:1413,top:81,center:117,bottom:908},
 {spine:765,left:131,right:1425,top:84,center:119,bottom:907}
];
function sourcePoint(profile,u,v,side){return {x:profile.spine+(side===1?profile.right-profile.spine:profile.spine-profile.left)*side*u,y:(profile.top+(profile.center-profile.top)*(1-u)**2)*(1-v)+(profile.bottom-6*(1-u)**2)*v}}
function paperPoint(u,v,side,p=0){const a=Math.PI*p;return {x:SPINE+side*((side===1?650:610)*u*Math.cos(a)+Math.sin(a)*22*Math.sin(Math.PI*u)),y:(87+29*(1-u)**2)*(1-v)+(924-5*(1-u)**2)*v+Math.sin(a)*12*Math.sin(Math.PI*u)*(1-2*v)}}
function contour(cc,side){cc.beginPath();for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side);j?cc.lineTo(q.x,q.y):cc.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side);cc.lineTo(q.x,q.y)}cc.closePath()}
function triangle(cc,im,q,t){const [a,b,c]=q,[A,B,C]=t;const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);cc.save();cc.beginPath();cc.moveTo(a.x,a.y);cc.lineTo(b.x,b.y);cc.lineTo(c.x,c.y);cc.closePath();cc.clip();cc.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const x=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),y=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1),w=Math.min(im.width-x,Math.ceil(Math.max(A.x,B.x,C.x))-x+2),h=Math.min(im.height-y,Math.ceil(Math.max(A.y,B.y,C.y))-y+2);if(w>0&&h>0)cc.drawImage(im,x,y,w,h,x,y,w,h);cc.restore()}
function mesh(cc,im,src,dst,cols,rows){for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){const uv=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]],q=uv.map(([u,v])=>dst(u,v)),t=uv.map(([u,v])=>src(u,v));triangle(cc,im,[q[0],q[1],q[2]],[t[0],t[1],t[2]]);triangle(cc,im,[q[0],q[2],q[3]],[t[0],t[2],t[3]])}}
// Decode once: the animated mesh samples images rather than live canvases.
async function freeze(c){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=c.toDataURL('image/png')})}
async function prepare(raw){
 const frame=make(),fc=frame.getContext('2d');fc.save();fc.clip(new Path2D(spreadPath));fc.drawImage(raw[1],0,0);fc.restore();
 const cover=make(),cc=cover.getContext('2d');
 const clean=document.createElement('canvas');clean.width=raw[0].width;clean.height=raw[0].height;const kc=clean.getContext('2d');kc.drawImage(raw[0],0,0);kc.drawImage(raw[0],965,900,75,275,968,530,95,275);
 const bodyPath=coverPath;cc.save();cc.translate(SPINE,67);cc.scale(701/990,880/1130);cc.translate(-77,-100);cc.clip(new Path2D(bodyPath));cc.drawImage(clean,0,0);cc.restore();
 const papers=[null],spreads=[null];
 for(let i=1;i<raw.length;i++){
  const spread=make(),sc=spread.getContext('2d');sc.drawImage(frame,0,0);const pair=[];
  for(const side of [-1,1]){const c=make(),pc=c.getContext('2d');pc.save();contour(pc,side);pc.clip();pc.fillStyle='#ead09e';pc.fillRect(0,0,W,H);mesh(pc,raw[i],(u,v)=>sourcePoint(sourceProfiles[i]||sourceProfiles[1],u,v,side),(u,v)=>paperPoint(u,v,side),32,8);pc.restore();sc.drawImage(c,0,0);pair.push(await freeze(c))}
  papers.push(pair);spreads.push(await freeze(spread));
 }
 const frozenFrame=await freeze(frame),frozenCover=await freeze(cover);
 function half(ctx,i,side){ctx.save();contour(ctx,side);ctx.clip();ctx.drawImage(spreads[i],0,0);ctx.restore()}
 function clasp(ctx){ctx.save();ctx.clip(new Path2D('M 1454 597 Q 1459 598 1464 592 Q 1469 582 1468 569 Q 1474 561 1474 550 L 1471 539 L 1467 535 L 1470 530 Q 1487 530 1490 521 Q 1495 520 1495 515 Q 1499 510 1494 504 Q 1497 500 1498 492 Q 1497 490 1496 492 Q 1488 495 1478 499 L 1478 487 L 1482 487 Q 1490 487 1490 480 Q 1490 475 1482 473 Q 1476 472 1472 468 L 1470 462 Q 1475 464 1482 460 Q 1487 453 1484 449 Q 1488 442 1488 431 Q 1483 433 1475 435 L 1475 432 Q 1471 419 1473 408 Q 1473 392 1462 380 Q 1465 362 1457 357 L 1448 372 L 1439 408 L 1440 424 L 1430 447 Q 1420 456 1414 460 Q 1409 465 1410 474 L 1408 479 Q 1400 480 1399 483 Q 1396 487 1399 492 Q 1401 497 1410 494 Q 1428 503 1430 514 L 1424 518 Q 1410 517 1414 508 Q 1418 506 1414 504 Q 1403 504 1404 514 Q 1403 525 1417 529 L 1445 541 Q 1458 562 1453 580 Q 1450 593 1457 595 Z'));ctx.drawImage(frozenFrame,0,0);ctx.restore()}
 function closed(ctx){ctx.drawImage(frozenCover,0,0);clasp(ctx)}
 function opening(ctx,p){
  // Reveal the left interior as the cover moves. At p=0 only the closed silhouette exists.
  const cos=Math.cos(Math.PI*p);
  if(p<=0){closed(ctx);return}
  const reveal=SPINE+686*Math.max(cos,0);
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
window.GrimorioArvoreMundo={prepare};
})();
