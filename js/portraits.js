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

export function portraitSVG(look = {}, { label = '' } = {}) {
  const id = `p${++uid}`;
  const h = look.hue ?? 30, a = look.accent || '#b8964e';
  const w = look.build === 'broad' ? 74 : 60;
  const hat = (HATS[look.hat] || HATS.none)(h, a);
  const body = `hsl(${h} 22% 20%)`;
  const veilOn = look.hat === 'veil';
  return `<svg class="portrait-svg" viewBox="0 0 200 150" role="img" aria-label="${label ? `Portrait of ${label}` : 'Portrait'}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="${id}bg" cx="50%" cy="38%" r="78%"><stop offset="0" stop-color="hsl(${h} 30% 34%)"/><stop offset=".6" stop-color="hsl(${h} 22% 15%)"/><stop offset="1" stop-color="#0c0b0a"/></radialGradient>
    <linearGradient id="${id}sk" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(28 22% 62%)"/><stop offset="1" stop-color="hsl(24 20% 40%)"/></linearGradient>
  </defs>
  <rect width="200" height="150" fill="url(#${id}bg)"/>
  <circle cx="100" cy="64" r="52" fill="rgba(255,240,200,.07)"/>
  <path d="M${100 - w} 150 Q${100 - w} 104 ${100 - w + 14} 98 Q100 86 ${100 + w - 14} 98 Q${100 + w} 104 ${100 + w} 150 Z" fill="${body}" stroke="rgba(255,255,255,.07)"/>
  <path d="M86 98 Q100 112 114 98 L114 88 L86 88 Z" fill="url(#${id}sk)" opacity=".9"/>
  <path d="M86 100 L100 122 L114 100" stroke="${a}" stroke-width="3" fill="none" opacity=".85"/>
  <circle cx="100" cy="126" r="4.5" fill="${a}" opacity=".9"/>
  <ellipse cx="100" cy="66" rx="24" ry="29" fill="url(#${id}sk)" ${veilOn ? 'opacity=".75"' : ''}/>
  <path d="M80 62 L92 60 M108 60 L120 62" stroke="rgba(20,12,8,.6)" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="90" cy="68" rx="2.6" ry="1.8" fill="rgba(20,12,8,.7)"/><ellipse cx="110" cy="68" rx="2.6" ry="1.8" fill="rgba(20,12,8,.7)"/>
  <path d="M94 85 H106" stroke="rgba(20,12,8,.45)" stroke-width="2" stroke-linecap="round" fill="none"/>
  ${hat}
  </svg>`;
}
