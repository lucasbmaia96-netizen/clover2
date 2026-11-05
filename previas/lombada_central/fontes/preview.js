(() => {
'use strict';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let ready=false,request=0;
async function select(n){
 if(!ready)return;
 const token=++request;
 while(Grimorio.getState().busy){await pause(25);if(token!==request)return}
 if(token===request)await Grimorio.goTo(n);
}
document.addEventListener('keydown',event=>{
 if(!ready||event.ctrlKey||event.altKey||event.metaKey||event.target.closest('select,input,textarea,[contenteditable="true"]'))return;
 const digit=/^Numpad([0-8])$/.exec(event.code);
 const step={ArrowLeft:1,ArrowRight:-1}[event.key];
 if(!digit&&step===undefined)return;
 event.preventDefault();event.stopImmediatePropagation();
 if(digit){if(!event.repeat)select(Number(digit[1])===0?1:Number(digit[1])+1)}
 else Grimorio.goTo(Grimorio.getState().state+step);
},true);
async function init(){
 while(!window.Grimorio?.getState().ready)await pause(50);
 await TrevasCaptions.install(document);TrevasBinding.install(document);
 const repeat=document.createElement('button');repeat.id='preview-repeat';repeat.textContent='Repetir abertura';document.querySelector('.tools').append(repeat);
 repeat.addEventListener('click',async()=>{
  if(Grimorio.getState().busy)return;
  await Grimorio.goTo(0,{instant:true});await pause(250);await Grimorio.open();
 });
 document.querySelector('.heading span').textContent='PRÉVIA · LOMBADA CENTRAL';
 document.querySelector('.preview-note').textContent='Prévia da abertura · NumPad 0–8 · ← avança · → volta';
 const next=document.querySelector('#next'),prev=document.querySelector('#prev');
 function controls(){
  repeat.disabled=Grimorio.getState().busy;
  const label=Grimorio.getState().state===0?'← Abrir':'← Próxima';
  if(next.textContent!==label)next.textContent=label;
  if(prev.textContent!=='Anterior →')prev.textContent='Anterior →';
 }
 new MutationObserver(controls).observe(next,{childList:true});
 new MutationObserver(controls).observe(document.querySelector('#book'),{attributes:true,attributeFilter:['aria-busy']});
 controls();ready=true;window.TrevasPreview=Object.freeze({ready:true,repeat:()=>repeat.click()});
}
init().catch(error=>{document.querySelector('#loading').hidden=false;document.querySelector('#loading').textContent='Não foi possível abrir a prévia: '+error.message;console.error(error)});
})();
