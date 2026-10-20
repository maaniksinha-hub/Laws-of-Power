// Original CSS/SVG silhouette portraits generated from a character's `look` data. No external images.
let uid = 0;

const HATS = {
  crown: (h, a) => `<path d="M72 52 L78 30 L92 44 L100 24 L108 44 L122 30 L128 52 Z" fill="${a}" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/><circle cx="100" cy="26" r="3" fill="#8a1c1c"/>`,
  helm: (h, a) => `<path d="M70 62 Q70 28 100 28 Q130 28 130 62 L130 68 L70 68 Z" fill="${a}" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/><rect x="97" y="40" width="6" height="34" fill="rgba(0,0,0,.35)"/><path d="M100 28 Q112 12 126 20 Q112 22 106 32 Z" fill="hsl(${h} 45% 35%)"/>`,
  coif: (h, a) => `<path d="M71 66 Q68 34 100 32 Q132 34 129 66 Q118 52 100 52 Q82 52 71 66 Z" fill="hsl(${h} 25% 16%)"/><path d="M129 66 Q138 78 130 96 Q126 80 122 70 Z" fill="hsl(${h} 25% 16%)"/>`,
  cap: (h, a) => `<ellipse cx="100" cy="46" rx="34" ry="12" fill="hsl(${h} 30% 20%)"/><path d="M72 48 Q100 24 128 48 Z" fill="hsl(${h} 30% 24%)"/><circle cx="120" cy="38" r="3" fill="${a}"/>`,
  hood: (h, a) => `<path d="M62 100 Q56 40 100 30 Q144 40 138 100 L120 100 Q124 60 100 56 Q76 60 80 100 Z" fill="hsl(${h} 20% 14%)" stroke="rgba(255,255,255,.06)"/>`,
  mitre: (h, a) => `<path d="M78 56 L100 6 L122 56 Z" fill="hsl(${h} 25% 78%)" stroke="rgba(0,0,0,.35)"/><path d="M100 12 L100 52" stroke="${a}" stroke-width="3"/><path d="M84 52 H116" stroke="${a}" stroke-width="3"/>`,
  veil: (h, a) => `<path d="M64 40 Q100 20 136 40 L146 110 L54 110 Z" fill="hsl(${h} 12% 55% / .45)" stroke="rgba(255,255,255,.18)"/><path d="M76 38 Q100 30 124 38" stroke="${a}" stroke-width="3" fill="none"/>`,
  turban: (h, a) => `<ellipse cx="100" cy="46" rx="34" ry="19" fill="hsl(${h} 45% 40%)"/><path d="M68 46 Q100 64 132 46" stroke="rgba(0,0,0,.3)" stroke-width="2" fill="none"/><path d="M72 38 Q100 56 128 36" stroke="rgba(255,255,255,.25)" stroke-width="2" fill="none"/><circle cx="100" cy="34" r="4" fill="${a}"/>`,
  none: (h) => `<path d="M72 60 Q74 36 100 34 Q126 36 128 60 Q116 46 100 46 Q84 46 72 60 Z" fill="hsl(${h} 20% 18%)"/>`,
};

