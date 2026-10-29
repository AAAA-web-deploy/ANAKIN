/* ANAKIN — independent static site. No wallet integration or analytics. */
(()=>{
  'use strict';
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  $('#year').textContent=String(new Date().getFullYear());
  const progress=$('#scroll-progress');
  let scrollQueued=false;
  const updateScroll=()=>{const h=document.documentElement;progress.style.width=(h.scrollHeight>h.clientHeight?Math.max(0,Math.min(100,100*h.scrollTop/(h.scrollHeight-h.clientHeight))):0)+'%';scrollQueued=false};
  window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll)}},{passive:true});updateScroll();
  const mobileMenu=$('#mobile-menu'), menuToggle=$('#menu-toggle');
  function closeMenu(){mobileMenu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation')}
  menuToggle.addEventListener('click',()=>{const show=mobileMenu.hidden;mobileMenu.hidden=!show;menuToggle.setAttribute('aria-expanded',String(show));menuToggle.setAttribute('aria-label',show?'Close navigation':'Open navigation')});
  $$('#mobile-menu a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('click',e=>{if(!mobileMenu.hidden&&!e.target.closest('.site-header'))closeMenu()});
  window.addEventListener('resize',()=>{if(window.innerWidth>1030)closeMenu()});
  let toastTimer;
  function showToast(msg){const toast=$('#toast');toast.textContent=msg;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),2600)}
  $$('[data-coming-soon]').forEach(el=>el.addEventListener('click',()=>showToast('Coming soon — details will be announced here.')));

  // Global modal access and focus recovery.
  let lastFocus=null;
  const gallery=[
    {"src": "anakin_archive_origins_v1.webp", "title": "ORIGINS", "desc": "The first spark of destiny burns bright in the desert.", "alt": "A young pilot wearing goggles among the dunes."},
    {"src": "anakin_archive_training_v1.webp", "title": "TRAINING", "desc": "A gift becomes discipline, and discipline becomes a calling.", "alt": "Warrior with blue blade in a futuristic city."},
    {"src": "anakin_archive_prophecy_v2.webp", "title": "PROPHECY", "desc": "Between the light and the shadow, a vision of two possible destinies.", "alt": "A split portrait of the hero and a masked dark figure."},
    {"src": "anakin_archive_connection_v1.webp", "title": "CONNECTION", "desc": "Love brings meaning to power, even as fear of loss grows.", "alt": "Two lovers at sunset in a futuristic city."},
    {"src": "anakin_archive_fall_v1.webp", "title": "THE FALL", "desc": "The closer the fire, the more difficult the path back to light.", "alt": "Fierce robed warrior illuminated by red volcanic fire."},
    {"src": "anakin_archive_duel_v2.webp", "title": "THE DUEL", "desc": "When brothers stand on opposite sides, every move changes the future.", "alt": "Two blade-wielding warriors duel on a burning world."},
    {"src": "anakin_archive_empire_v2.webp", "title": "THE EMPIRE", "desc": "The shadow casts a long reach across an uncertain galaxy.", "alt": "Hooded commander with ranks of armored soldiers."},
    {"src": "anakin_archive_legacy_v2.webp", "title": "THE LEGACY", "desc": "The choices of one life echo far beyond a single generation.", "alt": "Dark helmet against a blue planet and distant ships."},
    {"src": "anakin_archive_balance_v1.webp", "title": "BALANCE", "desc": "Even after darkness, the possibility of light remains.", "alt": "Warrior holding a glowing crystal between blue and crimson stars."}
  ];
  const lightbox=$('#lightbox');let galleryIndex=0;
  function openModal(modal,firstFocusable){lastFocus=document.activeElement;modal.hidden=false;document.body.classList.add('modal-open');(firstFocusable||$('button',modal))?.focus()}
  function closeModal(modal){modal.hidden=true;if(lightbox.hidden&&$('#scene-modal').hidden)document.body.classList.remove('modal-open');lastFocus?.focus()}
  function renderGallery(){const g=gallery[galleryIndex];$('#lightbox-image').src='assets/images/'+g.src;$('#lightbox-image').alt=g.alt;$('#lightbox-counter').textContent=String(galleryIndex+1).padStart(2,'0')+' / '+String(gallery.length).padStart(2,'0');$('#lightbox-title').textContent=g.title;$('#lightbox-description').textContent=g.desc}
  function openGallery(i){galleryIndex=i;renderGallery();openModal(lightbox,$('.lightbox-close',lightbox))}
  $$('[data-gallery]').forEach(btn=>btn.addEventListener('click',()=>openGallery(Number(btn.dataset.gallery))));
  function stepGallery(delta){galleryIndex=(galleryIndex+delta+gallery.length)%gallery.length;renderGallery()}
  $('#lightbox-prev').addEventListener('click',()=>stepGallery(-1));$('#lightbox-next').addEventListener('click',()=>stepGallery(1));
  $$('[data-close-lightbox]').forEach(btn=>btn.addEventListener('click',()=>closeModal(lightbox)));
  const sceneModal=$('#scene-modal');
  const scenes={light:{src:'anakin_saga_rise_v1.webp',kicker:'CHAPTER 01 / THE LIGHT',title:'RISE OF THE CHOSEN ONE.',text:'A spark of possibility ignites into an extraordinary destiny. The path ahead is bright, but no light shines without a shadow.'},shadow:{src:'anakin_saga_shadow_v1.webp',kicker:'CHAPTER 02 / THE SHADOW',title:'THE SHADOW AWAKENS.',text:'Fear, desire and power pull in different directions. The darker the storm, the greater the weight of a single choice.'}};
  $$('[data-scene]').forEach(btn=>btn.addEventListener('click',()=>{const s=scenes[btn.dataset.scene];$('#scene-image').src='assets/images/'+s.src;$('#scene-image').alt=s.title;$('#scene-kicker').textContent=s.kicker;$('#scene-heading').textContent=s.title;$('#scene-copy').textContent=s.text;openModal(sceneModal,$('[data-close-scene].lightbox-close',sceneModal))}));
  $$('[data-close-scene]').forEach(btn=>btn.addEventListener('click',()=>closeModal(sceneModal)));
  document.addEventListener('keydown',e=>{
    const modal=!lightbox.hidden?lightbox:!sceneModal.hidden?sceneModal:null;
    if(!modal)return;
    if(e.key==='Escape'){e.preventDefault();closeModal(modal)}
    if(modal===lightbox&&e.key==='ArrowLeft'){e.preventDefault();stepGallery(-1)}
    if(modal===lightbox&&e.key==='ArrowRight'){e.preventDefault();stepGallery(1)}
    if(e.key==='Tab'){const focusable=$$('button,a[href],[tabindex]:not([tabindex="-1"])',modal).filter(el=>!el.disabled&&el.getClientRects().length);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
  });

  // Accessible information tabs.
  const intel=[
    {
        "label": "FILE / 001 — MISSION BRIEFING",
        "heading": "THE STORY IS JUST BEGINNING.",
        "text": "ANAKIN is a cinematic, fan-inspired meme token concept. The site uses an Ethereum-inspired color palette; trading information is not currently linked.",
        "extra": "There are no promises about future performance. Official information will be posted here when available."
    },
    {
        "label": "FILE / 002 — CONTRACT STATUS",
        "heading": "CONTRACT ADDRESS: COMING SOON.",
        "text": "The CA and any verification links are not being displayed yet. Only rely on verified project announcements once published.",
        "extra": "Network: coming soon. Display name: Anakin Skywalker. Ticker: Anakin."
    },
    {
        "label": "FILE / 003 — TOKEN DETAILS",
        "heading": "OFFICIAL LINKS: COMING SOON.",
        "text": "Price charts, explorer links and token purchase buttons are intentionally inactive until confirmed project destinations are available.",
        "extra": "No live price, liquidity, supply or holder figures are displayed on this website."
    },
    {
        "label": "FILE / 004 — COMMUNITY UPDATES",
        "heading": "FOLLOW THE VERIFIED STORY.",
        "text": "Social accounts, roadmaps and announcements are not linked until official destinations have been provided.",
        "extra": "Never share private keys or recovery phrases. This website does not ask for wallet access."
    }
];
  const tabs=$$('[data-tab]');function setTab(i,focus=false){const t=intel[i];tabs.forEach((b,n)=>{b.setAttribute('aria-selected',String(n===i));b.tabIndex=n===i?0:-1});$('#intel-tabpanel').setAttribute('aria-labelledby',tabs[i].id);$('#intel-overline').textContent=t.label;$('#intel-heading').textContent=t.heading;$('#intel-text').textContent=t.text;$('#intel-extra').textContent=t.extra;if(focus)tabs[i].focus()}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>setTab(i));tab.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:e.key==='ArrowRight'||e.key==='ArrowDown'?(i+1)%tabs.length:(i+tabs.length-1)%tabs.length;setTab(n,true)}})});
  const helperPanel=$('#helper-panel'),helperToggle=$('#helper-toggle');
  function toggleHelper(open){helperPanel.hidden=!open;helperToggle.setAttribute('aria-expanded',String(open));if(open)$('#helper-close').focus();else helperToggle.focus()}
  helperToggle.addEventListener('click',()=>toggleHelper(helperPanel.hidden));$('#helper-close').addEventListener('click',()=>toggleHelper(false));
  const helperLines={light:'The light grows through patience, courage and connection.',shadow:'Power without balance can become its own prison.',balance:'The path is not chosen for you. Every choice becomes part of the story.'};
  $$('[data-helper]').forEach(b=>b.addEventListener('click',()=>{$('#helper-message').textContent=helperLines[b.dataset.helper]}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!helperPanel.hidden&&lightbox.hidden&&sceneModal.hidden)toggleHelper(false)});
  const motionButton=$('#reduce-motion');motionButton.addEventListener('click',()=>{const paused=document.body.classList.toggle('pause-motion');motionButton.textContent=paused?'RESUME MOTION':'PAUSE ALL MOTION';if(paused&&game.running&&!game.paused)pauseGame()});

  // Game: 'Balance the Force'. Native Canvas 2D, no external dependencies.
  const canvas=$('#game-canvas'),ctx=canvas.getContext('2d',{alpha:false});
  const W=1200,H=490;
  let stars=[],objects=[],particles=[],spawnClock=0,lastFrame=0,overlayTitle=$('#game-overlay-title'),overlayText=$('#game-overlay-text');
  const controls={left:false,right:false,up:false,down:false},pointer={active:false,x:W/2,y:H*.73};
  let game={running:false,paused:false,score:0,best:0,lives:3,pulse:0,dash:0,time:0,invuln:0,player:{x:W/2,y:H*.77,r:19},raf:0};
  try{game.best=Math.max(0,Number(localStorage.getItem('anakin_force_best_v1'))||0)}catch(e){};
  function fmt(n){return String(Math.max(0,Math.floor(n))).padStart(5,'0')}
  function updateHUD(){$('#game-score').textContent=fmt(game.score);$('#game-best').textContent=fmt(game.best);$('#game-lives').textContent='♥ '.repeat(Math.max(0,game.lives)).trim()||'—';$('#game-pulse-status').textContent=game.pulse<=0?'READY':Math.ceil(game.pulse)+'s';$('#game-dash-status').textContent=game.dash<=0?'READY':Math.ceil(game.dash)+'s'}
  function resizeCanvas(){const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);drawGame()}
  function resetStars(){stars=Array.from({length:125},(_,i)=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.9+.25,spd:12+Math.random()*45,alpha:.22+Math.random()*.68}))}
  resetStars();
  function setupGame(){cancelAnimationFrame(game.raf);objects=[];particles=[];spawnClock=.15;game.running=true;game.paused=false;game.score=0;game.lives=3;game.pulse=0;game.dash=0;game.time=0;game.invuln=1.3;game.player={x:W/2,y:H*.75,r:19};pointer.active=false;$('#game-overlay').hidden=true;$('#game-pause').textContent='PAUSE';updateHUD();lastFrame=0;game.raf=requestAnimationFrame(tick);canvas.focus()}
  function endGame(){game.running=false;cancelAnimationFrame(game.raf);$('#game-overlay').hidden=false;overlayTitle.textContent='THE FORCE RESTS.';overlayText.textContent=`Score ${fmt(game.score)}. Best ${fmt(game.best)}. Choose your next path.`;$('#game-start').textContent='PLAY AGAIN ↗';updateHUD()}
  function pauseGame(){if(!game.running)return;game.paused=!game.paused;$('#game-pause').textContent=game.paused?'RESUME':'PAUSE';$('#game-overlay').hidden=!game.paused;if(game.paused){overlayTitle.textContent='MISSION PAUSED.';overlayText.textContent='Return when you are ready.';$('#game-start').textContent='RESUME MISSION ↗';cancelAnimationFrame(game.raf)}else{lastFrame=0;game.raf=requestAnimationFrame(tick)}}
  $('#game-start').addEventListener('click',()=>{if(game.running&&game.paused)pauseGame();else setupGame()});$('#game-restart').addEventListener('click',setupGame);$('#game-pause').addEventListener('click',()=>{if(game.running)pauseGame();else showToast('Start the mission first.')});
  const spawn=()=>{const hazard=Math.random()<Math.min(.38+.013*game.time,.62);objects.push({x:35+Math.random()*(W-70),y:-30,r:hazard?17+Math.random()*12:12+Math.random()*8,spd:(hazard?125:100)+Math.random()*65+Math.min(game.time*2,90),hazard,phase:Math.random()*6.28})};
  function emit(x,y,hazard,n=12){for(let i=0;i<n;i++){const ang=Math.random()*Math.PI*2,v=35+Math.random()*130;particles.push({x,y,vx:Math.cos(ang)*v,vy:Math.sin(ang)*v,life:.7+Math.random()*.5,max:1.2,hazard})}}
  function pulse(){if(!game.running||game.paused||game.pulse>0)return;game.pulse=6;emit(game.player.x,game.player.y,false,35);objects=objects.filter(obj=>!(obj.hazard&&Math.hypot(obj.x-game.player.x,obj.y-game.player.y)<135));updateHUD()}
  function dash(){if(!game.running||game.paused||game.dash>0)return;game.dash=4.5;game.invuln=.65;game.player.y=Math.max(45,game.player.y-100);emit(game.player.x,game.player.y,false,15);updateHUD()}
  $('#game-pulse').addEventListener('click',pulse);$('#game-dash').addEventListener('click',dash);
  document.addEventListener('keydown',e=>{if(!game.running||game.paused||!lightbox.hidden||!sceneModal.hidden)return;const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','w','a','s','d',' ','shift'].includes(key))e.preventDefault();if(key==='arrowleft'||key==='a')controls.left=true;if(key==='arrowright'||key==='d')controls.right=true;if(key==='arrowup'||key==='w')controls.up=true;if(key==='arrowdown'||key==='s')controls.down=true;if(key===' ')pulse();if(key==='shift')dash()});
  document.addEventListener('keyup',e=>{const key=e.key.toLowerCase();if(key==='arrowleft'||key==='a')controls.left=false;if(key==='arrowright'||key==='d')controls.right=false;if(key==='arrowup'||key==='w')controls.up=false;if(key==='arrowdown'||key==='s')controls.down=false});
  const pointOnCanvas=e=>{const rect=canvas.getBoundingClientRect();return {x:Math.max(20,Math.min(W-20,(e.clientX-rect.left)/rect.width*W)),y:Math.max(20,Math.min(H-20,(e.clientY-rect.top)/rect.height*H))}};
  canvas.addEventListener('pointerdown',e=>{if(!game.running||game.paused)return;pointer.active=true;Object.assign(pointer,pointOnCanvas(e));canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{if(pointer.active)Object.assign(pointer,pointOnCanvas(e))});
  canvas.addEventListener('pointerup',()=>{pointer.active=false});canvas.addEventListener('pointercancel',()=>{pointer.active=false});
  function drawShip(x,y){ctx.save();ctx.translate(x,y);const flicker=game.invuln>0&&Math.floor(game.time*12)%2===0;ctx.globalAlpha=flicker?.54:1;ctx.shadowBlur=27;ctx.shadowColor='#87baff';ctx.fillStyle='#b8b7ff';ctx.beginPath();ctx.moveTo(0,-27);ctx.lineTo(20,18);ctx.lineTo(0,9);ctx.lineTo(-20,18);ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#627eea';ctx.beginPath();ctx.moveTo(0,-16);ctx.lineTo(10,9);ctx.lineTo(0,3);ctx.lineTo(-10,9);ctx.closePath();ctx.fill();ctx.fillStyle='#e2ebff';ctx.fillRect(-3,-9,6,10);ctx.restore()}
  function drawGame(){if(!ctx)return;ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);ctx.fillStyle='#060b22';ctx.fillRect(0,0,W,H);const halo=ctx.createRadialGradient(W*.5,H*.55,20,W*.5,H*.55,550);halo.addColorStop(0,'rgba(56,65,150,.36)');halo.addColorStop(1,'rgba(4,7,24,0)');ctx.fillStyle=halo;ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(130,144,222,.12)';ctx.lineWidth=1;for(let x=0;x<W;x+=75){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=0;y<H;y+=70){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    for(const s of stars){ctx.globalAlpha=s.alpha;ctx.fillStyle='#d3d9ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    for(const obj of objects){const color=obj.hazard?'#f56e9a':'#8cbbff';ctx.shadowBlur=20;ctx.shadowColor=color;ctx.fillStyle=color;ctx.beginPath();ctx.arc(obj.x,obj.y,obj.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=obj.hazard?'#ffafc5':'#e2f2ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(obj.x,obj.y,obj.r*.5,0,Math.PI*2);ctx.stroke()}
    for(const p of particles){ctx.globalAlpha=Math.min(1,Math.max(0,p.life/p.max));ctx.fillStyle=p.hazard?'#ff80a2':'#b9c8ff';ctx.fillRect(p.x,p.y,4,4)}ctx.globalAlpha=1;drawShip(game.player.x,game.player.y);ctx.font='11px monospace';ctx.fillStyle='rgba(208,213,255,.55)';ctx.fillText('ANAKIN / BALANCE PROTOCOL',20,H-16)}
  function tick(now){if(!game.running||game.paused)return;const dt=Math.min(.035,lastFrame?(now-lastFrame)/1000:.016);lastFrame=now;game.time+=dt;game.pulse=Math.max(0,game.pulse-dt);game.dash=Math.max(0,game.dash-dt);game.invuln=Math.max(0,game.invuln-dt);
    const px=game.player;if(pointer.active){px.x+=(pointer.x-px.x)*Math.min(1,dt*11);px.y+=(pointer.y-px.y)*Math.min(1,dt*11)}else{const dx=Number(controls.right)-Number(controls.left),dy=Number(controls.down)-Number(controls.up),norm=Math.hypot(dx,dy)||1;px.x+=dx/norm*dt*365;px.y+=dy/norm*dt*365}px.x=Math.max(27,Math.min(W-27,px.x));px.y=Math.max(30,Math.min(H-28,px.y));spawnClock-=dt;if(spawnClock<=0){spawn();spawnClock=Math.max(.23,.65-game.time*.004)+(Math.random()*.16)}
    for(const s of stars){s.y+=s.spd*dt;if(s.y>H){s.y=0;s.x=Math.random()*W}}
    for(const o of objects){o.y+=o.spd*dt;o.x+=Math.sin(game.time*2+o.phase)*dt*14;if(Math.hypot(o.x-px.x,o.y-px.y)<o.r+px.r){o.remove=true;if(o.hazard){if(game.invuln<=0){game.lives--;game.invuln=1.2;emit(px.x,px.y,true,17)}}else{game.score+=100;emit(o.x,o.y,false,10);if(game.score>game.best){game.best=game.score;try{localStorage.setItem('anakin_force_best_v1',String(game.best))}catch(e){}}}}}
    objects=objects.filter(o=>!o.remove&&o.y<H+35);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt}particles=particles.filter(p=>p.life>0);updateHUD();drawGame();if(game.lives<=0){endGame();return}game.raf=requestAnimationFrame(tick)}
  window.addEventListener('resize',resizeCanvas);resizeCanvas();updateHUD();
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.running&&!game.paused)pauseGame()});
})();
