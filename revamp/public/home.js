'use strict';
document.documentElement.classList.add('js');
const header=document.querySelector('.site-header'),toggle=document.querySelector('.menu-toggle'),links=document.getElementById('nav-links');

// Header background once the page scrolls
const onScroll=()=>header.classList.toggle('scrolled',scrollY>20);
addEventListener('scroll',onScroll,{passive:true});onScroll();

// Mobile menu
function setMenu(open){toggle.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open);}
toggle.addEventListener('click',()=>setMenu(toggle.getAttribute('aria-expanded')!=='true'));
links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setMenu(false);toggle.focus();}});
matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)setMenu(false);});

// Hero idea form → hands the brief to the studio
document.getElementById('idea-form').addEventListener('submit',event=>{
  event.preventDefault();
  const mode=event.submitter?.value==='existing'?'existing':'new';
  try{sessionStorage.setItem('oakline-start',JSON.stringify({mode,name:'',brief:document.getElementById('idea-brief').value.trim()}));}catch{}
  location.href='/studio?mode='+mode;
});
document.getElementById('idea-brief').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();e.target.form.requestSubmit();}});

// Pricing toggle
const prices={monthly:{price:'£19',period:'/month',note:'Billed monthly. Cancel any time.'},yearly:{price:'£15',period:'/month',note:'£180 billed once a year — save £48.'}};
document.querySelectorAll('[data-billing]').forEach(button=>button.addEventListener('click',()=>{
  const p=prices[button.dataset.billing];billingInterval=button.dataset.billing==='yearly'?'year':'month';
  document.querySelectorAll('[data-billing]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('[data-price]').textContent=p.price;
  document.querySelector('[data-period]').textContent=p.period;
  document.querySelector('[data-billing-note]').textContent=p.note;
}));

// Live settings: show sign-in and enable Pro checkout only when the site owner has switched them on
let billingInterval='month';
fetch('/api/config',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(config=>{
  if(!config)return;
  if(config.accounts)document.getElementById('nav-signin').hidden=false;
  if(config.billing){
    const cta=document.getElementById('pro-cta');cta.disabled=false;cta.textContent='Upgrade to Pro';
    cta.addEventListener('click',()=>{location.href='/studio?upgrade='+billingInterval;});
    document.getElementById('pro-badge').textContent='Most popular';
    document.getElementById('pricing-fine').textContent='Cancel any time from your account.';
  }
}).catch(()=>{});
document.getElementById('year').textContent=new Date().getFullYear();

// Scroll reveal
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}},{threshold:.12,rootMargin:'0px 0px -40px'});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
