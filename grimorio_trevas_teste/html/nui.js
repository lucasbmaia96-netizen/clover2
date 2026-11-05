/* Origem: captions.js — código legível, sem minificação. */
(() => {
'use strict';
// Coordinates refer to the original 1536 x 1024 artwork. Only small caption
// areas are restored; the original illustrations, frame and HTML stay intact.
const content={
 corte:{description:'A lâmina conduz um corte de sombra.',steps:['Reúna a sombra.','Envolva a lâmina.','Conduza o corte.'],centers:[310,473,745],erase:[[1161,291,170,65],[1160,452,172,64],[1155,722,181,65]]},
 lua:{description:'Uma sombra breve envolve o conjurador.',steps:['Concentre a sombra.','Trace o círculo.','Mantenha o domínio.'],centers:[313,473,660],erase:[[1144,292,184,64],[1167,451,161,65],[1152,638,185,69]]},
 passo:{description:'Um avanço curto e veloz deixa um rastro delicado de sombra.',steps:['Concentre a energia.','Trace o caminho.','Avance com controle.'],centers:[313,469,665],erase:[[1146,293,184,68],[1169,448,164,65],[1154,641,185,68]]},
 ruptura:{description:'Um golpe concentrado projeta as trevas além da lâmina.',steps:['Reúna a força.','Fixe o alvo.','Libere o ataque.'],centers:[313,474,743],erase:[[1163,292,160,68],[1171,451,151,66],[1155,719,182,68]]},
 fortaleza:{description:'As sombras se unem em uma proteção firme e contínua.',steps:['Concentre a energia.','Erga a proteção.','Sustente a defesa.'],centers:[311,473,687],erase:[[1145,289,185,67],[1165,445,166,70],[1169,663,169,70]]},
 dominio:{description:'A energia se expande ao redor do conjurador.',steps:['Perceba a energia.','Expanda o domínio.','Mantenha o controle.'],centers:[309,468,671],erase:[[1142,287,188,68],[1160,441,181,70],[1141,647,200,70]]},
 voo:{description:'As trevas sustentam o corpo em movimento.',steps:['Concentre a energia.','Eleve o corpo.','Conduza o voo.'],centers:[313,489,723],erase:[[1129,289,194,70],[1160,464,151,68],[1165,699,167,68]]}
};
async function install(doc){
 if(doc.getElementById('trevas-live-captions-style'))return;
 const url=new URL('legendas_fundo.webp',document.baseURI).href;
 await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=()=>reject(Error('Fundo das legendas não encontrado. Copie todos os arquivos da atualização.'));image.src=url});
 const style=doc.createElement('style');style.id='trevas-live-captions-style';
 const fontUrl=new URL('trevas_texto.woff',document.baseURI).href;
 style.textContent=`
 @font-face{font-family:'Trevas Texto';src:url('${fontUrl}') format('woff');font-weight:700;font-style:normal;font-display:block}
 .trevas-caption-layer{position:absolute;inset:0;pointer-events:none}
 .trevas-caption-patch{position:absolute;pointer-events:none;background-repeat:no-repeat;
  -webkit-mask-image:linear-gradient(to right,transparent,#000 2%,#000 98%,transparent),linear-gradient(to bottom,transparent,#000 8%,#000 92%,transparent);
  mask-image:linear-gradient(to right,transparent,#000 2%,#000 98%,transparent),linear-gradient(to bottom,transparent,#000 8%,#000 92%,transparent);
  -webkit-mask-composite:source-in;mask-composite:intersect}
 .trevas-live-caption{position:absolute;margin:0;padding:0;transform:translateY(-50%);pointer-events:none;
  font-family:'Trevas Texto',Georgia,serif;font-size:var(--trevas-step-font,11px);font-weight:700;
  line-height:1.1;letter-spacing:0;color:#20101d;text-align:center;text-wrap:balance;
  text-shadow:none;overflow-wrap:normal;word-break:normal;hyphens:none;-webkit-text-size-adjust:none}
 .trevas-live-description{font-size:var(--trevas-description-font,10px)}
 .trevas-live-learn{font-size:var(--trevas-learn-font,10px);line-height:1;color:#ffe4a0;letter-spacing:.02em}
 `;
 doc.head.append(style);
 await doc.fonts.load('700 10px "Trevas Texto"');
 if(!doc.fonts.check('700 10px "Trevas Texto"'))throw Error('A fonte das legendas não carregou. Copie todos os arquivos da atualização.');
 function position(el,x,y,w,h,side){
  el.style.left=(x-(side==='right'?768:0))/768*100+'%';
  el.style.top=y/1024*100+'%';el.style.width=w/768*100+'%';
  if(h!==undefined)el.style.height=h/1024*100+'%';
 }
 function patch(layer,box,side,source){
  const [x,y,w,h]=box,el=doc.createElement('span');el.className='trevas-caption-patch';el.setAttribute('aria-hidden','true');position(el,x,y,w,h,side);
  const [sx,sy]=source||[x,y];el.style.backgroundImage=`url("${url}")`;
  el.style.backgroundSize=`${1536/w*100}% ${1024/h*100}%`;
  el.style.backgroundPosition=`${sx/(1536-w)*100}% ${sy/(1024-h)*100}%`;
  layer.append(el);
 }
 function label(layer,text,x,y,w,side,kind=''){
  const el=doc.createElement('span');el.className='trevas-live-caption '+kind;el.textContent=text;position(el,x,y,w,undefined,side);layer.append(el);
 }
 function refresh(paper){
  let layer=paper.querySelector(':scope > .trevas-caption-layer');
  if(!layer){layer=doc.createElement('div');layer.className='trevas-caption-layer';paper.append(layer)}
  const art=paper.dataset.art,data=content[art];
  if(!data||!paper.style.backgroundImage||paper.style.backgroundImage==='none'){layer.hidden=true;return}
  layer.hidden=false;
  if(layer.dataset.art===art)return;
  layer.dataset.art=art;layer.replaceChildren();
  if(paper.classList.contains('left')){
   patch(layer,[238,800,466,81],'left');
   label(layer,data.description,200,840,530,'left','trevas-live-description');
  }else{
   data.erase.forEach(box=>patch(layer,box,'right',[1138,280]));
   data.steps.forEach((text,i)=>label(layer,text,1142,data.centers[i],198,'right'));
   patch(layer,[1001,817,136,37],'right');
   label(layer,'APRENDER',960,838,213,'right','trevas-live-learn');
  }
 }
 const papers=[...doc.querySelectorAll('.paper')];
 for(const paper of papers){
  const observer=new MutationObserver(()=>refresh(paper));observer.observe(paper,{attributes:true,attributeFilter:['data-art','style']});refresh(paper);
 }
 const stage=doc.querySelector('#stage');
 function size(){
  const width=stage.getBoundingClientRect().width;
  doc.documentElement.style.setProperty('--trevas-step-font',Math.max(10,Math.min(23,width*.020))+'px');
  doc.documentElement.style.setProperty('--trevas-description-font',Math.max(9.5,Math.min(20,width*.018))+'px');
  doc.documentElement.style.setProperty('--trevas-learn-font',Math.max(9,Math.min(18,width*.017))+'px');
 }
 new ResizeObserver(size).observe(stage);size();
}
window.TrevasCaptions=Object.freeze({install});
})();


