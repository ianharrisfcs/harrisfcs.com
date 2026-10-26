// Set the evergreen brand favicon site-wide.
if(!document.querySelector('link[rel="icon"]')){
  const icon=document.createElement('link');
  icon.rel='icon';
  icon.type='image/svg+xml';
  icon.href='/favicon.svg?v=2';
  document.head.appendChild(icon);
}

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

// Shared navigation with accessible dropdowns for services and industries.
document.querySelectorAll('.navlinks').forEach(navlinks=>{
  const contactHref=(location.pathname==='/' || location.pathname==='/index.html')?'#contact':'/#contact';
  navlinks.innerHTML=`
    <details class="nav-dropdown"><summary>Services <span class="nav-chevron" aria-hidden="true"></span></summary>
      <div class="nav-dropdown-menu">
        <a href="/#services" class="nav-dropdown-heading">All services</a>
        <a href="/managed-it-services/">Managed IT Services</a>
        <a href="/cybersecurity/">Cybersecurity</a>
        <a href="/it-projects/">IT Projects</a>
        <a href="/backup-disaster-recovery/">Backup &amp; Disaster Recovery</a>
        <a href="/network-infrastructure/">Network &amp; Infrastructure</a>
        <a href="/cloud-microsoft-365-google-workspace/">Microsoft 365 &amp; Google Workspace</a>
        <a href="/ai-hardening/">AI Hardening</a>
        <a href="/vciso-compliance-advisory/">vCISO &amp; Compliance Advisory</a>
        <a href="/wisp-compliance/">WISP &amp; Compliance</a>
      </div>
    </details>
    <details class="nav-dropdown"><summary>Industries <span class="nav-chevron" aria-hidden="true"></span></summary>
      <div class="nav-dropdown-menu">
        <a href="/#industries" class="nav-dropdown-heading">All industries</a>
        <a href="/tax-accounting-it-wisp/">Tax &amp; Accounting</a>
        <a href="/healthcare-it-hipaa/">Healthcare, Dental &amp; Chiropractic</a>
        <a href="/professional-services-it/">Small Business &amp; Professional Services</a>
        <a href="/retail-multi-location-it/">Retail &amp; Multi-Site Businesses</a>
      </div>
    </details>
    <a href="/resources/">Resources</a>
    <a href="/blog/">Blog</a>
    <a href="/about/">About</a>
    <a href="/careers/">Careers</a>
    <a class="btn primary" href="${contactHref}">Talk to Us</a>`;
  const dropdowns=[...navlinks.querySelectorAll('.nav-dropdown')];
  dropdowns.forEach(dropdown=>{
    dropdown.addEventListener('toggle',()=>{
      if(dropdown.open) dropdowns.filter(other=>other!==dropdown).forEach(other=>other.open=false);
    });
    dropdown.addEventListener('keydown',event=>{
      if(event.key==='Escape'){dropdown.open=false;dropdown.querySelector('summary').focus();}
    });
  });
  document.addEventListener('click',event=>{
    if(!navlinks.contains(event.target))dropdowns.forEach(dropdown=>dropdown.open=false);
  });
  navlinks.querySelectorAll('.nav-dropdown-menu a').forEach(link=>link.addEventListener('click',()=>{
    dropdowns.forEach(dropdown=>dropdown.open=false);
  }));
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
        <div class="terminal-app-icon" aria-hidden="true">&gt;_</div>
        <div class="terminal-title">HarrisFCS / system console</div>
        <div class="terminal-window-controls" aria-hidden="true"><span class="terminal-window-minimize"></span><span class="terminal-window-maximize"></span><span class="terminal-window-close"></span></div>
      </div>
      <div class="terminal-screen">
        <div class="terminal-history" id="terminal-history"></div>
        <div class="terminal-line"><span class="terminal-prompt">harrisfcs:~$</span> <span id="terminal-typing"></span><span class="terminal-cursor">▋</span></div>
      </div>
      `;
    oldConsole.replaceWith(terminal);

    const typingEl=terminal.querySelector('#terminal-typing');
    const historyEl=terminal.querySelector('#terminal-history');
    const commands=[
      {cmd:'status --services',out:'✓ endpoints online   ✓ patch state current'},
      {cmd:'devices --managed',out:'✓ MFA enforced        ✓ risky access reviewed'},
      {cmd:'backup --verify',out:'✓ backups checked     ✓ policies aligned'},
      {cmd:'security --summary',out:'✓ endpoint telemetry  ✓ alerts watched'},
      {cmd:'support --queue',out:'✓ users supported    ✓ issues resolved'}
    ];
    let commandIndex=0;
    let charIndex=0;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const addHistory=(entry)=>{
      const block=document.createElement('div');
      block.className='terminal-entry';
      block.innerHTML=`<div><span class="terminal-prompt">harrisfcs:~$</span> <span class="terminal-command"></span></div><div class="terminal-output"></div>`;
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

// Mobile navigation with compact, touch-friendly accordion groups.
document.querySelectorAll('.nav .wrap').forEach(navWrap=>{
  const navlinks=navWrap.querySelector('.navlinks');
  if(!navlinks || navWrap.querySelector('.menu-toggle')) return;
  const button=document.createElement('button');
  button.className='menu-toggle';
  button.type='button';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-label','Open navigation');
  button.setAttribute('aria-controls','harris-mobile-nav');
  button.innerHTML='<span></span><span></span><span></span>';
  const panel=document.createElement('div');
  panel.className='mobile-nav';
  panel.id='harris-mobile-nav';
  const services=[
    ['All Services','/#services'],
    ['Managed IT Services','/managed-it-services/'],
    ['Cybersecurity','/cybersecurity/'],
    ['IT Projects','/it-projects/'],
    ['Backup & Disaster Recovery','/backup-disaster-recovery/'],
    ['Network & Infrastructure','/network-infrastructure/'],
    ['Microsoft 365 & Google Workspace','/cloud-microsoft-365-google-workspace/'],
    ['AI Hardening','/ai-hardening/'],
    ['vCISO & Compliance Advisory','/vciso-compliance-advisory/'],
    ['WISP & Compliance','/wisp-compliance/']
  ];
  const industries=[
    ['All Industries','/#industries'],
    ['Tax & Accounting','/tax-accounting-it-wisp/'],
    ['Healthcare, Dental & Chiropractic','/healthcare-it-hipaa/'],
    ['Small Business & Professional Services','/professional-services-it/'],
    ['Retail & Multi-Site Businesses','/retail-multi-location-it/']
  ];
  const links=items=>items.map(([label,href])=>`<a href="${href}">${label}</a>`).join('');
  panel.innerHTML=`<div class="mobile-nav-inner">
    <details class="mobile-nav-group"><summary>Services <span class="mobile-nav-chevron" aria-hidden="true"></span></summary><div class="mobile-nav-submenu">${links(services)}</div></details>
    <details class="mobile-nav-group"><summary>Industries <span class="mobile-nav-chevron" aria-hidden="true"></span></summary><div class="mobile-nav-submenu">${links(industries)}</div></details>
    <a href="/resources/">Resources</a><a href="/blog/">Blog</a><a href="/about/">About</a><a href="/careers/">Careers</a><a href="/faq/">FAQ</a>
    <a class="btn primary" href="/#contact">Talk to Us</a>
  </div>`;
  navWrap.appendChild(button);
  navWrap.parentElement.appendChild(panel);
  const groups=[...panel.querySelectorAll('.mobile-nav-group')];
  groups.forEach(group=>group.addEventListener('toggle',()=>{
    if(group.open)groups.filter(other=>other!==group).forEach(other=>other.open=false);
  }));
  const close=()=>{
    panel.classList.remove('open');
    button.classList.remove('open');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Open navigation');
    document.body.classList.remove('menu-open');
    groups.forEach(group=>group.open=false);
  };
  button.addEventListener('click',()=>{
    const open=!panel.classList.contains('open');
    if(!open){close();return;}
    panel.classList.add('open');
    button.classList.add('open');
    button.setAttribute('aria-expanded','true');
    button.setAttribute('aria-label','Close navigation');
    document.body.classList.add('menu-open');
  });
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&panel.classList.contains('open')){close();button.focus();}
  });
  document.addEventListener('click',event=>{
    if(panel.classList.contains('open')&&!panel.contains(event.target)&&!button.contains(event.target))close();
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>780)close()});
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

// HarrisFCS Jotform AI Agent ,  copied from the prior site source.
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

// Standardize the footer across all site pages.
document.querySelectorAll('footer').forEach(footer=>{
  footer.innerHTML=`<div class="wrap"><div class="footergrid">
    <div><a class="brand" href="/">Harris<span>FCS</span></a><p>Independent, family-owned managed IT, security, and compliance services for businesses.</p><p><a href="mailto:office@harrisfcs.com">office@harrisfcs.com</a><br><a href="tel:+15412040597">541-204-0597</a></p></div>
    <div><strong>Explore</strong><p><a href="/managed-it-services/">Managed IT</a><br><a href="/cybersecurity/">Cybersecurity</a><br><a href="/it-projects/">IT Projects</a><br><a href="/resources/">Free Resources</a><br><a href="/blog/">Blog</a></p></div>
    <div><strong>Company &amp; links</strong><p><a href="/about/">About</a><br><a href="/careers/">Careers</a><br><a href="/faq/">FAQ</a><br><a href="/privacy/">Privacy</a><br><a href="https://wispcheck.com">WISPCheck</a><br><a href="https://harrisfcs.rmmservices.net/">Client Portal</a></p></div>
  </div><div class="fine">© <span data-year>${new Date().getFullYear()}</span> HarrisFCS. Compliance support is not legal advice.</div></div>`;
});

// Filter the Resource Center catalog as more guides are published.
(function(){
  const search=document.getElementById('resource-search');
  const pills=[...document.querySelectorAll('.resource-pill')];
  const cards=[...document.querySelectorAll('.resource-library-card')];
  const empty=document.querySelector('.resource-no-results');
  if(!search||!cards.length)return;
  let category='all';
  const filter=()=>{
    const query=search.value.trim().toLowerCase();
    let count=0;
    cards.forEach(card=>{
      const matchesText=(card.textContent+' '+(card.dataset.title||'')).toLowerCase().includes(query);
      const matchesCategory=category==='all'||(card.dataset.categories||'').includes(category);
      const visible=matchesText&&matchesCategory;
      card.hidden=!visible;
      if(visible)count++;
    });
    if(empty)empty.hidden=count>0;
  };
  search.addEventListener('input',filter);
  pills.forEach(pill=>pill.addEventListener('click',()=>{
    category=pill.dataset.filter||'all';
    pills.forEach(item=>item.classList.toggle('active',item===pill));
    filter();
  }));
})();
