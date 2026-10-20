// Original flat avatars and office scenes drawn in SVG from a character's `look` data. No image files.
// A card shows a wide scene (the place where the message arrives) and a round avatar on top of it, like a profile page.
let uid = 0;

const SKINS = ['#f5d3b3', '#ecb98d', '#d39a6b', '#b27547', '#80512f', '#523420'];
const HAIR_STYLES = {
  short: c => `<path d="M40 49 Q38 27 60 26 Q82 27 80 49 Q74 38 60 37 Q46 38 40 49Z" fill="${c}"/>`,
  crop: c => `<path d="M41 47 Q40 30 60 29 Q80 30 79 47 Q70 39 60 39 Q50 39 41 47Z" fill="${c}"/>`,
  part: c => `<path d="M39 51 Q35 25 62 25 Q85 27 81 49 Q72 35 52 38 Q43 41 39 51Z" fill="${c}"/><path d="M52 38 Q58 30 66 28" stroke="rgba(0,0,0,.25)" stroke-width="1.5" fill="none"/>`,
  long: c => `<path d="M37 56 Q34 25 60 25 Q86 25 83 56 L86 90 L74 72 L74 46 Q60 35 46 46 L46 72 L34 90Z" fill="${c}"/>`,
  bob: c => `<path d="M37 58 Q33 25 60 24 Q87 25 83 58 L79 62 L77 44 Q60 33 43 44 L41 62Z" fill="${c}"/>`,
  bun: c => `<circle cx="60" cy="20" r="8" fill="${c}"/><path d="M40 49 Q38 28 60 27 Q82 28 80 49 Q72 38 60 38 Q48 38 40 49Z" fill="${c}"/>`,
  curly: c => `<g fill="${c}"><circle cx="42" cy="40" r="8"/><circle cx="50" cy="31" r="9"/><circle cx="62" cy="28" r="9"/><circle cx="73" cy="32" r="9"/><circle cx="80" cy="42" r="8"/></g>`,
  bald: () => '',
};

// Face shapes and expressions. The same hidden state that drives `attitude` drives the expression; a mask slips before it breaks.
const FACES = { round: { rx: 21, ry: 23, cy: 52 }, long: { rx: 18, ry: 26, cy: 53 }, square: { rx: 21, ry: 22, cy: 52, r: 7 } };
const BROWS = {
  neutral: 'M46 44 L56 43 M64 43 L74 44',
  warm: 'M46 43 Q51 40 56 42 M64 42 Q69 40 74 43',
  slip: 'M46 47 L56 43 M64 43 L74 44',
  wary: 'M46 41 L56 45 M64 45 L74 41',
  hostile: 'M45 40 L56 46 M64 46 L75 40',
  afraid: 'M46 44 Q51 38 56 40 M64 40 Q69 38 74 44',
};
const MOUTHS = {
  neutral: 'M54 64 H66', warm: 'M52 62 Q60 69 68 62', slip: 'M52 65 Q59 67 65 63 L68 60',
  wary: 'M55 65 H65', hostile: 'M52 67 Q60 60 68 67', afraid: 'M57 63 Q60 70 63 63 Z',
};

