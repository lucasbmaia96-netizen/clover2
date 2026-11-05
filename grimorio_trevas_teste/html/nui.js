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
 const match=/^Numpad([0-7])$/.exec(event.code);
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
