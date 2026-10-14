// Apply the refinement layer to every page, including older landing pages.
if(!document.querySelector('link[href="/refinements.css"]')){
  const refinementStyles=document.createElement('link');
  refinementStyles.rel='stylesheet';
  refinementStyles.href='/refinements.css';
  document.head.appendChild(refinementStyles);
}

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// Keep the contact/community utility bar consistent across every page.
// WISPCheck lives here as a useful public resource rather than competing with
// the company's primary navigation. Older pages sometimes include a second
// legacy contact span; normalize those away so email/phone only appear once.
document.querySelectorAll('.topbar .wrap').forEach(wrap=>{
  const nonDivChildren=[...wrap.children].filter(el=>el.tagName!=='DIV');
  let locationLabel=nonDivChildren.shift();
  if(!locationLabel){
    locationLabel=document.createElement('span');
    wrap.prepend(locationLabel);
  }
  locationLabel.textContent='Oregon-based · Serving nationwide';
  nonDivChildren.forEach(el=>el.remove());

  let links=wrap.querySelector('.topbar-links');
  if(!links){
    links=document.createElement('div');
    links.className='topbar-links';
    wrap.appendChild(links);
  }
  links.innerHTML='<a href="mailto:office@harrisfcs.com">office@harrisfcs.com</a><a href="tel:+15412040597">541-204-0597</a><a href="https://wispcheck.com" target="_blank" rel="noopener">WISPCheck ↗</a><a href="https://www.skool.com/securetax-network-3635" target="_blank" rel="noopener">Skool ↗</a><a href="https://harrisfcs.rmmservices.net/" target="_blank" rel="noopener">Client Portal ↗</a>';
});

// One primary navigation model across the whole site.
// Industry/service discovery stays prominent; WISP remains available in page
// content, service pages, resources, and the utility-bar WISPCheck link.
document.querySelectorAll('.navlinks').forEach(navlinks=>{
  const contactHref=(location.pathname==='/' || location.pathname==='/index.html')?'#contact':'/#contact';
  navlinks.innerHTML='<a href="/#industries">Industries</a><a href="/#services">Services</a><a href="/blog/">Blog</a><a href="/about/">About</a><a class="btn primary" href="'+contactHref+'">Talk to Us</a>';
});

// Homepage terminal vignette.
if(location.pathname==='/' || location.pathname==='/index.html'){
  const oldConsole=document.querySelector('.ops-console');
  if(oldConsole){
    const terminal=document.createElement('div');
    terminal.className='hero-terminal';
    terminal.setAttribute('aria-label','HarrisFCS system terminal animation');
    terminal.innerHTML=`
      <div class="terminal-chrome">
        <div class="terminal-app-icon" aria-hidden="true">PS</div>
        <div class="terminal-title">Windows PowerShell — HarrisFCS</div>
        <div class="terminal-status">DEMO SESSION</div>
      </div>
      <div class="terminal-screen">
        <div class="terminal-history" id="terminal-history"></div>
        <div class="terminal-line"><span class="terminal-prompt">PS C:\HarrisFCS&gt;</span> <span id="terminal-typing"></span><span class="terminal-cursor">▋</span></div>
      </div>
      <div class="terminal-footer"><span>monitor</span><span>patch</span><span>secure</span><span>verify</span><span>support</span></div>`;
    oldConsole.replaceWith(terminal);

    const typingEl=terminal.querySelector('#terminal-typing');
    const historyEl=terminal.querySelector('#terminal-history');
    const commands=[
      {cmd:'Get-Service | Where-Object Status -eq Running',out:'✓ endpoints online   ✓ patch state current'},
      {cmd:'Get-ManagedDevice | Select-Object Name,Status',out:'✓ MFA enforced        ✓ risky access reviewed'},
      {cmd:'Test-BackupStatus -Scope Business',out:'✓ backups checked     ✓ policies aligned'},
      {cmd:'Get-SecuritySummary | Format-Table',out:'✓ endpoint telemetry  ✓ alerts watched'},
      {cmd:'Get-SupportQueue | Select-Object -First 2',out:'✓ users supported    ✓ issues resolved'}
    ];
    let commandIndex=0;
    let charIndex=0;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const addHistory=(entry)=>{
      const block=document.createElement('div');
      block.className='terminal-entry';
      block.innerHTML=`<div><span class="terminal-prompt">PS C:\HarrisFCS&gt;</span> <span class="terminal-command"></span></div><div class="terminal-output"></div>`;
      block.querySelector('.terminal-command').textContent=entry.cmd;
      block.querySelector('.terminal-output').textContent=entry.out;
      historyEl.appendChild(block);
      while(historyEl.children.length>3) historyEl.removeChild(historyEl.firstChild);
      terminal.querySelector('.terminal-screen').scrollTop=terminal.querySelector('.terminal-screen').scrollHeight;
    };

    if(reduceMotion){
      addHistory(commands[0]);
      addHistory(commands[1]);
      typingEl.textContent=commands[2].cmd;
    }else{
      const typeNext=()=>{
        const entry=commands[commandIndex];
        typingEl.textContent=entry.cmd.slice(0,charIndex++);
        if(charIndex<=entry.cmd.length){
          setTimeout(typeNext,38+Math.random()*34);
          return;
        }
        setTimeout(()=>{
          addHistory(entry);
          typingEl.textContent='';
          charIndex=0;
          commandIndex=(commandIndex+1)%commands.length;
          setTimeout(typeNext,520);
        },620);
      };
      setTimeout(typeNext,500);
    }
  }
}

