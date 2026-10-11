"use client";

import {
  ArrowRight,
  Atom,
  Award,
  Building2,
  Calculator,
  Globe,
  Pencil,
} from "lucide-react";
import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from "react";

type LoginMode = "platform" | "school";

interface SchoolLoginPanelProps {
  loginMode: LoginMode;
  email: string;
  password: string;
  message: string;
  isLoading: boolean;
  setLoginMode: Dispatch<SetStateAction<LoginMode>>;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  setMessage: Dispatch<SetStateAction<string>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

/* [left %, top %, size px, delay s] - fixed values so SSR and client always match */
const STARS: Array<[number, number, number, number]> = [
  [6, 8, 2, 0],
  [14, 20, 3, 1.2],
  [22, 6, 2, 0.6],
  [30, 26, 2, 2],
  [38, 12, 3, 0.3],
  [46, 5, 2, 1.8],
  [54, 22, 2, 0.9],
  [62, 10, 3, 2.4],
  [70, 28, 2, 0.4],
  [78, 7, 2, 1.5],
  [86, 18, 3, 0.8],
  [92, 9, 2, 2.1],
  [10, 32, 2, 1.1],
  [26, 36, 2, 0.2],
  [58, 34, 2, 1.7],
  [74, 38, 2, 2.6],
  [90, 30, 2, 0.5],
  [42, 30, 2, 1.4],
];

/* [cx, cy, delay s, duration s] */
const FIREFLIES: Array<[number, number, number, number]> = [
  [150, 470, 0, 7],
  [235, 505, -2, 9],
  [330, 525, -4, 8],
  [420, 510, -1, 10],
  [560, 495, -3, 7.5],
  [640, 525, -5, 9],
  [100, 525, -6, 8.5],
  [480, 475, -2.5, 9.5],
];

/* [left %, size px, delay s, duration s] - rising glow particles in the panel background */
const PARTICLES: Array<[number, number, number, number]> = [
  [4, 6, 0, 18],
  [11, 10, -4, 24],
  [18, 5, -9, 16],
  [25, 8, -13, 22],
  [33, 12, -2, 28],
  [40, 5, -7, 17],
  [47, 9, -15, 25],
  [54, 6, -11, 19],
  [61, 11, -5, 27],
  [68, 5, -17, 16],
  [75, 8, -3, 23],
  [82, 6, -12, 20],
  [89, 10, -8, 26],
  [95, 5, -14, 18],
  [8, 7, -19, 21],
  [29, 6, -6, 24],
  [51, 8, -20, 22],
  [72, 5, -1, 17],
  [86, 7, -16, 25],
  [44, 10, -10, 29],
];

function CampusAnimation() {
  return (
    <div className="school-scene relative mx-auto mt-6 aspect-[1.12] w-full max-w-[650px] max-h-[58vh] overflow-hidden rounded-[28px] border border-white/10 shadow-2xl shadow-slate-950/40">
      {/* Sky layers (day -> sunset -> night) */}
      <div className="school-scene__sunset pointer-events-none absolute inset-0" />
      <div className="school-scene__night pointer-events-none absolute inset-0" />

      <div className="school-scene__stars pointer-events-none absolute inset-0">
        {STARS.map(([left, top, size, delay], index) => (
          <span
            key={index}
            className="school-scene__star absolute rounded-full bg-white"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      <div className="school-scene__meteor pointer-events-none absolute" />

      {/* Sun & moon */}
      <div className="school-scene__sun absolute h-16 w-16 rounded-full bg-[#f8c96c]">
        <div className="school-scene__rays pointer-events-none absolute -inset-9" />
      </div>
      <div className="school-scene__moon absolute h-12 w-12 rounded-full bg-[#f3efd6]">
        <span className="absolute left-2 top-3 h-2.5 w-2.5 rounded-full bg-[#dcd6b4]" />
        <span className="absolute bottom-2.5 right-3 h-3 w-3 rounded-full bg-[#dcd6b4]" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#dcd6b4]" />
      </div>

      {/* Clouds */}
      <div className="school-scene__cloud school-scene__cloud--one absolute" />
      <div className="school-scene__cloud school-scene__cloud--two absolute" />
      <div className="school-scene__cloud school-scene__cloud--three absolute" />

      <div aria-hidden="true" className="school-scene__shine absolute inset-y-0 left-0 z-10 w-16 bg-white/10" />

      <svg
        aria-label="Animated school campus illustration"
        className="absolute inset-0 h-full w-full"
        role="img"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 720 640"
      >
        <defs>
          <linearGradient id="school-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff3c0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#fff3c0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Far hills */}
        <path d="M0 430C80 380 140 380 220 412C300 440 380 360 470 380C560 400 640 360 720 400V470H0z" fill="#8fbcc4" opacity="0.8" />

        {/* Birds (daytime only) */}
        <g className="school-scene__birds">
          <g transform="translate(0 95)">
            <g className="school-scene__bird school-scene__bird--one">
              <path className="school-scene__wing" d="M0 0q8-9 16 0q8-9 16 0" fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
          <g transform="translate(0 150)">
            <g className="school-scene__bird school-scene__bird--two">
              <path className="school-scene__wing school-scene__wing--two" d="M0 0q6-7 12 0q6-7 12 0" fill="none" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round" />
            </g>
          </g>
          <g transform="translate(0 60)">
            <g className="school-scene__bird school-scene__bird--three">
              <path className="school-scene__wing school-scene__wing--three" d="M0 0q5-6 10 0q5-6 10 0" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {/* Sparkles */}
        <g transform="translate(300 120)">
          <path className="school-scene__sparkle" d="M0-7 2-2 7 0 2 2 0 7-2 2-7 0-2-2z" fill="#f8d992" />
        </g>
        <g transform="translate(450 190)">
          <path className="school-scene__sparkle school-scene__sparkle--two" d="M0-5 1.5-1.5 5 0 1.5 1.5 0 5-1.5 1.5-5 0-1.5-1.5z" fill="#ffffff" />
        </g>
        <g transform="translate(170 200)">
          <path className="school-scene__sparkle school-scene__sparkle--three" d="M0-5 1.5-1.5 5 0 1.5 1.5 0 5-1.5 1.5-5 0-1.5-1.5z" fill="#f8d992" />
        </g>

        {/* Ground */}
        <path d="M0 445h720v195H0z" fill="#d9e4dc" />
        <path d="M0 490c110-30 206-38 330-13 142 29 255 20 390-18v181H0z" fill="#b7d2bc" />
        <path d="M0 544c138-38 255-42 378-11 121 30 227 20 342-20v127H0z" fill="#7eae88" />

        {/* Road */}
        <path d="M-20 598H740" stroke="#4f6879" strokeWidth="36" />
        <path d="M-20 598H740" stroke="#f1f5ec" strokeWidth="4" strokeDasharray="14 16" opacity="0.85" />

        {/* Garden lamps */}
        <path d="M215 568V520" stroke="#2c3e4c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="215" cy="514" r="6" fill="#f8d992" />
        <path d="M475 568V520" stroke="#2c3e4c" strokeWidth="4" strokeLinecap="round" />
        <circle cx="475" cy="514" r="6" fill="#f8d992" />

        <g className="school-scene__tree school-scene__tree--left">
          <path d="M122 474h22l7 83h-36z" fill="#79543f" />
          <circle cx="135" cy="416" r="51" fill="#2e7d62" />
          <circle cx="98" cy="445" r="35" fill="#3f9470" />
          <circle cx="169" cy="445" r="34" fill="#267255" />
        </g>
        <g className="school-scene__tree school-scene__tree--right">
          <path d="M594 464h22l7 94h-36z" fill="#79543f" />
          <circle cx="605" cy="405" r="55" fill="#2e7d62" />
          <circle cx="568" cy="434" r="36" fill="#3f9470" />
          <circle cx="640" cy="436" r="35" fill="#267255" />
        </g>

        {/* Falling leaves */}
        <ellipse className="school-scene__leaf school-scene__leaf--one" cx="120" cy="430" rx="5" ry="2.8" fill="#3f9470" />
        <ellipse className="school-scene__leaf school-scene__leaf--two" cx="150" cy="445" rx="4.5" ry="2.5" fill="#2e7d62" />
        <ellipse className="school-scene__leaf school-scene__leaf--three" cx="600" cy="420" rx="5" ry="2.8" fill="#3f9470" />
        <ellipse className="school-scene__leaf school-scene__leaf--four" cx="630" cy="440" rx="4.5" ry="2.5" fill="#267255" />

        <g className="school-scene__building">
          <path d="M196 243 360 142l164 101v236H196z" fill="#f6f2e9" />
          <path d="m174 248 186-119 186 119-14 22-172-111-172 111z" fill="#dc6751" />
          <path d="M317 234h86v245h-86z" fill="#355a73" />
          <path d="M327 245h66v38h-66z" fill="#f8d992" />
          <path d="M326 302h68v177h-68z" fill="#294b60" />
          <path d="M341 302h38v177h-38z" fill="#d8e9e6" />
          <path d="M231 277h63v62h-63zM426 277h63v62h-63zM231 370h63v62h-63zM426 370h63v62h-63z" fill="#8db8c2" />
          <path className="school-scene__windows" d="M238 284h49v48h-49zM433 284h49v48h-49zM238 377h49v48h-49zM433 377h49v48h-49z" fill="#f8d992" />
          <path className="school-scene__flag-pole" d="M360 85v49" stroke="#f6f2e9" strokeWidth="8" />
          <path className="school-scene__flag" d="M360 87 399 99l-39 13z" fill="#e4b451" />
          <path d="M211 236h298" stroke="#c84f42" strokeWidth="8" />

          {/* Clock */}
          <circle cx="360" cy="200" r="15" fill="#fffaf0" stroke="#c84f42" strokeWidth="3" />
          <path d="M360 188v3M360 209v3M348 200h3M369 200h3" stroke="#294b60" strokeWidth="1.5" strokeLinecap="round" />
          <path className="school-scene__clock-hour" d="M360 200v-7" stroke="#294b60" strokeWidth="2.2" strokeLinecap="round" />
          <path className="school-scene__clock-minute" d="M360 200v-10" stroke="#c84f42" strokeWidth="1.6" strokeLinecap="round" />
        </g>

        {/* Balloons */}
        <g className="school-scene__balloon school-scene__balloon--one">
          <g className="school-scene__balloon-sway">
            <path d="M70 555Q60 575 70 595" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" />
            <path d="M70 555l-3 5h6z" fill="#ee7964" />
            <ellipse cx="70" cy="540" rx="12" ry="15" fill="#ee7964" />
            <ellipse cx="66" cy="535" rx="3" ry="5" fill="#ffffff" opacity="0.35" />
          </g>
        </g>
        <g className="school-scene__balloon school-scene__balloon--two">
          <g className="school-scene__balloon-sway">
            <path d="M650 555Q640 575 650 595" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" />
            <path d="M650 555l-3 5h6z" fill="#f8c96c" />
            <ellipse cx="650" cy="540" rx="12" ry="15" fill="#f8c96c" />
            <ellipse cx="646" cy="535" rx="3" ry="5" fill="#ffffff" opacity="0.4" />
          </g>
        </g>
        <g className="school-scene__balloon school-scene__balloon--three">
          <g className="school-scene__balloon-sway">
            <path d="M360 555Q350 575 360 595" fill="none" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.2" />
            <path d="M360 555l-3 5h6z" fill="#3fb5a5" />
            <ellipse cx="360" cy="540" rx="12" ry="15" fill="#3fb5a5" />
            <ellipse cx="356" cy="535" rx="3" ry="5" fill="#ffffff" opacity="0.35" />
          </g>
        </g>

        {/* Bus drives in, stops, then leaves */}
        <g transform="translate(0 40)">
          <g className="school-scene__bus">
            <path className="school-scene__headlight" d="M606 522L710 494V562L606 548z" fill="url(#school-beam)" />
            <rect x="490" y="496" width="116" height="53" rx="9" fill="#e9b84f" />
            <rect x="502" y="505" width="68" height="21" rx="3" fill="#31566a" />
            <rect x="576" y="505" width="18" height="21" rx="3" fill="#31566a" />
            <rect className="school-scene__bus-door" x="577" y="505" width="17" height="44" rx="2" fill="#1c2f3d" />
            <path d="M577 505h17v44h-17z" fill="none" stroke="#b98530" strokeWidth="1.2" />
            <circle cx="602" cy="530" r="3.5" fill="#fff3c0" />
            <g className="school-scene__wheel">
              <circle cx="516" cy="550" r="10" fill="#30414d" />
              <circle cx="516" cy="550" r="3.5" fill="#8da0ac" />
              <path d="M516 542v16" stroke="#8da0ac" strokeWidth="1.5" />
            </g>
            <g className="school-scene__wheel">
              <circle cx="580" cy="550" r="10" fill="#30414d" />
              <circle cx="580" cy="550" r="3.5" fill="#8da0ac" />
              <path d="M580 542v16" stroke="#8da0ac" strokeWidth="1.5" />
            </g>
            <path d="M490 535h116" stroke="#ca8736" strokeWidth="5" />
          </g>
        </g>

        {/* Kids get off the bus and walk into the school */}
        <g transform="translate(586 582)">
          <g className="school-scene__kid school-scene__kid--one">
            <g className="school-scene__kid-bob">
              <rect x="6" y="-44" width="7" height="22" rx="3" fill="#2f4a5c" />
              <path d="M-10 -42h20l3 25h-26z" fill="#f0a04b" />
              <path d="M-5 -17-7 0m10-17 2 17" stroke="#304b60" strokeWidth="5" strokeLinecap="round" />
              <path d="M-9 -38-14 -24m23-14 4 12" stroke="#f3bd93" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="-52" r="8.5" fill="#f3bd93" />
              <path d="M-8.5 -54a8.5 8.5 0 0 1 17 0z" fill="#3b2b24" />
            </g>
          </g>
          <g className="school-scene__kid school-scene__kid--two">
            <g className="school-scene__kid-bob">
              <rect x="6" y="-44" width="7" height="22" rx="3" fill="#2f4a5c" />
              <path d="M-10 -42h20l3 25h-26z" fill="#5aa6a0" />
              <path d="M-5 -17-7 0m10-17 2 17" stroke="#304b60" strokeWidth="5" strokeLinecap="round" />
              <path d="M-9 -38-14 -24m23-14 4 12" stroke="#d99b72" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="-52" r="8.5" fill="#d99b72" />
              <path d="M-8.5 -54a8.5 8.5 0 0 1 17 0z" fill="#2a2420" />
            </g>
          </g>
          <g className="school-scene__kid school-scene__kid--three">
            <g className="school-scene__kid-bob">
              <rect x="6" y="-44" width="7" height="22" rx="3" fill="#2f4a5c" />
              <path d="M-10 -42h20l3 25h-26z" fill="#b07ad1" />
              <path d="M-5 -17-7 0m10-17 2 17" stroke="#304b60" strokeWidth="5" strokeLinecap="round" />
              <path d="M-9 -38-14 -24m23-14 4 12" stroke="#c88a63" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="-52" r="8.5" fill="#c88a63" />
              <path d="M-8.5 -54a8.5 8.5 0 0 1 17 0z" fill="#4a3426" />
            </g>
          </g>
        </g>

      </svg>

      {/* Night tint */}
      <div className="school-scene__tint pointer-events-none absolute inset-0" />

      {/* Night lights (above the tint so they really glow) */}
      <svg
        aria-hidden="true"
        className="school-scene__lights pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
        viewBox="0 0 720 640"
      >
        <defs>
          <radialGradient id="school-lamp-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
          </radialGradient>
          <filter id="school-soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <g className="school-scene__building">
          <g filter="url(#school-soft-glow)" opacity="0.85">
            <path d="M231 277h63v62h-63zM426 277h63v62h-63zM231 370h63v62h-63zM426 370h63v62h-63z" fill="#f8c96c" />
          </g>
          <path d="M238 284h49v48h-49zM433 284h49v48h-49zM238 377h49v48h-49zM433 377h49v48h-49z" fill="#ffe7ae" />
          <path d="M327 245h66v38h-66z" fill="#ffe7ae" />
        </g>

        <circle cx="215" cy="514" r="34" fill="url(#school-lamp-glow)" />
        <circle cx="475" cy="514" r="34" fill="url(#school-lamp-glow)" />

        {FIREFLIES.map(([cx, cy, delay, duration], index) => (
          <g
            key={index}
            className="school-scene__firefly"
            style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
          >
            <circle cx={cx} cy={cy} r="6" fill="#d7ff7a" opacity="0.28" />
            <circle cx={cx} cy={cy} r="2.2" fill="#f4ffb8" />
          </g>
        ))}
      </svg>

    </div>
  );
}

export default function SchoolLoginPanel({
  loginMode,
  email,
  password,
  message,
  isLoading,
  setLoginMode,
  setEmail,
  setPassword,
  setMessage,
  onSubmit,
}: SchoolLoginPanelProps) {
  return (
    <main className="school-root h-screen overflow-hidden bg-white text-slate-950">
      <section className="grid h-full min-h-0 w-full overflow-hidden bg-white lg:grid-cols-[1.12fr_0.88fr]">
        <div className="school-panel relative min-h-0 overflow-hidden px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-10">
          {/* Animated background */}
          <div className="school-grid pointer-events-none absolute inset-0" />
          <div className="school-blob school-blob--teal pointer-events-none absolute -left-24 top-[30%] h-80 w-80 rounded-full bg-[#078579]/35 blur-3xl" />
          <div className="school-blob school-blob--gold pointer-events-none absolute -right-16 top-[8%] h-72 w-72 rounded-full bg-[#f8c96c]/15 blur-3xl" />
          <div className="school-blob school-blob--indigo pointer-events-none absolute bottom-[-6%] right-[18%] h-80 w-80 rounded-full bg-[#5b6cf0]/20 blur-3xl" />

          {/* Aurora ribbons */}
          <div className="school-aurora pointer-events-none absolute" />
          <div className="school-aurora school-aurora--two pointer-events-none absolute" />

          {/* Rotating halo + ripples behind the scene */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="school-halo absolute h-[760px] w-[760px] rounded-full" />
            <div className="school-ripple absolute h-[420px] w-[420px] rounded-full border border-[#5fd3c4]/30" />
            <div className="school-ripple school-ripple--two absolute h-[420px] w-[420px] rounded-full border border-[#f8c96c]/25" />
            <div className="school-ripple school-ripple--three absolute h-[420px] w-[420px] rounded-full border border-white/20" />
          </div>

          {/* Light sweep + shooting stars */}
          <div className="school-beam pointer-events-none absolute" />
          <div className="school-panel-meteor pointer-events-none absolute" />
          <div className="school-panel-meteor school-panel-meteor--two pointer-events-none absolute" />

          {/* Rising glow particles */}
          {PARTICLES.map(([left, size, delay, duration], index) => (
            <span
              key={index}
              className="school-particle pointer-events-none absolute rounded-full"
              style={{
                left: `${left}%`,
                bottom: -24,
                width: size,
                height: size,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                background:
                  index % 3 === 0
                    ? "rgba(248, 201, 108, 0.6)"
                    : index % 3 === 1
                      ? "rgba(95, 211, 196, 0.55)"
                      : "rgba(255, 255, 255, 0.45)",
              }}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="school-float school-float--one absolute right-[7%] top-[9%] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#f8c96c]/80 backdrop-blur-sm">
              <Pencil className="h-5 w-5" />
            </div>
            <div className="school-float school-float--two absolute right-[3%] top-[40%] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#5fd3c4]/80 backdrop-blur-sm">
              <Globe className="h-5 w-5" />
            </div>
            <div className="school-float school-float--three absolute left-[2%] top-[46%] flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#f8c96c]/70 backdrop-blur-sm">
              <Calculator className="h-5 w-5" />
            </div>
            <div className="school-float school-float--four absolute bottom-[13%] right-[6%] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#5fd3c4]/80 backdrop-blur-sm">
              <Award className="h-5 w-5" />
            </div>
            <div className="school-float school-float--five absolute right-[24%] top-[22%] flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[#f8c96c]/70 backdrop-blur-sm">
              <Atom className="h-5 w-5" />
            </div>
          </div>

          <div className="relative z-10 flex h-full flex-col justify-center">
            <div className="school-enter school-enter--4">
              <CampusAnimation />
            </div>

          </div>
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -right-24 top-24 h-48 w-48 rounded-full border-[18px] border-[#f8c96c]/10" />
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-white px-6 py-10 sm:px-12 lg:px-16">
          <div className="school-blob school-blob--teal pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#078579]/10 blur-3xl" />
          <div className="school-blob school-blob--gold pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#f8c96c]/20 blur-3xl" />

          <div className="school-form-enter relative z-10 w-full max-w-md">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f3f1] text-[#078579]">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-[#078579]">
                {loginMode === "platform" ? "Platform control" : "School tenant"}
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Welcome back
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {loginMode === "platform"
                  ? "Sign in as Super Admin to create schools and manage tenant access."
                  : "Sign in with the school email and initial admin password created during provisioning."}
              </p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="mb-7 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                <button
                  className={`h-11 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${
                    loginMode === "platform"
                      ? "bg-white text-[#078579] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => {
                    setLoginMode("platform");
                    setEmail("superadmin@example.com");
                    setPassword("Admin@12345");
                    setMessage("");
                  }}
                  type="button"
                >
                  Platform
                </button>
                <button
                  className={`h-11 cursor-pointer rounded-lg text-sm font-semibold transition-all duration-300 ${
                    loginMode === "school"
                      ? "bg-white text-[#078579] shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                  onClick={() => {
                    setLoginMode("school");
                    setEmail("");
                    setPassword("");
                    setMessage("");
                  }}
                  type="button"
                >
                  School
                </button>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-4 focus:ring-[#078579]/10"
                  type="email"
                  required
                />
              </label>
              <label className="mt-5 block text-sm font-medium text-slate-700">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-[#078579] focus:ring-4 focus:ring-[#078579]/10"
                  type="password"
                  required
                />
              </label>
              <button
                className="school-btn relative mt-7 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#078579] px-4 text-sm font-semibold text-white shadow-lg shadow-[#078579]/20 transition hover:bg-[#056f67] disabled:cursor-not-allowed disabled:bg-slate-400"
                disabled={isLoading}
                type="submit"
              >
                {isLoading
                  ? "Signing in..."
                  : loginMode === "platform"
                    ? "Sign in as Platform Admin"
                    : "Sign in as School Admin"}
                {!isLoading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
              {message ? (
                <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </section>

      <style jsx global>{`
        /* ---------- Left panel theme ---------- */
        .school-panel {
          background:
            radial-gradient(circle at 15% 10%, rgba(7, 133, 121, 0.22), transparent 45%),
            linear-gradient(160deg, #0b1d31 0%, #11304a 55%, #0c3a49 100%);
        }

        .school-grid {
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
          background-size: 44px 44px;
          -webkit-mask-image: radial-gradient(ellipse at center, #000 25%, transparent 75%);
          mask-image: radial-gradient(ellipse at center, #000 25%, transparent 75%);
          animation: grid-pan 22s linear infinite;
        }

        .school-blob {
          animation: blob-drift 14s ease-in-out infinite;
        }

        .school-blob--gold {
          animation-duration: 18s;
          animation-delay: -6s;
        }

        .school-blob--indigo {
          animation-duration: 20s;
          animation-delay: -10s;
        }

        .school-float {
          animation: float-y 7s ease-in-out infinite;
        }

        .school-float--two { animation-duration: 8.5s; animation-delay: -2s; }
        .school-float--three { animation-duration: 6.5s; animation-delay: -4s; }
        .school-float--four { animation-duration: 9s; animation-delay: -1s; }
        .school-float--five { animation-duration: 7.5s; animation-delay: -5s; }

        .school-badge-icon {
          animation: badge-spin 6s ease-in-out infinite;
        }

        .school-enter {
          animation: copy-enter 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .school-enter--1 { animation-delay: 60ms; }
        .school-enter--3 { animation-delay: 380ms; }
        .school-enter--4 { animation-delay: 520ms; }
        .school-enter--5 { animation-delay: 700ms; }

        .school-login-copy {
          animation: copy-enter 900ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both;
        }

        .school-login-gradient {
          background: linear-gradient(90deg, #f8c96c, #ffffff, #5fd3c4, #f8c96c);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: gradient-pan 6s linear infinite;
        }

        .school-aurora {
          left: -20%;
          right: -20%;
          top: -6%;
          height: 46%;
          background: linear-gradient(90deg, transparent 0%, rgba(95, 211, 196, 0.3) 30%, rgba(91, 108, 240, 0.26) 55%, rgba(248, 201, 108, 0.18) 75%, transparent 100%);
          filter: blur(48px);
          opacity: 0.7;
          animation: aurora-wave 16s ease-in-out infinite alternate;
        }

        .school-aurora--two {
          top: auto;
          bottom: -8%;
          height: 38%;
          background: linear-gradient(90deg, transparent 0%, rgba(91, 108, 240, 0.28) 25%, rgba(95, 211, 196, 0.26) 60%, transparent 100%);
          animation-duration: 22s;
          animation-delay: -8s;
        }

        .school-halo {
          background: conic-gradient(from 0deg, rgba(7, 133, 121, 0) 0deg, rgba(95, 211, 196, 0.24) 70deg, rgba(248, 201, 108, 0.18) 140deg, rgba(7, 133, 121, 0) 200deg, rgba(91, 108, 240, 0.22) 280deg, rgba(7, 133, 121, 0) 360deg);
          filter: blur(36px);
          -webkit-mask-image: radial-gradient(circle, #000 35%, transparent 72%);
          mask-image: radial-gradient(circle, #000 35%, transparent 72%);
          animation: halo-spin 38s linear infinite;
        }

        .school-ripple {
          opacity: 0;
          animation: ripple-out 9s ease-out infinite;
        }

        .school-ripple--two { animation-delay: -3s; }
        .school-ripple--three { animation-delay: -6s; }

        .school-beam {
          top: -20%;
          bottom: -20%;
          left: -30%;
          width: 160px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
          transform: rotate(18deg);
          animation: beam-sweep 14s ease-in-out infinite;
        }

        .school-panel-meteor {
          top: 10%;
          left: 12%;
          width: 110px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9));
          opacity: 0;
          transform: rotate(30deg);
          animation: panel-meteor 9s linear infinite;
        }

        .school-panel-meteor--two {
          top: 34%;
          left: 46%;
          width: 80px;
          animation-delay: -4.5s;
        }

        .school-particle {
          opacity: 0;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.25);
          animation: particle-rise 20s linear infinite;
        }

        /* ---------- Right panel ---------- */
        .school-form-enter {
          animation: form-enter 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms backwards;
        }

        .school-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.28) 50%, transparent 75%);
          transform: translateX(-120%);
          animation: btn-shine 6s ease-in-out infinite;
        }

        .school-btn:disabled::after {
          display: none;
        }

        /* ---------- Scene ---------- */
        .school-scene {
          --cycle: 28s;
          background: linear-gradient(180deg, #4f9fd6 0%, #9ed2e8 50%, #f6e8c6 78%);
          animation: scene-float 7s ease-in-out infinite;
        }

        .school-scene__sunset {
          background: linear-gradient(180deg, #3b4b86 0%, #d56a8d 38%, #f5a265 62%, #fbd27a 80%);
          opacity: 0;
          animation: sky-sunset var(--cycle) linear infinite;
        }

        .school-scene__night {
          background: linear-gradient(180deg, #07102a 0%, #10244a 45%, #1d3b63 75%, #2c4b6b 100%);
          opacity: 0;
          animation: night-fade var(--cycle) linear infinite;
        }

        .school-scene__tint {
          background: rgba(8, 18, 48, 0.4);
          opacity: 0;
          animation: night-fade var(--cycle) linear infinite;
        }

        .school-scene__lights {
          opacity: 0;
          animation: night-fade var(--cycle) linear infinite;
        }

        .school-scene__stars {
          opacity: 0;
          animation: stars-fade var(--cycle) linear infinite;
        }

        .school-scene__star {
          animation: star-twinkle 3s ease-in-out infinite;
        }

        .school-scene__meteor {
          left: 28%;
          top: 8%;
          width: 70px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffffff);
          border-radius: 2px;
          opacity: 0;
          transform: rotate(28deg);
          animation: meteor var(--cycle) linear infinite;
        }

        .school-scene__shine {
          animation: shine-sweep 8s ease-in-out infinite;
          transform: translateX(-140%) skewX(-14deg);
        }

        .school-scene__sun {
          left: 8%;
          top: 38%;
          animation: sun-travel var(--cycle) linear infinite, sun-pulse 4s ease-in-out infinite;
          box-shadow: 0 0 0 12px rgba(248, 201, 108, 0.1), 0 0 44px rgba(248, 201, 108, 0.5);
        }

        .school-scene__rays {
          border-radius: 50%;
          background: repeating-conic-gradient(from 0deg, rgba(255, 226, 140, 0.4) 0deg 8deg, transparent 8deg 24deg);
          -webkit-mask-image: radial-gradient(circle, transparent 36%, #000 40%, transparent 72%);
          mask-image: radial-gradient(circle, transparent 36%, #000 40%, transparent 72%);
          animation: rays-spin 26s linear infinite;
        }

        .school-scene__moon {
          left: 10%;
          top: 40%;
          opacity: 0;
          box-shadow: 0 0 0 10px rgba(243, 239, 214, 0.08), 0 0 34px rgba(243, 239, 214, 0.45);
          animation: moon-travel var(--cycle) linear infinite;
        }

        .school-scene__cloud {
          width: 96px;
          height: 26px;
          border-radius: 999px;
          background: #ffffff;
          opacity: 0.85;
          left: 10%;
          animation: cloud-pass 60s linear infinite;
        }

        .school-scene__cloud::before,
        .school-scene__cloud::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          background: inherit;
        }

        .school-scene__cloud::before {
          left: 16px;
          top: -13px;
          width: 38px;
          height: 38px;
        }

        .school-scene__cloud::after {
          left: 46px;
          top: -18px;
          width: 46px;
          height: 46px;
        }

        .school-scene__cloud--one { top: 17%; animation-delay: -12s; }
        .school-scene__cloud--two { top: 29%; opacity: 0.65; transform: scale(0.7); animation-duration: 85s; animation-delay: -44s; }
        .school-scene__cloud--three { top: 9%; opacity: 0.55; transform: scale(0.55); animation-duration: 105s; animation-delay: -70s; }

        .school-scene__tree--left {
          transform-origin: 135px 500px;
          animation: tree-sway 5s ease-in-out infinite;
        }

        .school-scene__tree--right {
          transform-origin: 605px 500px;
          animation: tree-sway 6s ease-in-out -2s infinite;
        }

        .school-scene__building {
          animation: building-breathe 6s ease-in-out infinite;
          transform-origin: 360px 460px;
        }

        .school-scene__flag {
          animation: flag-wave 2.4s ease-in-out infinite;
          transform-origin: 360px 99px;
        }

        .school-scene__windows {
          opacity: 0.55;
          animation: window-cycle var(--cycle) linear infinite;
        }

        .school-scene__clock-hour {
          transform-origin: 360px 200px;
          animation: clock-spin 96s linear infinite;
        }

        .school-scene__clock-minute {
          transform-origin: 360px 200px;
          animation: clock-spin 8s linear infinite;
        }

        .school-scene__bus {
          animation: bus-drive 22s ease-in-out infinite;
        }

        .school-scene__wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: wheel-spin 22s ease-in-out infinite;
        }

        .school-scene__bus-door {
          opacity: 0;
          animation: bus-door-open 22s linear infinite;
        }

        .school-scene__kid {
          opacity: 0;
          transform-origin: 0 0;
          animation: kid-walk 22s ease-in-out infinite;
        }

        .school-scene__kid--two { animation-delay: 1s; }
        .school-scene__kid--three { animation-delay: 2s; }

        .school-scene__kid-bob {
          animation: kid-bob 0.5s ease-in-out infinite alternate;
        }

        .school-scene__headlight {
          opacity: 0;
          animation: night-fade var(--cycle) linear infinite;
        }

        .school-scene__birds {
          animation: day-only var(--cycle) linear infinite;
        }

        .school-scene__bird {
          animation: bird-fly 16s linear infinite;
        }

        .school-scene__bird--one { animation-delay: -3s; }
        .school-scene__bird--two { animation-duration: 22s; animation-delay: -8s; }
        .school-scene__bird--three { animation-duration: 28s; animation-delay: -15s; }

        .school-scene__wing {
          transform-box: fill-box;
          transform-origin: center;
          animation: wing-flap 0.5s ease-in-out infinite;
        }

        .school-scene__wing--two { animation-duration: 0.65s; }
        .school-scene__wing--three { animation-duration: 0.75s; }

        .school-scene__sparkle {
          transform-box: fill-box;
          transform-origin: center;
          animation: sparkle-twinkle 2.6s ease-in-out infinite;
        }

        .school-scene__sparkle--two { animation-delay: -0.9s; animation-duration: 3.2s; }
        .school-scene__sparkle--three { animation-delay: -1.7s; animation-duration: 2.9s; }

        .school-scene__leaf {
          opacity: 0;
          animation: leaf-fall 6s ease-in infinite;
        }

        .school-scene__leaf--two { animation-delay: -2s; animation-duration: 7s; }
        .school-scene__leaf--three { animation-delay: -1s; animation-duration: 6.5s; }
        .school-scene__leaf--four { animation-delay: -3.5s; animation-duration: 7.5s; }

        .school-scene__balloon {
          opacity: 0;
          animation: balloon-rise 16s linear infinite;
        }

        .school-scene__balloon--two { animation-duration: 20s; animation-delay: -6s; }
        .school-scene__balloon--three { animation-duration: 18s; animation-delay: -11s; }

        .school-scene__balloon-sway {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation: balloon-sway 4s ease-in-out infinite;
        }

        .school-scene__firefly {
          opacity: 0.2;
          animation: firefly-move 8s ease-in-out infinite;
        }

        /* ---------- Keyframes ---------- */
        @keyframes scene-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes copy-enter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes form-enter {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        @keyframes grid-pan {
          to { background-position: 44px 44px; }
        }

        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.15); }
        }

        @keyframes float-y {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(6deg); }
        }

        @keyframes badge-spin {
          0%, 70%, 100% { transform: rotate(0deg) scale(1); }
          85% { transform: rotate(180deg) scale(1.25); }
        }

        @keyframes btn-shine {
          0%, 40% { transform: translateX(-120%); }
          85%, 100% { transform: translateX(120%); }
        }

        @keyframes aurora-wave {
          0% { transform: translateX(-8%) skewY(-6deg) scaleY(0.9); opacity: 0.45; }
          50% { opacity: 0.85; }
          100% { transform: translateX(8%) skewY(5deg) scaleY(1.15); opacity: 0.55; }
        }

        @keyframes halo-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes ripple-out {
          0% { transform: scale(0.6); opacity: 0.55; }
          100% { transform: scale(2.3); opacity: 0; }
        }

        @keyframes beam-sweep {
          0%, 20% { left: -30%; }
          70%, 100% { left: 130%; }
        }

        @keyframes panel-meteor {
          0%, 70% { opacity: 0; transform: translate(0, 0) rotate(30deg); }
          72% { opacity: 1; transform: translate(0, 0) rotate(30deg); }
          86% { opacity: 0; transform: translate(420px, 242px) rotate(30deg); }
          100% { opacity: 0; transform: translate(0, 0) rotate(30deg); }
        }

        @keyframes particle-rise {
          0% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 0.7; }
          50% { transform: translate(18px, -55vh); }
          90% { opacity: 0.5; }
          100% { transform: translate(-12px, -110vh); opacity: 0; }
        }

        @keyframes shine-sweep {
          0%, 18% { transform: translateX(-140%) skewX(-14deg); opacity: 0; }
          34% { opacity: 0.8; }
          52%, 100% { transform: translateX(900%) skewX(-14deg); opacity: 0; }
        }

        /* day / night cycle */
        @keyframes sky-sunset {
          0%, 24% { opacity: 0; }
          38% { opacity: 0.95; }
          50% { opacity: 0.55; }
          60% { opacity: 0; }
          90% { opacity: 0; }
          96% { opacity: 0.5; }
          100% { opacity: 0; }
        }

        @keyframes night-fade {
          0%, 36% { opacity: 0; }
          54%, 84% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }

        @keyframes stars-fade {
          0%, 44% { opacity: 0; }
          58%, 82% { opacity: 1; }
          94%, 100% { opacity: 0; }
        }

        @keyframes day-only {
          0%, 36% { opacity: 1; }
          50%, 88% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes window-cycle {
          0%, 36% { opacity: 0.55; }
          54%, 84% { opacity: 1; }
          97%, 100% { opacity: 0.55; }
        }

        @keyframes sun-travel {
          0% { left: 8%; top: 38%; opacity: 1; }
          20% { left: 40%; top: 8%; opacity: 1; }
          40% { left: 78%; top: 32%; opacity: 1; }
          47% { left: 88%; top: 50%; opacity: 0; }
          48% { left: 4%; top: 56%; opacity: 0; }
          90% { left: 4%; top: 56%; opacity: 0; }
          100% { left: 8%; top: 38%; opacity: 1; }
        }

        @keyframes moon-travel {
          0%, 50% { left: 10%; top: 40%; opacity: 0; }
          60% { left: 20%; top: 22%; opacity: 1; }
          75% { left: 55%; top: 8%; opacity: 1; }
          88% { left: 85%; top: 24%; opacity: 1; }
          94% { left: 90%; top: 36%; opacity: 0; }
          100% { left: 10%; top: 40%; opacity: 0; }
        }

        @keyframes meteor {
          0%, 60% { opacity: 0; transform: translate(0, 0) rotate(28deg); }
          62% { opacity: 1; transform: translate(0, 0) rotate(28deg); }
          68% { opacity: 0; transform: translate(220px, 115px) rotate(28deg); }
          68.01%, 74% { opacity: 0; transform: translate(0, 0) rotate(28deg); }
          75% { opacity: 1; transform: translate(0, 0) rotate(28deg); }
          81% { opacity: 0; transform: translate(220px, 115px) rotate(28deg); }
          81.01%, 100% { opacity: 0; transform: translate(0, 0) rotate(28deg); }
        }

        @keyframes star-twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        @keyframes rays-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        @keyframes cloud-pass {
          from { left: -30%; }
          to { left: 110%; }
        }

        @keyframes flag-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(7deg) translateX(2px); }
        }

        @keyframes tree-sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes building-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes clock-spin {
          to { transform: rotate(360deg); }
        }

        @keyframes bus-drive {
          0% { transform: translateX(-720px); }
          28%, 66% { transform: translateX(0); }
          92%, 100% { transform: translateX(300px); }
        }

        @keyframes wheel-spin {
          0% { transform: rotate(0deg); }
          28%, 66% { transform: rotate(1440deg); }
          92%, 100% { transform: rotate(2040deg); }
        }

        @keyframes bus-door-open {
          0%, 28% { opacity: 0; }
          30%, 63% { opacity: 1; }
          66%, 100% { opacity: 0; }
        }

        @keyframes kid-walk {
          0%, 32% { opacity: 0; transform: translate(0, 0) scale(0.9); }
          33% { opacity: 1; transform: translate(0, 0) scale(0.9); }
          42% { opacity: 1; transform: translate(-226px, 0) scale(0.95); }
          52% { opacity: 1; transform: translate(-226px, -96px) scale(0.62); }
          53.5% { opacity: 0; transform: translate(-226px, -98px) scale(0.55); }
          54%, 100% { opacity: 0; transform: translate(0, 0) scale(0.9); }
        }

        @keyframes kid-bob {
          from { transform: translateY(0); }
          to { transform: translateY(-3px); }
        }

        @keyframes bird-fly {
          from { transform: translateX(-60px); }
          to { transform: translateX(780px); }
        }

        @keyframes wing-flap {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(-0.6); }
        }

        @keyframes sparkle-twinkle {
          0%, 100% { transform: scale(0.3) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
        }

        @keyframes leaf-fall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translate(-30px, 125px) rotate(200deg); opacity: 0; }
        }

        @keyframes balloon-rise {
          0% { transform: translateY(0); opacity: 0; }
          8% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateY(-520px); opacity: 0; }
        }

        @keyframes balloon-sway {
          0%, 100% { transform: translateX(-9px) rotate(-4deg); }
          50% { transform: translateX(9px) rotate(4deg); }
        }

        @keyframes firefly-move {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { transform: translate(10px, -14px); opacity: 1; }
          50% { transform: translate(-6px, -24px); opacity: 0.3; }
          75% { transform: translate(-14px, -8px); opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .school-root *,
          .school-root *::before,
          .school-root *::after {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
}