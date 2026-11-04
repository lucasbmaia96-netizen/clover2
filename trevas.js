(() => {
'use strict';
const W=1536,H=1024,S=808,PAPER={left:164,right:1452,top:96,bottom:910},WIDTH=644,HEIGHT=814;
const canvas=document.querySelector('#book'),screen=canvas.getContext('2d'),surface=make(),ctx=surface.getContext('2d');
const previous=document.querySelector('#previous'),next=document.querySelector('#next'),coverButton=document.querySelector('#cover'),sizeButton=document.querySelector('#size'),status=document.querySelector('#status');
let state=1,animation=null,ready=false,renderer=null;
function make(){const c=document.createElement('canvas');c.width=W;c.height=H;return c}
function well(c){c.beginPath();c.roundRect(PAPER.left,PAPER.top,PAPER.right-PAPER.left,HEIGHT,2)}
function outsideWell(c){c.beginPath();c.rect(0,0,W,H);c.roundRect(PAPER.left,PAPER.top,PAPER.right-PAPER.left,HEIGHT,2);c.clip('evenodd')}
function paperPoint(u,v,side,p=0){const angle=Math.PI*p,lift=Math.sin(angle);return {x:S+side*(WIDTH*u*Math.cos(angle)+lift*22*Math.sin(Math.PI*u)),y:PAPER.top+HEIGHT*v+lift*12*Math.sin(Math.PI*u)*(1-2*v)}}
function contour(c,side,p=0){c.beginPath();for(let j=0;j<=48;j++){const q=paperPoint(j/48,0,side,p);j?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=paperPoint(j/48,1,side,p);c.lineTo(q.x,q.y)}c.closePath()}
function expanded(q,pad=.65){
 const area=(q[1].x-q[0].x)*(q[2].y-q[0].y)-(q[1].y-q[0].y)*(q[2].x-q[0].x),sign=area>0?1:-1;
 const normals=q.map((a,i)=>{const b=q[(i+1)%3],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy)||1;return {x:sign*dy/n,y:-sign*dx/n}});
 return q.map((a,i)=>{const n=normals[(i+2)%3],m=normals[i],d=Math.max(.025,1+n.x*m.x+n.y*m.y);return {x:a.x+pad*(n.x+m.x)/d,y:a.y+pad*(n.y+m.y)/d}});
}
function triangle(c,image,q,t){
 const [a,b,d]=q,[A,B,D]=t,det=A.x*(B.y-D.y)+B.x*(D.y-A.y)+D.x*(A.y-B.y);if(Math.abs(det)<1e-6)return;
 const solve=(x,y,z)=>[(x*(B.y-D.y)+y*(D.y-A.y)+z*(A.y-B.y))/det,(x*(D.x-B.x)+y*(A.x-D.x)+z*(B.x-A.x))/det,(x*(B.x*D.y-D.x*B.y)+y*(D.x*A.y-A.x*D.y)+z*(A.x*B.y-B.x*A.y))/det];
 const m=solve(a.x,b.x,d.x),n=solve(a.y,b.y,d.y),clip=expanded(q);
 c.save();c.beginPath();c.moveTo(clip[0].x,clip[0].y);c.lineTo(clip[1].x,clip[1].y);c.lineTo(clip[2].x,clip[2].y);c.closePath();c.clip();c.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);
 const x=Math.max(0,Math.floor(Math.min(A.x,B.x,D.x))-3),y=Math.max(0,Math.floor(Math.min(A.y,B.y,D.y))-3),w=Math.min(W-x,Math.ceil(Math.max(A.x,B.x,D.x))-x+6),h=Math.min(H-y,Math.ceil(Math.max(A.y,B.y,D.y))-y+6);
 if(w>0&&h>0)c.drawImage(image,x,y,w,h,x,y,w,h);c.restore();
}
function mesh(c,image,side,direction,p){
 const cols=44,rows=12;
 for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){
  const uv=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]],q=uv.map(([u,v])=>paperPoint(u,v,direction,p)),t=uv.map(([u,v])=>paperPoint(u,v,side));
  triangle(c,image,[q[0],q[1],q[2]],[t[0],t[1],t[2]]);triangle(c,image,[q[0],q[2],q[3]],[t[0],t[2],t[3]]);
 }
}
async function load(url){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Não foi possível carregar uma arte.'));image.src=url})}
async function freeze(c){return load(c.toDataURL('image/png'))}
async function prepare(assets){
 const [frameSource,originalOpening,front,...art]=await Promise.all([assets.frame,assets.opening,assets.cover,...assets.papers.map(p=>p.url)].map(load));
 const source=make(),sourceContext=source.getContext('2d');
 sourceContext.save();sourceContext.clip(new Path2D('M 69 44 Q 31 42 31 78 L 29 942 Q 28 975 77 977 L 110 976 L 120 971 L 750 974 Q 768 982 788 974 L 1447 975 L 1447 53 L 788 54 Q 772 56 769 77 Q 763 54 747 53 L 179 51 L 171 47 L 118 45 Z'));sourceContext.drawImage(frameSource,0,0);sourceContext.restore();
 const frame=make(),fc=frame.getContext('2d');
 // The cover has one narrow rim. The paper never supplies the frame or hardware.
 fc.fillStyle='#1b1423';fc.beginPath();fc.roundRect(145,74,1327,856,6);fc.fill();
 fc.save();outsideWell(fc);
 // Remove the old left corner plates before adding the four smaller fittings.
 fc.beginPath();fc.rect(0,0,W,H);fc.rect(141,73,86,89);fc.rect(141,844,86,88);fc.clip('evenodd');
 fc.drawImage(source,28,43,741,936,60,74,748,856);fc.drawImage(source,769,43,681,936,S,74,664,856);fc.restore();
 // Continue the existing leather rail through the areas formerly occupied by
 // the oversized plates, avoiding rectangular patches at the two left corners.
 fc.save();outsideWell(fc);
 fc.drawImage(frame,145,350,19,88,145,74,19,88);
 fc.drawImage(frame,145,700,19,88,145,842,19,88);
 fc.drawImage(frame,300,74,86,22,141,74,86,22);
 fc.drawImage(frame,300,908,86,22,141,908,86,22);
 fc.restore();
 // Fixed corner fitting, extracted once from the supplied cover, at 18 × 21 px.
 const corner=document.createElement('canvas');corner.width=134;corner.height=158;const cc=corner.getContext('2d');
 cc.clip(new Path2D('M 0 2 L 66 0 L 130 53 L 134 158 L 101 135 L 72 101 L 50 66 L 29 42 Z'));cc.drawImage(originalOpening,1338,73,134,158,0,0,134,158);
 const clasp=make(),cl=clasp.getContext('2d');cl.clip(new Path2D('M 1385 474 L 1404 456 L 1420 455 L 1424 439 Q 1450 404 1484 404 Q 1493 407 1480 420 Q 1460 435 1460 452 L 1480 451 Q 1498 452 1502 471 Q 1503 490 1484 494 L 1467 491 Q 1466 519 1488 529 L 1487 536 Q 1456 540 1421 516 L 1403 505 L 1404 490 Z'));cl.drawImage(originalOpening,0,0);
 function hardware(c,side=0){
  c.save();outsideWell(c);
  for(const [left,bottom] of [[true,false],[false,false],[true,true],[false,true]]){
   if(side===1&&left||side===-1&&!left)continue;
   const x=left?146:1454,y=bottom?909:74;c.save();c.translate(x+(left?18:0),y+(bottom?21:0));c.scale(left?-1:1,bottom?-1:1);c.drawImage(corner,0,0,18,21);c.restore();
  }
  if(side!==-1)c.drawImage(clasp,1385,404,118,134,1456,478,42.48,48.24);
  c.restore();
 }
 const closed=make(),closedContext=closed.getContext('2d');
 const body=new Path2D('M 174 115 L 204 115 L 248 85 L 324 85 L 337 91 L 892 91 L 905 85 L 974 85 L 1072 177 L 1074 305 L 1065 311 L 1067 1126 L 1001 1203 L 882 1209 L 864 1205 L 354 1205 L 343 1212 L 228 1210 L 201 1194 L 172 1193 Q 87 1223 76 1195 L 77 1160 L 79 1098 L 78 1028 L 75 963 L 77 893 L 77 825 L 77 752 L 77 681 L 76 612 L 77 536 L 78 465 L 78 396 L 79 326 L 81 255 L 80 184 Q 78 124 126 115 Z');
 closedContext.save();closedContext.translate(S,74);closedContext.scale(664/999,856/1128);closedContext.translate(-75,-85);closedContext.clip(body);closedContext.drawImage(front,0,0);closedContext.restore();
 const papers=[null];
 for(let i=0;i<art.length;i++){
  const pair=[];
  for(const [j,side] of [[0,-1],[1,1]]){
   const leaf=make(),c=leaf.getContext('2d'),[l,t,r,b]=assets.papers[i].bounds[j];
   c.save();contour(c,side);c.clip();c.fillStyle='#f3ddb5';c.fillRect(0,0,W,H);
   c.drawImage(art[i],l,t,r-l,b-t,side===-1?PAPER.left:S,PAPER.top,WIDTH,HEIGHT);
   const shade=c.createLinearGradient(S,0,S+side*34,0);shade.addColorStop(0,'rgba(74,40,20,.29)');shade.addColorStop(.5,'rgba(74,40,20,.07)');shade.addColorStop(1,'rgba(74,40,20,0)');c.fillStyle=shade;c.fillRect(Math.min(S,S+side*34),PAPER.top,34,HEIGHT);
   c.restore();pair.push(await freeze(leaf));
  }
  papers.push(pair);
 }
 const fixedFrame=await freeze(frame),frontCover=await freeze(closed);
 function half(c,i,side){c.drawImage(papers[i][side===1?1:0],0,0)}
 function settled(c,i){
  if(i===0){c.drawImage(frontCover,0,0);hardware(c,1);return}
  c.drawImage(fixedFrame,0,0);half(c,i,-1);half(c,i,1);hardware(c);
 }
 function opening(c,p,page=1){
  if(p<=0){settled(c,0);return}if(p>=1){settled(c,page);return}
  const cos=Math.cos(Math.PI*p);
  c.save();c.beginPath();c.rect(S,0,W-S,H);c.clip();c.drawImage(fixedFrame,0,0);half(c,page,1);c.restore();
  if(cos>=0){c.save();c.translate(S,0);c.scale(cos,1);c.translate(-S,0);c.drawImage(frontCover,0,0);c.restore()}
  else{c.save();c.translate(S,0);c.scale(-cos,1);c.translate(-S,0);c.beginPath();c.rect(0,0,S,H);c.clip();c.drawImage(fixedFrame,0,0);half(c,page,-1);hardware(c,-1);c.restore()}
  hardware(c,1);
 }
 return {papers,frame:fixedFrame,hardware,render(c,i,turn=null,p=0){
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  if(!turn){settled(c,i);return}
  if(turn.from===0||turn.to===0){opening(c,turn.to===0?1-p:p,turn.from===0?turn.to:turn.from);return}
  if(p<=0){settled(c,turn.from);return}if(p>=1){settled(c,turn.to);return}
  const direction=turn.to>turn.from?1:-1;
  c.drawImage(fixedFrame,0,0);half(c,turn.from,-direction);half(c,turn.to,direction);
  c.save();well(c);c.clip();contour(c,direction,p);c.shadowColor='rgba(45,20,8,.3)';c.shadowBlur=18;c.shadowOffsetX=direction*8*Math.sin(Math.PI*p);c.fillStyle='rgba(45,20,8,.12)';c.fill();c.restore();
  const src=p<.5?turn.from:turn.to,side=p<.5?direction:-direction;
  c.save();well(c);c.clip();mesh(c,papers[src][side===1?1:0],side,direction,p);c.restore();
  hardware(c);
 }};
}
function controls(){
 const busy=!!animation||!ready;previous.disabled=busy||state===0;next.disabled=busy||state===9;coverButton.disabled=busy;
 coverButton.textContent=state===0?'Abrir capa':'Fechar capa';
 status.textContent=!ready?'Preparando as folhas…':state===0?'Capa':`${state}/9 · ${TREASSETS.papers[state-1].title}`;
 canvas.setAttribute('aria-label',ready?(state===0?'Capa do Grimório das Trevas':status.textContent):'Carregando o grimório');
 document.body.dataset.page=String(state);document.body.dataset.busy=String(!!animation);
}
function present(){
 const r=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(r.width*ratio)),h=Math.round(w*H/W);
 if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 screen.setTransform(1,0,0,1,0,0);screen.clearRect(0,0,w,h);screen.imageSmoothingEnabled=true;screen.imageSmoothingQuality='high';screen.drawImage(surface,0,0,w,h);
}
function draw(p=0){if(!renderer)return;renderer.render(ctx,state,animation,p);present()}
function move(to){
 if(!ready||animation||to===state||to<0||to>9)return;
 animation={from:state,to};controls();const start=performance.now(),duration=matchMedia('(prefers-reduced-motion:reduce)').matches?120:1350;
 function tick(now){const t=Math.min(1,(now-start)/duration);draw(t*t*(3-2*t));if(t<1)requestAnimationFrame(tick);else{state=to;animation=null;draw();controls()}}
 requestAnimationFrame(tick);
}
previous.onclick=()=>move(state-1);next.onclick=()=>move(state+1);coverButton.onclick=()=>move(state===0?1:0);
sizeButton.onclick=()=>{document.body.classList.toggle('game-size');sizeButton.textContent=document.body.classList.contains('game-size')?'Ampliar para conferir':'Tamanho do jogo';requestAnimationFrame(()=>draw())};
canvas.onclick=e=>{const r=canvas.getBoundingClientRect();move(state===0?1:state+(e.clientX-r.left>r.width/2?1:-1))};
addEventListener('keydown',e=>{if(e.repeat||!['ArrowLeft','ArrowRight','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home')move(state===0?1:0);else move(state+(e.key==='ArrowRight'?1:-1))});
addEventListener('resize',()=>draw());
window.TrevasPreview={get state(){return state},get ready(){return ready},get busy(){return !!animation},move,geometry:{spine:S,paper:PAPER,width:WIDTH,height:HEIGHT},snapshot(i,turn=null,p=0){const c=make();renderer.render(c.getContext('2d'),i,turn,p);return c.toDataURL('image/png')},paper(i,side){return renderer.papers[i][side===1?1:0].src},hardware(){const c=make();renderer.hardware(c.getContext('2d'));return c.toDataURL('image/png')}};
controls();prepare(TREASSETS).then(r=>{renderer=r;ready=true;draw();controls()}).catch(e=>{status.textContent='Falha ao preparar o grimório: '+e.message;document.body.dataset.error=e.message});
})();