/* Origem: nui.js — código legível, sem minificação. */
(() => {
'use strict';
const frame = document.querySelector('#reader');
const inGame = typeof GetParentResourceName === 'function';
const resource = inGame ? GetParentResourceName() : '';
let ready = false, wanted = !inGame, revision = 0, selectionRevision = 0, closePending = false, initStarted = false;
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
 configure(next);wanted = true;const token = ++revision;++selectionRevision;
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
function hide(){wanted=false;revision++;selectionRevision++;frame.hidden=true}
async function requestClose(){
 if(!wanted||closePending)return;
 closePending=true;
 try{const result=await post('trevasClose');if(result.ok)hide()}catch(error){console.error('[Trevas teste]',error)}finally{closePending=false}
}
function escape(event){
 if(event.key==='Escape'&&wanted){event.preventDefault();event.stopImmediatePropagation();requestClose()}
}
async function selectSpread(spread){
 if(!ready||!wanted)return;
 const token=++selectionRevision;
 while(api().getState().busy){await wait(25);if(token!==selectionRevision||!wanted)return}
 if(token===selectionRevision&&wanted)await api().goTo(spread);
}
function numpad(event){
 if(!wanted||!ready||event.ctrlKey||event.altKey||event.metaKey)return;
 if(event.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
 const match=/^Numpad([0-8])$/.exec(event.code);
 if(!match)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(!event.repeat)selectSpread(Number(match[1])===0?1:Number(match[1])+1);
}
function arrows(event){
 if(!wanted||!ready||event.ctrlKey||event.altKey||event.metaKey)return;
 if(event.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
 const step={ArrowLeft:1,ArrowRight:-1}[event.key];
 if(step===undefined)return;
 // Capture before the original HTML listener, after NumPad handling so that
 // NumLock-off Numpad4/Numpad6 still select their numbered powers.
 event.preventDefault();event.stopImmediatePropagation();
 api().goTo(api().getState().state+step);
}
document.addEventListener('keydown',escape,true);
document.addEventListener('keydown',numpad,true);
document.addEventListener('keydown',arrows,true);
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
 doc.head.append(style);doc.addEventListener('keydown',escape,true);doc.addEventListener('keydown',numpad,true);doc.addEventListener('keydown',arrows,true);configure();
 try{
  const start=performance.now();
  while(!api()?.getState().ready){
   const message=doc.querySelector('#loading')?.textContent||'';
   if(message.includes('Arte não encontrada'))throw Error(message);
   if(performance.now()-start>60000)throw Error('Tempo de carregamento do HTML excedido.');
   await wait(100);
  }
  await window.TrevasCaptions.install(doc);
  ready=true;await post('trevasReady');if(wanted)await show();
 }catch(error){console.error('[Trevas teste]',error);hide();await post('trevasError',{error:String(error)}).catch(()=>{})}
}
frame.addEventListener('load',loaded,{once:true});
if(frame.contentDocument?.readyState==='complete'&&api())loaded();
window.TrevasTesteBridge=Object.freeze({getState:()=>({ready,visible:!frame.hidden,wanted,book:api()?.getState()||null}),show,hide});
})();
