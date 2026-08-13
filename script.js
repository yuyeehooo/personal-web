const entry = document.querySelector('#entry');
entry.addEventListener('click', (event) => {
  event.preventDefault();
  document.body.classList.add('entered');
  history.replaceState(null, '', '#home');
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}, { once: true });
const cursor = document.querySelector('#cursor');
let x = innerWidth / 2, y = innerHeight / 2; const dots = [];
const canvas = document.querySelector('#particles'), ctx = canvas.getContext('2d');
function resize(){canvas.width=innerWidth;canvas.height=innerHeight}resize();addEventListener('resize',resize);
addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;cursor.style.left=x+'px';cursor.style.top=y+'px';if(!matchMedia('(prefers-reduced-motion: reduce)').matches){dots.push({x,y,a:1,r:Math.random()*2+1})}});
document.querySelectorAll('a, .project-card, .artwork-button').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.classList.add('is-hovering');cursor.style.cssText+=`;width:28px;height:28px`});el.addEventListener('mouseleave',()=>{cursor.classList.remove('is-hovering');cursor.style.cssText+=`;width:12px;height:12px`})});
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=dots.length-1;i>=0;i--){let d=dots[i];d.a-=.035;d.r*=.99;ctx.fillStyle=`rgba(0,0,0,${d.a*.4})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();if(d.a<=0)dots.splice(i,1)}requestAnimationFrame(draw)}draw();
document.querySelectorAll('#nav a, .home-dot').forEach(a=>a.addEventListener('click',()=>document.body.classList.add('entered')));

function openProject(target) {
  document.documentElement.style.scrollBehavior = 'auto';
  location.hash = target;
  document.body.classList.remove('project-entering');
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.body.classList.add('project-entering');
    document.documentElement.style.scrollBehavior = '';
    window.setTimeout(() => document.body.classList.remove('project-entering'), 1050);
  });
}

document.querySelectorAll('.project-card[href]').forEach(card => {
  card.addEventListener('click', event => {
    event.preventDefault();
    openProject(card.getAttribute('href'));
  });
});

document.querySelectorAll('.about-teaser a[href="#resume"]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.documentElement.style.scrollBehavior = 'auto';
    location.hash = 'resume';
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.style.scrollBehavior = '';
    });
  });
});

document.querySelectorAll('.detail .back').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    document.body.classList.remove('project-entering');
    document.documentElement.style.scrollBehavior = 'auto';
    location.hash = 'projects';
    requestAnimationFrame(() => {
      const projects = document.querySelector('#projects');
      window.scrollTo({ top: projects.offsetTop, left: 0, behavior: 'auto' });
      document.documentElement.style.scrollBehavior = '';
    });
  });
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxCaption = lightbox?.querySelector('.lightbox-caption');
const lightboxStage = lightbox?.querySelector('.lightbox-stage');
let zoom = 1, panX = 0, panY = 0, dragStart = null;
const minZoom = .45, maxZoom = 4;
function renderLightboxImage() { lightboxImage.style.transform = `translate(${panX}px, ${panY}px) scale(${zoom})`; }
function fitLightboxImage() {
  if (!lightboxImage?.naturalWidth || !lightboxStage) return;
  const styles = getComputedStyle(lightboxStage);
  const availableWidth = lightboxStage.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
  const availableHeight = lightboxStage.clientHeight - parseFloat(styles.paddingTop) - parseFloat(styles.paddingBottom);
  const ratio = Math.min(availableWidth / lightboxImage.naturalWidth, availableHeight / lightboxImage.naturalHeight);
  lightboxImage.style.width = `${Math.floor(lightboxImage.naturalWidth * ratio)}px`;
  lightboxImage.style.height = `${Math.floor(lightboxImage.naturalHeight * ratio)}px`;
  zoom = 1; panX = 0; panY = 0; renderLightboxImage();
}
function closeLightbox() { lightbox.classList.remove('is-open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelectorAll('.artwork-button').forEach(button => button.addEventListener('click', () => {
  lightboxImage.style.visibility = 'hidden';
  lightboxImage.onload = () => { fitLightboxImage(); lightboxImage.style.visibility = 'visible'; };
  lightboxImage.src = button.dataset.full; lightboxImage.alt = button.querySelector('img').alt;
  lightboxCaption.textContent = button.dataset.caption;
  lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}));
lightbox?.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) closeLightbox(); });
lightboxStage?.addEventListener('wheel', event => { event.preventDefault(); zoom = Math.min(maxZoom, Math.max(minZoom, zoom + (event.deltaY < 0 ? .18 : -.18))); if (zoom <= 1) { panX = 0; panY = 0; } renderLightboxImage(); }, { passive: false });
lightboxStage?.addEventListener('pointerdown', event => { if (zoom <= 1) return; dragStart = { x:event.clientX, y:event.clientY, panX, panY }; lightboxStage.classList.add('is-panning'); lightboxStage.setPointerCapture(event.pointerId); });
lightboxStage?.addEventListener('pointermove', event => { if (!dragStart) return; panX = dragStart.panX + event.clientX - dragStart.x; panY = dragStart.panY + event.clientY - dragStart.y; renderLightboxImage(); });
lightboxStage?.addEventListener('pointerup', () => { dragStart = null; lightboxStage.classList.remove('is-panning'); });
addEventListener('resize', () => { if (lightbox?.classList.contains('is-open')) fitLightboxImage(); });
