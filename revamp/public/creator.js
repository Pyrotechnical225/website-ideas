'use strict';
const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let started=false,dirty=false,loading=false,aiReady=false,imageTarget=null,toastTimer,autosaveTimer,meta={name:'Untitled website',brief:'',kind:'new'},suggestionRun=0;
const BASE_CSS='*{box-sizing:border-box}body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#18382b;background:#fff;font-size:16px;line-height:1.6;--oak-accent:#18382b;--oak-accent-text:#ffffff}img{max-width:100%;height:auto}h1,h2,h3,p,a{overflow-wrap:anywhere}.oak-columns{display:flex;gap:24px;align-items:stretch;flex-wrap:wrap}.oak-column{flex:1 1 240px;min-width:0}.oak-btn{display:inline-block;padding:14px 26px;background-color:var(--oak-accent);color:var(--oak-accent-text);border-radius:999px;text-decoration:none;font-weight:600}@media(max-width:600px){.oak-columns{flex-direction:column}}';
const IMAGE_DATA=/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),4000);}
function setStatus(text,state=''){const el=$('save-status');el.textContent=text;el.className='save-status '+state;}
function markDirty(){if(loading||!started)return;dirty=true;setStatus('Saving…','pending');scheduleAutosave();}

/* ---------- Tabs ---------- */
function switchTab(id,focus=false){document.querySelectorAll('[data-tab]').forEach(button=>{const active=button.dataset.tab===id;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;$(button.getAttribute('aria-controls')).hidden=!active;if(active&&focus)button.focus();});}
document.querySelectorAll('[data-tab]').forEach((button,i,buttons)=>{button.addEventListener('click',()=>switchTab(button.dataset.tab));button.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight')index=(i+1)%buttons.length;if(e.key==='ArrowLeft')index=(i+buttons.length-1)%buttons.length;if(e.key==='Home')index=0;if(e.key==='End')index=buttons.length-1;if(index!==undefined){e.preventDefault();switchTab(buttons[index].dataset.tab,true);}});});

/* ---------- Editor ---------- */
const editor=grapesjs.init({container:'#gjs',height:'100%',width:'auto',storageManager:false,noticeOnUnload:false,panels:{defaults:[]},selectorManager:{componentFirst:true},fromElement:false,components:'',style:BASE_CSS,exportWrapper:true,wrapperIsBody:true,jsInHtml:false,showOffsets:true,
 deviceManager:{devices:[{name:'Desktop',width:''},{name:'Tablet',width:'768px',widthMedia:'992px'},{name:'Mobile',width:'390px',widthMedia:'600px'}]},
 layerManager:{appendTo:'#layers'},traitManager:{appendTo:'#traits'},blockManager:{appendTo:null,blocks:[]},
 styleManager:{appendTo:'#style-manager',sectors:[
  {name:'Typography',open:true,properties:['font-family','font-size','font-weight','line-height','letter-spacing','text-align','color']},
  {name:'Layout & size',open:true,properties:['display','flex-direction','justify-content','align-items','gap','width','max-width','min-height']},
  {name:'Spacing',open:false,properties:['padding','margin']},
  {name:'Background & border',open:false,properties:['background-color','background-image','border','border-radius','box-shadow','opacity']},
  {name:'Position',open:false,properties:['position','top','right','bottom','left','z-index']}]},
 parser:{optionsHtml:{allowScripts:false,allowUnsafeAttr:false,allowUnsafeAttrValue:false}},canvas:{scripts:[],styles:[]},assetManager:{upload:false,assets:[]}});

/* ---------- Building blocks (editable primitives, not page templates) ---------- */
const col=()=>({tagName:'div',name:'Column',classes:['oak-column'],style:{'min-height':'140px',padding:'20px',border:'1px dashed #b7c2b7'},droppable:true});
const text=(tagName,content,style={})=>({type:'text',tagName,content,style});
const blockGroups=[
 {title:'Structure',blocks:[
  {id:'section',label:'Section',icon:'▱',make:()=>({tagName:'section',name:'Section',style:{padding:'64px 6%','min-height':'200px'},droppable:true})},
  {id:'container',label:'Container',icon:'□',make:()=>({tagName:'div',name:'Container',style:{'max-width':'1100px',margin:'0 auto',padding:'24px','min-height':'100px'},droppable:true})},
  {id:'columns',label:'2 columns',icon:'Ⅱ',make:()=>({tagName:'div',name:'Two columns',classes:['oak-columns'],style:{padding:'24px'},components:[col(),col()]})},
  {id:'grid',label:'3 columns',icon:'Ⅲ',make:()=>({tagName:'div',name:'Three columns',classes:['oak-columns'],style:{padding:'24px'},components:[col(),col(),col()]})},
  {id:'spacer',label:'Space',icon:'↕',make:()=>({tagName:'div',name:'Space',style:{height:'48px'},droppable:false})},
  {id:'divider',label:'Divider',icon:'―',make:()=>({tagName:'hr',name:'Divider',style:{border:'none','border-top':'1px solid #bfc7bf',margin:'28px 0'}})}]},
 {title:'Text',blocks:[
  {id:'heading',label:'Heading',icon:'H1',make:()=>({...text('h1','Your next great idea',{'font-size':'52px','line-height':'1.08','font-weight':'600','letter-spacing':'-0.02em',margin:'0 0 24px'}),name:'Heading'})},
  {id:'subheading',label:'Subheading',icon:'H2',make:()=>({...text('h2','A clear, confident subheading',{'font-size':'30px','line-height':'1.2','font-weight':'600',margin:'0 0 16px'}),name:'Subheading'})},
  {id:'text',label:'Text',icon:'T',make:()=>({...text('p','Tell your story, in your own words.',{'font-size':'18px','line-height':'1.7',margin:'0 0 24px'}),name:'Text'})},
  {id:'list',label:'List',icon:'≡',make:()=>({tagName:'ul',name:'List',components:[{tagName:'li',type:'text',content:'Your first point'},{tagName:'li',type:'text',content:'Your next point'}],style:{'line-height':'1.9'}})},
  {id:'quote',label:'Quote',icon:'“',make:()=>({tagName:'blockquote',type:'text',name:'Quote',content:'A few words worth remembering.',style:{'font-family':'Georgia,serif','font-size':'28px',padding:'8px 24px',margin:'24px 0','border-left':'3px solid #b69b68'}})},
  {id:'label',label:'Label',icon:'◦',make:()=>({...text('p','SMALL LABEL',{'font-size':'12px','letter-spacing':'0.18em','font-weight':'600',margin:'0 0 12px',opacity:'0.7'}),name:'Label'})}]},
 {title:'Media & actions',blocks:[
  {id:'image',label:'Image',icon:'▧',make:()=>({type:'image',name:'Image',attributes:{alt:'',src:''},style:{width:'100%','min-height':'140px','object-fit':'cover','border-radius':'12px'},resizable:true})},
  {id:'button',label:'Button',icon:'↗',make:()=>({type:'link',name:'Button',content:'Discover more',classes:['oak-btn'],attributes:{href:'#'}})},
  {id:'link',label:'Link',icon:'🔗',make:()=>({type:'link',name:'Link',content:'Read more →',attributes:{href:'#'},style:{color:'inherit','font-weight':'600'}})},
  {id:'card',label:'Card',icon:'▭',make:()=>({tagName:'div',name:'Card',droppable:true,style:{padding:'28px','border-radius':'16px',border:'1px solid rgba(127,127,127,0.3)','background-color':'rgba(127,127,127,0.08)'},components:[{...text('h3','Card title',{'font-size':'22px',margin:'0 0 8px'}),name:'Card title'},{...text('p','A short description.',{margin:'0'}),name:'Card text'}]})},
  {id:'nav',label:'Menu bar',icon:'☰',make:()=>({tagName:'nav',name:'Menu bar',droppable:true,style:{display:'flex','align-items':'center','justify-content':'space-between',gap:'24px',padding:'20px 6%','flex-wrap':'wrap'},components:[{...text('strong','Your name',{'font-size':'20px'}),name:'Logo text'},{tagName:'div',name:'Links',style:{display:'flex',gap:'24px','flex-wrap':'wrap'},components:['About','Work','Contact'].map(t=>({type:'link',content:t,attributes:{href:'#'},style:{color:'inherit','text-decoration':'none'}}))}]})},
  {id:'footer',label:'Footer',icon:'▁',make:()=>({tagName:'footer',name:'Footer',droppable:true,style:{padding:'40px 6%','border-top':'1px solid rgba(0,0,0,0.1)','font-size':'14px'},components:[{...text('p','© Your name. Made with care.',{margin:'0'}),name:'Footer text'}]})}]}
];
const blocks=blockGroups.flatMap(g=>g.blocks);
blocks.forEach(b=>editor.BlockManager.add(b.id,{label:b.label,content:b.make(),activate:b.id==='image',select:true}));
function insertBlock(id,into){const block=blocks.find(b=>b.id===id);if(!block)return;const selected=into||editor.getSelected(),tag=selected?.get('tagName');const target=selected&&['section','div','main','header','footer','nav','article','aside','body'].includes(tag)&&selected.get('droppable')!==false?selected:editor.getWrapper();const added=target.append(block.make())[0];editor.select(added);if(id==='image'){imageTarget=added;$('image-file').click();}updateEmpty();markDirty();return added;}
$('blocks').innerHTML=blockGroups.map(g=>`<div class="block-group"><h3>${g.title}</h3><div class="block-grid">${g.blocks.map(b=>`<button class="block-button" draggable="true" data-block="${b.id}" title="Click to add, or drag onto the canvas"><span class="icon" aria-hidden="true">${b.icon}</span>${b.label}</button>`).join('')}</div></div>`).join('');
document.querySelectorAll('[data-block]').forEach(button=>{
 button.addEventListener('click',()=>insertBlock(button.dataset.block));
 button.addEventListener('dragstart',event=>{editor.BlockManager.startDrag(editor.BlockManager.get(button.dataset.block),event);});
 button.addEventListener('dragend',()=>editor.BlockManager.endDrag());
});
// A drop that misses the canvas must never make the browser navigate away from unsaved work
['dragover','drop'].forEach(type=>addEventListener(type,e=>e.preventDefault()));
editor.on('block:drag:stop',component=>{if(!component)return;const added=Array.isArray(component)?component[0]:component;if(added?.get?.('type')==='image'){imageTarget=added;$('image-file').click();}updateEmpty();markDirty();});
editor.on('asset:open',()=>{editor.Modal.close();editor.AssetManager.close?.();});
document.querySelectorAll('[data-quick]').forEach(b=>b.addEventListener('click',()=>insertBlock(b.dataset.quick,editor.getWrapper())));
$('blank-ai').addEventListener('click',()=>{switchTab('assistant');$('project-brief').focus();});

/* ---------- Selection & inspector ---------- */
function updateEmpty(){$('blank-guide').hidden=editor.getWrapper().components().length>0;}
function updateSelection(){const selected=editor.getSelected(),root=editor.getWrapper(),isRoot=!selected||selected===root;const tag=selected?.get('tagName')||'body';$('selected-name').textContent=isRoot?'Page':selected.getName();$('selected-status').textContent=isRoot?'Page selected':selected.getName()+' selected';['duplicate','remove','select-parent'].forEach(id=>$(id).disabled=isRoot);const textLike=!!selected&&/^(h[1-6]|p|a|button|li|blockquote|span|strong)$/.test(tag)&&!selected.find('img').length;$('text-control').hidden=!textLike;if(textLike){const doc=new DOMParser().parseFromString(selected.toHTML(),'text/html');$('element-text').value=doc.body.textContent||'';}$('link-control').hidden=tag!=='a';if(tag==='a')$('element-link').value=selected.getAttributes().href||'';$('image-control').hidden=tag!=='img';if(tag==='img')$('image-alt').value=selected.getAttributes().alt||'';}
editor.on('load',()=>{editor.select(editor.getWrapper());updateEmpty();});
editor.on('component:selected component:deselected',updateSelection);
editor.on('update',()=>{updateEmpty();markDirty();$('undo').disabled=!editor.UndoManager.hasUndo();$('redo').disabled=!editor.UndoManager.hasRedo();});
const undo=()=>{editor.UndoManager.undo();updateEmpty();},redo=()=>{editor.UndoManager.redo();updateEmpty();};
$('undo').addEventListener('click',undo);$('redo').addEventListener('click',redo);
const selectParent=()=>{const parent=editor.getSelected()?.parent();if(parent)editor.select(parent);};
const duplicate=()=>{const selected=editor.getSelected();if(!selected||selected===editor.getWrapper())return;const copy=selected.clone();selected.parent().append(copy,{at:selected.index()+1});editor.select(copy);};
const removeSelected=()=>{const selected=editor.getSelected();if(selected&&selected!==editor.getWrapper()){const parent=selected.parent();selected.remove();editor.select(parent&&parent!==editor.getWrapper()?parent:editor.getWrapper());updateEmpty();}};
$('select-parent').addEventListener('click',selectParent);$('duplicate').addEventListener('click',duplicate);$('remove').addEventListener('click',removeSelected);
$('apply-text').addEventListener('click',()=>{const selected=editor.getSelected();if(selected){selected.components(esc($('element-text').value).replace(/\n/g,'<br>'));markDirty();}});
const PAGE_FILE=/^[a-z0-9][a-z0-9-]*\.html(#[A-Za-z0-9_-]*)?$/;
function safeLink(value){return /^(https?:\/\/|mailto:|tel:|#)/i.test(value)||PAGE_FILE.test(value)||value==='';}
$('apply-link').addEventListener('click',()=>{const value=$('element-link').value.trim();if(!safeLink(value)){toast('Use an https://, mailto:, tel:, #section link, or pick one of your pages.');return;}editor.getSelected()?.addAttributes({href:value||'#'});markDirty();toast('Link updated.');});
$('image-alt').addEventListener('input',()=>{editor.getSelected()?.addAttributes({alt:$('image-alt').value});markDirty();});
$('replace-image').addEventListener('click',()=>{imageTarget=editor.getSelected();$('image-file').click();});
editor.on('run:open-assets',()=>{editor.stopCommand('open-assets');imageTarget=editor.getSelected();$('image-file').click();});
$('image-file').addEventListener('change',async event=>{const file=event.target.files?.[0];event.target.value='';if(!file)return;if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){toast('Choose a PNG, JPG or WebP image under 5 MB.');return;}try{const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=data;});if(imageTarget&&imageTarget.parent()){imageTarget.addAttributes({src:data});editor.select(imageTarget);markDirty();toast('Image added to your website.');}}catch{toast('That image could not be opened.');}});
document.querySelectorAll('[data-device]').forEach(button=>button.addEventListener('click',()=>{editor.setDevice(button.dataset.device);document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));

/* ---------- Theme presets ---------- */
const palettes=[
 {name:'Paper',bg:'#ffffff',text:'#18382b',accent:'#18382b',accentText:'#ffffff'},
 {name:'Oak',bg:'#f4efe3',text:'#0b2419',accent:'#0b2419',accentText:'#f4efe3'},
 {name:'Forest night',bg:'#0b2419',text:'#f4efe3',accent:'#d9b56f',accentText:'#0b2419'},
 {name:'Midnight',bg:'#111318',text:'#eceef3',accent:'#8ab4ff',accentText:'#111318'},
 {name:'Terracotta',bg:'#fbf3ec',text:'#3b2219',accent:'#c4643f',accentText:'#ffffff'},
 {name:'Ocean',bg:'#f1f7fa',text:'#0f2e3d',accent:'#1b7a9e',accentText:'#ffffff'}];
const fonts=[
 {name:'Modern',sample:'Aa',body:'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',head:'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',note:'Clean sans-serif'},
 {name:'Editorial',sample:'Aa',body:'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',head:'Georgia,"Times New Roman",serif',note:'Serif headings'},
 {name:'Classic',sample:'Aa',body:'Georgia,"Times New Roman",serif',head:'Georgia,"Times New Roman",serif',note:'Serif throughout'},
 {name:'Friendly',sample:'Aa',body:'"Trebuchet MS","Segoe UI",sans-serif',head:'"Trebuchet MS","Segoe UI",sans-serif',note:'Rounded, warm'},
 {name:'Technical',sample:'Aa',body:'system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif',head:'ui-monospace,Menlo,Consolas,monospace',note:'Mono headings'}];
$('palettes').innerHTML=palettes.map((p,i)=>`<button class="swatch" data-palette="${i}" aria-pressed="false"><span class="swatch-preview"><span style="background:${p.bg}"></span><span style="background:${p.text}"></span><span style="background:${p.accent}"></span></span>${p.name}</button>`).join('');
$('fonts').innerHTML=fonts.map((f,i)=>`<button class="font-option" data-font="${i}" aria-pressed="false"><span><strong>${f.name}</strong><br><small>${f.note}</small></span><b style="font-family:${esc(f.head)}">${f.sample}</b></button>`).join('');
function applyTheme(style,headFont){editor.Pages.getAll().forEach(page=>{const wrapper=page.getMainComponent();wrapper.setStyle({...wrapper.getStyle(),...style});});if(headFont)editor.Css.setRule('h1, h2, h3, h4',{'font-family':headFont});markDirty();}
document.querySelectorAll('[data-palette]').forEach(b=>b.addEventListener('click',()=>{const p=palettes[b.dataset.palette];applyTheme({'background-color':p.bg,color:p.text,'--oak-accent':p.accent,'--oak-accent-text':p.accentText});document.querySelectorAll('[data-palette]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));toast(p.name+' colours applied.');}));
document.querySelectorAll('[data-font]').forEach(b=>b.addEventListener('click',()=>{const f=fonts[b.dataset.font];applyTheme({'font-family':f.body},f.head);document.querySelectorAll('[data-font]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));toast(f.name+' fonts applied.');}));

/* ---------- Dialogs & start flow ---------- */
document.querySelectorAll('dialog .dialog-close').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d&&d.id!=='start-dialog')d.close();}));
$('start-dialog').addEventListener('cancel',e=>{if(!started)e.preventDefault();});
function showStart(kind='new'){document.querySelector(`[name="project-kind"][value="${kind}"]`).checked=true;$('close-start').hidden=!started;$('start-name').value='';$('start-brief').value='';$('start-file').value='';$('start-error').textContent='';updateStartMode();refreshRestore();refreshCloudList();$('start-dialog').showModal();}
function updateStartMode(){const existing=document.querySelector('[name="project-kind"]:checked').value==='existing';$('existing-options').hidden=!existing;$('aim-label').textContent=existing?'What would you like to change?':'What do you want to make?';$('start-submit').innerHTML=existing?'Open my website <span aria-hidden="true">→</span>':'Open my canvas <span aria-hidden="true">→</span>';}
document.querySelectorAll('[name="project-kind"]').forEach(input=>input.addEventListener('change',updateStartMode));
$('new-project').addEventListener('click',()=>showStart());$('open-project').addEventListener('click',()=>showStart('existing'));

/* ---------- Import / sanitising (unchanged security model) ---------- */
function cleanCss(css){return String(css||'').replace(/@import\s[\s\S]*?;/gi,'').replace(/url\(\s*(['"]?)(?!data:image\/(?:png|jpeg|webp);base64,)[\s\S]*?\1\s*\)/gi,'none').replace(/<\/?style/gi,'').replace(/expression\s*\(/gi,'blocked(').replace(/-moz-binding\s*:/gi,'blocked:');}
function cleanDocument(source,extraCss=''){
 const doc=new DOMParser().parseFromString(source,'text/html');const css=cleanCss([...doc.querySelectorAll('style')].map(s=>s.textContent).join('\n')+'\n'+extraCss);const bodyStyle=cleanCss(doc.body.getAttribute('style')||''),bodyId=doc.body.getAttribute('id')||'',bodyClass=doc.body.getAttribute('class')||'';
 doc.querySelectorAll('script,style,link,meta,base,iframe,object,embed,form,input,textarea,select,video,audio,source').forEach(el=>el.remove());
 const clean=DOMPurify.sanitize(doc.body.innerHTML,{USE_PROFILES:{html:true},ALLOW_DATA_ATTR:false,FORBID_TAGS:['script','iframe','object','embed','form','input','textarea','select','style','link','meta','base'],FORBID_ATTR:['srcset','srcdoc','formaction','action','ping']});
 const safe=new DOMParser().parseFromString(clean,'text/html');safe.querySelectorAll('*').forEach(el=>{for(const attr of [...el.attributes]){if(attr.name.startsWith('data-gjs-')||attr.name.startsWith('on'))el.removeAttribute(attr.name);}if(el.hasAttribute('style'))el.setAttribute('style',cleanCss(el.getAttribute('style')));if(el.hasAttribute('href')&&!safeLink(el.getAttribute('href')))el.removeAttribute('href');if(el.hasAttribute('src')&&!IMAGE_DATA.test(el.getAttribute('src')))el.removeAttribute('src');if(el.tagName==='A'&&el.getAttribute('target')==='_blank')el.setAttribute('rel','noopener noreferrer');});
 return {html:safe.body.innerHTML,css,body:{...(bodyId?{id:bodyId}:{}),...(bodyClass?{class:bodyClass}:{}),...(bodyStyle?{style:bodyStyle}:{})},title:(doc.title||'').slice(0,80)};
}
function legacyProject(model){if(!model||typeof model!=='object')throw new Error('Invalid project');const t=v=>typeof v==='string'?esc(v.slice(0,5000)):'';const parts=[`<section style="padding:60px 8%"><h1>${t(model.headline).replace(/\n/g,'<br>')}</h1><p>${t(model.description)}</p></section>`];if(Array.isArray(model.services))parts.push(`<section style="padding:40px 8%">${model.services.slice(0,20).map(s=>`<article><h2>${t(s.title)}</h2><p>${t(s.text)}</p></article>`).join('')}</section>`);if(model.aboutText)parts.push(`<section style="padding:40px 8%"><h2>${t(model.aboutTitle)}</h2><p>${t(model.aboutText)}</p></section>`);if(Array.isArray(model.faqs))parts.push(`<section style="padding:40px 8%">${model.faqs.slice(0,20).map(s=>`<details><summary>${t(s.q)}</summary><p>${t(s.a)}</p></details>`).join('')}</section>`);if(typeof model.image==='string'&&IMAGE_DATA.test(model.image))parts.splice(1,0,`<img src="${model.image}" alt="">`);return cleanDocument(parts.join(''));}

/* ---------- Pages ---------- */
const Pages=editor.Pages;
const pageFile=(page,i=Pages.getAll().indexOf(page))=>(i===0?'index':page.get('slug')||'page')+'.html';
function slugify(name){let base=String(name).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40)||'page';return base==='index'?'home':base;}
function uniqueSlug(name,except){const taken=new Set(Pages.getAll().filter(p=>p!==except).map(p=>p.get('slug')));const base=slugify(name);let s=base,n=2;while(taken.has(s)||s==='index')s=`${base}-${n++}`;return s;}
const maxPages=()=>OakCloud.limits.max_pages;
function applyBody(wrapper,body={}){wrapper.setAttributes(body);if(body.style){const declaration=document.createElement('div');declaration.setAttribute('style',body.style);const values={};for(const property of declaration.style)values[property]=declaration.style.getPropertyValue(property);wrapper.setStyle(values);}else wrapper.setStyle({});}
// Replaces every page. A blank placeholder page lets the old pages (and their element ids) go first.
function loadProject(project,{resetHistory=true}={}){
 loading=true;
 const placeholder=Pages.add({name:'…'});Pages.select(placeholder);
 Pages.getAll().filter(p=>p!==placeholder).forEach(p=>Pages.remove(p));
 editor.setStyle(BASE_CSS+'\n'+project.css);
 const added=project.pages.map(pg=>{const page=Pages.add({name:pg.name,component:pg.content.html});applyBody(page.getMainComponent(),pg.content.body);return page;});
 Pages.select(added[0]);Pages.remove(placeholder);
 added.forEach((page,i)=>page.set('slug',i===0?'index':uniqueSlug(project.pages[i].slug||page.getName(),page)));
 if(resetHistory)editor.UndoManager.clear();
 loading=false;renderPages();updateEmpty();editor.select(editor.getWrapper());
}
const singlePage=(content,name='Home')=>({css:content.css,pages:[{name,slug:'index',content:{html:content.html,body:content.body}}]});
function renderPages(){
 const all=Pages.getAll(),current=Pages.getSelected(),limit=maxPages();
 $('page-list').replaceChildren(...all.map((page,i)=>{
  const li=document.createElement('li');li.className='page-item'+(page===current?' current':'');
  const open=document.createElement('button');open.className='page-open';open.title='Edit this page';open.setAttribute('aria-label','Edit '+page.getName());open.addEventListener('click',()=>selectPage(page));
  const input=document.createElement('input');input.value=page.getName();input.maxLength=40;input.setAttribute('aria-label','Page name');
  input.addEventListener('change',()=>{const name=input.value.trim()||'Untitled page';page.set('name',name);if(i>0)page.set('slug',uniqueSlug(name,page));renderPages();markDirty();});
  const file=document.createElement('small');file.textContent=pageFile(page,i);
  const del=document.createElement('button');del.textContent='Delete';del.disabled=i===0;del.title=i===0?'Your homepage can’t be deleted':'Delete page';
  del.addEventListener('click',()=>{if(!confirm(`Delete the page “${page.getName()}”? You can undo other edits, but not this.`))return;if(Pages.getSelected()===page)selectPage(all[0]);Pages.remove(page);if(meta.cloudBlocked==='pages')meta.cloudBlocked=false;renderPages();markDirty();});
  const names=document.createElement('div');names.className='page-names';names.append(input,file);li.append(open,names,del);return li;}));
 const atLimit=all.length>=limit;
 $('add-page').disabled=atLimit;$('new-page-name').disabled=atLimit;
 $('page-limit').textContent=atLimit?`You’ve reached ${limit} pages on the ${OakCloud.plan==='pro'?'Pro':'Free'} plan.${OakCloud.plan==='pro'?'':' Pro allows 25 pages per website.'}`:`${all.length} of ${limit} pages used.`;
 $('current-page').textContent=all.length>1?'Page: '+(current?.getName()||''):'';
 $('link-page').replaceChildren(new Option('Link to one of your pages…',''),...all.map((page,i)=>new Option(page.getName()+' ('+pageFile(page,i)+')',pageFile(page,i))));
}
function selectPage(page){if(Pages.getSelected()!==page)Pages.select(page);renderPages();updateEmpty();editor.select(editor.getWrapper());}
$('add-page-form').addEventListener('submit',event=>{event.preventDefault();if(Pages.getAll().length>=maxPages()){renderPages();return;}const name=$('new-page-name').value.trim()||`Page ${Pages.getAll().length+1}`;const page=Pages.add({name,component:''});page.set('slug',uniqueSlug(name,page));$('new-page-name').value='';selectPage(page);markDirty();toast(`“${name}” added. It downloads as ${pageFile(page)}.`);});
$('link-page').addEventListener('change',()=>{if($('link-page').value)$('element-link').value=$('link-page').value;});

/* ---------- Opening projects ---------- */
function projectFromFile(root){
 if(root.format==='oakline-canvas-project'&&root.version===3&&Array.isArray(root.pages)&&root.pages.length&&root.pages.length<=25&&typeof root.css==='string'){
  const size=root.css.length+root.pages.reduce((n,p)=>n+String(p?.html||'').length,0);if(size>14*1024*1024)throw new Error('Project content is too large.');
  return{css:cleanCss(root.css),pages:root.pages.map((p,i)=>{const content=cleanDocument(String(p?.html||''));return{name:String(p?.name||`Page ${i+1}`).slice(0,40),slug:typeof p?.slug==='string'?p.slug:'',content:{html:content.html,body:content.body}};})};
 }
 if(root.format==='oakline-canvas-project'&&root.version===2&&typeof root.html==='string'&&typeof root.css==='string'){if(root.html.length+root.css.length>14*1024*1024)throw new Error('Project content is too large.');return singlePage(cleanDocument(root.html,root.css));}
 return null;
}
async function readProject(file){if(!file)throw new Error('Choose an HTML website or an Oakline project file.');if(file.size>15*1024*1024)throw new Error('Choose a project smaller than 15 MB.');const source=await file.text();if(/\.json$/i.test(file.name)){let root;try{root=JSON.parse(source);}catch{throw new Error('This JSON file could not be read.');}const project=projectFromFile(root);if(project)return{project,name:typeof root.name==='string'?root.name.slice(0,80):'',brief:typeof root.brief==='string'?root.brief.slice(0,4000):''};if(root.format==='oakline-studio-project'&&root.schemaVersion===1)return{project:singlePage(legacyProject(root.project)),name:String(root.project.brand||'Imported website').slice(0,80),brief:'',legacy:true};throw new Error('Choose an Oakline project file, or import an HTML website.');}if(!/\.(html?|htm)$/i.test(file.name))throw new Error('Choose an HTML or Oakline JSON file.');const content=cleanDocument(source);return{project:singlePage(content),name:content.title,brief:''};}
function openProject(project,{name,brief,kind,message,cloudId=null}){meta={name,brief,kind,cloudId,cloudBlocked:false};loadProject(project);$('project-name').value=meta.name;$('project-brief').value=meta.brief;$('project-mode').textContent=kind==='new'?'New website':'Editing website';$('ai-results').replaceChildren();suggestionRun++;started=true;dirty=false;$('start-dialog').close();switchTab('add');toast(message);}
const confirmLeave=()=>!(started&&dirty)||confirm('Open a different website? Your current work hasn’t finished saving — download an editable project first if you want to keep it.');
$('start-form').addEventListener('submit',async event=>{event.preventDefault();$('start-error').textContent='';const kind=document.querySelector('[name="project-kind"]:checked').value;try{const imported=kind==='existing'?await readProject($('start-file').files[0]):null;if(!confirmLeave())return;openProject(imported?.project||singlePage({html:'',css:'',body:{}}),{name:$('start-name').value.trim()||imported?.name||'Untitled website',brief:$('start-brief').value.trim()||imported?.brief||'',kind,message:imported?.legacy?'Previous project content imported into the new canvas.':kind==='existing'?'Website opened. Your original file is unchanged.':'Your canvas is ready. Drag in any block to begin.'});autosave();}catch(error){$('start-error').textContent=error.message;}});
$('project-name').addEventListener('input',()=>{meta.name=$('project-name').value.trim()||'Untitled website';markDirty();});
$('project-brief').addEventListener('input',()=>{meta.brief=$('project-brief').value;markDirty();});

/* ---------- Saving: this browser (IndexedDB) + your account (Supabase) ---------- */
const pageHtml=page=>editor.getHtml({component:page.getMainComponent()});
function projectData(){return{css:editor.getCss({keepUnusedStyles:true}),pages:Pages.getAll().map((page,i)=>({name:page.getName(),slug:i===0?'index':page.get('slug'),html:pageHtml(page)}))};}
function snapshot(){return{format:'oakline-canvas-project',version:3,name:meta.name,brief:meta.brief,kind:meta.kind,...projectData(),savedAt:Date.now()};}
const DB_NAME='oakline-studio',STORE='projects',KEY='current';
function db(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function idb(mode,fn){const conn=await db();return new Promise((resolve,reject)=>{const tx=conn.transaction(STORE,mode);const req=fn(tx.objectStore(STORE));tx.oncomplete=()=>{resolve(req?.result);conn.close();};tx.onerror=tx.onabort=()=>{reject(tx.error);conn.close();};});}
function scheduleAutosave(){clearTimeout(autosaveTimer);autosaveTimer=setTimeout(autosave,1200);}
let cloudBusy=false,cloudAgain=false;
async function saveToCloud(snap){
 if(!OakCloud.user||!started)return'off';
 if(meta.cloudBlocked)return'blocked';
 if(cloudBusy){cloudAgain=true;return'busy';}
 cloudBusy=true;
 try{
  const saved=await OakCloud.saveProject(meta.cloudId,{name:meta.name,brief:meta.brief,kind:meta.kind,data:{css:snap.css,pages:snap.pages}});
  meta.cloudId=saved.id;meta.cloudOwner=OakCloud.user.id;return'saved';
 }catch(error){
  if(error.code==='PROJECT_LIMIT'){meta.cloudBlocked='projects';toast(`Your plan allows ${OakCloud.limits.max_projects} cloud projects. This one is saved in this browser only.`);return'blocked';}
  if(error.code==='PAGE_LIMIT'){meta.cloudBlocked='pages';toast(`Your plan allows ${OakCloud.limits.max_pages} pages per website. Remove a page to keep saving to your account.`);return'blocked';}
  if(/0 rows|no\) rows/i.test(error.message))meta.cloudId=null;  // deleted elsewhere: next save creates it again
  return'error';
 }finally{cloudBusy=false;if(cloudAgain){cloudAgain=false;scheduleAutosave();}}
}
async function autosave(){
 if(!started)return;
 const snap=snapshot(),time=new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
 let local=true;try{await idb('readwrite',s=>s.put({...snap,cloudId:meta.cloudId||null,owner:OakCloud.user?.id||null},KEY));}catch{local=false;}
 const cloud=await saveToCloud(snap);
 if(cloud==='busy')return;
 if(cloud==='saved'){dirty=false;setStatus('Saved to your account · '+time,'saved');}
 else if(cloud==='blocked')setStatus('Saved in this browser only · plan limit reached','pending');
 else if(cloud==='error')setStatus('Couldn’t reach your account · saved in this browser','pending');
 else setStatus(local?'Autosaved in this browser · '+time:'Autosave unavailable · download a project to keep your work',local?'saved':'pending');
}
let restorable=null;
async function refreshRestore(){try{restorable=await idb('readonly',s=>s.get(KEY));}catch{restorable=null;}const valid=restorable&&(typeof restorable.html==='string'||Array.isArray(restorable.pages));const show=!started&&valid;$('restore-box').hidden=!show;if(show){const when=new Date(restorable.savedAt);$('restore-meta').textContent=`“${restorable.name||'Untitled website'}” · saved ${when.toLocaleDateString()} ${when.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}`;}}
$('restore-btn').addEventListener('click',async()=>{if(!restorable)return;await OakCloud.ready;try{const project=projectFromFile({...restorable,format:'oakline-canvas-project',version:Array.isArray(restorable.pages)?3:2});if(!project)throw new Error();const mine=restorable.owner&&restorable.owner===OakCloud.user?.id;openProject(project,{name:String(restorable.name||'Untitled website').slice(0,80),brief:String(restorable.brief||'').slice(0,4000),kind:restorable.kind==='existing'?'existing':'new',cloudId:mine?restorable.cloudId:null,message:'Welcome back. Your work is right where you left it.'});setStatus('Restored from this browser','saved');}catch{toast('That saved work couldn’t be opened.');}});

/* ---------- Cloud project list (start dialog) ---------- */
async function refreshCloudList(){
 await OakCloud.ready;
 const signedIn=Boolean(OakCloud.user);
 $('cloud-box').hidden=!signedIn;$('signin-hint').hidden=signedIn||!OakCloud.enabled;
 if(!signedIn)return;
 const list=$('cloud-list');list.innerHTML='<li class="empty">Loading your projects…</li>';
 try{
  const projects=await OakCloud.listProjects();const limit=OakCloud.limits.max_projects;
  $('cloud-count').textContent=`${projects.length} of ${limit} used`+(projects.length>=limit?' · new projects will be saved in this browser only':'');
  if(!projects.length){list.innerHTML='<li class="empty">No saved projects yet. Anything you start now saves here automatically.</li>';return;}
  list.replaceChildren(...projects.map(p=>{
   const li=document.createElement('li');
   const open=document.createElement('button');open.type='button';open.className='open';
   const strong=document.createElement('strong');strong.textContent=p.name;const small=document.createElement('small');small.textContent='Edited '+new Date(p.updated_at).toLocaleString([],{dateStyle:'medium',timeStyle:'short'});
   open.append(strong,small);open.addEventListener('click',()=>openCloudProject(p.id));
   const del=document.createElement('button');del.type='button';del.className='del';del.textContent='Delete';del.setAttribute('aria-label','Delete '+p.name);
   del.addEventListener('click',async()=>{if(!confirm(`Delete “${p.name}” from your account? This can’t be undone.`))return;try{await OakCloud.deleteProject(p.id);if(meta.cloudId===p.id){meta.cloudId=null;meta.cloudBlocked=false;}refreshCloudList();}catch(error){toast(error.message);}});
   li.append(open,del);return li;}));
 }catch(error){list.innerHTML='';const li=document.createElement('li');li.className='empty';li.textContent=error.message;list.append(li);}
}
async function openCloudProject(id){
 if(!confirmLeave())return;
 try{const row=await OakCloud.getProject(id);const project=projectFromFile({format:'oakline-canvas-project',version:3,css:row.data?.css||'',pages:row.data?.pages?.length?row.data.pages:[{name:'Home',html:''}]});
  openProject(project,{name:row.name,brief:row.brief,kind:row.kind,cloudId:row.id,message:`“${row.name}” opened from your account.`});setStatus('Saved to your account','saved');}
 catch(error){$('start-error').textContent=error.message||'That project couldn’t be opened.';}
}

/* ---------- Code editor (current page; styles are shared by all pages) ---------- */
$('edit-code').addEventListener('click',()=>{$('code-html').value=editor.getHtml();$('code-css').value=editor.getCss({keepUnusedStyles:true});$('code-error').textContent='';$('code-dialog').showModal();});
$('apply-code').addEventListener('click',()=>{try{if($('code-html').value.length+$('code-css').value.length>14*1024*1024)throw new Error('Keep the page under 14 MB.');const content=cleanDocument($('code-html').value,$('code-css').value);const wrapper=editor.getWrapper();loading=true;wrapper.components('');editor.setStyle(BASE_CSS+'\n'+content.css);wrapper.components(content.html);applyBody(wrapper,content.body);loading=false;updateEmpty();markDirty();$('code-dialog').close();toast('Your HTML and CSS are on the canvas.');}catch(error){loading=false;$('code-error').textContent=error.message;}});

/* ---------- Export & preview ---------- */
function pageDocument(page){const i=Pages.getAll().indexOf(page);const content=cleanDocument(pageHtml(page),editor.getCss({component:page.getMainComponent()}));const attrs=Object.entries(content.body).map(([key,value])=>` ${key}="${esc(value)}"`).join('');const title=i>0?`${page.getName()} · ${meta.name}`:meta.name;return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="generator" content="Oakline Creator"><style>${BASE_CSS}\n${content.css}</style></head><body${attrs}>${content.html}</body></html>`;}
function slug(){return meta.name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70)||'my-website';}
function download(contents,type,name){const url=URL.createObjectURL(new Blob([contents],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function saveProject(){const {format,version,name,brief,kind,css,pages}=snapshot();const file=JSON.stringify({format,version,name,brief,kind,css,pages},null,2);if(new Blob([file]).size>15*1024*1024){toast('This project exceeds the 15 MB import limit. Remove or resize large images before saving.');return;}download(file,'application/json',slug()+'.oakline.json');if(!OakCloud.user)dirty=false;toast('Project saved. Open it any time with “Open”.');}
$('download').addEventListener('click',()=>{const count=Pages.getAll().length;$('export-html-note').textContent=count>1?`A .zip with ${count} HTML pages (index.html is your homepage). Upload the files to any host.`:'One HTML file with your styles and images. Upload it to any host.';$('export-note').textContent=OakCloud.user?'Your work also saves to your account automatically.':'Your latest work is also autosaved in this browser.';$('export-dialog').showModal();});
$('export-html').addEventListener('click',()=>{const pages=Pages.getAll();if(pages.length===1){download(pageDocument(pages[0]),'text/html;charset=utf-8',slug()+'.html');}else{const files=Object.fromEntries(pages.map(page=>[pageFile(page),fflate.strToU8(pageDocument(page))]));download(fflate.zipSync(files,{level:6}),'application/zip',slug()+'.zip');}toast('Your website download has started.');});
$('export-project').addEventListener('click',saveProject);
function openPreview(){const page=Pages.getSelected();$('preview-title').textContent=Pages.getAll().length>1?`${meta.name} — ${page.getName()}`:meta.name;$('preview-frame').srcdoc=pageDocument(page);$('preview-dialog').showModal();}
$('preview').addEventListener('click',openPreview);
$('preview-dialog').addEventListener('close',()=>$('preview-frame').srcdoc='');
document.querySelectorAll('[data-preview]').forEach(b=>b.addEventListener('click',()=>{$('preview-frame').style.width=b.dataset.preview;document.querySelectorAll('[data-preview]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
$('help').addEventListener('click',()=>$('help-dialog').showModal());$('shortcuts-btn').addEventListener('click',()=>$('help-dialog').showModal());
$('small-continue').addEventListener('click',()=>document.body.classList.add('force-small'));

/* ---------- Keyboard shortcuts (work in the page and inside the canvas) ---------- */
const guarded=fn=>(ed,sender,{event}={})=>{if(!started||document.querySelector('dialog[open]'))return;const t=event?.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;fn();};
editor.Keymaps.add('oak:duplicate','⌘+d, ctrl+d',guarded(duplicate),{prevent:true});
editor.Keymaps.add('oak:save','⌘+s, ctrl+s',guarded(saveProject),{prevent:true});
editor.Keymaps.add('oak:preview','⌘+p, ctrl+p',guarded(openPreview),{prevent:true});
editor.Keymaps.add('oak:parent','escape',guarded(selectParent));


/* ---------- Accounts ---------- */
let authMode='signin',afterSignIn=null;
function renderAccountButton(){
 const btn=$('account-btn');btn.hidden=!OakCloud.enabled;if(!OakCloud.enabled)return;
 const user=OakCloud.user;btn.classList.toggle('pro',OakCloud.plan==='pro');
 btn.querySelector('.avatar').textContent=user?(user.email||'?')[0].toUpperCase():'';
 $('account-label').textContent=user?(OakCloud.plan==='pro'?'Pro':'Account'):'Sign in';
 btn.setAttribute('aria-label',user?`Account: ${user.email}`:'Sign in or create an account');
}
function setAuthMode(mode,intro=''){
 authMode=mode;
 const titles={signin:'Welcome <em>back.</em>',signup:'Create your <em>account.</em>',reset:'Reset your <em>password.</em>'};
 $('auth-title').innerHTML=titles[mode];
 document.querySelectorAll('[data-auth]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.auth===mode)));
 $('auth-tabs').hidden=mode==='reset';$('auth-password-field').hidden=mode==='reset';
 $('auth-password').autocomplete=mode==='signup'?'new-password':'current-password';
 $('auth-submit').textContent={signin:'Sign in',signup:'Create account',reset:'Send reset link'}[mode];
 $('auth-forgot').textContent=mode==='reset'?'← Back to sign in':'Forgot your password?';
 $('auth-intro').hidden=!intro;$('auth-intro').textContent=intro;
 $('auth-error').textContent='';$('auth-message').hidden=true;$('auth-resend').hidden=true;
}
function openAuth(mode='signin',intro='',then=null){afterSignIn=then;setAuthMode(mode,intro);if(!$('auth-dialog').open)$('auth-dialog').showModal();$('auth-email').focus();}
document.querySelectorAll('[data-auth]').forEach(b=>b.addEventListener('click',()=>setAuthMode(b.dataset.auth,$('auth-intro').textContent)));
$('auth-forgot').addEventListener('click',()=>setAuthMode(authMode==='reset'?'signin':'reset'));
$('auth-form').addEventListener('submit',async event=>{
 event.preventDefault();const email=$('auth-email').value.trim(),password=$('auth-password').value;
 $('auth-error').textContent='';$('auth-message').hidden=true;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){$('auth-error').textContent='Enter a valid email address.';return;}
 if(authMode!=='reset'&&password.length<8){$('auth-error').textContent='Passwords have at least 8 characters.';return;}
 const submit=$('auth-submit');submit.disabled=true;
 try{
  if(authMode==='signin'){await OakCloud.signIn(email,password);$('auth-dialog').close();toast('Signed in. Your work now saves to your account.');const next=afterSignIn;afterSignIn=null;next?.();}
  else if(authMode==='signup'){const {needsConfirmation}=await OakCloud.signUp(email,password);if(needsConfirmation){$('auth-message').textContent=`Almost there — we’ve emailed a confirmation link to ${email}. Open it to finish creating your account.`;$('auth-message').hidden=false;$('auth-resend').hidden=false;}else{$('auth-dialog').close();toast('Account created. Welcome to Oakline!');}}
  else{await OakCloud.resetPassword(email);$('auth-message').textContent=`If there’s an account for ${email}, a reset link is on its way.`;$('auth-message').hidden=false;}
 }catch(error){$('auth-error').textContent=error.message;if(/confirm your email/i.test(error.message))$('auth-resend').hidden=false;}
 finally{submit.disabled=false;}
});
$('auth-resend').addEventListener('click',async()=>{try{await OakCloud.resendConfirmation($('auth-email').value.trim());$('auth-message').textContent='Confirmation email sent again.';$('auth-message').hidden=false;}catch(error){$('auth-error').textContent=error.message;}});
$('recovery-form').addEventListener('submit',async event=>{event.preventDefault();const password=$('recovery-password').value;if(password.length<8){$('recovery-error').textContent='Choose at least 8 characters.';return;}try{await OakCloud.setPassword(password);$('recovery-dialog').close();toast('Password updated. You’re signed in.');}catch(error){$('recovery-error').textContent=error.message;}});

function meter(id,used,limit){$(id+'-text').textContent=limit?`${Math.max(limit-used,0)} of ${limit} left`:'Not included on Free';$(id+'-bar').style.width=limit?Math.min(100,used/limit*100)+'%':'0%';}
function renderAccount(){
 const user=OakCloud.user,account=OakCloud.state.account;if(!user)return;
 $('account-email').textContent=user.email;
 const pro=OakCloud.plan==='pro',sub=account?.subscription,limits=OakCloud.limits;
 $('plan-badge').textContent=pro?'Pro':'Free';$('plan-badge').classList.toggle('pro',pro);
 const end=sub?.current_period_end?new Date(sub.current_period_end).toLocaleDateString([], {dateStyle:'medium'}):'';
 $('plan-detail').textContent=pro?(sub.cancel_at_period_end?`Ends ${end}`:`${sub.interval==='year'?'Yearly':'Monthly'} · renews ${end}`):(sub&&['past_due','unpaid'].includes(sub.status)?'Payment problem — update your card in Manage billing':'');
 $('verify-warning').hidden=OakCloud.verified;
 meter('luna',account?.used?.luna||0,limits.luna_per_month);meter('sol',account?.used?.sol||0,limits.sol_per_month);
 $('projects-text').textContent=`${account?.projects??0} of ${limits.max_projects}`;$('projects-bar').style.width=Math.min(100,(account?.projects||0)/limits.max_projects*100)+'%';
 $('reset-note').textContent=account?.resets?`AI allowances reset on ${new Date(account.resets+'T00:00:00').toLocaleDateString([],{dateStyle:'medium'})}. Unused requests don’t roll over.`:'';
 $('upgrade-box').hidden=pro||!OakCloud.state.config.billing;
 $('manage-billing').hidden=!OakCloud.state.config.billing||!sub||sub.status==='none';
}
async function openAccount(){$('account-error').textContent='';renderAccount();$('account-dialog').showModal();await OakCloud.refreshAccount();renderAccount();}
$('account-btn').addEventListener('click',()=>OakCloud.user?openAccount():openAuth('signin'));
$('start-signin').addEventListener('click',()=>openAuth('signin','',()=>refreshCloudList()));
$('sign-out').addEventListener('click',async()=>{await autosave();await OakCloud.signOut();meta.cloudId=null;meta.cloudBlocked=false;$('account-dialog').close();toast('Signed out. This project stays saved in this browser.');});
$('account-resend').addEventListener('click',async()=>{try{await OakCloud.resendConfirmation(OakCloud.user.email);toast('Confirmation email sent.');}catch(error){$('account-error').textContent=error.message;}});
document.querySelectorAll('[data-upgrade]').forEach(b=>b.addEventListener('click',async()=>{$('account-error').textContent='';if(!OakCloud.verified){$('account-error').textContent='Please confirm your email address first.';return;}b.disabled=true;try{await autosave();await OakCloud.checkout(b.dataset.upgrade);}catch(error){$('account-error').textContent=error.message;b.disabled=false;}}));
$('manage-billing').addEventListener('click',async()=>{try{await autosave();await OakCloud.portal();}catch(error){$('account-error').textContent=error.message;}});

OakCloud.on(event=>{
 renderAccountButton();renderPages();updateAIPanel();
 if(event==='session'){if(OakCloud.user){meta.cloudBlocked=false;if(started)autosave();}if($('start-dialog').open)refreshCloudList();}
 if(event==='account'&&$('account-dialog').open)renderAccount();
 if(event==='recovery'){$('recovery-error').textContent='';$('recovery-dialog').showModal();}
});

/* ---------- AI suggestions ---------- */
const selectedModel=()=>document.querySelector('[name="ai-model"]:checked').value;
function updateAIPanel(){
 const ai=OakCloud.state.config?.ai||{available:false},user=OakCloud.user,account=OakCloud.state.account,limits=OakCloud.limits;
 const solAllowed=!ai.requiresAccount||limits.sol_per_month>0;
 const sol=document.querySelector('[name="ai-model"][value="sol"]');sol.disabled=!solAllowed;if(!solAllowed&&sol.checked)document.querySelector('[name="ai-model"][value="luna"]').checked=true;
 $('model-switch').hidden=!ai.available||!ai.requiresAccount;
 let status,ready=false,label='✦ Suggest ideas';
 if(!OakCloud.state.config)status='Checking AI availability…';
 else if(!ai.available)status='AI suggestions aren’t connected yet. Every design tool still works.';
 else if(ai.requiresAccount&&!user){status='Sign in to get AI layout ideas — Free accounts include 25 Luna requests a month.';ready=true;label='Sign in to use AI';}
 else if(ai.requiresAccount&&!OakCloud.verified)status='Confirm your email address to use AI suggestions.';
 else{status='Ready when you are. Suggestions only change your page when you choose to apply them.';ready=true;}
 aiReady=ready;$('ask-ai').disabled=!ready;$('ask-ai').textContent=label;
 if(!$('ai-status').dataset.busy)$('ai-status').textContent=status;
 const show=ai.available&&user&&account;$('ai-balance').hidden=!show;
 if(show){const m=selectedModel(),lim=m==='sol'?limits.sol_per_month:limits.luna_per_month,left=Math.max(lim-(account.used?.[m]||0),0);$('ai-balance').textContent=`${m==='sol'?'Sol':'Luna'}: ${left} of ${lim} requests left this month`;}
}
document.querySelectorAll('[name="ai-model"]').forEach(r=>r.addEventListener('change',updateAIPanel));
document.querySelectorAll('#prompt-chips button').forEach(b=>b.addEventListener('click',()=>{$('ai-prompt').value=b.textContent;$('ai-prompt').focus();}));
$('ask-ai').addEventListener('click',async()=>{
 if(!aiReady)return;
 if(OakCloud.state.config.ai.requiresAccount&&!OakCloud.user){openAuth('signin','Sign in or create a free account to get AI layout ideas.');return;}
 const brief=$('project-brief').value.trim(),prompt=$('ai-prompt').value.trim();
 if(!brief&&!prompt){$('ai-status').textContent='Describe your website or ask a design question first.';$('project-brief').focus();return;}
 const run=++suggestionRun;$('ask-ai').disabled=true;$('ai-status').dataset.busy='1';$('ai-status').textContent='Thinking through a few directions…';
 try{const doc=new DOMParser().parseFromString(editor.getHtml(),'text/html');const outline=[...doc.querySelectorAll('h1,h2,h3,p')].map(el=>el.tagName+': '+el.textContent).join('\n').slice(0,4000);
  const result=await OakCloud.askAI({brief,prompt,outline,model:selectedModel()});
  if(run!==suggestionRun)return;renderSuggestions(result);delete $('ai-status').dataset.busy;$('ai-status').textContent='Here are some directions to explore. Your canvas is unchanged.';}
 catch(error){if(run===suggestionRun){delete $('ai-status').dataset.busy;$('ai-status').textContent=error.name==='TimeoutError'?'The assistant took too long. This request wasn’t counted — please try again.':error.message;if(error.code==='SIGN_IN')openAuth('signin','Your session expired. Please sign in again.');}}
 finally{delete $('ai-status').dataset.busy;$('ask-ai').disabled=!aiReady;}
});
function renderSuggestions(result){const area=$('ai-results');area.replaceChildren();if(!Array.isArray(result.suggestions))throw new Error('The assistant returned an unreadable response.');for(const suggestion of result.suggestions.slice(0,3)){const article=document.createElement('article');article.className='suggestion';const title=document.createElement('h3');title.textContent=String(suggestion.title||'Design direction');const rationale=document.createElement('p');rationale.textContent=String(suggestion.reason||'');const list=document.createElement('ol');for(const step of (suggestion.steps||[]).slice(0,5)){const li=document.createElement('li');li.textContent=String(step);list.append(li);}article.append(title,rationale,list);if(['section','columns','grid'].includes(suggestion.block)){const button=document.createElement('button');button.textContent='+ Add an empty '+({section:'section',columns:'two-column container',grid:'three-column container'}[suggestion.block]);button.addEventListener('click',()=>{insertBlock(suggestion.block,editor.getWrapper());toast('Empty structure added. Add your own content and style.');});article.append(button);}area.append(article);}}

addEventListener('beforeunload',event=>{if(dirty){autosave();event.preventDefault();event.returnValue='';}});

/* ---------- Boot ---------- */
renderPages();
showStart();
const params=new URLSearchParams(location.search);let intro={};try{intro=JSON.parse(sessionStorage.getItem('oakline-start')||'{}');sessionStorage.removeItem('oakline-start');}catch{}
$('start-name').value=String(intro.name||params.get('brand')||'').slice(0,80);$('start-brief').value=String(intro.brief||params.get('brief')||'').slice(0,4000);
if((intro.mode||params.get('mode'))==='existing'){document.querySelector('[name="project-kind"][value="existing"]').checked=true;updateStartMode();}
OakCloud.ready.then(()=>{
 updateAIPanel();renderAccountButton();
 const upgrade=params.get('upgrade'),billing=params.get('billing');
 if(['month','year'].includes(upgrade)&&OakCloud.state.config.billing){if(OakCloud.user)openAccount();else openAuth('signin','Sign in or create an account to upgrade to Pro.',openAccount);}
 else if(params.get('signin')==='1'&&OakCloud.enabled&&!OakCloud.user)openAuth('signin');
 if(billing==='success'){toast('Payment received — Pro switches on as soon as Stripe confirms it.');let tries=0;const poll=setInterval(async()=>{await OakCloud.refreshAccount();if(OakCloud.plan==='pro'||++tries>12){clearInterval(poll);if(OakCloud.plan==='pro')toast('You’re on Pro. Enjoy!');}},3000);}
 else if(billing==='cancelled')toast('Checkout cancelled — you haven’t been charged.');
 if(upgrade||billing||params.get('signin'))history.replaceState(null,'',location.pathname);
});

/* Optional browser model-context hooks (unchanged) */
if(document.modelContext?.registerTool){const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const register=tool=>{try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};register({name:'read_website_design',description:'Read the current Oakline project brief, website name and page outline.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:async()=>{const doc=new DOMParser().parseFromString(editor.getHtml(),'text/html');return{content:[{type:'text',text:JSON.stringify({name:meta.name,brief:meta.brief,outline:doc.body.textContent.slice(0,6000)})}]};}});register({name:'add_website_element',description:'Add an editable building block to the current Oakline website after the user has started a project.',inputSchema:{type:'object',properties:{element:{type:'string',enum:blocks.map(b=>b.id)}},required:['element'],additionalProperties:false},execute:async input=>{if(!started||!input||Object.keys(input).some(key=>key!=='element')||!blocks.some(b=>b.id===input.element)||input.element==='image')return{isError:true,content:[{type:'text',text:'Start a project and choose a supported element. Upload images through the image control.'}]};insertBlock(input.element,editor.getWrapper());await new Promise(resolve=>requestAnimationFrame(resolve));return{content:[{type:'text',text:'Element added to your canvas.'}]};}});}
