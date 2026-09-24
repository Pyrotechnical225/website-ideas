'use strict';
const menu=document.querySelector('.menu'),navigation=document.querySelector('.navlinks');
function closeMenu(){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='Menu +';}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close ×':'Menu +';navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
matchMedia('(min-width:761px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('idea-form').addEventListener('submit',event=>{event.preventDefault();const mode=event.submitter?.value||'new';try{sessionStorage.setItem('oakline-start',JSON.stringify({mode,name:document.getElementById('demo-name').value,brief:document.getElementById('demo-brief').value}));}catch{}location.href='/studio.html?mode='+mode;});
fetch('/api/assistant/status',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(data=>{document.getElementById('home-ai-status').textContent=data.available?'AI suggestions: connected.':'AI suggestions: connection pending. All design tools are available.';}).catch(()=>{document.getElementById('home-ai-status').textContent='AI suggestions: connection pending. All design tools are available.';});
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){document.documentElement.classList.add('js-reveal');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}
