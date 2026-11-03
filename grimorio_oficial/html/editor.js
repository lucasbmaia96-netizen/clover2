(() => {
'use strict';
const $=s=>document.querySelector(s),original=JSON.parse(JSON.stringify(window.GRIMORIO_EDICAO));
let data=JSON.parse(JSON.stringify(original)),bookId='agua',pageId='',changing=false;
const notice=t=>$('#notice').textContent=t;
try{const cached=JSON.parse(localStorage.getItem('grimorio-edicao-v1'));if(cached?.version===1&&cached.books)data=cached}catch(_){}
const book=()=>data.books[bookId],page=()=>book().pages[pageId];
const catalog=window.GRIMORIO_CATALOG;
function option(select,value,title){const op=document.createElement('option');op.value=value;op.textContent=title;select.append(op)}
Object.entries(catalog.books).forEach(([id,b])=>option($('#book'),id,b.title));$('#book').value=bookId;
function save(){try{localStorage.setItem('grimorio-edicao-v1',JSON.stringify(data));notice('Edição salva neste navegador. Baixe para usar no jogo.')}catch(_){notice('Baixe a edição para guardar suas alterações.')}update()}
async function update(){
 const win=$('#preview').contentWindow;if(!win.GrimorioPreview)return;
 try{win.GrimorioEdition.setData(JSON.parse(JSON.stringify(data)));await win.GrimorioPreview.show(bookId,catalog.books[bookId].pages.findIndex(p=>p.id===pageId)+1)}catch(e){notice('Falha na prévia: '+e.message)}
}
function field(parent,label,value,setter){const el=document.createElement('label'),name=document.createElement('span'),input=document.createElement(value.length>65?'textarea':'input');name.textContent=label;input.value=value;input.addEventListener('input',()=>{setter(input.value);save()});el.append(name,input);parent.append(el)}
function form(){
 const p=page(),el=$('#form');el.replaceChildren();$('#ink').value=book().ink;$('#paper').value=book().paper;
 if(p.kind==='pair'){p.spells.forEach((s,i)=>{const group=document.createElement('fieldset'),legend=document.createElement('legend');legend.textContent=i===0?'Folha esquerda':'Folha direita';group.append(legend);field(group,'Título',s.title,v=>s.title=v);field(group,'Descrição',s.description,v=>s.description=v);s.steps.forEach((v,j)=>field(group,'Etapa '+(j+1),v,v=>s.steps[j]=v));el.append(group)})}
 else{if(p.kind!=='spell')field(el,'Título da folha esquerda',p.leftTitle,v=>p.leftTitle=v);field(el,'Título',p.title,v=>p.title=v);field(el,'Descrição',p.description,v=>p.description=v);(p.steps||[]).forEach((v,i)=>field(el,'Etapa '+(i+1),v,v=>p.steps[i]=v))}
 const crops=$('#crops');crops.replaceChildren();
 function crop(label,a){const block=document.createElement('label'),name=document.createElement('span'),row=document.createElement('div');row.className='crop';name.textContent=label;['X','Y','Largura','Altura'].forEach((label,i)=>{const input=document.createElement('input');input.type='number';input.step='1';input.min=i<2?0:1;input.max=i%2===0?1536:1024;input.value=a[i];input.setAttribute('aria-label',name.textContent+' — '+label);input.onchange=()=>{const v=Number(input.value),bound=i%2===0?1536:1024;if(!Number.isFinite(v)||v<(i<2?0:1)||v>bound){input.value=a[i];return}a[i]=v;save()};row.append(input)});block.append(name,row);crops.append(block)}
 if(p.crop.main)crop('Ilustração esquerda',p.crop.main);if(p.crop.right)crop('Ilustração direita',p.crop.right);(p.crop.steps||[]).forEach((a,i)=>crop('Etapa '+(i+1),a));(p.crop.pair||[]).forEach((a,i)=>crop('Ilustração '+(i+1),a));
 update();
}
function pages(){const select=$('#page');select.replaceChildren();catalog.books[bookId].pages.forEach((p,i)=>option(select,p.id,`${i+1}. ${p.title}`));pageId=select.value;form()}
$('#book').onchange=()=>{bookId=$('#book').value;pages()};$('#page').onchange=()=>{pageId=$('#page').value;form()};
['ink','paper'].forEach(k=>$('#'+k).oninput=()=>{book()[k]=$('#'+k).value;save()});
$('#reset').onclick=()=>{if(!confirm('Restaurar os textos e recortes desta página?'))return;book().pages[pageId]=JSON.parse(JSON.stringify(original.books[bookId].pages[pageId]));form();save()};
$('#zoom').onclick=()=>$('#preview').contentWindow.document.body.classList.toggle('reading');
$('#export').onclick=()=>{const blob=new Blob(['/* Edição dos grimórios: textos e recortes. */\nwindow.GRIMORIO_EDICAO = '+JSON.stringify(data,null,2)+';\n'],{type:'text/javascript;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='edicao.js';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);notice('Arquivo edicao.js exportado. Substitua html/edicao.js e reinicie o recurso.')};
$('#import-button').onclick=()=>$('#import').click();
$('#import').onchange=async()=>{const f=$('#import').files[0];if(!f)return;try{const raw=(await f.text()).trim(),start=raw.indexOf('{'),end=raw.lastIndexOf('}'),parsed=JSON.parse(raw.slice(start,end+1));if(parsed.version!==1||!parsed.books)throw Error('Formato inválido');for(const [id,b] of Object.entries(original.books)){if(!parsed.books[id]?.pages)throw Error('Livro ausente: '+id);for(const [pid,p] of Object.entries(b.pages)){const value=parsed.books[id].pages[pid];if(!value||value.kind!==p.kind||!value.crop)throw Error('Página inválida: '+pid);if(JSON.stringify(value).length>15000)throw Error('Página muito grande');const boxes=[value.crop.main,value.crop.right,...value.crop.steps||[],...value.crop.pair||[]].filter(Boolean);if(boxes.some(a=>!Array.isArray(a)||a.length!==4||a.some(n=>!Number.isFinite(n)||n<0)||a[2]<=0||a[3]<=0))throw Error('Recorte inválido')}}data=parsed;form();save()}catch(e){notice('Importação recusada: '+e.message)}$('#import').value=''};
$('#preview').onload=()=>{update()};pages();
})();
