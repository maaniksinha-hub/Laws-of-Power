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
  <defs><linearGradient id="${id}bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h} 45% 88%)"/><stop offset="1" stop-color="hsl(${h} 35% 72%)"/></linearGradient><clipPath id="${id}c"><circle cx="60" cy="60" r="60"/></clipPath></defs>
  <g clip-path="url(#${id}c)">
  <rect width="120" height="120" fill="url(#${id}bg)"/>
  <path d="M10 124 Q12 94 30 90 Q46 84 48 84 L72 84 Q74 84 90 90 Q108 94 110 124Z" fill="${outfit}"/>
  <path d="M48 84 L60 100 L72 84 L66 80 L54 80Z" fill="#f4f6f9"/>
  <rect x="53" y="68" width="14" height="18" rx="5" fill="${skin}" opacity=".95"/>
  ${tie}${badge}
  ${behind ? HAIR_STYLES[style](hair) : ''}
  ${face}
  ${stubble}
  ${behind ? '' : (HAIR_STYLES[style] || HAIR_STYLES.short)(hair)}
  <path class="brows" d="${BROWS[ex]}" stroke="rgba(25,18,14,.7)" stroke-width="2" stroke-linecap="round" fill="none"/>
  ${shades || `<ellipse cx="52" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/><ellipse cx="68" cy="52" rx="2.3" ry="${eyeRy}" fill="rgba(25,18,14,.8)"/>`}
  ${glasses}
  <path class="mouth" d="${MOUTHS[ex]}" stroke="rgba(25,18,14,.55)" stroke-width="2" stroke-linecap="round" fill="${ex === 'afraid' ? 'rgba(25,18,14,.5)' : 'none'}"/>
  ${headset}
  </g></svg>`;
}
export const portraitSVG = avatarSVG;

// Office scenes (wide band). Muted so the avatar and text stay in front.
const SCENES = {
  skyline: () => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9db7d8"/><stop offset=".7" stop-color="#f1d6b8"/><stop offset="1" stop-color="#f6e7d2"/></linearGradient></defs><rect width="240" height="100" fill="url(#sk)"/><g fill="#52688a" opacity=".85"><rect x="6" y="40" width="26" height="60"/><rect x="38" y="22" width="22" height="78"/><rect x="66" y="50" width="30" height="50"/><rect x="104" y="30" width="24" height="70"/><rect x="134" y="46" width="32" height="54"/><rect x="172" y="18" width="24" height="82"/><rect x="202" y="44" width="34" height="56"/></g><g fill="#ffe9a8" opacity=".9"><rect x="44" y="32" width="4" height="4"/><rect x="52" y="44" width="4" height="4"/><rect x="110" y="42" width="4" height="4"/><rect x="178" y="30" width="4" height="4"/><rect x="186" y="46" width="4" height="4"/><rect x="142" y="60" width="4" height="4"/></g><rect y="86" width="240" height="14" fill="#3b4d68"/>`,
  boardroom: () => `<rect width="240" height="100" fill="#dfe6ee"/><rect x="16" y="10" width="208" height="46" fill="#b9cbe0"/><path d="M16 56 L60 30 L110 56 L160 24 L224 56Z" fill="#8fa8c4" opacity=".6"/><path d="M60 10 V56 M120 10 V56 M180 10 V56" stroke="#dfe6ee" stroke-width="3"/><ellipse cx="120" cy="76" rx="96" ry="16" fill="#5b4636"/><ellipse cx="120" cy="72" rx="96" ry="14" fill="#7c5f48"/><g fill="#33404f"><rect x="40" y="82" width="16" height="12" rx="4"/><rect x="82" y="86" width="16" height="12" rx="4"/><rect x="142" y="86" width="16" height="12" rx="4"/><rect x="184" y="82" width="16" height="12" rx="4"/></g>`,
  openplan: () => `<rect width="240" height="100" fill="#e6ecf2"/><g fill="#cdd7e2"><rect x="0" y="0" width="240" height="16"/></g><g fill="#fff" stroke="#b7c3d1"><rect x="14" y="56" width="62" height="10" rx="2"/><rect x="92" y="56" width="62" height="10" rx="2"/><rect x="170" y="56" width="62" height="10" rx="2"/></g><g fill="#27384d"><rect x="28" y="36" width="30" height="20" rx="2"/><rect x="106" y="36" width="30" height="20" rx="2"/><rect x="184" y="36" width="30" height="20" rx="2"/></g><g fill="#6fa3e8" opacity=".8"><rect x="31" y="39" width="24" height="14"/><rect x="109" y="39" width="24" height="14"/><rect x="187" y="39" width="24" height="14"/></g><g fill="#6aa584"><circle cx="82" cy="46" r="7"/><circle cx="160" cy="46" r="7"/></g><rect y="86" width="240" height="14" fill="#c3cfdb"/>`,
  stage: () => `<rect width="240" height="100" fill="#1b2a42"/><rect x="40" y="10" width="160" height="56" rx="3" fill="#f3f6fa"/><g fill="#2f6fe0"><rect x="64" y="40" width="14" height="18"/><rect x="84" y="32" width="14" height="26"/><rect x="104" y="24" width="14" height="34"/><rect x="124" y="30" width="14" height="28"/><rect x="144" y="20" width="14" height="38"/></g><rect x="60" y="18" width="70" height="4" fill="#ffd84d"/><rect x="104" y="70" width="32" height="30" rx="3" fill="#0f1a2b"/><g fill="#0f1a2b" opacity=".7"><circle cx="20" cy="94" r="8"/><circle cx="46" cy="98" r="8"/><circle cx="200" cy="96" r="8"/><circle cx="224" cy="94" r="8"/></g>`,
  server: () => `<rect width="240" height="100" fill="#18222f"/><g fill="#243447" stroke="#33465c"><rect x="14" y="8" width="42" height="92"/><rect x="66" y="8" width="42" height="92"/><rect x="118" y="8" width="42" height="92"/><rect x="170" y="8" width="42" height="92"/></g><g fill="#4ee0a1"><rect x="20" y="18" width="4" height="3"/><rect x="20" y="38" width="4" height="3"/><rect x="72" y="28" width="4" height="3"/><rect x="124" y="48" width="4" height="3"/><rect x="176" y="22" width="4" height="3"/></g><g fill="#ffd84d"><rect x="28" y="18" width="4" height="3"/><rect x="80" y="58" width="4" height="3"/><rect x="132" y="28" width="4" height="3"/><rect x="184" y="68" width="4" height="3"/></g><g fill="#e05a5a"><rect x="28" y="38" width="4" height="3"/><rect x="190" y="22" width="4" height="3"/></g>`,
  garage: () => `<rect width="240" height="100" fill="#4a5461"/><g fill="#6a7482"><rect x="30" y="0" width="22" height="100"/><rect x="130" y="0" width="22" height="100"/></g><g fill="#ffd84d"><path d="M30 60 h22 l-22 12Z M30 74 h22 l-22 12Z"/></g><rect y="82" width="240" height="18" fill="#343c47"/><g fill="#1c242e"><rect x="70" y="62" width="48" height="20" rx="8"/><rect x="170" y="60" width="52" height="22" rx="9"/></g><g fill="#ffe9a8"><rect x="112" y="68" width="5" height="4"/><rect x="170" y="68" width="5" height="4"/></g>`,
};
export const THEME_SCENE = { ambition: 'skyline', reputation: 'stage', loyalty: 'openplan', secrets: 'garage', rivalry: 'boardroom', negotiation: 'boardroom', fear: 'server', scarcity: 'openplan', revenge: 'garage', opportunity: 'skyline', timing: 'server' };

export function sceneSVG(scene = 'openplan') {
  const draw = SCENES[scene] || SCENES.openplan;
  return `<svg class="scene-svg" viewBox="0 0 240 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${draw()}</svg>`;
}
