/* ======================================================================
   CUSTOMIZE ME — the only section you should need to touch
   ====================================================================== */
const CONFIG = {
  name: "Kushagra",

  // photo paths — swap the files in /images or change these paths
  PHOTO_1: "images/kushagra.jpg",          // solo photo of the birthday boy
  PHOTO_2: "images/kushagra-couple.jpg",   // photo of him with his girlfriend

  // the personal letter — shown EXACTLY as written, line breaks preserved
  letterMessage:
`happiest birthday Kushagra! ❤️

firstly thank you for all the efforts you put in for me they genuinely make my heart so happy, and I hope you know how much I appreciate every little thing you do, I am so glad that it’s been 3 years and we are still together, making memories, growing together, and having each other through everything.

I feel so lucky to have you in my life and I truly hope this year brings you everything you’ve wished for and so much more. you deserve all the happiness in the world.

Happy birthday once again, my favourite person❤️ here’s to us and many many more years together 🫶🏻`,

  // optional background music — put a file in /audio and set the path, e.g. "audio/song.mp3"
  musicSrc: "",

  // typewriter speed (ms per character) for the letter
  letterTypeSpeedMs: 32,
};

/* ====================================================================== */

(function(){
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("photo1-img").src = CONFIG.PHOTO_1;
  document.getElementById("photo2-img").src = CONFIG.PHOTO_2;
  document.querySelectorAll(".polaroid img").forEach(img=>{
    if(img.id !== "photo1-img" && img.id !== "photo2-img"){
      // ghost/receded copies use same sources
    }
  });
  document.querySelectorAll('img[alt="Kushagra"]').forEach(img=> img.src = CONFIG.PHOTO_1);
  document.querySelectorAll('img[alt="Kushagra and his girlfriend"]').forEach(img=> img.src = CONFIG.PHOTO_2);
  document.getElementById("headline-name").innerHTML = `Happy Birthday, ${CONFIG.name} <span class="heart">❤️</span>`;
  document.getElementById("final-name").textContent = CONFIG.name.toUpperCase();
  document.title = `A little surprise for ${CONFIG.name}`;

  const audio = document.getElementById("bg-audio");
  if(CONFIG.musicSrc){ audio.src = CONFIG.musicSrc; }

  /* ---------------------------------------------------------------------
     Ambient particle background — stars + soft drifting hearts/confetti
  --------------------------------------------------------------------- */
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function makeParticles(){
    particles = [];
    const count = reducedMotion ? 25 : 70;
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*W,
        y: Math.random()*H,
        r: Math.random()*1.6 + .3,
        baseA: Math.random()*.5 + .2,
        speed: Math.random()*.15 + .02,
        drift: (Math.random()-.5)*.08,
        twinkle: Math.random()*Math.PI*2,
        depth: Math.random() // for parallax
      });
    }
  }
  makeParticles();

  let pointerX = 0, pointerY = 0; // -1..1

  function drawBg(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      p.twinkle += 0.02;
      const a = p.baseA + Math.sin(p.twinkle)*0.15;
      const px = p.x + pointerX * p.depth * 12;
      const py = p.y + pointerY * p.depth * 12;
      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(230,201,138,${Math.max(a,0)})`;
      ctx.fill();
      p.y -= p.speed;
      p.x += p.drift;
      if(p.y < -10){ p.y = H+10; p.x = Math.random()*W; }
      if(p.x < -10) p.x = W+10;
      if(p.x > W+10) p.x = -10;
    }
    requestAnimationFrame(drawBg);
  }
  drawBg();

  /* ---------------------------------------------------------------------
     Scene / stage state machine
  --------------------------------------------------------------------- */
  const scenes = Array.from(document.querySelectorAll(".scene"));
  const dots = Array.from(document.querySelectorAll(".progress .dot"));
  let currentScene = 0;

  function goToScene(index){
    scenes[currentScene].classList.remove("active");
    currentScene = index;
    scenes[currentScene].classList.add("active");
    dots.forEach((d,i)=> d.classList.toggle("active", i === index));
  }

  /* ---------------------------------------------------------------------
     SCENE 0 — open the gift
  --------------------------------------------------------------------- */
  const openBtn = document.getElementById("open-btn");
  const gift = document.getElementById("gift");
  const openingScene = document.querySelector(".scene-opening");

  openBtn.addEventListener("click", () => {
    gift.classList.add("opened");
    burstParticlesAt(window.innerWidth/2, window.innerHeight/2, 26);
    openingScene.classList.add("leaving");
    setTimeout(() => {
      goToScene(1);
      openCardEnvelope();
    }, reducedMotion ? 200 : 950);
  });

  /* ---------------------------------------------------------------------
     SCENE 1 — photo 1 pop out
  --------------------------------------------------------------------- */
  const cardEnvelope = document.getElementById("card-envelope");
  const photo1Card = document.getElementById("photo1-card");
  const photo1Copy = document.getElementById("photo1-copy");
  const moreBtn = document.getElementById("more-btn");

  function openCardEnvelope(){
    setTimeout(()=> cardEnvelope.classList.add("open"), 150);
    setTimeout(()=>{
      photo1Card.classList.add("emerged");
      spawnHeartsAround(photo1Card, 6);
    }, reducedMotion ? 250 : 700);
    setTimeout(()=>{
      photo1Copy.classList.add("show");
    }, reducedMotion ? 500 : 1500);
    setTimeout(()=>{
      moreBtn.classList.add("show");
    }, reducedMotion ? 700 : 2100);
  }

  moreBtn.addEventListener("click", ()=>{
    goToScene(2);
    setTimeout(runPhoto2Sequence, 60);
  });

  /* ---------------------------------------------------------------------
     SCENE 2 — photo 2 pop out
  --------------------------------------------------------------------- */
  const photo1Receded = document.getElementById("photo1-receded");
  const photo2Card = document.getElementById("photo2-card");
  const readBtn = document.getElementById("read-btn");

  function runPhoto2Sequence(){
    photo1Receded.classList.add("show");
    setTimeout(()=>{
      photo2Card.classList.add("emerged");
      spawnHeartsAround(photo2Card, 8);
    }, reducedMotion ? 200 : 500);
    setTimeout(()=>{
      readBtn.classList.add("show");
    }, reducedMotion ? 400 : 1600);
  }

  readBtn.addEventListener("click", ()=>{
    goToScene(3);
    setTimeout(runLetterSequence, 60);
  });

  /* ---------------------------------------------------------------------
     SCENE 3 — the letter (typewriter reveal)
  --------------------------------------------------------------------- */
  const letterEl = document.getElementById("letter");
  const letterTextEl = document.getElementById("letter-text");
  const caret = document.getElementById("caret");
  const letterGlow = document.getElementById("letter-glow");
  const lastBtn = document.getElementById("last-btn");
  let letterStarted = false;

  function runLetterSequence(){
    setTimeout(()=>{
      letterEl.classList.add("emerged");
    }, reducedMotion ? 150 : 300);
    setTimeout(typeLetter, reducedMotion ? 300 : 1100);
  }

  function typeLetter(){
    if(letterStarted) return;
    letterStarted = true;
    const text = CONFIG.letterMessage;
    if(reducedMotion){
      letterTextEl.textContent = text;
      finishLetter();
      return;
    }
    let i = 0;
    const heartTimer = setInterval(()=> spawnHeartsAround(letterEl, 1), 700);
    function step(){
      if(i <= text.length){
        letterTextEl.textContent = text.slice(0, i);
        i++;
        letterEl.scrollTop = letterEl.scrollHeight;
        const scroller = document.getElementById("letter-scroll");
        scroller.scrollTop = scroller.scrollHeight;
        setTimeout(step, CONFIG.letterTypeSpeedMs);
      } else {
        clearInterval(heartTimer);
        finishLetter();
      }
    }
    step();
  }

  function finishLetter(){
    caret.classList.add("done");
    letterGlow.classList.add("pulse");
    setTimeout(()=> lastBtn.classList.remove("hidden"), 400);
    setTimeout(()=> lastBtn.classList.add("show"), 450);
  }

  lastBtn.addEventListener("click", ()=>{
    goToScene(4);
    setTimeout(runFinalSequence, 60);
  });

  /* ---------------------------------------------------------------------
     SCENE 4 — final celebration
  --------------------------------------------------------------------- */
  const confettiLayer = document.getElementById("confetti-layer");
  let finalRan = false;

  function runFinalSequence(){
    if(finalRan) return;
    finalRan = true;
    if(!reducedMotion){
      burstConfetti();
      const riseInterval = setInterval(()=> spawnRisingParticles(3), 220);
      setTimeout(()=> clearInterval(riseInterval), 6000);
    }
  }

  function burstConfetti(){
    const colors = ["#c14a5a","#e6c98a","#e6a8ad","#f7f1e6","#cda468"];
    for(let i=0;i<90;i++){
      const el = document.createElement("div");
      el.className = "confetti-piece";
      const size = Math.random()*7+4;
      el.style.width = size+"px";
      el.style.height = (size*0.4)+"px";
      el.style.left = Math.random()*100+"%";
      el.style.background = colors[Math.floor(Math.random()*colors.length)];
      const dur = Math.random()*2.5+2.8;
      el.style.animationDuration = dur+"s";
      el.style.animationDelay = (Math.random()*0.6)+"s";
      confettiLayer.appendChild(el);
      setTimeout(()=> el.remove(), (dur+1)*1000);
    }
  }

  function spawnRisingParticles(n){
    const kinds = ["❤️","✨","🫶🏻"];
    for(let i=0;i<n;i++){
      const el = document.createElement("div");
      const isHeart = Math.random() > 0.4;
      el.className = "final-particle";
      el.style.left = Math.random()*100+"%";
      el.style.bottom = "-20px";
      const dur = Math.random()*3+3;
      el.style.animationDuration = dur+"s";
      if(isHeart){
        el.textContent = kinds[Math.floor(Math.random()*kinds.length)];
        el.style.fontSize = (Math.random()*10+14)+"px";
        el.style.background = "none";
      } else {
        const size = Math.random()*4+2;
        el.style.width = size+"px";
        el.style.height = size+"px";
        el.style.background = "rgba(230,201,138,.9)";
        el.style.boxShadow = "0 0 6px rgba(230,201,138,.8)";
      }
      confettiLayer.appendChild(el);
      setTimeout(()=> el.remove(), (dur+0.5)*1000);
    }
  }

  /* ---------------------------------------------------------------------
     Mouse / touch parallax tilt on polaroids + background drift
  --------------------------------------------------------------------- */
  function handlePointer(clientX, clientY){
    const nx = (clientX / window.innerWidth - 0.5) * 2;
    const ny = (clientY / window.innerHeight - 0.5) * 2;
    pointerX = nx; pointerY = ny;
    if(reducedMotion) return;
    document.querySelectorAll(".tilt-target").forEach(el=>{
      const card = el.closest(".polaroid");
      if(!card || !card.classList.contains("emerged")) return;
      const rotY = nx * 8;
      const rotX = -ny * 8;
      card.style.setProperty("--tiltX", rotX+"deg");
      card.style.setProperty("--tiltY", rotY+"deg");
      const base = card.style.transform;
      card.style.transform = card.classList.contains("photo1-polaroid")
        ? `translate(-50%,-58%) translateZ(60px) scale(1.02) rotate(-3deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`
        : `translate(-50%,-52%) translateZ(70px) scale(1.03) rotate(4deg) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
  }
  window.addEventListener("mousemove", (e)=> handlePointer(e.clientX, e.clientY));
  window.addEventListener("touchmove", (e)=>{
    if(e.touches[0]) handlePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, {passive:true});

  // subtle device-motion tilt on mobile as a parallax substitute
  if(!reducedMotion && window.DeviceOrientationEvent){
    window.addEventListener("deviceorientation", (e)=>{
      if(e.gamma == null) return;
      const nx = Math.max(-1, Math.min(1, e.gamma/30));
      const ny = Math.max(-1, Math.min(1, (e.beta-45)/30));
      pointerX = nx; pointerY = ny;
    });
  }

  /* ---------------------------------------------------------------------
     Floating hearts helper
  --------------------------------------------------------------------- */
  function spawnHeartsAround(el, count){
    if(reducedMotion) return;
    const rect = el.getBoundingClientRect();
    for(let i=0;i<count;i++){
      const heart = document.createElement("div");
      heart.className = "floating-heart";
      heart.textContent = Math.random() > 0.5 ? "❤️" : "✨";
      const x = rect.left + Math.random()*rect.width;
      const y = rect.top + Math.random()*rect.height*0.6 + rect.height*0.2;
      heart.style.left = x+"px";
      heart.style.top = y+"px";
      document.body.appendChild(heart);
      setTimeout(()=> heart.remove(), 3300);
    }
  }

  /* ---------------------------------------------------------------------
     Click / tap burst — the "extra wow" effect
  --------------------------------------------------------------------- */
  const burstLayer = document.getElementById("click-burst-layer");
  function burstParticlesAt(x, y, count = 10){
    if(reducedMotion) count = Math.min(count, 4);
    const colors = ["#e6a8ad","#e6c98a","#f7f1e6"];
    for(let i=0;i<count;i++){
      const p = document.createElement("div");
      p.className = "burst-particle";
      const size = Math.random()*5+3;
      p.style.width = size+"px";
      p.style.height = size+"px";
      p.style.left = x+"px";
      p.style.top = y+"px";
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      const angle = Math.random()*Math.PI*2;
      const dist = Math.random()*70+30;
      p.style.setProperty("--bx", Math.cos(angle)*dist+"px");
      p.style.setProperty("--by", Math.sin(angle)*dist+"px");
      burstLayer.appendChild(p);
      setTimeout(()=> p.remove(), 850);
    }
  }
  document.addEventListener("click", (e)=>{
    if(e.target.closest("button")) return; // buttons already have their own feedback
    burstParticlesAt(e.clientX, e.clientY, 8);
  });

  /* ---------------------------------------------------------------------
     Music toggle
  --------------------------------------------------------------------- */
  const musicBtn = document.getElementById("music-toggle");
  musicBtn.addEventListener("click", ()=>{
    if(!CONFIG.musicSrc){
      musicBtn.classList.toggle("playing");
      const label = musicBtn.querySelector(".music-label");
      label.textContent = musicBtn.classList.contains("playing") ? "No track yet" : "Music";
      setTimeout(()=>{
        if(!audio.src){
          musicBtn.classList.remove("playing");
          label.textContent = "Music";
        }
      }, 1600);
      return;
    }
    if(audio.paused){
      audio.play();
      musicBtn.classList.add("playing");
    } else {
      audio.pause();
      musicBtn.classList.remove("playing");
    }
  });

})();
