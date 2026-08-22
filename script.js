const resolveAssetPath = path => path
  .replace(/^Bridge\//, 'Project/Bridge/')
  .replace(/^Level%20up\//, 'Project/Level%20up/')
  .replace(/^Painting%20%26%20sketch\//, 'About/Painting%20%26%20sketch/')
  .replace('Project/Level%20up/maze.png', 'Project/Level%20up/cemetery%20maze.png');

document.querySelectorAll('[src], [data-full]').forEach(element => {
  if (element.hasAttribute('src')) element.src = resolveAssetPath(element.getAttribute('src'));
  if (element.dataset.full) element.dataset.full = resolveAssetPath(element.dataset.full);
});

const bridgeCard = document.querySelector('.project-card.bridge');
const levelupCard = document.querySelector('.project-card.level');
if (bridgeCard) bridgeCard.style.backgroundImage = `url("${resolveAssetPath('Bridge/site photo/8.jpg')}")`;
if (levelupCard) levelupCard.style.backgroundImage = `url("${resolveAssetPath('Level%20up/bird%20view.jpg')}")`;

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
const bindCursorHover = el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('is-hovering'); cursor.style.cssText += ';width:28px;height:28px'; });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('is-hovering'); cursor.style.cssText += ';width:12px;height:12px'; });
};
document.querySelectorAll('a, .project-card, .artwork-button, .media-carousel').forEach(bindCursorHover);
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=dots.length-1;i>=0;i--){let d=dots[i];d.a-=.035;d.r*=.99;ctx.fillStyle=`rgba(0,0,0,${d.a*.4})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fill();if(d.a<=0)dots.splice(i,1)}requestAnimationFrame(draw)}draw();
document.querySelectorAll('#nav a, .home-dot').forEach(a=>a.addEventListener('click',()=>document.body.classList.add('entered')));

const contactLinks = [...document.querySelectorAll('#contact .contact-links a')];
const homeIcon = '<span class="contact-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z"/><path d="M9 21v-7h6v7"/></svg></span>';
const mailIcon = '<span class="contact-link-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></svg></span>';
if (contactLinks.length === 2) {
  const [websiteLink, emailLink] = contactLinks;
  websiteLink.href = '#entry';
  websiteLink.innerHTML = `${homeIcon}<span class="contact-link-label">yeehoo.xyz</span><span class="contact-link-arrow" aria-hidden="true">↗</span>`;
  emailLink.href = 'mailto:yuyeehooo@gmail.com';
  emailLink.innerHTML = `${mailIcon}<span class="contact-link-label">yuyeehooo@gmail.com</span><span class="contact-link-arrow" aria-hidden="true">↗</span>`;
  websiteLink.addEventListener('click', event => {
    event.preventDefault();
    document.body.classList.remove('entered');
    history.replaceState(null, '', '#home');
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    entry.addEventListener('click', revisitEntry, { once: true });
  });
}
function revisitEntry(event) {
  event.preventDefault();
  document.body.classList.add('entered');
  history.replaceState(null, '', '#home');
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
}

const bridgeLocation = document.querySelector('#bridge .bridge-location');
if (bridgeLocation) bridgeLocation.innerHTML = 'Shap Long Valley, South Lantau, Hong Kong<br>about 6ha';

const levelupLocation = document.querySelector('#levelup .bridge-location');
const levelupKeywords = document.querySelector('#levelup .bridge-keywords');
const levelupCopy = document.querySelector('#levelup .project-copy');
const resumeSkills = document.querySelector('#resume .skills p');
const hobbyLabels = ['Photography', 'Painting & sketch', 'Carving & sculpture'];
const hobbyCards = [...document.querySelectorAll('#resume .hobby-grid > div')];
const hobbiesSubtext = document.querySelector('#resume .hobbies .sub');
if (levelupLocation) levelupLocation.innerHTML = 'Quarry hill, Ho Man Tin, Hong Kong<br>about 3.7ha';
if (levelupKeywords) levelupKeywords.innerHTML = '<b>Key words:</b> Game-like landscape、 Youth-oriented public space、 Spatial narrative、 Playable environment';
if (resumeSkills) resumeSkills.textContent = 'AutoCAD，Rhino，SketchUp，Adobe Creative Suite，Lumion，Enscape，D5，GIS';
if (hobbiesSubtext) hobbiesSubtext.textContent = 'A gallery of photographs, drawings and sculptures.';
hobbyCards.forEach((card, index) => {
  const title = card.querySelector('strong');
  const prompt = card.querySelector('em');
  if (title) title.textContent = hobbyLabels[index];
  if (prompt) prompt.textContent = 'Click to explore';
});
const paintingImages = Array.from({ length: 40 }, (_, index) => [
  resolveAssetPath(`Painting%20%26%20sketch/${index + 1}.jpg`),
  `Painting and sketch ${String(index + 1).padStart(2, '0')}`
]);
const paintingCard = hobbyCards[1];
if (paintingCard) {
  paintingCard.classList.add('hobby-gallery');
  paintingCard.innerHTML = `
    <span>02</span><strong>Painting & sketch</strong>
    <section class="media-carousel hobby-media-carousel" data-carousel tabindex="0" aria-label="Painting and sketch gallery">
      <section class="carousel-track">${paintingImages.map(([src, alt], index) => `<figure class="carousel-slide"><img src="${src}" alt="${alt}"${index ? ' loading="lazy"' : ''}></figure>`).join('')}</section>
      <aside class="carousel-controls"><button class="carousel-arrow" data-direction="previous" aria-label="Previous painting or sketch">←</button><span class="carousel-count" aria-live="polite">01 / 40</span><button class="carousel-arrow" data-direction="next" aria-label="Next painting or sketch">→</button></aside>
    </section>
  `;
  bindCursorHover(paintingCard.querySelector('.media-carousel'));
}
const resume = document.querySelector('#resume');
if (resume && !resume.querySelector('.resume-contact-cta')) {
  resume.insertAdjacentHTML('beforeend', '<a class="resume-contact-cta" href="#contact">Feel free to get in touch.<span aria-hidden="true">↗</span></a>');
  const resumeContactCta = resume.querySelector('.resume-contact-cta');
  bindCursorHover(resumeContactCta);
  resumeContactCta.addEventListener('click', event => {
    event.preventDefault();
    location.hash = 'contact';
    requestAnimationFrame(() => {
      const contact = document.querySelector('#contact');
      window.scrollTo({ top: contact.offsetTop, left: 0, behavior: 'auto' });
    });
  });
}
if (levelupCopy) levelupCopy.innerHTML = `
  <p>This project addresses the lack of attractive outdoor spaces for young people by transforming a conventional park into a game-like landscape. Instead of static and single-function spaces, the design introduces narrative, exploration, and interaction inspired by video games.</p>
  <p>By translating game movement mechanics into spatial experiences, the site becomes a sequence of levels connected through dynamic routes. At the same time, the historical layers of Quarry Hill are reinterpreted as different scenarios within the journey. The objective is to create an engaging, playable environment where visitors become active participants, encouraging young people to return to public space through challenge, discovery, and immersive experience.</p>
`;

const levelupPortfolio = document.querySelector('#levelup .levelup-portfolio');
if (levelupPortfolio) {
  const levelupArtwork = (src, title, className = '') => {
    const assetPath = resolveAssetPath(src);
    return `
    <figure class="artwork ${className}"><button class="artwork-button" type="button" data-full="${assetPath}" data-caption="${title}" aria-label="View ${title} in detail"><img src="${assetPath}" alt="${title}"><span>${title}</span></button></figure>
  `;
  };
  levelupPortfolio.innerHTML = `
    <div class="artwork-stack levelup-research">
      ${levelupArtwork('Level%20up/user%20profile.jpg', 'User profile and site research', 'artwork-hero')}
      ${levelupArtwork('Level%20up/game%20elements_%E7%94%BB%E6%9D%BF%201.png', 'Quarry Hill historical layers', 'artwork-hero')}
      ${levelupArtwork('Level%20up/add%20game.png', 'Game references and spatial narrative', 'artwork-hero')}
    </div>
    <div class="levelup-plan-grid">
      ${levelupArtwork('Level%20up/site%20plan.jpg', 'Level up site plan')}
      <div class="levelup-plan-aside">
        ${levelupArtwork('Level%20up/accessibility_%E7%94%BB%E6%9D%BF%201.png', 'Accessibility strategy')}
        ${levelupArtwork('Level%20up/game%20line_%E7%94%BB%E6%9D%BF%201.png', 'Game path strategy')}
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
      ${levelupArtwork('Level%20up/cemetery%20maze.png', 'Maze scene')}
    </div>
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/zipline.png', 'Zipline scene')}
      ${levelupArtwork('Level%20up/rest%20stop.png', 'Rest area scene')}
    </div>
    <div class="artwork-pair levelup-scene-pair">
      ${levelupArtwork('Level%20up/climbing.png', 'Climbing scene')}
      ${levelupArtwork('Level%20up/Mine%20train%20roller%20coaster.png', 'Trail scene')}
    </div>
  `;

  const levelupDraftVersions = {
    '2.jpg': '20260814150938',
    '8model/4.jpg': '20260814151142',
    '8model/6.jpg': '20260814151151',
    '8model/7.jpg': '20260814151200',
    '8model/8.jpg': '20260814151208'
  };
  const levelupDraftSource = path => resolveAssetPath(`Level%20up/draft/${path}${levelupDraftVersions[path] ? `?v=${levelupDraftVersions[path]}` : ''}`);
  const levelupDraftImages = [
    ...Array.from({ length: 7 }, (_, index) => [`${levelupDraftSource(`${index + 1}.jpg`)}`, `Level up draft ${String(index + 1).padStart(2, '0')}`]),
    ...Array.from({ length: 11 }, (_, index) => [`${levelupDraftSource(`8model/${index + 1}.jpg`)}`, `Level up model ${String(index + 1).padStart(2, '0')}`])
  ];
  const levelupSiteImages = Array.from({ length: 6 }, (_, index) => [resolveAssetPath(`Level%20up/site%20photo/${index + 1}.jpg`), `Level up site photo ${String(index + 1).padStart(2, '0')}`]);
  const makeCarousel = (label, images) => `
    <div class="media-carousel" data-carousel tabindex="0" aria-label="${label}">
      <div class="carousel-track">${images.map(([src, alt], index) => `<figure class="carousel-slide"><img src="${src}" alt="${alt}"${index ? ' loading="lazy"' : ''}></figure>`).join('')}</div>
      <div class="carousel-controls"><button class="carousel-arrow" data-direction="previous" aria-label="Previous image">←</button><span class="carousel-count" aria-live="polite">01 / ${String(images.length).padStart(2, '0')}</span><button class="carousel-arrow" data-direction="next" aria-label="Next image">→</button></div>
    </div>`;
  levelupPortfolio.insertAdjacentHTML('beforebegin', `
    <div class="archive-galleries levelup-galleries">
      <section class="archive-section" aria-labelledby="levelup-draft-title"><div class="archive-heading"><p class="kicker">Process archive</p><h3 id="levelup-draft-title">Draft</h3></div>${makeCarousel('Level up draft gallery', levelupDraftImages)}</section>
      <section class="archive-section" aria-labelledby="levelup-site-photo-title"><div class="archive-heading"><p class="kicker">Site documentation</p><h3 id="levelup-site-photo-title">Site photo</h3></div>${makeCarousel('Level up site photo gallery', levelupSiteImages)}</section>
    </div>
  `);
  document.querySelectorAll('#levelup .artwork-button').forEach(bindCursorHover);
  document.querySelectorAll('#levelup .media-carousel').forEach(bindCursorHover);
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
const lightboxPage = document.createElement('p');
lightboxPage.className = 'lightbox-page';
lightboxPage.setAttribute('aria-live', 'polite');
lightbox?.append(lightboxPage);
let zoom = 1, panX = 0, panY = 0, dragStart = null;
let lightboxGallery = [], lightboxIndex = 0;
const minZoom = .45, maxZoom = 4;
function updateLightboxPage() {
  lightboxPage.textContent = lightboxGallery.length > 1
    ? `${String(lightboxIndex + 1).padStart(2, '0')} / ${String(lightboxGallery.length).padStart(2, '0')}`
    : '';
}
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
  updateLightboxPage();
}
function moveLightbox(direction) { if (!lightboxGallery.length) return; lightboxIndex = (lightboxIndex + direction + lightboxGallery.length) % lightboxGallery.length; showLightboxImage(lightboxGallery[lightboxIndex]); }
function closeLightbox() { lightbox.classList.remove('is-open', 'has-gallery'); lightbox.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; lightboxGallery = []; updateLightboxPage(); }
document.querySelectorAll('.bridge-portfolio .artwork-button').forEach(button => button.addEventListener('click', () => {
  const drawings = [...button.closest('.bridge-portfolio').querySelectorAll('.artwork-button')];
  lightboxGallery = drawings.map(drawing => ({
    src: drawing.dataset.full,
    alt: drawing.querySelector('img')?.alt || ''
  }));
  lightboxIndex = drawings.indexOf(button);
  lightbox.classList.toggle('has-gallery', lightboxGallery.length > 1);
  showLightboxImage(lightboxGallery[lightboxIndex]);
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
    `<figure class="carousel-slide"><img src="${resolveAssetPath(src)}" alt="${alt}"${index ? ' loading="lazy"' : ''}></figure>`
  ).join('');
  draftCarousel.querySelector('.carousel-count').textContent = '01 / 20';
}

document.querySelectorAll('.carousel-slide img').forEach(image => image.addEventListener('click', () => {
  lightboxGallery = [...image.closest('[data-carousel]').querySelectorAll('.carousel-slide:not(.is-carousel-clone) img')]; lightboxIndex = lightboxGallery.indexOf(image); lightbox.classList.add('has-gallery');
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


/* Platform-independent interface arrows and mobile image-viewer gestures. */
(() => {
  const arrowSvg = direction => {
    const paths = {
      northeast: '<path d="M5 19 19 5M9 5h10v10"/>',
      southeast: '<path d="m5 5 14 14M9 19h10V9"/>',
      east: '<path d="M4 12h16M14 6l6 6-6 6"/>',
      west: '<path d="M20 12H4m6 6-6-6 6-6"/>',
      south: '<path d="M12 4v16m-6-6 6 6 6-6"/>'
    };
    return `<svg class="ui-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[direction]}</svg>`;
  };

  const replaceArrow = (selector, direction) => document.querySelectorAll(selector).forEach(element => {
    if (element.dataset.iconReady) return;
    element.dataset.iconReady = 'true';
    element.innerHTML = arrowSvg(direction);
  });

  replaceArrow('.project-card .arrow, .contact-link-arrow', 'northeast');
  replaceArrow('.about-teaser .big-arrow, #entry .enter span', 'southeast');
  replaceArrow('.scroll-note span', 'south');
  document.querySelectorAll('.project-switch span, .carousel-arrow, .lightbox-nav').forEach(element => {
    if (element.dataset.iconReady) return;
    const label = `${element.getAttribute('aria-label') || ''} ${element.textContent || ''}`.toLowerCase();
    const direction = /previous|left|←/.test(label) ? 'west' : 'east';
    element.dataset.iconReady = 'true';
    element.innerHTML = arrowSvg(direction);
  });
})();