// Mobile navigation.
document.querySelectorAll('.nav .wrap').forEach(navWrap=>{
  const navlinks=navWrap.querySelector('.navlinks');
  if(!navlinks || navWrap.querySelector('.menu-toggle')) return;
  const button=document.createElement('button');
  button.className='menu-toggle';
  button.type='button';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label','Open navigation');
  button.innerHTML='<span></span><span></span><span></span>';
  const panel=document.createElement('div');
  panel.className='mobile-nav';
  const primaryLinks=[
    ['Industries','/#industries'],
    ['Services','/#services'],
    ['Managed IT','/managed-it-services/'],
    ['Cybersecurity','/cybersecurity/'],
    ['IT Projects','/it-projects/'],
    ['Tax & Accounting','/tax-accounting-it-wisp/'],
    ['Healthcare','/healthcare-it-hipaa/'],
    ['WISPCheck','https://wispcheck.com'],
    ['Blog','/blog/'],
    ['About','/about/'],
    ['FAQ','/faq/'],
    ['Client Portal','https://harrisfcs.rmmservices.net/']
  ];
  panel.innerHTML='<div class="mobile-nav-inner">'+primaryLinks.map(([label,href])=>`<a href="${href}">${label}</a>`).join('')+'<a class="btn primary" href="/#contact">Talk to Us</a></div>';
  navWrap.appendChild(button);
  navWrap.parentElement.appendChild(panel);
  const close=()=>{panel.classList.remove('open');button.classList.remove('open');button.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
  button.addEventListener('click',()=>{
    const open=!panel.classList.contains('open');
    panel.classList.toggle('open',open);button.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);
  });
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  window.addEventListener('resize',()=>{if(window.innerWidth>780) close()});
});

// Remove any Netlify promotional badge/tag if injected into the page.
const removeNetlifyBadge=()=>{
  document.querySelectorAll('[class*="netlify"],[id*="netlify"],a[href*="netlify.com"]').forEach(el=>{
    const text=(el.textContent||'').toLowerCase();
    const href=(el.getAttribute?.('href')||'').toLowerCase();
    const style=getComputedStyle(el);
    const isPromo=text.includes('netlify') || href.includes('netlify.com');
    const isFloating=style.position==='fixed' || style.position==='sticky';
    if(isPromo && isFloating) el.remove();
  });
};
removeNetlifyBadge();
new MutationObserver(removeNetlifyBadge).observe(document.documentElement,{childList:true,subtree:true});

// HarrisFCS Jotform AI Agent — copied from the prior site source.
const jotformLoader=document.createElement('script');
jotformLoader.src='https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
jotformLoader.onload=()=>{
  if(!window.AgentInitializer) return;
  window.AgentInitializer.init({
    agentRenderURL:'https://agent.jotform.com/0196a66dafd075e799d373f79a1e2a8e7bfe',
    rootId:'JotformAgent-0196a66dafd075e799d373f79a1e2a8e7bfe',
    formID:'0196a66dafd075e799d373f79a1e2a8e7bfe',
    queryParams:['skipWelcome=1','maximizable=1'],
    domain:'https://www.jotform.com',
    isDraggable:false,
    background:'linear-gradient(180deg, #3A5800 0%, #3A5800 100%)',
    buttonBackgroundColor:'#004BB6',
    buttonIconColor:'#F8FEEC',
    variant:false,
    customizations:{
      greeting:'Yes',
      greetingMessage:'Hi! How can I assist you?',
      openByDefault:'No',
      pulse:'Yes',
      position:'right',
      autoOpenChatIn:'0'
    },
    isVoice:false
  });
};
document.head.appendChild(jotformLoader);

