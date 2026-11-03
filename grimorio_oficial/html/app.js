(() => {
'use strict';
const root=document.querySelector('#interface'),display=document.querySelector('canvas'),canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;const ctx=canvas.getContext('2d');
const screen=display.getContext('2d');
const prev=document.querySelector('#prev'),next=document.querySelector('#next'),coverButton=document.querySelector('#cover'),status=document.querySelector('#status');
const inGame=typeof GetParentResourceName==='function';
const catalog=window.GRIMORIO_CATALOG;
let lore=null;
let files=[],names=[],lastPage=0,selectedBook=null,leather='#591713',loadRevision=0;
let openingTimer=0;
let desiredBook=null,desiredKey=null,selectedKey=null,loadJob=null;
const variantsByBook=Object.create(null);
const validBook=id=>typeof id==='string'&&Object.prototype.hasOwnProperty.call(catalog.books,id);
let images=[],papers=[],coverFace=null,state=0,ready=false,animation=null,frame=0,closing=false,target=null;
const numberButtons=Array.from(document.querySelectorAll('[data-page-number]'));
const H=768;
// Insets follow the paper boundary, keeping the leather and metal outside the mesh.
function top(u){return 99+40*Math.pow(1-u,2)}
function bottom(u){return 866-14*u}
function point(u,v,side,p){
 const w=side===1?622:615;
 const a=Math.PI*p, bend=Math.sin(a)*22*Math.sin(Math.PI*u);
 return {x:H+side*(w*u*Math.cos(a)+bend),y:top(u)+(bottom(u)-top(u))*v+Math.sin(a)*12*Math.sin(Math.PI*u)*(1-2*v)};
}
function paperPath(side){ctx.beginPath();for(let j=0;j<=48;j++){const q=point(j/48,0,side,0);j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=point(j/48,1,side,0);ctx.lineTo(q.x,q.y)}ctx.closePath()}
// Source-space silhouettes. Only the immutable PNG source is read; no recompression.
const spreadOutline=new Path2D('M 113 82 Q 125 77 177 82 Q 478 91 735 111 Q 750 115 751 127 Q 768 116 788 114 Q 1060 88 1353 82 L 1409 82 Q 1424 84 1424 108 L 1428 157 L 1436 389 L 1449 392 L 1455 412 L 1464 438 L 1470 453 L 1460 477 L 1452 489 L 1451 514 L 1440 516 L 1455 797 L 1460 817 L 1462 864 Q 1460 879 1442 881 L 1383 882 L 808 891 L 790 895 L 786 915 L 794 933 L 768 971 L 740 936 L 751 912 L 749 894 L 733 891 L 145 879 L 92 880 Q 77 878 76 864 L 77 799 L 85 793 L 90 692 L 81 689 L 81 674 L 95 658 L 104 565 L 89 559 L 89 541 L 106 530 L 113 464 L 95 460 L 95 440 L 114 430 L 122 349 L 103 346 L 103 327 L 124 314 L 130 237 L 106 237 L 106 217 L 127 207 L 111 154 Z');
const coverOutline=new Path2D('M 93 160 Q 105 154 195 159 L 1008 158 L 1039 161 L 1048 178 L 1048 552 L 1066 554 L 1071 582 L 1087 615 L 1090 638 L 1075 667 L 1063 689 L 1054 695 L 1054 1162 Q 1053 1184 1028 1186 L 104 1186 Q 89 1182 88 1163 L 87 1086 L 89 1038 L 88 978 L 87 915 L 88 868 L 88 800 L 86 750 L 86 679 L 85 631 L 88 565 L 87 513 L 90 445 L 89 395 L 91 327 L 88 278 Z');
function maskSource(im,i){const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const cc=c.getContext('2d');cc.save();cc.clip(i===0?coverOutline:spreadOutline);cc.drawImage(im,0,0);cc.restore();return c}
// Paper-only source textures: no leather, clasp, or spine may travel with a leaf.
function paperContour(cc,side){
 cc.beginPath();cc.moveTo(H,137);
 if(side===1){cc.bezierCurveTo(940,112,1190,98,1364,95);cc.lineTo(1398,855);cc.bezierCurveTo(1210,863,933,852,H,871)}
 else {cc.bezierCurveTo(633,112,355,101,179,95);cc.lineTo(151,854);cc.bezierCurveTo(360,857,607,852,H,871)}
 cc.closePath();
}
function paperTexture(im,side,scale=1){const c=document.createElement('canvas');c.width=1536;c.height=1024;const cc=c.getContext('2d');paperContour(cc,side);cc.clip();if(scale!==1){const x=H+side*310;cc.translate(x,137);cc.scale(scale,scale);cc.translate(-x,-137)}cc.drawImage(im,0,0);return c}
function rightBoard(cc){
 cc.beginPath();cc.moveTo(H,127);cc.bezierCurveTo(925,97,1250,88,1353,82);cc.lineTo(1409,82);cc.quadraticCurveTo(1424,82,1424,108);cc.lineTo(1428,157);cc.lineTo(1436,389);cc.lineTo(1440,516);cc.lineTo(1455,797);cc.lineTo(1460,817);cc.lineTo(1462,864);cc.quadraticCurveTo(1460,879,1442,881);cc.lineTo(1383,882);cc.lineTo(808,891);cc.lineTo(H,895);cc.closePath();
}
function coverTriangle(cc,im,a,b,c,A,B,C){
 const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;
 const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];
 const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);
 cc.save();cc.beginPath();cc.moveTo(a.x,a.y);cc.lineTo(b.x,b.y);cc.lineTo(c.x,c.y);cc.closePath();cc.clip();cc.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const sx=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),sy=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1);const sw=Math.min(im.width-sx,Math.ceil(Math.max(A.x,B.x,C.x))-sx+1),sh=Math.min(im.height-sy,Math.ceil(Math.max(A.y,B.y,C.y))-sy+1);if(sw>0&&sh>0)cc.drawImage(im,sx,sy,sw,sh,sx,sy,sw,sh);cc.restore();
}
function makeCoverFace(){
 const c=document.createElement('canvas');c.width=1536;c.height=1024;const cc=c.getContext('2d');
 cc.save();rightBoard(cc);cc.clip();cc.fillStyle=leather;cc.fillRect(H,0,768,1024);cc.restore();
 const clean=document.createElement('canvas');clean.width=images[0].width;clean.height=images[0].height;
 const sc=clean.getContext('2d');sc.save();sc.clip(coverOutline);sc.drawImage(images[0],0,0);
 sc.drawImage(images[0],990,750,70,155,990,550,70,155);sc.restore();
 // All of the source top/bottom corners are mapped, not clipped away.
 const cols=32,rows=8;
 const project=(u,v)=>({x:H+(656+38*v)*u,y:(82+45*(1-u)*(1-u))*(1-v)+(891-10*u)*v});
 const uv=(u,v)=>({x:80+980*u,y:150+1042*v});
 for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){
  const coords=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]];
  const q=coords.map(([u,v])=>project(u,v)),t=coords.map(([u,v])=>uv(u,v));
  coverTriangle(cc,clean,q[0],q[1],q[2],t[0],t[1],t[2]);coverTriangle(cc,clean,q[0],q[2],q[3],t[0],t[2],t[3]);
 }
 return c;
}

