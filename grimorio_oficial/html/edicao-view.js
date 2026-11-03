/* Diagramação vetorial comum. As artes de origem permanecem intactas. */
(() => {
'use strict';
const root=document.querySelector('#interface'), layer=document.createElement('section');
layer.id='edition';layer.hidden=true;layer.setAttribute('aria-label','Páginas do grimório');root.append(layer);
let current='',source='',savedSource=null,bookId='',pageIndex=0;
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text)el.textContent=text;return el};
function art(box,cls){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','edition-art '+cls);
 const [x,y,w,h]=box;svg.setAttribute('viewBox',`${x} ${y} ${w} ${h}`);svg.setAttribute('preserveAspectRatio','xMidYMid meet');svg.setAttribute('aria-hidden','true');
 const defs=document.createElementNS(svg.namespaceURI,'defs'),clip=document.createElementNS(svg.namespaceURI,'clipPath'),rect=document.createElementNS(svg.namespaceURI,'rect');const clipId='crop-'+Math.random().toString(36).slice(2);clip.id=clipId;['x','y','width','height'].forEach((k,i)=>rect.setAttribute(k,box[i]));clip.append(rect);defs.append(clip);svg.append(defs);
 const im=document.createElementNS(svg.namespaceURI,'image');im.setAttribute('clip-path',`url(#${clipId})`);im.setAttribute('href',source);im.setAttribute('width','1536');im.setAttribute('height','1024');svg.append(im);return svg;
}
function seal(){const b=make('button','edition-seal','SELADO');b.disabled=true;b.setAttribute('aria-label','Página selada');b.title='Selamento visual. A autorização dos poderes continua no servidor.';const lock=make('span','edition-lock');lock.setAttribute('aria-hidden','true');b.prepend(lock);return b}
function sheet(side){const el=make('article','edition-sheet '+side);layer.append(el);return el}
function text(tag,cls,value){const el=make(tag,cls,value);el.dir='auto';return el}
function draw(){
 const book=window.GRIMORIO_CATALOG.books[bookId],data=window.GRIMORIO_EDICAO.books[bookId];if(!book||!data||!pageIndex)return;
 const p=data.pages[book.pages[pageIndex-1].id];if(!p)return;
 layer.replaceChildren();const backing=document.createElementNS('http://www.w3.org/2000/svg','svg');backing.setAttribute('viewBox','0 0 1536 1024');backing.setAttribute('class','edition-backing');const outline=document.createElementNS(backing.namespaceURI,'path');outline.setAttribute('d','M170 115 L738 140 L768 151 L798 140 L1390 115 L1402 870 L800 880 L768 870 L736 880 L150 870 Z');outline.setAttribute('fill',data.paper);backing.append(outline);layer.append(backing);layer.dataset.kind=p.kind;layer.style.setProperty('--ink',data.ink);layer.style.setProperty('--paper',data.paper);
 const left=sheet('left'),right=sheet('right');
 if(p.kind==='spell'){
  left.append(text('h2','edition-title',p.title),art(p.crop.main,'main-art'),text('p','edition-description',p.description));
  right.append(text('h2','edition-title','Condução'));
  const rows=make('ol','edition-steps');p.steps.forEach((step,i)=>{const row=make('li','edition-step');row.append(art(p.crop.steps[i],'step-art'),text('span','edition-step-text',step));rows.append(row)});right.append(rows);
 }else if(p.kind==='pair'){
  [left,right].forEach((el,i)=>{const spell=p.spells[i];el.append(text('h2','edition-title',spell.title),art(p.crop.pair[i],'pair-art'),text('p','edition-description pair-description',spell.description));const list=make('ol','pair-steps');spell.steps.forEach(t=>list.append(text('li','',t)));el.append(list)});
 }else{
  left.append(text('h2','edition-title',p.leftTitle),art(p.crop.main,'portrait-art'));
  right.append(text('h2','edition-title',p.title),art(p.crop.right,'portrait-art'),text('p','edition-description',p.description));
 }
 left.append(seal());right.append(seal());
 layer.querySelectorAll('.edition-title').forEach(el=>{if(el.textContent.length>28)el.classList.add('long-title')});
 layer.hidden=false;
}
window.GrimorioEdition={
 update(id,index,canvas,busy){
  if(busy||!index||!id){layer.hidden=true;return}
  const key=id+':'+index;if(current!==key||savedSource!==canvas){current=key;savedSource=canvas;source=canvas.toDataURL('image/png')}
  bookId=id;pageIndex=index;draw();
 },
 setData(data){if(!data||data.version!==1||!data.books)throw Error('Edição inválida');window.GRIMORIO_EDICAO=data;draw()},
 refresh(){draw()},hide(){layer.hidden=true;current='';savedSource=null}
};
})();
