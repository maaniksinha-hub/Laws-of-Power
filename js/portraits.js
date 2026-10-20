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

const BG = ['#E9F9EE', '#FFEFEF', '#FFF2D6', '#F4F3FF', '#C2D6FF'];
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
  <g stroke="#0E1116" stroke-width="2.2" stroke-linejoin="round"><path d="M10 124 Q12 94 30 90 Q46 84 48 84 L72 84 Q74 84 90 90 Q108 94 110 124Z" fill="${outfit}"/>
  <path d="M48 84 L60 100 L72 84 L66 80 L54 80Z" fill="#f4f6f9"/>
  <rect x="53" y="68" width="14" height="18" rx="5" fill="${skin}"/></g>
  ${tie}${badge}
  <g stroke="#0E1116" stroke-width="2.2" stroke-linejoin="round">${behind ? HAIR_STYLES[style](hair) : ''}
  ${face}</g>
  ${stubble}
  <g stroke="#0E1116" stroke-width="2.2" stroke-linejoin="round">${behind ? '' : (HAIR_STYLES[style] || HAIR_STYLES.short)(hair)}</g>
  <path class="brows" d="${BROWS[ex]}" stroke="rgba(25,18,14,.7)" stroke-width="2" stroke-linecap="round" fill="none"/>
  ${shades || `<ellipse cx="52" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/><ellipse cx="68" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/>`}
  ${glasses}
  <path class="mouth" d="${MOUTHS[ex]}" stroke="rgba(25,18,14,.55)" stroke-width="2" stroke-linecap="round" fill="${ex === 'afraid' ? 'rgba(25,18,14,.5)' : 'none'}"/>
  ${headset}
  </g></svg>`;
}
export const portraitSVG = avatarSVG;

// Design-team scenes (wide band): hand-drawn line art on a soft tint. A scene shows where the message comes from.
const K = 'stroke="#0E1116" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"';
const SCENES = {
  canvas: () => `<rect width="240" height="100" fill="#B4DFC4"/><g ${K}><rect x="22" y="22" width="52" height="62" rx="4" fill="#fff"/><rect x="92" y="14" width="62" height="40" rx="4" fill="#fff"/><rect x="92" y="62" width="62" height="26" rx="4" fill="#F8A9AC"/><rect x="170" y="26" width="48" height="58" rx="4" fill="#fff"/></g><g fill="#005AD2" ${K}><rect x="30" y="30" width="36" height="20" rx="3"/></g><g ${K} fill="none"><path d="M30 60 H66 M30 70 H56"/><path d="M178 36 H210 M178 46 H202"/></g><path d="M196 62 L214 76 L205 77 L209 88 L203 90 L199 79 L193 84Z" fill="#FFB84D" ${K}/>`,
  crit: () => `<rect width="240" height="100" fill="#F8A9AC"/><g ${K}><rect x="20" y="14" width="64" height="48" rx="3" fill="#fff"/><rect x="100" y="10" width="64" height="52" rx="3" fill="#fff"/></g><g ${K}><rect x="176" y="14" width="26" height="26" fill="#FFB84D" transform="rotate(-6 189 27)"/><rect x="204" y="34" width="26" height="26" fill="#B4DFC4" transform="rotate(5 217 47)"/><rect x="178" y="48" width="26" height="26" fill="#B8B3F4" transform="rotate(3 191 61)"/></g><g fill="none" ${K}><path d="M30 28 H70 M30 38 H60"/><path d="M110 24 H154 M110 34 H146 M110 44 H150"/></g><path d="M20 74 H220" ${K}/><g fill="#0E1116"><circle cx="52" cy="88" r="6"/><circle cx="104" cy="88" r="6"/><circle cx="156" cy="88" r="6"/></g>`,
  handoff: () => `<rect width="240" height="100" fill="#C2D6FF"/><g ${K}><rect x="18" y="18" width="70" height="64" rx="4" fill="#fff"/><rect x="150" y="18" width="72" height="64" rx="4" fill="#0E1116"/></g><g fill="#FFB84D" ${K}><rect x="28" y="28" width="50" height="16" rx="3"/></g><g fill="none" ${K}><path d="M28 56 H70 M28 66 H58"/></g><g fill="none" stroke="#FFB84D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M166 40 L158 50 L166 60 M206 40 L214 50 L206 60 M188 36 L182 64"/></g><path d="M96 50 H142 M134 42 L144 50 L134 58" fill="none" ${K}/>`,
  research: () => `<rect width="240" height="100" fill="#B8B3F4"/><g ${K}><circle cx="64" cy="46" r="16" fill="#fff"/><path d="M34 88 Q34 66 64 66 Q94 66 94 88Z" fill="#FFB84D"/><circle cx="176" cy="46" r="16" fill="#fff"/><path d="M146 88 Q146 66 176 66 Q206 66 206 88Z" fill="#005AD2"/></g><g ${K}><path d="M92 18 H144 Q150 18 150 24 V36 Q150 42 144 42 H110 L100 50 V42 H92 Q86 42 86 36 V24 Q86 18 92 18Z" fill="#fff"/></g><g fill="none" ${K}><path d="M96 28 H140 M96 35 H124"/></g>`,
  roadmap: () => `<rect width="240" height="100" fill="#FFF2D6"/><path d="M16 62 H224" ${K}/><g ${K}><rect x="24" y="30" width="60" height="22" rx="11" fill="#B4DFC4"/><rect x="92" y="38" width="70" height="22" rx="11" fill="#F8A9AC"/><rect x="132" y="12" width="64" height="22" rx="11" fill="#fff"/></g><g fill="#005AD2" ${K}><circle cx="46" cy="62" r="6"/><circle cx="120" cy="62" r="6"/><circle cx="196" cy="62" r="6"/></g><g ${K}><path d="M196 62 V78 L216 84 L196 90" fill="#FFB84D"/></g>`,
  sprint: () => `<rect width="240" height="100" fill="#B4DFC4"/><g ${K}><rect x="14" y="12" width="68" height="78" rx="5" fill="#fff"/><rect x="86" y="12" width="68" height="78" rx="5" fill="#fff"/><rect x="158" y="12" width="68" height="78" rx="5" fill="#fff"/></g><g ${K}><rect x="22" y="24" width="52" height="16" rx="3" fill="#F8A9AC"/><rect x="22" y="46" width="52" height="16" rx="3" fill="#FFB84D"/><rect x="94" y="24" width="52" height="16" rx="3" fill="#B8B3F4"/><rect x="166" y="24" width="52" height="16" rx="3" fill="#005AD2"/><rect x="166" y="46" width="52" height="16" rx="3" fill="#C2D6FF"/></g>`,
  dark: () => `<rect width="240" height="100" fill="#2a3340"/><circle cx="200" cy="24" r="12" fill="#FFB84D" stroke="#0E1116" stroke-width="2.4"/><circle cx="206" cy="20" r="11" fill="#2a3340"/><g ${K}><rect x="62" y="26" width="116" height="52" rx="5" fill="#fff"/><path d="M48 84 H192 L184 78 H56Z" fill="#B4DFC4"/></g><g fill="#005AD2" ${K}><rect x="72" y="36" width="44" height="22" rx="3"/></g><g fill="none" ${K}><path d="M124 38 H168 M124 48 H156 M72 66 H150"/></g><g fill="#FFB84D"><circle cx="30" cy="30" r="2.4"/><circle cx="40" cy="62" r="2"/><circle cx="214" cy="70" r="2.4"/></g>`,
};
export const THEME_SCENE = { ambition: 'roadmap', reputation: 'crit', loyalty: 'canvas', secrets: 'dark', rivalry: 'sprint', negotiation: 'handoff', fear: 'dark', scarcity: 'sprint', revenge: 'dark', opportunity: 'research', timing: 'roadmap' };

export function sceneSVG(scene = 'openplan') {
  const draw = SCENES[scene] || SCENES.openplan;
  return `<svg class="scene-svg" viewBox="0 0 240 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${draw()}</svg>`;
}