(() => {
  const viewer = document.querySelector('#lightbox');
  const stage = viewer?.querySelector('.lightbox-stage');
  const image = viewer?.querySelector('.lightbox-image');
  if (!viewer || !stage || !image) return;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let singleTouch = null;
  let pinch = null;
  let lastTap = null;
  let frame = 0;
  const maxScale = 4;
  const isTouchDevice = () => matchMedia('(pointer: coarse)').matches;
  const touchDistance = touches => Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );

  const render = () => {
    frame = 0;
    image.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
  };
  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const keepInBounds = () => {
    if (scale <= 1.01) {
      scale = 1;
      translateX = 0;
      translateY = 0;
      return;
    }
    const maxX = Math.max(0, (image.clientWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.clientHeight * scale - stage.clientHeight) / 2);
    translateX = Math.max(-maxX, Math.min(maxX, translateX));
    translateY = Math.max(-maxY, Math.min(maxY, translateY));
  };
  const reset = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    requestRender();
  };
  const setGesturing = active => stage.classList.toggle('is-gesturing', active);
  const switchImage = direction => {
    viewer.querySelector(direction === 'next' ? '.lightbox-next' : '.lightbox-previous')?.click();
  };

  stage.addEventListener('touchstart', event => {
    if (!isTouchDevice() || !viewer.classList.contains('is-open')) return;
    setGesturing(true);
    if (event.touches.length === 2) {
      pinch = { distance: touchDistance(event.touches), scale };
      singleTouch = null;
    } else if (event.touches.length === 1) {
      const touch = event.touches[0];
      singleTouch = { x: touch.clientX, y: touch.clientY, translateX, translateY, scale, moved: false };
      pinch = null;
    }
    event.preventDefault();
  }, { passive: false });

  stage.addEventListener('touchmove', event => {
    if (!isTouchDevice() || !viewer.classList.contains('is-open')) return;
    if (event.touches.length === 2 && pinch) {
      scale = Math.min(maxScale, Math.max(1, pinch.scale * (touchDistance(event.touches) / pinch.distance)));
      keepInBounds();
      requestRender();
      event.preventDefault();
      return;
    }
    if (event.touches.length === 1 && singleTouch) {
      const touch = event.touches[0];
      const dx = touch.clientX - singleTouch.x;
      const dy = touch.clientY - singleTouch.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) singleTouch.moved = true;
      if (scale > 1.01) {
        translateX = singleTouch.translateX + dx;
        translateY = singleTouch.translateY + dy;
        keepInBounds();
        requestRender();
      }
      event.preventDefault();
    }
  }, { passive: false });

  stage.addEventListener('touchend', event => {
    if (!isTouchDevice()) return;
    if (event.touches.length === 1 && pinch) {
      const touch = event.touches[0];
      singleTouch = { x: touch.clientX, y: touch.clientY, translateX, translateY, scale, moved: false };
      pinch = null;
      return;
    }
    if (event.touches.length) return;
    setGesturing(false);
    if (singleTouch) {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - singleTouch.x;
      const dy = touch.clientY - singleTouch.y;
      const isTap = !singleTouch.moved && Math.abs(dx) < 12 && Math.abs(dy) < 12;
      const now = performance.now();
      const isDoubleTap = isTap && lastTap && now - lastTap.time < 300 &&
        Math.hypot(touch.clientX - lastTap.x, touch.clientY - lastTap.y) < 30;

      if (isDoubleTap) {
        const bounds = stage.getBoundingClientRect();
        const fromCenterX = touch.clientX - bounds.left - bounds.width / 2;
        const fromCenterY = touch.clientY - bounds.top - bounds.height / 2;
        if (scale > 1.01) {
          reset();
        } else {
          scale = 2.2;
          translateX = -fromCenterX * (scale - 1);
          translateY = -fromCenterY * (scale - 1);
          keepInBounds();
          requestRender();
        }
        lastTap = null;
      } else if (singleTouch.scale <= 1.01 && Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        switchImage(dx < 0 ? 'next' : 'previous');
        reset();
        lastTap = null;
      } else {
        keepInBounds();
        requestRender();
        lastTap = isTap ? { time: now, x: touch.clientX, y: touch.clientY } : null;
      }
    }
    singleTouch = null;
    pinch = null;
  }, { passive: false });

  stage.addEventListener('dblclick', event => {
    if (isTouchDevice() || !viewer.classList.contains('is-open')) return;
    const bounds = stage.getBoundingClientRect();
    const fromCenterX = event.clientX - bounds.left - bounds.width / 2;
    const fromCenterY = event.clientY - bounds.top - bounds.height / 2;
    if (scale > 1.01) {
      reset();
    } else {
      scale = 2.2;
      translateX = -fromCenterX * (scale - 1);
      translateY = -fromCenterY * (scale - 1);
      keepInBounds();
      requestRender();
    }
  });

  stage.addEventListener('touchcancel', () => {
    setGesturing(false);
    singleTouch = null;
    pinch = null;
    keepInBounds();
    requestRender();
  }, { passive: true });

  image.addEventListener('load', reset);
  viewer.querySelectorAll('.lightbox-close, .lightbox-nav').forEach(control => {
    control.addEventListener('click', () => setTimeout(reset, 0));
  });
  new MutationObserver(() => {
    if (!viewer.classList.contains('is-open')) reset();
  }).observe(viewer, { attributes: true, attributeFilter: ['class'] });
})();

/* Project details conclude with a direct route into the full About me profile. */
(() => {
  const aboutArrow = '<svg class="ui-arrow-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M9 5h10v10"/></svg>';
  document.querySelectorAll('.detail').forEach(detail => {
    if (detail.querySelector('.project-about-cta')) return;
    detail.insertAdjacentHTML('beforeend', `<a class="resume-contact-cta project-about-cta" href="#resume">About me <span>${aboutArrow}</span></a>`);
  });
})();