const BG = ['#ffc21a', '#ff5b1f', '#f4f1e8', '#9ad1f5', '#b9e39a'];
function hash(n) { let h = 2166136261; for (const ch of String(n)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }

export function avatarSVG(look = {}, { label = '', expression = 'neutral' } = {}) {
  const id = `a${++uid}`;
  const h = look.hue ?? 210;
  const skin = SKINS[(look.skin ?? 1 + (hash(h) % 5)) - 1] || SKINS[1];
  const outfit = look.outfit || `hsl(${h} 38% 30%)`;
  const hair = look.hair || '#2a2320';
  const f = FACES[look.face] || FACES.round;
  const ex = BROWS[expression] ? expression : 'neutral';
  const style = HAIR_STYLES[look.style] ? look.style : 'short';
  const behind = style === 'long' || style === 'bob';
  const face = f.r ? `<rect x="${60 - f.rx}" y="${f.cy - f.ry}" width="${f.rx * 2}" height="${f.ry * 2}" rx="${f.r + 8}" fill="${skin}"/>` : `<ellipse cx="60" cy="${f.cy}" rx="${f.rx}" ry="${f.ry}" fill="${skin}"/>`;
  const eyeRy = ex === 'afraid' ? 2.8 : ex === 'warm' ? 1.4 : 2;
  const glasses = look.glasses ? `<g fill="none" stroke="#1b2430" stroke-width="1.6"><circle cx="52" cy="52" r="6.5"/><circle cx="68" cy="52" r="6.5"/><path d="M58.5 52 H61.5"/></g>` : '';
  const shades = look.shades ? `<g fill="#111820"><rect x="43" y="47" width="15" height="9" rx="4"/><rect x="62" y="47" width="15" height="9" rx="4"/><rect x="57" y="50" width="6" height="2"/></g>` : '';
  const headset = look.headset ? `<path d="M38 50 Q38 22 60 22 Q82 22 82 50" fill="none" stroke="#1b2430" stroke-width="3"/><rect x="34" y="48" width="7" height="12" rx="3" fill="#1b2430"/><path d="M38 60 Q42 70 54 68" fill="none" stroke="#1b2430" stroke-width="2"/>` : '';
  const stubble = look.beard ? `<path d="M42 56 Q44 76 60 77 Q76 76 78 56 Q70 66 60 66 Q50 66 42 56Z" fill="${hair}" opacity=".85"/>` : '';
  const tie = look.tie ? `<path d="M57 86 L63 86 L65 96 L60 112 L55 96Z" fill="${look.tie}"/>` : '';
  const badge = look.badge ? `<path d="M52 86 L50 104 M68 86 L70 104" stroke="#e8edf3" stroke-width="1.5"/><rect x="45" y="104" width="10" height="13" rx="2" fill="#ffffff" stroke="#c4ccd6"/><rect x="47" y="106" width="6" height="5" fill="#2f6fe0"/>` : '';
  return `<svg class="avatar-svg expr-${ex}" viewBox="0 0 120 120" role="img" aria-label="${label ? `Photo of ${label}, looking ${ex === 'slip' ? 'friendly, but strained' : ex}` : 'Photo'}">
  <defs><clipPath id="${id}c"><circle cx="60" cy="60" r="60"/></clipPath></defs>
  <g clip-path="url(#${id}c)">
  <rect width="120" height="120" fill="${BG[hash(h) % BG.length]}"/>
  <g stroke="#111" stroke-width="2.5" stroke-linejoin="round"><path d="M10 124 Q12 94 30 90 Q46 84 48 84 L72 84 Q74 84 90 90 Q108 94 110 124Z" fill="${outfit}"/>
  <path d="M48 84 L60 100 L72 84 L66 80 L54 80Z" fill="#f4f6f9"/>
  <rect x="53" y="68" width="14" height="18" rx="5" fill="${skin}"/></g>
  ${tie}${badge}
  <g stroke="#111" stroke-width="2.5" stroke-linejoin="round">${behind ? HAIR_STYLES[style](hair) : ''}
  ${face}</g>
  ${stubble}
  <g stroke="#111" stroke-width="2.5" stroke-linejoin="round">${behind ? '' : (HAIR_STYLES[style] || HAIR_STYLES.short)(hair)}</g>
  <path class="brows" d="${BROWS[ex]}" stroke="rgba(25,18,14,.7)" stroke-width="2" stroke-linecap="round" fill="none"/>
  ${shades || `<ellipse cx="52" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/><ellipse cx="68" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/>`}
  ${glasses}
  <path class="mouth" d="${MOUTHS[ex]}" stroke="rgba(25,18,14,.55)" stroke-width="2" stroke-linecap="round" fill="${ex === 'afraid' ? 'rgba(25,18,14,.5)' : 'none'}"/>
  ${headset}
  </g></svg>`;
}
export const portraitSVG = avatarSVG;

// Office scenes (wide band): flat shapes, thick ink outlines, yellow / orange / paper colours.
const K = 'stroke="#111" stroke-width="2.5" stroke-linejoin="round"';
const SCENES = {
  skyline: () => `<rect width="240" height="100" fill="#ffc21a"/><circle cx="196" cy="30" r="16" fill="#ff5b1f" ${K}/><g ${K}><rect x="14" y="46" width="46" height="60" fill="#fff"/><rect x="66" y="24" width="40" height="82" fill="#111"/><rect x="112" y="52" width="50" height="54" fill="#fff"/><rect x="168" y="40" width="44" height="66" fill="#f4f1e8"/></g><g fill="#111"><rect x="24" y="58" width="8" height="8"/><rect x="42" y="58" width="8" height="8"/><rect x="24" y="76" width="8" height="8"/><rect x="124" y="64" width="8" height="8"/><rect x="144" y="64" width="8" height="8"/><rect x="180" y="52" width="8" height="8"/><rect x="196" y="52" width="8" height="8"/></g><g fill="#ffc21a"><rect x="78" y="36" width="8" height="8"/><rect x="92" y="36" width="8" height="8"/><rect x="78" y="56" width="8" height="8"/><rect x="92" y="76" width="8" height="8"/></g>`,
  boardroom: () => `<rect width="240" height="100" fill="#f4f1e8"/><rect x="16" y="8" width="208" height="46" fill="#9ad1f5" ${K}/><path d="M16 54 L70 24 L120 54 L170 20 L224 54Z" fill="#fff" ${K}/><path d="M80 8 V54 M150 8 V54" stroke="#111" stroke-width="2.5"/><rect x="30" y="62" width="180" height="16" fill="#ff5b1f" ${K}/><g fill="#111"><rect x="52" y="82" width="14" height="14"/><rect x="100" y="82" width="14" height="14"/><rect x="150" y="82" width="14" height="14"/></g>`,
  openplan: () => `<rect width="240" height="100" fill="#f4f1e8"/><rect y="0" width="240" height="14" fill="#ffc21a" stroke="#111" stroke-width="2.5"/><g ${K} fill="#fff"><rect x="14" y="56" width="62" height="12"/><rect x="92" y="56" width="62" height="12"/><rect x="170" y="56" width="58" height="12"/></g><g fill="#111"><rect x="30" y="34" width="30" height="22"/><rect x="108" y="34" width="30" height="22"/><rect x="184" y="34" width="30" height="22"/></g><g fill="#ff5b1f"><rect x="34" y="38" width="22" height="12"/></g><g fill="#ffc21a"><rect x="112" y="38" width="22" height="12"/><rect x="188" y="38" width="22" height="12"/></g><path d="M0 92 H240" stroke="#111" stroke-width="2.5"/>`,
  stage: () => `<rect width="240" height="100" fill="#111"/><rect x="34" y="10" width="172" height="58" fill="#fff" stroke="#ffc21a" stroke-width="3"/><g fill="#ff5b1f" stroke="#111" stroke-width="2"><rect x="60" y="42" width="18" height="20"/><rect x="90" y="32" width="18" height="30"/><rect x="120" y="22" width="18" height="40"/></g><rect x="150" y="26" width="38" height="8" fill="#ffc21a"/><rect x="150" y="40" width="30" height="6" fill="#111"/><rect x="100" y="76" width="40" height="24" fill="#ffc21a" ${K}/>`,
  server: () => `<rect width="240" height="100" fill="#2b2b2b"/><g fill="#111" stroke="#ffc21a" stroke-width="2.5"><rect x="14" y="8" width="44" height="96"/><rect x="68" y="8" width="44" height="96"/><rect x="122" y="8" width="44" height="96"/><rect x="176" y="8" width="50" height="96"/></g><g fill="#ffc21a"><rect x="22" y="20" width="10" height="6"/><rect x="22" y="40" width="10" height="6"/><rect x="76" y="30" width="10" height="6"/><rect x="130" y="50" width="10" height="6"/><rect x="184" y="24" width="10" height="6"/></g><g fill="#ff5b1f"><rect x="40" y="20" width="10" height="6"/><rect x="94" y="62" width="10" height="6"/><rect x="148" y="30" width="10" height="6"/><rect x="204" y="64" width="10" height="6"/></g>`,
  garage: () => `<rect width="240" height="100" fill="#ff5b1f"/><path d="M0 100 L90 0 H130 L40 100Z M110 100 L200 0 H240 V30 L170 100Z" fill="#111" opacity=".9"/><rect x="92" y="34" width="56" height="66" fill="#f4f1e8" ${K}/><circle cx="136" cy="68" r="4" fill="#111"/><rect x="104" y="44" width="32" height="14" fill="#ffc21a" stroke="#111" stroke-width="2.5"/>`,
};
export const THEME_SCENE = { ambition: 'skyline', reputation: 'stage', loyalty: 'openplan', secrets: 'garage', rivalry: 'boardroom', negotiation: 'boardroom', fear: 'server', scarcity: 'openplan', revenge: 'garage', opportunity: 'skyline', timing: 'server' };

export function sceneSVG(scene = 'openplan') {
  const draw = SCENES[scene] || SCENES.openplan;
  return `<svg class="scene-svg" viewBox="0 0 240 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${draw()}</svg>`;
}
