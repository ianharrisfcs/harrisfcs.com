// Apply the refinement layer to every page, including older landing pages.
if(!document.querySelector('link[href="/refinements.css"]')){
  const refinementStyles=document.createElement('link');
  refinementStyles.rel='stylesheet';
  refinementStyles.href='/refinements.css';
  document.head.appendChild(refinementStyles);
}

document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// Keep the contact/community utility bar consistent across every page.
document.querySelectorAll('.topbar .wrap').forEach(wrap=>{
  if(wrap.querySelector('.topbar-links')) return;
  const existing=[...wrap.children].find(el=>el.tagName!=='DIV');
  if(existing) existing.textContent='Oregon-based · Serving nationwide';
  const links=document.createElement('div');
  links.className='topbar-links';
  links.innerHTML='<a href="mailto:office@harrisfcs.com">office@harrisfcs.com</a><a href="tel:+15412040597">541-204-0597</a><a href="https://www.skool.com/securetax-network-3635" target="_blank" rel="noopener">Skool ↗</a><a href="https://harrisfcs.rmmservices.net/" target="_blank" rel="noopener">Client Portal ↗</a>';
  wrap.appendChild(links);
});

// Homepage navigation: expose the two primary browsing paths explicitly.
if(location.pathname==='/' || location.pathname==='/index.html'){
  const homeNav=document.querySelector('.navlinks');
  if(homeNav){
    homeNav.innerHTML='<a href="#industries">Industries</a><a href="#services">Services</a><a href="/wisp-compliance/">WISP</a><a href="/blog/">Blog</a><a href="/about/">About</a><a class="btn primary" href="#contact">Talk to Us</a>';
  }

  // Replace the static managed-environment graphic with a live terminal vignette.
  const oldConsole=document.querySelector('.ops-console');
  if(oldConsole){
    const terminal=document.createElement('div');
    terminal.className='hero-terminal';
    terminal.setAttribute('aria-label','HarrisFCS system terminal animation');
    terminal.innerHTML=`
      <div class="terminal-chrome">
        <div class="terminal-dots"><i></i><i></i><i></i></div>
        <div class="terminal-title">harrisfcs — operations</div>
        <div class="terminal-status">secure session</div>
      </div>
      <div class="terminal-screen">
        <div class="terminal-history" id="terminal-history"></div>
        <div class="terminal-line"><span class="terminal-prompt">ian@harrisfcs:~$</span> <span id="terminal-typing"></span><span class="terminal-cursor">▋</span></div>
      </div>
      <div class="terminal-footer"><span>monitor</span><span>patch</span><span>secure</span><span>verify</span><span>support</span></div>`;
    oldConsole.replaceWith(terminal);

    const typingEl=terminal.querySelector('#terminal-typing');
    const historyEl=terminal.querySelector('#terminal-history');
    const commands=[
      {cmd:'scan --environment',out:'✓ endpoints online   ✓ patch state current'},
      {cmd:'secure --identity',out:'✓ MFA enforced        ✓ risky access reviewed'},
      {cmd:'verify --controls',out:'✓ backups checked     ✓ policies aligned'},
      {cmd:'monitor --threats',out:'✓ endpoint telemetry  ✓ alerts watched'},
      {cmd:'support --business',out:'✓ users supported    ✓ issues resolved'}
    ];
    let commandIndex=0;
    let charIndex=0;
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const addHistory=(entry)=>{
      const block=document.createElement('div');
      block.className='terminal-entry';
      block.innerHTML=`<div><span class="terminal-prompt">ian@harrisfcs:~$</span> ${entry.cmd}</div><div class="terminal-output">${entry.out}</div>`;
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
    ['WISP & Compliance','/wisp-compliance/'],
    ['IT Projects','/it-projects/'],
    ['Tax & Accounting','/tax-accounting-it-wisp/'],
    ['Healthcare','/healthcare-it-hipaa/'],
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
