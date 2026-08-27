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