// Scene backdrops: the place the conversation happens, drawn behind the speaker. `h` tints them to the speaker.
const SCENES = {
  throne: h => `<path d="M0 150 V30 Q0 6 24 6 H30 V150 Z M200 150 V30 Q200 6 176 6 H170 V150 Z" fill="rgba(0,0,0,.42)"/><path d="M52 150 V58 Q100 -6 148 58 V150" fill="none" stroke="rgba(217,185,112,.22)" stroke-width="2"/><path d="M78 0 V22 L88 34 L98 22 V0 M102 0 V22 L112 34 L122 22 V0" fill="hsl(${h} 40% 30% / .55)"/><path d="M0 128 H200" stroke="rgba(217,185,112,.18)"/>`,
  hall: h => `<path d="M10 150 V70 Q10 40 38 40 Q66 40 66 70 V150 M74 150 V70 Q74 40 102 40 Q130 40 130 70 V150 M138 150 V70 Q138 40 166 40 Q194 40 194 70 V150" fill="rgba(0,0,0,.32)" stroke="rgba(217,185,112,.16)" stroke-width="1.5"/><path d="M0 132 H200 M0 142 H200" stroke="rgba(217,185,112,.12)"/>`,
  war: h => `<path d="M20 150 V14 M44 150 V30 M156 150 V26 M180 150 V10" stroke="rgba(0,0,0,.5)" stroke-width="2.5"/><path d="M20 14 L42 20 L20 28 Z M180 10 L158 16 L180 24 Z" fill="hsl(${h} 55% 38% / .75)"/><path d="M0 120 L30 96 L58 120 M142 120 L170 92 L200 120" fill="rgba(0,0,0,.38)"/>`,
  night: h => `<circle cx="158" cy="30" r="15" fill="rgba(239,230,210,.28)"/><circle cx="153" cy="27" r="14" fill="hsl(${h} 25% 12%)"/><path d="M0 150 V108 H16 V94 H30 V108 H48 V86 L60 76 L72 86 V108 H96 V100 H118 V112 H140 V90 H160 V108 H200 V150 Z" fill="rgba(0,0,0,.55)"/><g fill="rgba(239,230,210,.5)"><circle cx="30" cy="20" r="1"/><circle cx="62" cy="40" r="1"/><circle cx="104" cy="14" r="1.2"/><circle cx="186" cy="62" r="1"/></g><rect x="52" y="92" width="4" height="6" fill="rgba(217,185,112,.8)"/>`,
  counting: h => `<path d="M0 40 H200 M0 80 H200 M0 120 H200" stroke="rgba(0,0,0,.4)" stroke-width="3"/><g fill="rgba(217,185,112,.4)"><circle cx="26" cy="34" r="5"/><circle cx="40" cy="34" r="5"/><circle cx="33" cy="26" r="5"/><circle cx="166" cy="74" r="5"/><circle cx="180" cy="74" r="5"/><circle cx="30" cy="114" r="5"/></g><path d="M150 0 V20 M134 28 H166 M134 28 Q150 44 166 28" stroke="rgba(217,185,112,.45)" fill="none" stroke-width="1.5"/>`,
  market: h => `<path d="M0 30 H66 L58 52 H8 Z" fill="hsl(${h} 50% 36% / .6)"/><path d="M134 24 H200 L192 46 H142 Z" fill="hsl(${h} 15% 60% / .35)"/><path d="M0 150 V98 H22 V84 H46 V98 H70 V150 M130 150 V92 H150 V80 H178 V92 H200 V150" fill="rgba(0,0,0,.45)"/>`,
  chapel: h => `<path d="M76 150 V54 Q76 18 100 6 Q124 18 124 54 V150 Z" fill="hsl(${h + 20} 55% 45% / .38)" stroke="rgba(217,185,112,.3)" stroke-width="1.5"/><path d="M100 10 V150 M76 70 H124" stroke="rgba(0,0,0,.4)" stroke-width="2"/><g fill="rgba(255,206,120,.95)"><ellipse cx="34" cy="106" rx="2.4" ry="4.4"/><ellipse cx="166" cy="106" rx="2.4" ry="4.4"/></g><path d="M34 112 V140 M166 112 V140" stroke="rgba(0,0,0,.5)" stroke-width="3"/>`,
};
export const THEME_SCENE = { ambition: 'throne', reputation: 'hall', loyalty: 'war', secrets: 'night', rivalry: 'hall', negotiation: 'counting', fear: 'war', scarcity: 'market', revenge: 'night', opportunity: 'chapel', timing: 'throne' };

