/* A small, self-contained seasonal tree. No network, animation library or WebGL required. */
(() => {
  'use strict';
  const scene = document.querySelector('#seasonal-scene');
  const garden = document.querySelector('#seasonal-garden');
  const picker = document.querySelector('#site-season');
  if (!scene || !garden || !picker) return;

  const root = document.documentElement;
  const svg = scene.querySelector('svg');
  const canvas = document.querySelector('#seasonal-weather');
  const context = canvas.getContext('2d');
  const background = document.querySelector('.hero-landscape img');
  let backgroundRequest = 0;
  const status = document.querySelector('#season-context');
  const ns = 'http://www.w3.org/2000/svg';
  const storageKey = 'aditusan-season';
  const themes = {
    spring: {
      name: 'Spring', symbol: 'tree-blossom', density: 1.12, wind: .85,
      colors: ['#e8a5ae', '#f2bac1', '#f8d8d6', '#cf7f93', '#f5c7cd'],
      wash: '#df9aa6', description: 'Sakura blossoms and drifting pink petals.'
    },
    summer: {
      name: 'Summer', symbol: 'tree-leaf', density: 1.2, wind: 1.55,
      colors: ['#345d51', '#4f7960', '#6f8c63', '#8d9a6a', '#416a5d'],
      wash: '#65856a', description: 'Green leaves and branches moving in the breeze.'
    },
    autumn: {
      name: 'Autumn', symbol: 'tree-maple', density: .83, wind: 1.12,
      colors: ['#a75136', '#c8793c', '#cc984e', '#9b4936', '#d0a664'],
      wash: '#b97242', description: 'Crimson and golden leaves tumbling from the tree.'
    },
    winter: {
      name: 'Winter', symbol: null, density: 0, wind: .7,
      colors: ['#f6faf8'], wash: '#d8e8e7',
      description: 'Snow gathering on bare branches and falling in small clumps.'
    }
  };

  // Each bough has its own pivot. Foliage, snow and particle origins share that geometry.
  const boughs = [
    {
      name: 'left', pivot: [226, 463], flex: .62, phase: 0,
      wood: [
        ['M226 463 C183 436 148 390 125 337 C110 301 90 266 54 233', 15],
        ['M148 387 C109 377 79 361 42 329', 7],
        ['M123 334 C140 304 148 271 143 232', 6],
        ['M96 281 C70 282 43 270 18 251 M143 268 L173 241', 3],
        ['M71 249 L73 209 M44 331 L20 300 M142 238 L125 213', 2]
      ],
      sprays: [[46, 233, 62, 37], [102, 278, 64, 40], [140, 231, 53, 35], [42, 326, 60, 34]],
      ledges: [
        { d: 'M47 229 Q70 245 87 266', point: [70, 246] },
        { d: 'M47 325 Q79 350 109 363', point: [81, 349] }
      ]
    },
    {
      name: 'crown', pivot: [227, 392], flex: .9, phase: .7,
      wood: [
        ['M227 392 C223 340 241 287 267 242 C287 208 296 162 326 130 C344 112 362 100 386 87', 14],
        ['M267 243 C235 224 217 195 208 159 C204 143 194 128 185 116', 7],
        ['M306 154 C341 161 372 145 400 123 L433 106', 6],
        ['M296 181 C277 159 273 132 276 104 M356 108 L351 76', 3],
        ['M216 180 L236 148 M278 129 L258 110 M399 125 L402 96 M383 89 L410 83', 2]
      ],
      sprays: [[187, 119, 58, 36], [220, 161, 60, 39], [275, 109, 65, 37], [341, 102, 69, 41], [399, 106, 67, 39]],
      ledges: [
        { d: 'M314 151 Q352 155 380 136', point: [351, 149] },
        { d: 'M277 229 Q290 203 295 182', point: [286, 208] }
      ]
    },
    {
      name: 'middle', pivot: [234, 395], flex: .82, phase: 1.2,
      wood: [
        ['M234 395 C278 351 308 295 350 267 C390 239 427 221 461 192 C485 172 507 153 540 146', 13],
        ['M352 265 C347 236 355 216 369 195 L388 163', 6],
        ['M430 216 C458 221 483 210 505 196 L529 187', 6],
        ['M497 169 C493 149 499 128 513 111 M538 147 L572 151', 3],
        ['M369 195 L351 175 M505 195 L501 176 M524 152 L541 126', 2]
      ],
      sprays: [[382, 170, 59, 37], [444, 210, 66, 37], [512, 124, 62, 37], [549, 148, 66, 35], [526, 187, 65, 35]],
      ledges: [
        { d: 'M436 211 Q472 213 502 194', point: [473, 205] },
        { d: 'M502 161 Q523 147 551 145', point: [527, 148] }
      ]
    },
    {
      name: 'right', pivot: [213, 457], flex: 1.04, phase: 1.8,
      wood: [
        ['M213 457 C274 435 311 401 347 371 C396 330 444 321 491 304 C535 288 577 276 619 271', 17],
        ['M346 372 C357 338 376 312 399 287 L421 257', 7],
        ['M477 308 C486 276 507 254 528 235 L543 212', 7],
        ['M570 281 C590 299 618 304 645 302 M615 272 L646 253', 5],
        ['M397 289 L378 268 M525 240 L511 217 M618 300 L628 281 M592 276 L596 250', 2.5]
      ],
      sprays: [[414, 259, 58, 35], [477, 305, 68, 39], [535, 222, 62, 38], [590, 270, 66, 37], [639, 294, 54, 33]],
      ledges: [
        { d: 'M378 344 Q416 327 454 317', point: [416, 329] },
        { d: 'M523 286 Q570 269 616 266', point: [569, 274] },
        { d: 'M580 285 Q609 303 641 298', point: [611, 298] }
      ]
    }
  ];

  function element(name, attributes = {}) {
    const node = document.createElementNS(ns, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function taperedBranch(d, width) {
    const guide = element('path', { d });
    const length = guide.getTotalLength();
    const sides = [[], []];
    for (let i = 0; i <= 36; i += 1) {
      const distance = length * i / 36;
      const point = guide.getPointAtLength(distance);
      const before = guide.getPointAtLength(Math.max(0, distance - 1));
      const after = guide.getPointAtLength(Math.min(length, distance + 1));
      const dx = after.x - before.x;
      const dy = after.y - before.y;
      const magnitude = Math.hypot(dx, dy) || 1;
      const radius = width * (.5 - .44 * i / 36);
      sides[0].push(`${(point.x - dy / magnitude * radius).toFixed(2)} ${(point.y + dx / magnitude * radius).toFixed(2)}`);
      sides[1].push(`${(point.x + dy / magnitude * radius).toFixed(2)} ${(point.y - dx / magnitude * radius).toFixed(2)}`);
    }
    return element('path', { d: `M${sides[0].join('L')}L${sides[1].reverse().join('L')}Z`, fill: 'url(#tree-bark)', stroke: 'none' });
  }

  svg.innerHTML = `<defs>
    <linearGradient id="tree-bark" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#3d4940"/><stop offset=".45" stop-color="#77644c"/><stop offset="1" stop-color="#4f5140"/>
    </linearGradient>
    <radialGradient id="tree-ground"><stop stop-color="#63775a" stop-opacity=".33"/><stop offset="1" stop-color="#63775a" stop-opacity="0"/></radialGradient>
    <g id="tree-blossom"><path d="M0-6C3-12 10-7 6-2C13-2 12 6 5 6C7 13-2 14-3 7C-9 13-14 5-8 1C-15-3-8-10-3-6L-1-2Z"/><circle r="1.5" fill="#aa6b64" opacity=".65"/></g>
    <g id="tree-leaf"><path d="M-7 2Q-2-9 9-4Q7 5-7 2Z"/><path d="M-6 2L6-2" fill="none" stroke="#e4dfaa" stroke-width=".55" opacity=".35"/></g>
    <g id="tree-maple"><path d="M0 7L-2 3L-8 3L-5 0L-9-4L-4-3L-3-8L0-5L3-11L5-5L9-6L7-1L11 1L5 3L2 7Z"/><path d="M1 9L1-5M1 3L-5-2M1 3L6-2" fill="none" stroke="#713e2b" stroke-width=".65" opacity=".45"/></g>
    <path id="tree-wash" d="M-63 9C-79-6-55-32-35-31C-33-49-1-49 10-35C34-48 62-28 58-14C86-8 72 22 51 25C34 44 8 34-2 38C-27 47-56 33-51 22C-69 29-80 15-63 9Z"/>
  </defs>
  <g class="tree-ledge">
    <ellipse cx="211" cy="659" rx="184" ry="23" fill="url(#tree-ground)"/>
    <path d="M61 670L96 641L151 645L184 628L227 644L282 640L331 656L349 680L74 684Z" fill="#aab29c"/>
    <path d="M96 641L151 645L169 671L74 684M184 628L195 650L169 671M227 644L225 671L282 640M282 640L300 668L349 680" fill="none" stroke="#7b8979" stroke-width="2" opacity=".7"/>
    <path d="M96 641Q125 628 151 645M224 644Q255 632 282 640" fill="none" stroke="#7d956d" stroke-width="8" stroke-linecap="round" opacity=".55"/>
    <path class="tree-ledge-snow" d="M96 641Q125 628 151 641M172 635L184 631L224 645M243 643Q262 637 282 640" fill="none" stroke="#f7faf7" stroke-width="9" stroke-linecap="round"/>
  </g>
  <g class="tree-trunk">
    <path d="M148 651C173 625 183 601 188 576C198 532 189 503 196 470C203 436 213 416 216 390L234 383C232 425 220 457 218 484C215 516 226 542 218 579C213 604 211 627 236 648C216 644 206 632 202 619C194 639 183 649 148 651Z" fill="url(#tree-bark)"/>
    <path d="M170 640C201 606 201 572 203 539C197 501 209 462 220 425M205 610L201 636" fill="none" stroke="#343e34" stroke-width="2.3" stroke-linecap="round" opacity=".5"/>
    <path d="M201 575Q215 548 209 512M210 479L225 394M194 608L183 635" fill="none" stroke="#b0a07a" stroke-width="1.7" stroke-linecap="round" opacity=".48"/>
  </g>`;

  const snowCaps = [];
  boughs.forEach((bough) => {
    const group = element('g', { class: 'tree-bough', 'data-bough': bough.name });
    group.style.transformOrigin = `${bough.pivot[0]}px ${bough.pivot[1]}px`;
    const wood = element('g', { fill: 'none', stroke: '#5a5944', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    bough.wood.forEach(([d, width]) => {
      if (width > 5) wood.append(taperedBranch(d, width));
      else wood.append(element('path', { d, 'stroke-width': width }));
      if (width > 6) wood.append(element('path', { d, 'stroke-width': .8, stroke: '#9f8c68', opacity: .4 }));
    });
    bough.foliage = element('g', { class: 'tree-foliage' });
    group.append(wood, bough.foliage);
    bough.ledges.forEach((ledge, index) => {
      const cap = element('path', { d: ledge.d, fill: 'none', stroke: '#f3f7f4', 'stroke-linecap': 'round', 'stroke-width': 0, opacity: 0 });
      group.append(cap);
      snowCaps.push({ ...ledge, node: cap, group, amount: .32 + index * .12, speed: .035 + snowCaps.length * .003, cooldown: 0 });
    });
    bough.group = group;
    svg.append(group);
  });

  // Deterministic canopy: changing a season keeps the same tree and branch locations.
  function seededRandom(seed) {
    return () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  let selection = 'auto';
  try { selection = localStorage.getItem(storageKey) || 'auto'; } catch { /* Optional storage. */ }
  if (selection !== 'auto' && !Object.hasOwn(themes, selection)) selection = 'auto';
  picker.value = selection;
  let season = '';
  let theme = themes.autumn;
  let emitters = [];
  let particles = [];
  let elapsed = 0;
  let lastTime = 0;
  let nextEmission = 0;
  let nextAmbient = 0;
  let frameId = 0;
  let inView = false;
  let suspended = false;
  let reduced = root.classList.contains('reduce-motion') ||
    (!root.classList.contains('motion-enabled') && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let drops = 0;
  let lastDrop = 0;

  function currentSeason() {
    const month = new Date().getMonth();
    return month >= 2 && month <= 4 ? 'spring' : month >= 5 && month <= 7 ? 'summer' : month >= 8 && month <= 10 ? 'autumn' : 'winter';
  }

  function setBackground() {
    if (!background) return;
    const selected = season;
    const appearance = root.dataset.appearance === 'night' ? 'night' : 'day';
    const file = `season-${selected}${appearance === 'night' ? '-night' : ''}.webp`;
    const url = window.ADITUSAN_ASSET_URLS?.[file] || `./assets/${file}`;
    const request = ++backgroundRequest;
    const image = new Image();
    image.src = url;
    image.decode().then(() => {
      if (request !== backgroundRequest) return;
      background.src = url;
      background.dataset.season = selected;
      background.dataset.appearance = appearance;
    }).catch(() => { /* Keep the last complete illustration if an image cannot load. */ });
  }

  function fillCanopy() {
    emitters = [];
    const random = seededRandom(52026);
    boughs.forEach((bough) => {
      bough.foliage.replaceChildren();
      bough.sprayNodes = [];
      bough.sprays.forEach(([cx, cy, rx, ry], sprayIndex) => {
        const spray = element('g', { class: 'tree-spray' });
        spray.style.transformOrigin = `${cx}px ${cy}px`;
        if (theme.symbol) {
          const wash = element('use', { href: '#tree-wash', x: cx, y: cy, fill: theme.wash, opacity: season === 'spring' ? .24 : .18 });
          wash.setAttribute('transform', `translate(${cx} ${cy}) scale(${rx / 65} ${ry / 41}) translate(${-cx} ${-cy})`);
          spray.append(wash);
          const count = Math.round(26 * theme.density);
          for (let i = 0; i < count; i += 1) {
            const angle = random() * Math.PI * 2;
            const distance = Math.sqrt(random());
            const x = cx + Math.cos(angle) * distance * rx;
            const y = cy + Math.sin(angle) * distance * ry;
            const scale = .48 + random() * .5;
            const rotation = random() * 170 - 85;
            const color = theme.colors[Math.floor(random() * theme.colors.length)];
            spray.append(element('use', { href: `#${theme.symbol}`, fill: color, opacity: .72 + random() * .27, transform: `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${rotation.toFixed(1)}) scale(${scale.toFixed(2)})` }));
            emitters.push({ x, y, group: spray, color });
          }
        }
        spray.dataset.phase = String(sprayIndex * .8 + bough.phase);
        bough.foliage.append(spray);
        bough.sprayNodes.push(spray);
      });
    });
  }

  function clearCanvas() {
    if (context) context.clearRect(0, 0, width, height);
  }

  function paintCaps() {
    snowCaps.forEach((cap) => {
      const visible = season === 'winter';
      cap.node.setAttribute('stroke-width', visible ? (1 + cap.amount * 10).toFixed(2) : '0');
      cap.node.setAttribute('opacity', visible ? '.97' : '0');
    });
  }

  function staticTree() {
    boughs.forEach((bough) => {
      bough.group.style.transform = '';
      bough.sprayNodes.forEach((spray) => { spray.style.transform = ''; });
    });
    if (season === 'winter' && reduced) snowCaps.forEach((cap) => { cap.amount = .85; });
    paintCaps();
    clearCanvas();
  }

  function resize() {
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5, 2000 / Math.max(1, width));
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    if (context) context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  function stop() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = 0;
    scene.dataset.motion = reduced ? 'reduced' : 'paused';
    canvas.dataset.motion = reduced ? 'reduced' : 'paused';
  }

  function start() {
    if (frameId || reduced || document.hidden || suspended) return;
    scene.dataset.motion = inView ? 'running' : 'paused';
    canvas.dataset.motion = 'running';
    frameId = requestAnimationFrame(tick);
  }

  function chooseSeason() {
    const automatic = currentSeason();
    picker.querySelector('[value="auto"]').textContent = `Auto · ${themes[automatic].name}`;
    const next = selection === 'auto' ? automatic : selection;
    if (next === season) return;
    stop();
    season = next;
    theme = themes[season];
    root.dataset.season = season;
    scene.dataset.season = season;
    canvas.dataset.season = season;
    status.textContent = `${theme.name}. ${theme.description}`;
    particles = [];
    elapsed = 0;
    nextEmission = .3;
    nextAmbient = .5;
    drops = 0;
    lastDrop = 0;
    scene.dataset.snowDrops = '0';
    snowCaps.forEach((cap, i) => { cap.amount = .32 + (i % 3) * .12; cap.cooldown = 0; });
    fillCanopy();
    setBackground();
    staticTree();
    seedAmbient();
    start();
  }

  function branchPoint(group, x, y) {
    const matrix = group.getScreenCTM();
    if (!matrix) return null;
    return { x: matrix.a * x + matrix.c * y + matrix.e, y: matrix.b * x + matrix.d * y + matrix.f };
  }

  function addParticle(kind, point, color) {
    if (!context || !point || particles.length >= (width < 700 ? 44 : 72)) return;
    const particle = {
      kind, x: point.x, y: point.y, color,
      size: kind === 'clump' ? 3 + Math.random() * 3 : kind === 'snow' ? 1 + Math.random() * 1.8 : 3 + Math.random() * 2,
      vx: kind === 'breeze' ? 65 + Math.random() * 40 : -5 + Math.random() * 15,
      vy: kind === 'clump' ? 22 : kind === 'breeze' ? .5 : kind === 'snow' ? 19 + Math.random() * 18 : 20 + Math.random() * 15,
      angle: kind === 'breeze' ? 0 : Math.random() * Math.PI * 2, spin: kind === 'breeze' ? 0 : (Math.random() - .5) * 2,
      age: 0, life: kind === 'snow' ? 32 : kind === 'clump' ? 6 : 18,
      phase: Math.random() * Math.PI * 2
    };
    particles.push(particle);
    return particle;
  }

  function ambientParticle(point) {
    const kind = season === 'winter' ? 'snow' : season === 'spring' ? 'petal' : season === 'summer' ? 'breeze' : 'leaf';
    const position = point || (kind === 'breeze' ? { x: -60, y: 60 + Math.random() * (height - 120) } : { x: Math.random() * width, y: -15 });
    const color = kind === 'breeze' ? '#64816e' : theme.colors[Math.floor(Math.random() * theme.colors.length)];
    return addParticle(kind, position, color);
  }

  function seedAmbient() {
    if (reduced) return;
    const count = season === 'summer' ? 5 : season === 'winter' ? (width < 700 ? 16 : 24) : (width < 700 ? 9 : 14);
    for (let i = 0; i < count; i += 1) {
      const particle = ambientParticle({ x: Math.random() * width, y: 35 + Math.random() * (height - 80) });
      if (particle) particle.age = .5;
    }
  }

  function emitFromTree() {
    if (!emitters.length) return;
    // Only visible parts of the actual canopy shed particles.
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const source = emitters[Math.floor(Math.random() * emitters.length)];
      const point = branchPoint(source.group, source.x, source.y);
      if (point && point.x > 4 && point.x < width - 4 && point.y > 0 && point.y < height - 30) {
        addParticle(season === 'spring' ? 'petal' : 'leaf', point, source.color);
        break;
      }
    }
  }

  function updateSnow(dt, gust) {
    snowCaps.forEach((cap) => {
      cap.amount = Math.min(1, cap.amount + cap.speed * dt);
      cap.cooldown = Math.max(0, cap.cooldown - dt);
    });
    if (inView && gust > .72 && elapsed > 3 && elapsed - lastDrop > 2.4) {
      const eligible = snowCaps.filter((cap) => cap.amount > .74 && !cap.cooldown);
      const cap = eligible.find((item) => {
        const point = branchPoint(item.group, ...item.point);
        return point && point.x > 10 && point.x < width - 10 && point.y > 0 && point.y < height - 10;
      });
      if (cap) {
        const point = branchPoint(cap.group, ...cap.point);
        for (let i = 0; i < 3; i += 1) addParticle('clump', { x: point.x + i * 5, y: point.y + 2 }, '#f6faf8');
        cap.amount = .12;
        cap.cooldown = 8;
        drops += 1;
        lastDrop = elapsed;
        scene.dataset.snowDrops = String(drops);
      }
    }
    if (inView) paintCaps();
  }

  function drawParticle(particle, dt, wind) {
    const p = particle;
    p.age += dt;
    p.vy += dt * (p.kind === 'clump' ? 85 : p.kind === 'snow' || p.kind === 'breeze' ? 0 : 1.6);
    p.x += (p.vx + wind * (p.kind === 'snow' ? 15 : 30) + Math.sin(p.age * 1.6 + p.phase) * 9) * dt;
    p.y += p.vy * dt;
    p.angle += p.spin * dt;
    const fadeIn = p.kind === 'clump' ? 1 : Math.min(1, p.age / .3);
    const fadeOut = Math.min(1, Math.max(0, (p.life - p.age) / 1.5), Math.max(0, (height - p.y) / 50));
    context.save();
    context.globalAlpha = fadeIn * fadeOut * (p.kind === 'breeze' ? .22 : p.kind === 'snow' ? .72 : .8);
    context.translate(p.x, p.y);
    context.rotate(p.angle);
    context.fillStyle = p.color;
    context.beginPath();
    const r = p.size;
    if (p.kind === 'breeze') {
      context.strokeStyle = p.color;
      context.lineWidth = .8;
      context.moveTo(-r * 13, 0);
      context.bezierCurveTo(-r * 5, -r * 2, r * 2, r * 2, r * 10, 0);
      context.stroke();
    } else if (p.kind === 'petal') {
      context.moveTo(0, -r);
      context.bezierCurveTo(r * 1.6, -r, r * 1.4, r * 1.3, 0, r * 1.7);
      context.bezierCurveTo(-r * 1.3, r * .5, -r * 1.2, -r * .8, 0, -r);
    } else if (p.kind === 'leaf') {
      const points = [[0, -1.7], [.35, -.65], [.95, -.9], [.7, -.2], [1.3, .2], [.45, .45], [.12, 1.15], [-.2, .45], [-.95, .5], [-.65, -.1], [-1, -.7], [-.3, -.5]];
      points.forEach(([x, y], index) => { if (!index) context.moveTo(x * r, y * r); else context.lineTo(x * r, y * r); });
      context.closePath();
    } else {
      context.arc(0, 0, r, 0, Math.PI * 2);
      if (p.kind === 'clump') { context.moveTo(r * 1.7, r * .2); context.arc(r * .7, r * .2, r * .7, 0, Math.PI * 2); }
    }
    if (p.kind !== 'breeze') context.fill();
    if (p.kind === 'snow' || p.kind === 'clump') {
      context.strokeStyle = 'rgba(105, 139, 149, .35)';
      context.lineWidth = .45;
      context.stroke();
    }
    context.restore();
  }

  function tick(now) {
    frameId = 0;
    if (reduced || document.hidden || suspended) { stop(); return; }
    const clockDelta = lastTime ? Math.max(0, (now - lastTime) / 1000) : 0;
    const dt = Math.min(clockDelta, .05);
    lastTime = now;
    elapsed += clockDelta;
    const gust = Math.pow((1 + Math.sin(elapsed * .58 - 1)) / 2, 5);
    const wind = .18 + Math.sin(elapsed * .46) * .26 + Math.sin(elapsed * .91) * .09 + gust * .9;
    if (inView) boughs.forEach((bough) => {
      const bend = (wind + Math.sin(elapsed * .8 - bough.phase) * .12) * bough.flex * theme.wind;
      bough.group.style.transform = `rotate(${bend.toFixed(3)}deg)`;
      bough.sprayNodes.forEach((spray) => {
        const phase = Number(spray.dataset.phase);
        const flutter = (wind * 1.6 + Math.sin(elapsed * 1.8 + phase) * .45) * theme.wind;
        spray.style.transform = `rotate(${flutter.toFixed(3)}deg)`;
      });
    });
    clearCanvas();
    if (inView && (season === 'spring' || season === 'autumn') && elapsed >= nextEmission) {
      emitFromTree();
      if (gust > .6) emitFromTree();
      nextEmission = elapsed + .32 + Math.random() * .55;
    }
    if (elapsed >= nextAmbient) {
      ambientParticle();
      nextAmbient = elapsed + (season === 'summer' ? 2.2 : season === 'winter' ? (width < 700 ? .65 : .4) : (width < 700 ? .8 : .55));
    }
    if (season === 'winter') {
      updateSnow(clockDelta, gust);
    }
    if (context) {
      particles.forEach((particle) => drawParticle(particle, dt, wind));
      particles = particles.filter((particle) => particle.age < particle.life && particle.y < height + 20 && particle.x > -80 && particle.x < width + 80);
    }
    frameId = requestAnimationFrame(tick);
  }

  picker.addEventListener('change', () => {
    selection = picker.value;
    try { localStorage.setItem(storageKey, selection); } catch { /* Keep selection for this visit. */ }
    chooseSeason();
  });
  window.addEventListener('aditusan:appearancechange', setBackground);
  window.addEventListener('aditusan:motionchange', (event) => {
    reduced = event.detail.reduced;
    stop();
    particles = [];
    if (reduced) staticTree();
    else start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else { chooseSeason(); start(); }
  });
  window.addEventListener('pagehide', () => { suspended = true; stop(); });
  window.addEventListener('pageshow', () => { suspended = false; chooseSeason(); start(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRect.height > 0;
      scene.dataset.motion = reduced ? 'reduced' : inView && !document.hidden ? 'running' : 'paused';
    });
    observer.observe(garden);
  } else {
    inView = true;
  }
  window.addEventListener('resize', resize, { passive: true });
  // Also handle a month changing while a visitor leaves the page open.
  setInterval(() => { if (!document.hidden && selection === 'auto') chooseSeason(); }, 60000);
  resize();
  chooseSeason();
  scene.classList.add('is-ready');
})();