function fixedClasp(){
 ctx.save();ctx.beginPath();ctx.moveTo(1385,407);ctx.lineTo(1405,407);ctx.lineTo(1410,388);ctx.lineTo(1437,389);ctx.lineTo(1449,392);ctx.lineTo(1455,412);ctx.lineTo(1464,438);ctx.lineTo(1470,453);ctx.lineTo(1460,477);ctx.lineTo(1452,489);ctx.lineTo(1451,514);ctx.lineTo(1440,516);ctx.lineTo(1412,510);ctx.lineTo(1408,496);ctx.lineTo(1385,496);ctx.closePath();ctx.clip();drawImage(1);ctx.restore();
}
function drawImage(i){ctx.drawImage(images[i],0,0,1536,1024)}
function half(i,side){ctx.save();paperPath(side);ctx.clip();drawImage(i);ctx.restore()}
function triangle(im,a,b,c,A,B,C){
 const d=A.x*(B.y-C.y)+B.x*(C.y-A.y)+C.x*(A.y-B.y);if(Math.abs(d)<1e-6)return;
 const solve=(x,y,z)=>[(x*(B.y-C.y)+y*(C.y-A.y)+z*(A.y-B.y))/d,(x*(C.x-B.x)+y*(A.x-C.x)+z*(B.x-A.x))/d,(x*(B.x*C.y-C.x*B.y)+y*(C.x*A.y-A.x*C.y)+z*(A.x*B.y-B.x*A.y))/d];
 const m=solve(a.x,b.x,c.x),n=solve(a.y,b.y,c.y);
 ctx.save();ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.closePath();ctx.clip();ctx.setTransform(m[0],n[0],m[1],n[1],m[2],n[2]);const sx=Math.max(0,Math.floor(Math.min(A.x,B.x,C.x))-1),sy=Math.max(0,Math.floor(Math.min(A.y,B.y,C.y))-1);const sw=Math.min(im.width-sx,Math.ceil(Math.max(A.x,B.x,C.x))-sx+1),sh=Math.min(im.height-sy,Math.ceil(Math.max(A.y,B.y,C.y))-sy+1);if(sw>0&&sh>0)ctx.drawImage(im,sx,sy,sw,sh,sx,sy,sw,sh);ctx.restore();
}
function leaf(from,to,p){
 const direction=to>from?1:-1, source=p<.5?from:to,sourceSide=p<.5?direction:-direction;
 const cols=44,rows=12;
 for(let j=0;j<cols;j++)for(let k=0;k<rows;k++){
  const coords=[[j/cols,k/rows],[(j+1)/cols,k/rows],[(j+1)/cols,(k+1)/rows],[j/cols,(k+1)/rows]];
  const q=coords.map(([u,v])=>point(u,v,direction,p));
  const uv=coords.map(([u,v])=>point(u,v,sourceSide,0));
  const tex=papers[source][sourceSide===1?1:0];
  triangle(tex,q[0],q[1],q[2],uv[0],uv[1],uv[2]);triangle(tex,q[0],q[2],q[3],uv[0],uv[2],uv[3]);
 }
 // Restore the fixed frame over the mesh so no paper can cross a fitting.
 ctx.save();ctx.beginPath();ctx.rect(0,0,1536,1024);
 for(const side of [-1,1]){for(let j=0;j<=48;j++){const q=point(j/48,0,side,0);j?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)}for(let j=48;j>=0;j--){const q=point(j/48,1,side,0);ctx.lineTo(q.x,q.y)}ctx.closePath()}
 ctx.clip('evenodd');drawImage(1);ctx.restore();
}
function closed(p=0){
 const cos=Math.cos(Math.PI*p);
 // Permanent right board, spine and border at exactly the approved open coordinates.
 ctx.save();ctx.beginPath();ctx.rect(H-1,0,1536-H+1,1024);ctx.clip();drawImage(1);ctx.restore();
 ctx.save();ctx.beginPath();ctx.rect(751,114,38,18);ctx.rect(735,879,65,92);ctx.clip();drawImage(1);ctx.restore();
 if(cos>=0){
  ctx.save();ctx.translate(H,0);ctx.scale(Math.max(cos,0),1);ctx.translate(-H,0);ctx.drawImage(coverFace,0,0);ctx.restore();
 }else{
  // The inside board reaches the exact left-half pose at p=1, without resizing or a fade.
  ctx.save();ctx.translate(H,0);ctx.scale(-cos,1);ctx.translate(-H,0);ctx.beginPath();ctx.rect(0,0,H,1024);ctx.clip();drawImage(1);ctx.restore();
 }
 // One stationary clasp; the front-cover texture deliberately excludes its source clasp.
 fixedClasp();
 // The hanging ornament belongs to the open spread, not to the closed cover.
 // Reapply only its pixels with the opening progress; the book body is untouched.
 ctx.clearRect(735,895,65,76);
 if(p>0){ctx.save();ctx.globalAlpha=Math.min(1,p);ctx.beginPath();ctx.rect(735,895,65,76);ctx.clip();drawImage(1);ctx.restore()}
}

