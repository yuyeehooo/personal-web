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
document.querySelectorAll('a, .project-card, .artwork-button, .media-carousel').forEach(el=>{el.addEventListener('mouseenter',()=>{cursor.classList.add('is-hovering');cursor.style.cssText+=`;width:28px;height:28px`});el.addEventListener('mouseleave',()=>{cursor.classList.remove('is-hovering');cursor.style.cssText+=`;width:12px;height:12px`})});
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=dots.length-1;i>=0;i--){let d=dots[i];d.a-=.035;d.r*=.99;ctx.fillStyle=`rgba(0,0,0,${d.a*.4})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();if(d.a<=0)dots.splice(i,1)}requestAnimationFrame(draw)}draw();
document.querySelectorAll('#nav a, .home-dot').forEach(a=>a.addEventListener('click',()=>document.body.classList.add('entered')));

const bridgeLocation = document.querySelector('#bridge .bridge-location');
if (bridgeLocation) bridgeLocation.innerHTML = 'Shap Long Valley, South Lantau, Hong Kong<br>about 6ha';

const levelupLocation = document.querySelector('#levelup .bridge-location');
const levelupKeywords = document.querySelector('#levelup .bridge-keywords');
const levelupCopy = document.querySelector('#levelup .project-copy');
if (levelupLocation) levelupLocation.innerHTML = 'Quarry hill, Ho Man Tin, Hong Kong<br>about 3.7ha';
if (levelupKeywords) levelupKeywords.innerHTML = '<b>Key words:</b> Game-like landscape、 Youth-oriented public space、 Spatial narrative、 Playable environment';
if (levelupCopy) levelupCopy.innerHTML = `
  <p>This project addresses the lack of attractive outdoor spaces for young people by transforming a conventional park into a game-like landscape. Instead of static and single-function spaces, the design introduces narrative, exploration, and interaction inspired by video games.</p>
  <p>By translating game movement mechanics into spatial experiences, the site becomes a sequence of levels connected through dynamic routes. At the same time, the historical layers of Quarry Hill are reinterpreted as different scenarios within the journey. The objective is to create an engaging, playable environment where visitors become active participants, encouraging young people to return to public space through challenge, discovery, and immersive experience.</p>
`;

const levelupPortfolio = document.querySelector('#levelup .levelup-portfolio');
if (levelupPortfolio) {
  const levelupArtwork = (src, title, className = '') => `
    <figure class="artwork ${className}"><button class="artwork-button" type="button" data-full="${src}" data-caption="${title}" aria-label="View ${title} in detail"><img src="${src}" alt="${title}"><span>${title}</span></button></figure>
  `;
  levelupPortfolio.innerHTML = `
    <div class="artwork-stack levelup-research">
      ${levelupArtwork('Level%20up/user%20profile.jpg', 'User profile and site research', 'artwork-hero')}
      ${levelupArtwork('Level%20up/elements_画板%201.png', 'Quarry Hill historical layers', 'artwork-hero')}
      ${levelupArtwork('Level%20up/add%20game.png', 'Game references and spatial narrative', 'artwork-hero')}
    </div>
    <div class="levelup-plan-grid">
      ${levelupArtwork('Level%20up/site%20plan.jpg', 'Level up site plan')}
      <div class="levelup-plan-aside">
        ${levelupArtwork('Level%20up/accessibility_画板%201.png', 'Accessibility strategy')}
        ${levelupArtwork('Level%20up/game%20line_画板%201.png', 'Game path strategy')}
      </div>
    </div>
    ${levelupArtwork('Level%20up/section%20mini-01.png', 'Site section', 'artwork-hero')}
    <div class="artwork-pair levelup-drawing-pair">
      ${levelupArtwork('Level%20up/ladder%20section-01.png', 'Ladder section')}
      ${levelupArtwork('Level%20up/planting%20design.jpg', 'Planting design')}
    </div>
    ${levelupArtwork('Level%20up/bird%20view.jpg', "Bird's eye view", 'artwork-hero')}
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/mushroom%20bouncer.png', 'Mushroom bouncer scene')}
      ${levelupArtwork('Level%20up/gear.png', 'Gear scene')}
    </div>
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/ladder.png', 'Ladder scene')}
      ${levelupArtwork('Level%20up/maze.png', 'Maze scene')}
    </div>
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/zipline.png', 'Zipline scene')}
      ${levelupArtwork('Level%20up/rest.png', 'Rest area scene')}
    </div>
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/climbing.png', 'Climbing scene')}
      ${levelupArtwork('Level%20up/trail.png', 'Trail scene')}
    </div>
  `;
}

const alignLevelupDrawings = () => {
  if (innerWidth <= 700) {
    document.querySelectorAll('#levelup .artwork-pair, #levelup .levelup-plan-grid').forEach(grid => { grid.style.gridTemplateColumns = ''; });
    return;
  }
  document.querySelectorAll('#levelup .artwork-pair').forEach(pair => {
    const images = [...pair.querySelectorAll('img')];
    if (images.length !== 2 || images.some(image => !image.naturalWidth || !image.naturalHeight)) return;
    const firstRatio = images[0].naturalWidth / images[0].naturalHeight;
    const secondRatio = images[1].naturalWidth / images[1].naturalHeight;
    pair.style.gridTemplateColumns = `${firstRatio}fr ${secondRatio}fr`;
  });
  const planGrid = document.querySelector('#levelup .levelup-plan-grid');
  const planImages = planGrid ? [...planGrid.querySelectorAll('img')] : [];
  if (!planGrid || planImages.length !== 3 || planImages.some(image => !image.naturalWidth || !image.naturalHeight)) return;
  const [sitePlan, accessibility, gameLine] = planImages;
  const siteRatio = sitePlan.naturalWidth / sitePlan.naturalHeight;
  const accessibilityRatio = accessibility.naturalWidth / accessibility.naturalHeight;
  const gameLineRatio = gameLine.naturalWidth / gameLine.naturalHeight;
  const gridGap = parseFloat(getComputedStyle(planGrid).columnGap) || 0;
  const stack = planGrid.querySelector('.levelup-plan-aside');
  const stackGap = parseFloat(getComputedStyle(stack).rowGap) || 0;
  const availableWidth = planGrid.clientWidth - gridGap;
  const rightWidth = (availableWidth - siteRatio * stackGap) / (1 + siteRatio * ((1 / accessibilityRatio) + (1 / gameLineRatio)));
  if (rightWidth > 0) planGrid.style.gridTemplateColumns = `${availableWidth - rightWidth}px ${rightWidth}px`;
};

document.querySelectorAll('#levelup .artwork-button img').forEach(image => {
  if (image.complete) requestAnimationFrame(alignLevelupDrawings);
  else image.addEventListener('load', alignLevelupDrawings, { once: true });
});
let levelupAlignmentQueued = false;
const queueLevelupAlignment = () => {
  if (levelupAlignmentQueued) return;
  levelupAlignmentQueued = true;
  requestAnimationFrame(() => {
    levelupAlignmentQueued = false;
    alignLevelupDrawings();
  });
};
const levelupPlanGrid = document.querySelector('#levelup .levelup-plan-grid');
if (levelupPlanGrid && 'ResizeObserver' in window) new ResizeObserver(queueLevelupAlignment).observe(levelupPlanGrid);
addEventListener('resize', queueLevelupAlignment);
addEventListener('hashchange', queueLevelupAlignment);

function openProject(target) {
  document.documentElement.style.scrollBehavior = 'auto';
  location.hash = target;
  document.body.classList.remove('project-entering');
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (target === '#levelup') queueLevelupAlignment();
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
let lightboxGallery = [], lightboxIndex = 0;
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
function showLightboxImage(image) {
  lightboxImage.style.visibility = 'hidden';
  lightboxImage.onload = () => { fitLightboxImage(); lightboxImage.style.visibility = 'visible'; };
  lightboxImage.src = image.currentSrc || image.src || image;
  lightboxImage.alt = image.alt || '';
  lightboxCaption.textContent = '';
}
function moveLightbox(direction) { if (!lightboxGallery.length) return; lightboxIndex = (lightboxIndex + direction + lightboxGallery.length) % lightboxGallery.length; showLightboxImage(lightboxGallery[lightboxIndex]); }
function closeLightbox() { lightbox.classList.remove('is-open', 'has-gallery'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lightboxGallery = []; }
document.querySelectorAll('.artwork-button').forEach(button => button.addEventListener('click', () => {
  lightboxGallery = []; lightboxIndex = 0; lightbox.classList.remove('has-gallery');
  showLightboxImage({ src: button.dataset.full, alt: button.querySelector('img').alt });
  lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}));

const draftCarousel = document.querySelector('[aria-label="Bridge draft gallery"]');
const draftTrack = draftCarousel?.querySelector('.carousel-track');
if (draftCarousel && draftTrack) {
  const draftOrder = [
    ['Bridge/draft/section.jpg', 'Sectional draft'],
    ['Bridge/draft/draft.jpg', 'Conceptual draft'],
    ['Bridge/draft/0.png', 'Draft study 01'],
    ['Bridge/draft/1.png', 'Draft study 02'],
    ['Bridge/draft/2.png', 'Draft study 03'],
    ['Bridge/draft/3.png', 'Draft study 04'],
    ['Bridge/draft/model/1.jpg', 'Model study 01'],
    ['Bridge/draft/model/2.jpg', 'Model study 02'],
    ['Bridge/draft/model/3.jpg', 'Model study 03'],
    ['Bridge/draft/model/4.jpg', 'Model study 04'],
    ['Bridge/draft/model/5.jpg', 'Model study 05'],
    ['Bridge/draft/model/6.jpg', 'Model study 06'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_1.png', 'Hydrological dynamics 1983'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_2.png', 'Hydrological dynamics 1982'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_3.png', 'Hydrological dynamics 2015'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_4.png', 'Hydrological dynamics 2024'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_5.png', 'Vegetation study 01'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_6.png', 'Vegetation study 02'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_7.png', 'Vegetation study 03'],
    ['Bridge/draft/LAND7138_F24_Yu Yihao_P1A_Ex1(step4)_页面_8.png', 'Vegetation study 04']
  ];
  draftTrack.innerHTML = draftOrder.map(([src, alt], index) =>
    `<figure class="carousel-slide"><img src="${src}" alt="${alt}"${index ? ' loading="lazy"' : ''}></figure>`
  ).join('');
  draftCarousel.querySelector('.carousel-count').textContent = '01 / 20';
}

document.querySelectorAll('.carousel-slide img').forEach(image => image.addEventListener('click', () => {
  lightboxGallery = [...image.closest('[data-carousel]').querySelectorAll('.carousel-slide img')]; lightboxIndex = lightboxGallery.indexOf(image); lightbox.classList.add('has-gallery');
  showLightboxImage(image);
  lightbox.classList.add('is-open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
}));
lightbox?.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox?.querySelector('.lightbox-previous').addEventListener('click', () => moveLightbox(-1));
lightbox?.querySelector('.lightbox-next').addEventListener('click', () => moveLightbox(1));
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (!lightbox?.classList.contains('is-open')) return; if (event.key === 'Escape') closeLightbox(); if (event.key === 'ArrowLeft') moveLightbox(-1); if (event.key === 'ArrowRight') moveLightbox(1); });
lightboxStage?.addEventListener('wheel', event => { event.preventDefault(); zoom = Math.min(maxZoom, Math.max(minZoom, zoom + (event.deltaY < 0 ? .18 : -.18))); if (zoom <= 1) { panX = 0; panY = 0; } renderLightboxImage(); }, { passive: false });
lightboxStage?.addEventListener('pointerdown', event => { if (zoom <= 1) return; dragStart = { x:event.clientX, y:event.clientY, panX, panY }; lightboxStage.classList.add('is-panning'); lightboxStage.setPointerCapture(event.pointerId); });
lightboxStage?.addEventListener('pointermove', event => { if (!dragStart) return; panX = dragStart.panX + event.clientX - dragStart.x; panY = dragStart.panY + event.clientY - dragStart.y; renderLightboxImage(); });
lightboxStage?.addEventListener('pointerup', () => { dragStart = null; lightboxStage.classList.remove('is-panning'); });
addEventListener('resize', () => { if (lightbox?.classList.contains('is-open')) fitLightboxImage(); });

document.querySelectorAll('[data-carousel]').forEach(carousel => {
  const track = carousel.querySelector('.carousel-track');
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const counter = carousel.querySelector('.carousel-count');
  if (slides.length < 2) return;
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.add('is-carousel-clone');
  lastClone.classList.add('is-carousel-clone');
  track.prepend(lastClone);
  track.append(firstClone);
  let current = 0, startX = null, isAnimating = false;
  const updateCounter = () => {
    const visibleIndex = (current + slides.length) % slides.length;
    counter.textContent = `${String(visibleIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const positionTrack = animate => {
    track.style.transition = animate ? 'transform .48s cubic-bezier(.22,.8,.25,1)' : 'none';
    track.style.transform = `translate3d(${-((current + 1) * 100)}%, 0, 0)`;
  };
  const move = direction => {
    if (isAnimating) return;
    isAnimating = true;
    current += direction;
    positionTrack(true);
    updateCounter();
  };
  positionTrack(false);
  void track.offsetWidth;
  track.style.transition = 'transform .48s cubic-bezier(.22,.8,.25,1)';
  track.addEventListener('transitionend', event => {
    if (event.target !== track || !isAnimating) return;
    if (current === slides.length) {
      current = 0;
      positionTrack(false);
      void track.offsetWidth;
    } else if (current === -1) {
      current = slides.length - 1;
      positionTrack(false);
      void track.offsetWidth;
    }
    track.style.transition = 'transform .48s cubic-bezier(.22,.8,.25,1)';
    isAnimating = false;
  });
  carousel.querySelectorAll('.carousel-arrow').forEach(button => button.addEventListener('click', () => { move(button.dataset.direction === 'next' ? 1 : -1); button.blur(); }));
  carousel.addEventListener('keydown', event => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); });
  carousel.addEventListener('pointerdown', event => { startX = event.clientX; });
  carousel.addEventListener('pointerup', event => { if (startX === null) return; const delta = event.clientX - startX; if (Math.abs(delta) > 45) move(delta < 0 ? 1 : -1); startX = null; });
});

const bridgePortfolio = document.querySelector('#bridge .bridge-portfolio');
const bridgeGalleries = bridgePortfolio?.querySelector('.archive-galleries');
if (bridgePortfolio && bridgeGalleries) bridgePortfolio.before(bridgeGalleries);

const projectRoutes = [
  { id: 'bridge', next: 'levelup' },
  { id: 'levelup', previous: 'bridge' }
];
projectRoutes.forEach(({ id, previous, next }) => {
  const detail = document.querySelector(`#${id}`);
  if (!detail || detail.querySelector('.project-switch')) return;
  detail.insertAdjacentHTML('beforeend', `
    <nav class="project-switch ${previous ? 'has-previous' : ''} ${next ? 'has-next' : ''}" aria-label="Project navigation">
      ${previous ? `<a href="#${previous}" data-project-route="${previous}"><span>←</span> Previous</a>` : ''}
      ${next ? `<a href="#${next}" data-project-route="${next}">Next <span>→</span></a>` : ''}
    </nav>
  `);
});
document.querySelectorAll('.project-switch [data-project-route]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    openProject(link.dataset.projectRoute);
  });
});
