(() => {
'use strict';
function install(doc){
 if(doc.getElementById('trevas-binding'))return;
 const book=doc.querySelector('#book'),cover=doc.querySelector('#cover'),art=doc.querySelector('#cover-art');
 const split=18/118.64*100;
 const closedPose='translate3d(0%,0%,2px) scale(1,1)';
 // The same leather spine becomes a narrower profile in the open gutter.
 // Translation centers its visible pixels, rather than its transparent image.
 const openPose='translate3d(2.174%,-1.06%,2px) scale(.32,.925)';
 const binding=doc.createElement('div');binding.id='trevas-binding';binding.setAttribute('aria-hidden','true');
 const spine=doc.createElement('img');spine.className='trevas-binding-art';spine.src=art.src;spine.alt='';spine.draggable=false;binding.append(spine);
 const style=doc.createElement('style');style.id='trevas-binding-style';
 style.textContent=`
 #cover-art{clip-path:inset(0 0 0 ${split}%)}
 #trevas-binding{position:absolute;left:50%;top:0;width:50%;height:100%;z-index:13;pointer-events:none;opacity:1;
  transform-origin:0 50%;will-change:transform}
 .trevas-binding-art{position:absolute;left:-18%;top:-.7%;width:118.64%;height:105%;max-width:none;object-fit:fill;
  pointer-events:none;user-select:none;clip-path:inset(0 ${100-split}% 0 0)}
 `;
 doc.head.append(style);book.insertBefore(binding,cover);
 let movement=null;
 function settle(){
  if(book.classList.contains('opening')||book.classList.contains('closing-book'))return;
  movement?.cancel();movement=null;
  binding.style.transform=book.classList.contains('closed')?closedPose:openPose;
 }
 const originalAnimate=cover.animate.bind(cover);
 cover.animate=function(keyframes,options){
  const reduced=doc.defaultView.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const timing={...options,duration:reduced?options.duration:1250,easing:'cubic-bezier(.35,0,.25,1)'};
  const opening=book.classList.contains('opening'),start=opening?closedPose:openPose,end=opening?openPose:closedPose;
  movement?.cancel();binding.style.transform=start;
  const frames=opening?
   [{transform:closedPose,offset:0,easing:'cubic-bezier(.22,.61,.36,1)'},{transform:openPose,offset:.36},{transform:openPose,offset:1}]:
   [{transform:openPose,offset:0},{transform:openPose,offset:.64,easing:'cubic-bezier(.22,.61,.36,1)'},{transform:closedPose,offset:1}];
  const spineMotion=binding.animate(frames,{duration:timing.duration,easing:'linear',fill:'forwards'});
  movement=spineMotion;
  const animation=originalAnimate(keyframes,timing);
  animation.finished.then(()=>{
   if(movement!==spineMotion)return;
   binding.style.transform=end;spineMotion.cancel();movement=null;
  },()=>{spineMotion.cancel();if(movement===spineMotion)movement=null});
  return animation;
 };
 new MutationObserver(settle).observe(book,{attributes:true,attributeFilter:['class']});
 settle();
}
window.TrevasBinding=Object.freeze({install});
})();
