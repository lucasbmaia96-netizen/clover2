(() => {
'use strict';
function install(doc){
 if(doc.getElementById('trevas-binding'))return;
 const book=doc.querySelector('#book'),cover=doc.querySelector('#cover'),art=doc.querySelector('#cover-art');
 // The supplied cover texture includes its spine. Its image starts at -18%
 // and spans 118.64% of the hinged panel. Split precisely at that panel's
 // transform origin, leaving the spine outside the rotating cover.
 const split=18/118.64*100;
 const binding=doc.createElement('div');binding.id='trevas-binding';binding.setAttribute('aria-hidden','true');
 const spine=doc.createElement('img');spine.className='trevas-binding-art';spine.src=art.src;spine.alt='';spine.draggable=false;binding.append(spine);
 const style=doc.createElement('style');style.id='trevas-binding-style';
 style.textContent=`
 #cover-art{clip-path:inset(0 0 0 ${split}%)}
 #trevas-binding{position:absolute;left:50%;top:0;width:50%;height:100%;z-index:2;pointer-events:none;opacity:1}
 #trevas-binding[hidden]{display:none!important}
 .trevas-binding-art{position:absolute;left:-18%;top:-.7%;width:118.64%;height:105%;max-width:none;object-fit:fill;
  pointer-events:none;user-select:none;clip-path:inset(0 ${100-split}% 0 0)}
 `;
 doc.head.append(style);book.insertBefore(binding,cover);
 function settle(){
  const turning=book.classList.contains('opening')||book.classList.contains('closing-book');
  // Keep the complete, opaque spine throughout the cover's movement. Only
  // tuck it away once the cover has finished opening and the pages are flat.
  binding.hidden=!turning&&!book.classList.contains('closed');
 }
 // Keep the original renderer, masks and page-turn logic. Only the cover's
 // timing changes; its spine is a stationary sibling, never a rotating child.
 const originalAnimate=cover.animate.bind(cover);
 cover.animate=function(keyframes,options){
  const reduced=doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const timing={...options,duration:reduced?options.duration:1250,easing:'cubic-bezier(.35,0,.25,1)'};
  binding.hidden=false;
  return originalAnimate(keyframes,timing);
 };
 new MutationObserver(settle).observe(book,{attributes:true,attributeFilter:['class']});
 settle();
}
window.TrevasBinding=Object.freeze({install});
})();