// Face shapes and expressions. The same hidden state that drives `attitude` drives the expression; a mask slips before it breaks.
const FACES = {
  round: { rx: 25, ry: 28, cy: 66 },
  long: { rx: 21, ry: 32, cy: 67 },
  square: { rx: 25, ry: 27, cy: 66, r: 9 },
};
const BROWS = {
  neutral: 'M80 62 L92 61 M108 61 L120 62',
  warm: 'M80 61 Q86 57 92 60 M108 60 Q114 57 120 61',
  slip: 'M80 66 L92 61 M108 61 L120 62',
  wary: 'M80 59 L92 63 M108 63 L120 59',
  hostile: 'M79 57 L92 65 M108 65 L121 57',
  afraid: 'M80 62 Q86 55 92 57 M108 57 Q114 55 120 62',
};
const MOUTHS = {
  neutral: 'M94 86 H106',
  warm: 'M92 84 Q100 91 108 84',
  slip: 'M92 87 Q99 89 105 85 L108 82',
  wary: 'M95 87 H105',
  hostile: 'M92 90 Q100 83 108 90',
  afraid: 'M97 85 Q100 92 103 85 Z',
};

export function portraitSVG(look = {}, { label = '', expression = 'neutral', scene = null } = {}) {
  const id = `p${++uid}`;
  const h = look.hue ?? 30, a = look.accent || '#b8964e';
  const w = look.build === 'broad' ? 74 : 60;
  const hat = (HATS[look.hat] || HATS.none)(h, a);
  const body = `hsl(${h} 22% 20%)`;
  const veilOn = look.hat === 'veil';
  const f = FACES[look.face] || FACES.round;
  const face = f.r ? `<rect x="${100 - f.rx}" y="${f.cy - f.ry}" width="${f.rx * 2}" height="${f.ry * 2}" rx="${f.r + 8}" fill="url(#${id}sk)" ${veilOn ? 'opacity=".75"' : ''}/>` : `<ellipse cx="100" cy="${f.cy}" rx="${f.rx}" ry="${f.ry}" fill="url(#${id}sk)" ${veilOn ? 'opacity=".75"' : ''}/>`;
  const ex = BROWS[expression] ? expression : 'neutral';
  const eyeY = ex === 'afraid' ? 67 : ex === 'warm' ? 69 : 68;
  const eyeRy = ex === 'afraid' ? 2.6 : ex === 'warm' ? 1.3 : 1.8;
  return `<svg class="portrait-svg expr-${ex}" viewBox="0 0 200 150" role="img" aria-label="${label ? `Portrait of ${label}, looking ${ex === 'slip' ? 'pleasant, but strained' : ex}` : 'Portrait'}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="${id}bg" cx="50%" cy="38%" r="78%"><stop offset="0" stop-color="hsl(${h} 30% 34%)"/><stop offset=".6" stop-color="hsl(${h} 22% 15%)"/><stop offset="1" stop-color="#0c0b0a"/></radialGradient>
    <linearGradient id="${id}sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(28 22% 62%)"/><stop offset="1" stop-color="hsl(24 20% 40%)"/></linearGradient>
  </defs>
  <rect width="200" height="150" fill="url(#${id}bg)"/>
  ${scene && SCENES[scene] ? SCENES[scene](h) : ''}
  <circle cx="100" cy="64" r="52" fill="rgba(255,240,200,.07)"/>
  <path d="M${100 - w} 150 Q${100 - w} 104 ${100 - w + 14} 98 Q100 86 ${100 + w - 14} 98 Q${100 + w} 104 ${100 + w} 150 Z" fill="${body}" stroke="rgba(255,255,255,.07)"/>
  <path d="M86 98 Q100 112 114 98 L114 88 L86 88 Z" fill="url(#${id}sk)" opacity=".9"/>
  <path d="M86 100 L100 122 L114 100" stroke="${a}" stroke-width="3" fill="none" opacity=".85"/>
  <circle cx="100" cy="126" r="4.5" fill="${a}" opacity=".9"/>
  ${face}
  <path class="brows" d="${BROWS[ex]}" stroke="rgba(20,12,8,.62)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="90" cy="${eyeY}" rx="2.6" ry="${eyeRy}" fill="rgba(20,12,8,.72)"/><ellipse cx="110" cy="${eyeY}" rx="2.6" ry="${eyeRy}" fill="rgba(20,12,8,.72)"/>
  <path class="mouth" d="${MOUTHS[ex]}" stroke="rgba(20,12,8,.5)" stroke-width="2" stroke-linecap="round" fill="${ex === 'afraid' ? 'rgba(20,12,8,.5)' : 'none'}"/>
  ${hat}
  </svg>`;
}
