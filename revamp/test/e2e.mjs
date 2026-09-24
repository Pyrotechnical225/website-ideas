// Full browser journey against the fake services. Needs Playwright:
//   PLAYWRIGHT=/path/to/playwright/index.mjs node test/e2e.mjs
// with the site on :8788 configured for the fake services on :54321 (see README).
import fs from 'node:fs';
import crypto from 'node:crypto';
const {chromium}=await import(process.env.PLAYWRIGHT||'playwright');
const SITE='http://localhost:8788',FAKE='http://localhost:54321',OUT=process.env.OUT||'/tmp';
const b=await chromium.launch();
let failures=0;const ok=(c,m)=>{if(!c)failures++;console.log(c?'PASS':'FAIL',m);};
const newUser=async()=>{const ctx=await b.newContext({viewport:{width:1440,height:900},acceptDownloads:true});const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('dialog',d=>d.accept());return p;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const status=p=>p.textContent('#save-status');

// ---------------------------------------------------------------- sign up + confirm
const p=await newUser();
await p.goto(SITE+'/studio');await p.waitForTimeout(1500);
ok(await p.isVisible('#signin-hint'),'start dialog offers sign-in');
await p.click('#start-signin');await p.click('[data-auth=signup]');
await p.fill('#auth-email','malik@test.dev');await p.fill('#auth-password','short');await p.click('#auth-submit');
ok((await p.textContent('#auth-error')).includes('8 characters'),'password length checked');
await p.fill('#auth-password','correct-horse');await p.click('#auth-submit');await p.waitForSelector('#auth-message:not([hidden])');
ok((await p.textContent('#auth-message')).includes('confirmation link'),'sign-up asks to confirm email');
await p.click('[data-auth=signin]');await p.fill('#auth-password','correct-horse');await p.click('#auth-submit');await p.waitForTimeout(500);
ok((await p.textContent('#auth-error')).includes('confirm your email'),'unconfirmed sign-in explained');
await fetch(FAKE+'/__confirm?email=malik@test.dev');
await p.click('#auth-submit');await p.waitForTimeout(1200);
ok(!(await p.isVisible('#auth-dialog')),'signed in after confirming');
ok(await p.isVisible('#cloud-box'),'cloud project list shown');
await p.screenshot({path:OUT+'/e2e-start-signed-in.png'});

// ---------------------------------------------------------------- new project saves to the cloud
await p.fill('#start-name','Dawn Bakery');await p.fill('#start-brief','A bakery website');await p.click('#start-submit');await p.waitForTimeout(500);
await p.click('[data-quick=heading]');await p.waitForTimeout(2500);
ok((await status(p)).includes('Saved to your account'),'autosaves to account: '+await status(p));

// ---------------------------------------------------------------- pages
await p.click('#tab-pages');
for(const name of ['About','Contact']){await p.fill('#new-page-name',name);await p.click('#add-page');await p.waitForTimeout(200);}
ok(await p.locator('.page-item').count()===3,'three pages');
ok(await p.isDisabled('#add-page'),'free plan stops at 3 pages');
ok((await p.textContent('#page-limit')).includes('25 pages'),'limit explained');
await p.click('[data-block=text]').catch(()=>{});
await p.click('#tab-add');await p.click('[data-block=button]');await p.waitForTimeout(200);
await p.selectOption('#link-page','index.html');await p.click('#apply-link');
ok(await p.evaluate(()=>editor.getHtml().includes('href="index.html"')),'button links to homepage');
await p.waitForTimeout(2500);
await p.screenshot({path:OUT+'/e2e-pages.png'});
await p.click('#tab-pages');await p.screenshot({path:OUT+'/e2e-pages-panel.png'});
await p.click('#download');const [dl]=await Promise.all([p.waitForEvent('download'),p.click('#export-html')]);
const zipPath=OUT+'/site.zip';fs.copyFileSync(await dl.path(),zipPath);
const zipText=fs.readFileSync(zipPath).toString('latin1');
ok(dl.suggestedFilename()==='dawn-bakery.zip'&&['index.html','about.html','contact.html'].every(f=>zipText.includes(f)),'multi-page export is a zip: '+dl.suggestedFilename());
await p.keyboard.press('Escape');

// ---------------------------------------------------------------- AI with allowance
await p.click('#tab-assistant');await p.waitForTimeout(300);
ok(await p.isDisabled('[name=ai-model][value=sol]'),'Sol locked on Free');
ok((await p.textContent('#ai-balance')).includes('25 of 25'),'balance shown: '+await p.textContent('#ai-balance'));
await p.click('#ask-ai');await p.waitForSelector('.suggestion');await p.waitForTimeout(800);
ok((await p.textContent('.suggestion h3')).includes('gpt-6-luna'),'Luna request answered');
ok((await p.textContent('#ai-balance')).includes('24 of 25'),'allowance used: '+await p.textContent('#ai-balance'));
await p.screenshot({path:OUT+'/e2e-ai.png'});

// ---------------------------------------------------------------- account + project limits
await p.click('#account-btn');await p.waitForTimeout(600);
ok((await p.textContent('#luna-text')).includes('24 of 25'),'account shows usage');
await p.screenshot({path:OUT+'/e2e-account.png'});
await p.keyboard.press('Escape');
for(const n of [2,3,4]){await p.click('#new-project');await p.fill('#start-name','Site '+n);await p.click('#start-submit');await p.waitForTimeout(300);await p.click('[data-quick=section]');await p.waitForTimeout(2600);}
ok((await status(p)).includes('browser only'),'4th project blocked from cloud: '+await status(p));

// ---------------------------------------------------------------- another customer sees nothing
const q=await newUser();
await fetch(FAKE+'/__confirm?email=x');
await q.goto(SITE+'/studio');await q.waitForTimeout(1200);await q.click('#start-signin');await q.click('[data-auth=signup]');await q.fill('#auth-email','other@test.dev');await q.fill('#auth-password','another-pass');await q.click('#auth-submit');await q.waitForTimeout(500);
await fetch(FAKE+'/__confirm?email=other@test.dev');await q.click('[data-auth=signin]');await q.fill('#auth-password','another-pass');await q.click('#auth-submit');await q.waitForTimeout(1500);
ok((await q.textContent('#cloud-list')).includes('No saved projects'),'second customer cannot see first customer’s projects');

// ---------------------------------------------------------------- reopen from the cloud on a "new device"
const r=await newUser();
await r.goto(SITE+'/studio');await r.waitForTimeout(1200);await r.click('#start-signin');await r.fill('#auth-email','malik@test.dev');await r.fill('#auth-password','correct-horse');await r.click('#auth-submit');await r.waitForTimeout(1500);
await r.locator('.cloud-list .open',{hasText:'Dawn Bakery'}).click();await r.waitForTimeout(800);
ok(await r.evaluate(()=>editor.Pages.getAll().length)===3,'cloud project reopens with all pages');
ok(await r.evaluate(()=>editor.Pages.getAll().map(x=>x.get('slug')).join())==='index,about,contact','page file names kept');

// ---------------------------------------------------------------- upgrade to Pro
await r.click('#account-btn');await r.waitForTimeout(500);
await r.click('[data-upgrade=year]');await r.waitForURL(/__checkout/);
const stripe=await (await fetch(FAKE+'/__stripe')).json();const cs=stripe.sessions.at(-1);
ok(cs.price==='price_y'&&cs.customer?.startsWith('cus_'),'yearly checkout created');
// Stripe confirms the payment via webhook
await fetch(FAKE+'/__stripe/subscription',{method:'POST',body:JSON.stringify({id:'sub_1',customer:cs.customer,status:'active',metadata:{user_id:cs.user},cancel_at_period_end:false,items:{data:[{current_period_end:Math.floor(Date.now()/1000)+365*86400,price:{recurring:{interval:'year'}}}]}})});
const event=JSON.stringify({id:'evt_1',type:'checkout.session.completed',data:{object:{mode:'subscription',subscription:'sub_1'}}});
const t=Math.floor(Date.now()/1000);const sig=crypto.createHmac('sha256','whsec_fake').update(`${t}.${event}`).digest('hex');
const wh=await fetch(SITE+'/api/billing/webhook',{method:'POST',headers:{'Stripe-Signature':`t=${t},v1=${sig}`},body:event});
ok(wh.status===200,'webhook accepted');
await r.goto(SITE+'/studio?billing=success');await r.waitForTimeout(4500);
await r.click('#close-start').catch(()=>{});
ok((await r.textContent('#account-label'))==='Pro','account shows Pro');
await r.click('#restore-btn').catch(()=>{});
await r.keyboard.press('Escape');
await r.click('#account-btn');await r.waitForTimeout(600);
ok((await r.textContent('#plan-detail')).includes('Yearly'),'plan detail: '+await r.textContent('#plan-detail'));
ok((await r.textContent('#sol-text')).includes('100 of 100'),'Sol unlocked');
await r.screenshot({path:OUT+'/e2e-pro.png'});
await r.keyboard.press('Escape');

console.log('page errors:',[...p.errs,...q.errs,...r.errs]);
await b.close();
console.log(failures?`${failures} FAILED`:'ALL E2E CHECKS PASSED');process.exit(failures?1:0);
