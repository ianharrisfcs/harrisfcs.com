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