function renderSource(p=0){
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,1536,1024);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(!ready)return;
 if(lore){lore.render(ctx,state,animation,p);return}
 if(!animation){state===0?closed():drawImage(state);return}
 if(animation.from===0||animation.to===0){closed(animation.to===0?1-p:p);return}
 drawImage(1);half(animation.from,-1);half(animation.to,1);
 if(animation.to<animation.from){half(animation.to,-1);half(animation.from,1)}
 leaf(animation.from,animation.to,p);
}
// Keep the approved renderer at native artwork resolution. Present at real screen pixels.
function present(){
 const rect=display.getBoundingClientRect(),ratio=Math.min(lore?.presentationScale===2?Math.max(globalThis.devicePixelRatio||1,2):(globalThis.devicePixelRatio||1),2);
 root.style.setProperty("--book-width",rect.width+"px");
 const w=Math.max(1,Math.round(rect.width*ratio)),h=Math.round(w*2/3);
 if(display.width!==w||display.height!==h){display.width=w;display.height=h}
 screen.setTransform(1,0,0,1,0,0);screen.clearRect(0,0,w,h);screen.imageSmoothingEnabled=true;screen.imageSmoothingQuality='high';screen.drawImage(canvas,0,0,w,h);
 // A mild unsharp pass at screen resolution restores text edge contrast after downsampling.
 // Skip moving frames, transparent boundaries, and large native-size previews.
 if(animation||!ready||w>1000)return;
 try{
  const data=screen.getImageData(0,0,w,h),original=new Uint8ClampedArray(data.data),pixels=data.data,amount=lore?.presentationScale===2 ? .18 : .45;
  for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
   const i=(y*w+x)*4;if(original[i+3]<250||original[i-4+3]<250||original[i+4+3]<250||original[i-w*4+3]<250||original[i+w*4+3]<250)continue;
   for(let c=0;c<3;c++){const blur=(original[i-4+c]+original[i+4+c]+original[i-w*4+c]+original[i+w*4+c])*0.25;pixels[i+c]=Math.max(0,Math.min(255,original[i+c]+amount*(original[i+c]-blur)))}
  }
  screen.putImageData(data,0,0);
 }catch(_){/* File previews may disallow pixel reads; high-quality presentation still works. */}
}
function render(p=0){if(inGame&&root.hidden)return;renderSource(p);present();if(ready)window.GrimorioEdition?.update(selectedBook,state,canvas,!!animation)}
addEventListener('resize',()=>{if(ready&&!root.hidden)render()});
function controls(){const busy=!!animation;prev.disabled=!ready||busy||state===0;next.disabled=!ready||busy||state===lastPage;coverButton.disabled=!ready||busy||state===0;next.textContent=state===0?'Abrir capa':'Próxima';if(ready)status.textContent=`${state+1}/${files.length} · ${names[state]}`;root.dataset.page=String(state);root.dataset.busy=String(busy);numberButtons.forEach(button=>{button.disabled=!ready||busy;button.setAttribute('aria-current',Number(button.dataset.pageNumber)===state?'page':'false')})}
function move(to){
 if(!ready||animation||to===state||to<0||to>lastPage)return;
 animation={from:state,to};controls();const start=performance.now(),duration=matchMedia('(prefers-reduced-motion: reduce)').matches?120:1350;
 const tick=(now)=>{const t=Math.min(1,(now-start)/duration);render(t*t*(3-2*t));if(t<1){frame=requestAnimationFrame(tick)}else{const animationFrom=animation.from;state=to;animation=null;render();controls();if(closing){if(state>0)move(state-1);else closing=false}else if(target!==null){if(state!==target){if(animationFrom===0&&state===1){openingTimer=setTimeout(()=>{openingTimer=0;if(!root.hidden&&target!==null&&state!==target)move(state+(target>state?1:-1));else if(target===state)target=null},250)}else move(state+(target>state?1:-1))}else target=null}}};frame=requestAnimationFrame(tick);
}
function hide(){window.GrimorioEdition?.hide();clearTimeout(openingTimer);openingTimer=0;cancelAnimationFrame(frame);loadRevision++;animation=null;closing=false;target=null;state=0;root.hidden=true;controls();screen.clearRect(0,0,display.width,display.height)}
async function exit(){if(!inGame){hide();root.hidden=false;return}try{const r=await fetch(`https://${GetParentResourceName()}/close`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});if(!r.ok)throw Error('close');hide()}catch(e){status.textContent='Não foi possível sair. Tente novamente.'}}
prev.onclick=()=>move(state-1);next.onclick=()=>move(state+1);coverButton.onclick=()=>{if(!animation&&state>0){target=null;closing=true;move(state-1)}};document.querySelector('#exit').onclick=exit;
display.onclick=(e)=>{const r=display.getBoundingClientRect();move(state===0?1:state+(e.clientX-r.left>r.width/2?1:-1))};
function goTo(page){if(!Number.isInteger(page)||!ready||page<1||page>lastPage)return;target=page;if(animation||openingTimer)return;if(page===state){target=null;return}move(state+(page>state?1:-1))}
numberButtons.forEach(button=>button.onclick=()=>goTo(Number(button.dataset.pageNumber)));
function control(action,page){if(root.hidden)return;if(action==='next'||action==='prev'){clearTimeout(openingTimer);openingTimer=0;target=null;move(state+(action==='next'?1:-1))}else if(action==='page')goTo(Number(page))}
addEventListener('keydown',e=>{if(inGame||root.hidden||e.repeat)return;const handled=['Escape','ArrowRight','ArrowLeft','F6','1','2','3','4','5'];if(handled.includes(e.key))e.preventDefault();if(e.key==='Escape'||e.key==='F6')exit();if(e.key==='ArrowRight')control('prev');if(e.key==='ArrowLeft')control('next');if(/^[1-5]$/.test(e.key))control('page',Number(e.key))});
addEventListener('message',e=>{
 const data=e.data;if(!data||typeof data!=='object')return;
 if(data.action==='setBookState'){
  if(!validBook(data.book))return;const book=catalog.books[data.book];
  const incoming=data.variants&&typeof data.variants==='object'?data.variants:{};
  variantsByBook[data.book]=Object.fromEntries(book.pages.filter(p=>typeof incoming[p.id]==='string'&&typeof p.variants?.[incoming[p.id]]==='string').map(p=>[p.id,incoming[p.id]]));
  selectBook(data.book);
 }else if(data.action==='selectBook'){variantsByBook[data.book]={};selectBook(data.book)}
 else if(data.action==='open'){root.hidden=false;selectBook(data.book||desiredBook||catalog.defaultBook);render();controls()}
 else if(data.action==='reading')document.body.classList.toggle('reading');else if(data.action==='hide')hide();else control(data.action,data.page);
});

