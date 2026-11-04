(() => {
'use strict';
const frame = document.querySelector('#reader');
const inGame = typeof GetParentResourceName === 'function';
const resource = inGame ? GetParentResourceName() : '';
let ready = false, wanted = !inGame, revision = 0, closePending = false, initStarted = false;
let options = {gameSize:true,showControls:false,resetCover:true,widthVw:35,limitVh:54,rightVw:0,bottomVh:.5};
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const clamp = (v, fallback, min, max) => typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
function api(){return frame.contentWindow?.Grimorio}
async function post(name, data = {}){
 if(!inGame)return {ok:true};
 const controller = new AbortController(),timer = setTimeout(()=>controller.abort(),5000);
 try{
  const response = await fetch(`https://${resource}/${name}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
  if(!response.ok)throw Error(`NUI ${name}: ${response.status}`);
  return await response.json();
 }finally{clearTimeout(timer)}
}
function configure(next = {}){
 options = {...options,...next};
 if(!frame.contentDocument?.body)return;
 const doc = frame.contentDocument,root = doc.documentElement;
 doc.body.classList.toggle('compact',options.gameSize === true);
 doc.body.classList.toggle('trevas-controls',options.showControls === true);
 root.style.setProperty('--trevas-width',clamp(options.widthVw,35,10,100)+'vw');
 root.style.setProperty('--trevas-limit',clamp(options.limitVh,54,10,100)+'vh');
 root.style.setProperty('--trevas-right',clamp(options.rightVw,0,0,90)+'vw');
 root.style.setProperty('--trevas-bottom',clamp(options.bottomVh,.5,0,90)+'vh');
}
async function show(next = options){
 configure(next);wanted = true;const token = ++revision;
 if(!ready)return;
 if(options.resetCover){
  while(api().getState().busy){await wait(25);if(token!==revision||!wanted)return}
  if(api().getState().state!==0)await api().goTo(0,{instant:true});
 }
 if(token!==revision||!wanted)return;
 frame.hidden = false;
 requestAnimationFrame(()=>{
  if(token!==revision||!wanted)return;
  frame.contentWindow.focus();
  const doc = frame.contentDocument,target = doc.body;
  target.tabIndex=-1;
  target?.focus({preventScroll:true});
 });
}
function hide(){wanted=false;revision++;frame.hidden=true}
async function requestClose(){
 if(!wanted||closePending)return;
 closePending=true;
 try{const result=await post('trevasClose');if(result.ok)hide()}catch(error){console.error('[Trevas teste]',error)}finally{closePending=false}
}
function escape(event){
 if(event.key==='Escape'&&wanted){event.preventDefault();event.stopImmediatePropagation();requestClose()}
}
function sharpenCaptions(doc){
 // The captions are baked into the supplied artwork. Enhance only their
 // existing pixels: no new font, text, dimensions, assets or navigation.
 const regions={
  corte:[[1164,296,160,32],[1164,454,158,32],[1158,724,176,34]],
  lua:[[1145,295,181,38],[1170,454,156,34],[1155,640,179,38]],
  passo:[[1149,296,177,39],[1172,450,157,34],[1157,644,181,39]],
  ruptura:[[1166,295,154,40],[1174,453,143,38],[1158,722,176,39]],
  fortaleza:[[1148,292,178,38],[1169,448,159,41],[1172,666,162,40]],
  dominio:[[1145,290,181,36],[1163,444,175,40],[1144,650,194,40]],
  voo:[[1132,292,188,42],[1163,467,144,41],[1168,702,160,42]]
 };
 const ns='http://www.w3.org/2000/svg';
 const svg=doc.createElementNS(ns,'svg');
 svg.setAttribute('aria-hidden','true');
 svg.style.cssText='position:absolute;width:0;height:0;pointer-events:none';
 svg.innerHTML=`<defs><filter id="trevas-caption-sharp" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
 <feConvolveMatrix order="3" kernelMatrix="0 -.22 0 -.22 1.88 -.22 0 -.22 0" preserveAlpha="true" edgeMode="duplicate"/>
 <feComponentTransfer>
 <feFuncR type="table" tableValues="0 .03 .105 .22 .38 .5 .6 .7 .8 .9 1"/>
 <feFuncG type="table" tableValues="0 .03 .105 .22 .38 .5 .6 .7 .8 .9 1"/>
 <feFuncB type="table" tableValues="0 .03 .105 .22 .38 .5 .6 .7 .8 .9 1"/>
 </feComponentTransfer></filter></defs>`;
 const defs=svg.firstElementChild,style=doc.createElement('style');
 style.id='trevas-caption-clarity';
 const rules=[];
 for(const [art,right] of Object.entries(regions)){
  for(const [side,boxes] of [['left',[[239,813,451,31]]],['right',[...right,[1004,821,127,32]]]]){
   const id=`trevas-caption-${art}-${side}`,clip=doc.createElementNS(ns,'clipPath');
   clip.id=id;clip.setAttribute('clipPathUnits','objectBoundingBox');
   for(const [x,y,w,h] of boxes){
    const rect=doc.createElementNS(ns,'rect');
    rect.setAttribute('x',(x-(side==='right'?768:0))/768);
    rect.setAttribute('y',y/1024);rect.setAttribute('width',w/768);rect.setAttribute('height',h/1024);
    clip.append(rect);
   }
   defs.append(clip);
   rules.push(`.paper.${side}[data-art="${art}"]::after{content:"";position:absolute;inset:0;pointer-events:none;background:inherit;filter:url(#trevas-caption-sharp);clip-path:url(#${id})}`);
  }
 }
 style.textContent=rules.join('\n');doc.body.append(svg);doc.head.append(style);
}
document.addEventListener('keydown',escape,true);
window.addEventListener('message',event=>{
 const data=event.data;
 if(!data||typeof data!=='object')return;
 if(data.action==='trevas_teste:open')show(data.config||{});
 else if(data.action==='trevas_teste:hide')hide();
});
async function loaded(){
 if(initStarted)return;initStarted=true;
 const doc=frame.contentDocument;if(!doc)return;
 const style=doc.createElement('style');style.id='trevas-redm-host';
 // The supplied HTML and all original assets remain unchanged on disk.
 style.textContent=`
 html,body{background:transparent!important;color-scheme:normal!important}
 body{height:100vh;min-height:100vh}
 .preview-note{display:none!important}
 body:not(.trevas-controls) header,body:not(.trevas-controls) footer{display:none!important}
 body:not(.trevas-controls) main{height:100vh}
 .compact #stage{right:var(--trevas-right,0vw);bottom:var(--trevas-bottom,.5vh);width:min(var(--trevas-width,35vw),var(--trevas-limit,54vh))}
 `;
 doc.head.append(style);sharpenCaptions(doc);doc.addEventListener('keydown',escape,true);configure();
 try{
  const start=performance.now();
  while(!api()?.getState().ready){
   const message=doc.querySelector('#loading')?.textContent||'';
   if(message.includes('Arte não encontrada'))throw Error(message);
   if(performance.now()-start>60000)throw Error('Tempo de carregamento do HTML excedido.');
   await wait(100);
  }
  ready=true;await post('trevasReady');if(wanted)await show();
 }catch(error){console.error('[Trevas teste]',error);hide();await post('trevasError',{error:String(error)}).catch(()=>{})}
}
frame.addEventListener('load',loaded,{once:true});
if(frame.contentDocument?.readyState==='complete'&&api())loaded();
window.TrevasTesteBridge=Object.freeze({getState:()=>({ready,visible:!frame.hidden,wanted,book:api()?.getState()||null}),show,hide});
})();
