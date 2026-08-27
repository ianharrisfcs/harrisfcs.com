document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// Keep the contact/community utility bar consistent across every page.
document.querySelectorAll('.topbar .wrap').forEach(wrap=>{
  if(wrap.querySelector('.topbar-links')) return;
  const existing=[...wrap.children].find(el=>el.tagName!=='DIV');
  if(existing) existing.textContent='Oregon-based · Serving organizations nationwide';
  const links=document.createElement('div');
  links.className='topbar-links';
  links.innerHTML='<a href="mailto:office@harrisfcs.com">office@harrisfcs.com</a><a href="tel:+15412040597">541-204-0597</a><a href="https://www.skool.com/securetax-network-3635" target="_blank" rel="noopener">Skool Community ↗</a><a href="https://harrisfcs.rmmservices.net/" target="_blank" rel="noopener">Client Portal ↗</a>';
  wrap.appendChild(links);
});

// Mobile navigation: clone the existing page links so every route remains easy to navigate.
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
  panel.innerHTML='<div class="mobile-nav-inner">'+primaryLinks.map(([label,href])=>`<a href="${href}">${label}</a>`).join('')+'<a class="btn primary" href="/#contact">Start a Conversation</a></div>';
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

// Jotform AI Agent bootstrap. Add the current agent ID as
// <meta name="jotform-agent-id" content="YOUR_AGENT_ID"> to activate globally.
const jotformAgentId=document.querySelector('meta[name="jotform-agent-id"]')?.content?.trim();
if(jotformAgentId){
  const loader=document.createElement('script');
  loader.src='https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
  loader.onload=()=>{
    if(!window.AgentInitializer) return;
    window.AgentInitializer.init({
      agentRenderURL:`https://agent.jotform.com/${jotformAgentId}`,
      rootId:`JotformAgent-${jotformAgentId}`,
      formID:jotformAgentId,
      queryParams:['skipWelcome=1','maximizable=1'],
      domain:'https://www.jotform.com',
      isDraggable:false,
      background:'linear-gradient(180deg, #0f948b 0%, #0b7a75 100%)',
      buttonBackgroundColor:'#0b7a75',
      buttonIconColor:'#FFFFFF',
      variant:false,
      customizations:{greeting:'Yes',greetingMessage:'Hi! How can I help?',openByDefault:'No',pulse:'Yes',position:'right',autoOpenChatIn:'0'},
      isVoice:undefined
    });
  };
  document.head.appendChild(loader);
}