// Curated Google review display. Add only independently verified, verbatim reviews.
// Entries: {name, text, rating:5, date:'YYYY-MM-DD', url:'https://...'}
const curatedGoogleReviews=[{"name":"Zak Barsuglia","text":"Ian is super knowledgeable and very communicative. They setup my office, helped with security, and I will not use anyone else!","date":"2025-06-24","rating":5},{"name":"Laurel Okorofsky","text":"Attentive and efficient, super knowledgeable and real-world savvy. I feel lucky to have found this great local service!","date":"2023-09-29","rating":5},{"name":"Yulia Marynik","text":"Great service, very fast to respond and very honest. We've hired Ian for our business multiple times and so far had only great experience","date":"2020-12-10","rating":5},{"name":"Kara Kraft","text":"My family has utilized HarrisFCS many times. Ian has helped solve a variety of technology issues in a prompt and professional manner. I would highly recommend this organization.","date":"2020-09-13","rating":5},{"name":"Staci O'Shea","text":"Ian was fantastic and detailed, he completed a large scale residential project for me including networking, cabling, and home office setup. Will definitely be using him regularly and recommending him to all.","date":"2024-02-19","rating":5},{"name":"Josh Blakeley","text":"Fixed all our issues! Was so great to work With!","date":"2024-03-21","rating":5},{"name":"Alan Churchill","text":"Great service...Ian is very knowledgeable.","date":"2023-09-29","rating":5},{"name":"Samantha Domask","text":"Excellent service! Very nice and walked us through what he did to fix our printer. He was very kind and helpful!","date":"2020-09-15","rating":5},{"name":"Sue clymens","text":"I keep goofing up my review and losing it. ian was awesome, and being 76, I needed mobile repair ! He was pleasant, professional, patient and fixed my computer up great. Nice young man.","rating":5}];
(function initReviewCarousel(){
 const section=document.querySelector('.client-reviews');if(!section)return;
 const track=section.querySelector('[data-reviews-track]');const viewport=section.querySelector('[data-reviews-viewport]');
 const prev=section.querySelector('[data-review-prev]');const next=section.querySelector('[data-review-next]');
 const reviews=curatedGoogleReviews.filter(r=>r.rating===5&&r.name&&r.text);
 if(!reviews.length){const empty=document.createElement('div');empty.className='review-empty';empty.textContent='Verified client reviews will appear here soon.';viewport.replaceChildren(empty);prev.hidden=true;next.hidden=true;return;}
 reviews.forEach(r=>{const card=document.createElement('article');card.className='review-card';const stars=document.createElement('div');stars.className='review-stars';stars.setAttribute('aria-label','5 out of 5 stars');stars.textContent='★★★★★';const quote=document.createElement('p');quote.className='review-quote';quote.textContent='“'+r.text+'”';const name=document.createElement('div');name.className='review-person';name.textContent=r.name;const source=document.createElement('a');source.className='review-source';source.textContent='Google Reviews ↗';source.href='https://www.google.com/maps/search/?api=1&query=HarrisFCS+Grants+Pass+Oregon';source.target='_blank';source.rel='noopener noreferrer';card.append(stars,quote,name,source);track.appendChild(card)});
 // Seamless, slow horizontal movement. Pause on hover, focus, or reduced-motion preference.
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reviews.length<2){prev.hidden=true;next.hidden=true;return;}
 const originalCards=Array.from(track.children);
 originalCards.forEach(card=>{const copy=card.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.querySelectorAll('a').forEach(a=>a.tabIndex=-1);track.appendChild(copy)});
 let offset=0,last=0,paused=false;
 const cycleWidth=()=>track.children[originalCards.length].offsetLeft-track.children[0].offsetLeft;
 const render=()=>{const width=cycleWidth();if(width>0){offset=((offset%width)+width)%width;track.style.transform='translate3d('+(-offset)+'px,0,0)'}};
 const animate=t=>{if(last&&!paused&&!reduced.matches){offset+=(t-last)*0.025;render()}last=t;requestAnimationFrame(animate)};
 track.addEventListener('mouseenter',()=>paused=true);track.addEventListener('mouseleave',()=>paused=false);
 track.addEventListener('focusin',()=>paused=true);track.addEventListener('focusout',e=>{if(!track.contains(e.relatedTarget))paused=false});
 const shift=dir=>{const width=originalCards[0].getBoundingClientRect().width+(parseFloat(getComputedStyle(track).gap)||0);offset+=dir*width;render()};
 prev.addEventListener('click',()=>shift(-1));next.addEventListener('click',()=>shift(1));
 window.addEventListener('resize',render);requestAnimationFrame(animate);
})();
