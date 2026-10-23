document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>{
        i.classList.remove('open');
        i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      });
      if(!wasOpen){
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const menuBtn = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(menuBtn && navLinks){
    const closeMenu = ()=>{
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
      menuBtn.setAttribute('aria-label','Open navigation menu');
    };
    menuBtn.addEventListener('click', ()=>{
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
      menuBtn.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
    });
    navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',event=>{
      if(event.key==='Escape' && navLinks.classList.contains('open')){
        closeMenu();
        menuBtn.focus();
      }
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change',closeMenu);
  }

  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:.12});
  revealItems.forEach(el=>revealObserver.observe(el));

document.addEventListener('DOMContentLoaded', function(){
  const root=document.querySelector('.mf-slider');
  if(!root) return;
  const slides=[...root.querySelectorAll('.mf-slide')];
  const dots=[...root.querySelectorAll('.mf-dot')];
  const prev=root.querySelector('.mf-slider-arrow.prev');
  const next=root.querySelector('.mf-slider-arrow.next');
  const pause=root.querySelector('.mf-slider-pause');
  if(!slides.length || !prev || !next || !pause) return;

  let index=0, timer=null;
  let userPaused=true;
  let hoverPaused=false;
  function show(i){
    index=(i+slides.length)%slides.length;
    slides.forEach((slide,n)=>{
      const active=n===index;
      slide.classList.toggle('active',active);
      slide.setAttribute('aria-hidden',String(!active));
      slide.inert=!active;
    });
    dots.forEach((dot,n)=>{
      const active=n===index;
      dot.classList.toggle('active',active);
      dot.setAttribute('aria-pressed',String(active));
    });
  }
  function stopRotation(){
    clearInterval(timer);
    timer=null;
  }
  function updateRotation(){
    stopRotation();
    pause.textContent=userPaused?'Play':'Pause';
    pause.setAttribute('aria-label',userPaused?'Start automatic slide rotation':'Pause automatic slide rotation');
    if(!userPaused && !hoverPaused) timer=setInterval(()=>show(index+1),6500);
  }
  function selectSlide(i){
    userPaused=true;
    show(i);
    updateRotation();
  }
  prev.addEventListener('click',()=>selectSlide(index-1));
  next.addEventListener('click',()=>selectSlide(index+1));
  dots.forEach((dot,n)=>dot.addEventListener('click',()=>selectSlide(n)));
  pause.addEventListener('click',()=>{
    userPaused=!userPaused;
    updateRotation();
  });
  root.addEventListener('mouseenter',()=>{
    hoverPaused=true;
    updateRotation();
  });
  root.addEventListener('mouseleave',()=>{
    hoverPaused=false;
    updateRotation();
  });
  root.addEventListener('focusin',()=>{
    userPaused=true;
    updateRotation();
  });
  show(index);
  updateRotation();
});