if(!inGame){document.body.classList.add('preview');root.hidden=false}
controls();
function notifyReady(book,ok){if(inGame)fetch(`https://${GetParentResourceName()}/uiReady`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({book,ok})}).catch(()=>{});}
async function loadBook(id,key,revision){
 const original=catalog.books[id];if(!original)return;
 const variants=variantsByBook[id]||{};
 const book={...original,pages:original.pages.map(page=>({...page,art:page.variants?.[variants[page.id]]||page.art}))};
 notifyReady(id,false);

 window.GrimorioEdition?.hide();clearTimeout(openingTimer);openingTimer=0;cancelAnimationFrame(frame);animation=null;closing=false;target=null;ready=false;controls();
 const nextFiles=[book.cover,...book.pages.map(page=>page.art)];
 try{
  const loaded=await Promise.all(nextFiles.map((file,i)=>new Promise((resolve,reject)=>{
   const im=new Image();const timeout=setTimeout(()=>{im.onload=null;im.onerror=null;reject(Error('Tempo de carregamento: '+file))},15000);im.onload=()=>{clearTimeout(timeout);im.onload=null;im.onerror=null;const [w,h]=book.nativeSizes?.[i]||(i===0?[1155,1362]:[1536,1024]);if(im.width!==w||im.height!==h){reject(Error('Dimensões inválidas: '+file));return}resolve(im)};
   im.onerror=()=>{clearTimeout(timeout);im.onload=null;im.onerror=null;reject(Error(file))};im.src=`assets/${file}`;
  })));
  if(revision!==loadRevision)return;
  const loreModule={trevas:window.GrimorioTrevas,arvore_mundo:window.GrimorioArvoreMundo,rei_mago:window.GrimorioReiMago,antimagia:window.GrimorioAntimagia,vento:window.GrimorioVento,noelle:window.GrimorioNoelle,fogo_leao:window.GrimorioFogoLeao,luz_solar:window.GrimorioLuzSolar,espadas:window.GrimorioEspadas}[book.renderer];
  const nextLore=loreModule?await loreModule.prepare(loaded,book):null;
  if(revision!==loadRevision)return;
  const nextImages=nextLore?loaded:loaded.map(maskSource),nextPapers=nextLore?[]:nextImages.map((im,i)=>i===0?null:[paperTexture(im,-1,book.pages[i-1].paperScale||1),paperTexture(im,1,book.pages[i-1].paperScale||1)]);
  // New themes share the approved opening frame; only paper artwork changes.
  if(book.fixedFrame){const frameImage=nextImages[1];for(let i=2;i<nextImages.length;i++){
   const c=document.createElement('canvas');c.width=1536;c.height=1024;const cc=c.getContext('2d');cc.drawImage(frameImage,0,0);
   for(const [side,tex] of [[-1,nextPapers[i][0]],[1,nextPapers[i][1]]]){cc.save();paperContour(cc,side);cc.clip();cc.drawImage(tex,0,0);cc.restore()}nextImages[i]=c;
  }}
  lore=nextLore;images=nextImages;papers=nextPapers;files=nextFiles;names=['Capa',...book.pages.map(page=>page.title)];lastPage=book.pages.length;leather=book.leather;
  coverFace=nextLore?null:makeCoverFace();selectedBook=id;selectedKey=key;state=0;ready=true;root.dataset.book=id;const picker=document.querySelector('#preview-tools select');if(picker)picker.value=id;display.setAttribute('aria-label',book.title);render();controls();notifyReady(id,true);
 }catch(e){
  if(revision!==loadRevision)return;
  ready=false;selectedKey=null;selectedBook=null;images=[];papers=[];lore=null;coverFace=null;ctx.clearRect(0,0,1536,1024);screen.clearRect(0,0,display.width,display.height);controls();status.textContent='Falha ao carregar: '+e.message;
  if(inGame)fetch(`https://${GetParentResourceName()}/assetError`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({book:id,error:e.message})}).catch(()=>{});
 }
}
function selectBook(id){
 if(!validBook(id))return;
 const key=id+JSON.stringify(variantsByBook[id]||{});
 if(desiredKey!==key){desiredKey=key;desiredBook=id;loadRevision++}
 if(inGame&&root.hidden)return;
 if(ready&&selectedKey===key){notifyReady(id,true);return}
 if(loadJob)return loadJob;
 loadJob=(async()=>{
  while((!inGame||!root.hidden)&&desiredBook){
   const currentId=desiredBook,currentKey=desiredKey,revision=loadRevision;
   await loadBook(currentId,currentKey,revision);
   if(revision===loadRevision)break;
  }
 })().finally(()=>{loadJob=null});
 return loadJob;
}
if(!inGame){
 window.GrimorioPreview={async show(id,page=1){
  if(!validBook(id))throw Error('Livro inválido');root.hidden=false;await selectBook(id);
  if(!ready||selectedBook!==id)throw Error('Arte indisponível');
  clearTimeout(openingTimer);openingTimer=0;cancelAnimationFrame(frame);animation=null;target=null;closing=false;
  state=Math.max(0,Math.min(lastPage,Number(page)||0));render();controls();return true;
 }};
 if(!new URLSearchParams(location.search).has('editor')){
  const tools=document.createElement('div');tools.id='preview-tools';
  const choose=document.createElement('select');choose.setAttribute('aria-label','Grimório');
  Object.entries(catalog.books).forEach(([id,b])=>{const op=document.createElement('option');op.value=id;op.textContent=b.title;choose.append(op)});
  choose.value=new URLSearchParams(location.search).get('magia')||catalog.defaultBook;choose.onchange=()=>window.GrimorioPreview.show(choose.value,1);
  const zoom=document.createElement('button');zoom.textContent='Ampliar leitura';zoom.onclick=()=>document.body.classList.toggle('reading');
  const edit=document.createElement('a');edit.href='editor.html';edit.textContent='Editar todos';
  const back=document.createElement('button');back.textContent='←';back.setAttribute('aria-label','Página anterior');back.onclick=()=>control('prev');
  const forward=document.createElement('button');forward.textContent='→';forward.setAttribute('aria-label','Próxima página');forward.onclick=()=>control('next');
  tools.append(choose,back,forward,zoom,edit);document.body.append(tools);
 }
 const requested=new URLSearchParams(location.search).get('magia');selectBook(catalog.books[requested]?requested:catalog.defaultBook)}
})();
