(function() {
  const script = document.currentScript;
  const botId = script.getAttribute('data-bot-id');
  const origin = script.src.split('/embed.js')[0];

  if (!botId) {
    console.error('BotCraftAI: data-bot-id is required');
    return;
  }

  // Create floating button
  const button = document.createElement('div');
  button.id = 'botcraft-button';
  button.style.cssText = 'position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:#2E5BFF;border-radius:50%;display:flex;align-items:center;justify-center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:999999;transition:all 0.3s ease;';
  button.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>';
  
  // Create iframe container
  const container = document.createElement('div');
  container.id = 'botcraft-container';
  container.style.cssText = 'position:fixed;bottom:90px;right:20px;width:400px;height:600px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.2);z-index:999999;display:none;flex-direction:column;overflow:hidden;border:1px solid #eee;';
  
  if (window.innerWidth < 500) {
    container.style.width = 'calc(100% - 40px)';
    container.style.height = 'calc(100% - 120px)';
  }

  const iframe = document.createElement('iframe');
  iframe.src = `${origin}/share/${botId}`;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  
  container.appendChild(iframe);
  document.body.appendChild(button);
  document.body.appendChild(container);

  let isOpen = false;
  button.onclick = () => {
    isOpen = !isOpen;
    container.style.display = isOpen ? 'flex' : 'none';
    button.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0)';
  };
})();
