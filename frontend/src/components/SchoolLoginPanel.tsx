"use client";

import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
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

function CampusAnimation() {
  return (
    <div className="school-scene relative mx-auto mt-6 aspect-[1.12] w-full max-w-[650px] max-h-[58vh] overflow-hidden rounded-[28px] border border-white/10 bg-[#1a3044] shadow-2xl shadow-slate-950/25">
      <div className="absolute inset-x-0 top-0 h-1/2 bg-[#254762]" />
      <div className="school-scene__sun absolute right-[14%] top-[11%] h-16 w-16 rounded-full bg-[#f8c96c]" />
      <div className="school-scene__cloud school-scene__cloud--one absolute left-[9%] top-[18%] h-5 w-24 rounded-full bg-white/80" />
      <div className="school-scene__cloud school-scene__cloud--two absolute right-[30%] top-[30%] h-4 w-16 rounded-full bg-white/60" />
      <div aria-hidden="true" className="school-scene__shine absolute inset-y-0 left-0 z-10 w-16 bg-white/10" />

      <svg
        aria-label="Animated school campus illustration"
        className="absolute inset-0 h-full w-full"
        role="img"
        viewBox="0 0 720 640"
      >
        <path d="M0 445h720v195H0z" fill="#d9e4dc" />
        <path d="M0 490c110-30 206-38 330-13 142 29 255 20 390-18v181H0z" fill="#b7d2bc" />
        <path d="M0 544c138-38 255-42 378-11 121 30 227 20 342-20v127H0z" fill="#7eae88" />

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
        </g>

        <g className="school-scene__bus">
          <rect x="490" y="496" width="116" height="53" rx="9" fill="#e9b84f" />
          <rect x="502" y="505" width="68" height="21" rx="3" fill="#31566a" />
          <rect x="576" y="505" width="18" height="21" rx="3" fill="#31566a" />
          <circle cx="516" cy="550" r="10" fill="#30414d" />
          <circle cx="580" cy="550" r="10" fill="#30414d" />
          <path d="M490 535h116" stroke="#ca8736" strokeWidth="5" />
        </g>

        <g className="school-scene__student school-scene__student--one">
          <circle cx="274" cy="493" r="10" fill="#f3bd93" />
          <path d="M260 505h28l6 35h-40z" fill="#ee7964" />
          <path d="m263 540-11 27m29-27 11 27" stroke="#304b60" strokeWidth="7" strokeLinecap="round" />
          <path d="m260 512-17 16m43-16 16 14" stroke="#f3bd93" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g className="school-scene__student school-scene__student--two">
          <circle cx="435" cy="492" r="10" fill="#d99b72" />
          <path d="M421 505h28l6 35h-40z" fill="#6b83d4" />
          <path d="m424 540-11 27m29-27 11 27" stroke="#304b60" strokeWidth="7" strokeLinecap="round" />
          <path d="m421 512-17 14m43-14 16 15" stroke="#d99b72" strokeWidth="6" strokeLinecap="round" />
        </g>

        <path d="M214 575h312" stroke="#f1f5ec" strokeWidth="5" strokeLinecap="round" strokeDasharray="14 16" />
      </svg>

      <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/15 bg-[#102536]/85 px-4 py-3 text-white backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8c96c] text-[#193247]">
          <GraduationCap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#f8c96c]">
            School tenant
          </p>
          <p className="mt-0.5 text-sm font-medium text-white/90">
            One campus, one connected system
          </p>
        </div>
      </div>
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
    <main className="h-screen overflow-hidden bg-white text-slate-950">
      <section className="grid h-full min-h-0 w-full overflow-hidden bg-white lg:grid-cols-[1.12fr_0.88fr]">
        <div className="relative min-h-0 overflow-hidden bg-[#12283b] px-6 py-8 text-white sm:px-10 lg:px-14 lg:py-10">
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f8c96c]">
                <Sparkles className="h-3.5 w-3.5" />
                School management
              </div>
              <h1 className="school-login-copy mt-6 max-w-lg text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Make every school day feel more connected.
              </h1>
              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                A calm control center for your campus, from attendance and
                academics to people and everyday school operations.
              </p>
            </div>

            <CampusAnimation />

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <ShieldCheck className="h-3.5 w-3.5 text-[#f8c96c]" />
                Secure tenant access
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                <BookOpen className="h-3.5 w-3.5 text-[#f8c96c]" />
                Built for schools
              </span>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -right-24 top-24 h-48 w-48 rounded-full border-[18px] border-[#f8c96c]/10" />
        </div>

        <div className="flex items-center justify-center bg-white px-6 py-10 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
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
                className="mt-7 inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#078579] px-4 text-sm font-semibold text-white shadow-lg shadow-[#078579]/20 transition hover:bg-[#056f67] disabled:cursor-not-allowed disabled:bg-slate-400"
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

      <style jsx>{`
        .school-scene {
          animation: scene-float 7s ease-in-out infinite;
        }

        .school-login-copy {
          animation: copy-enter 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .school-scene__shine {
          animation: shine-sweep 8s ease-in-out infinite;
          transform: translateX(-140%) skewX(-14deg);
        }

        .school-scene__sun {
          animation: sun-pulse 4s ease-in-out infinite;
          box-shadow: 0 0 0 12px rgba(248, 201, 108, 0.08), 0 0 34px rgba(248, 201, 108, 0.24);
        }

        .school-scene__cloud {
          animation: cloud-drift 12s ease-in-out infinite;
        }

        .school-scene__cloud--two {
          animation-delay: -5s;
          animation-duration: 15s;
        }

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
          animation: window-glow 3.5s ease-in-out infinite;
        }

        .school-scene__bus {
          animation: bus-roll 9s ease-in-out infinite;
        }

        .school-scene__student--one {
          animation: student-wave 4s ease-in-out -1s infinite;
          transform-origin: 274px 535px;
        }

        .school-scene__student--two {
          animation: student-wave 4.5s ease-in-out -2.2s infinite;
          transform-origin: 435px 535px;
        }

        @keyframes scene-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes copy-enter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine-sweep {
          0%, 18% { transform: translateX(-140%) skewX(-14deg); opacity: 0; }
          34% { opacity: 0.8; }
          52%, 100% { transform: translateX(900%) skewX(-14deg); opacity: 0; }
        }

        @keyframes flag-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(7deg) translateX(2px); }
        }

        @keyframes window-glow {
          0%, 100% { opacity: 0.78; }
          50% { opacity: 1; }
        }

        @keyframes sun-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes cloud-drift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(28px); }
        }

        @keyframes tree-sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes building-breathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes bus-roll {
          0%, 10% { transform: translateX(0); }
          45%, 60% { transform: translateX(-48px); }
          90%, 100% { transform: translateX(0); }
        }

        @keyframes student-wave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-2deg) translateY(-3px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .school-scene,
          .school-scene__shine,
          .school-login-copy,
          .school-scene__sun,
          .school-scene__cloud,
          .school-scene__tree,
          .school-scene__building,
          .school-scene__bus,
          .school-scene__student,
          .school-scene__flag,
          .school-scene__windows {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
