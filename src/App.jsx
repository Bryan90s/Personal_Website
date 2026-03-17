import React, { useEffect, useMemo, useRef } from "react";

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);
}

function useFancyEffects({ starsRef }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const yearEl = document.querySelector("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const themeBtn = document.querySelector("#themeBtn");
    const themeKey = "bryan_theme";
    const storedTheme = localStorage.getItem(themeKey);
    if (storedTheme === "light") document.body.classList.add("theme--light");

    const setIcon = () => {
      const icon = themeBtn?.querySelector(".iconBtn__icon");
      if (!icon) return;
      icon.textContent = document.body.classList.contains("theme--light") ? "☀" : "◐";
    };

    setIcon();
    const onClick = () => {
      document.body.classList.toggle("theme--light");
      localStorage.setItem(themeKey, document.body.classList.contains("theme--light") ? "light" : "dark");
      setIcon();
    };
    themeBtn?.addEventListener("click", onClick);
    return () => themeBtn?.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const els = [...document.querySelectorAll(".reveal")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const typeEl = document.querySelector("#typewriter");
    if (!typeEl) return;
    if (prefersReducedMotion) {
      typeEl.textContent = "web apps, systems, and APIs";
      return;
    }

    const phrases = [
      "online shops & e‑commerce",
      "dashboards & admin systems",
      "APIs, auth, and databases",
      "Next.js / React / Vue frontends",
      "Node.js / Python backend services",
      "end‑to‑end product delivery",
    ];

    let i = 0;
    let s = "";
    let deleting = false;
    let last = performance.now();
    let raf = 0;

    const tick = (t) => {
      const dt = t - last;
      last = t;
      const target = phrases[i % phrases.length];

      const speed = deleting ? 28 : 40;
      const pause = deleting ? 350 : 900;

      if (!typeEl.dataset.pause) typeEl.dataset.pause = "0";
      let pauseLeft = Number(typeEl.dataset.pause);

      if (pauseLeft > 0) {
        pauseLeft = Math.max(0, pauseLeft - dt);
        typeEl.dataset.pause = String(pauseLeft);
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!deleting) {
        s = target.slice(0, Math.min(target.length, s.length + Math.max(1, Math.round(dt / speed))));
        typeEl.textContent = s;
        if (s.length >= target.length) {
          deleting = true;
          typeEl.dataset.pause = String(pause);
        }
      } else {
        s = s.slice(0, Math.max(0, s.length - Math.max(1, Math.round(dt / speed))));
        typeEl.textContent = s;
        if (s.length === 0) {
          deleting = false;
          i++;
          typeEl.dataset.pause = String(220);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const termEl = document.querySelector("#terminalText");
    if (!termEl) return;

    const lines = [
      "$ whoami",
      "bryan-leung (software developer)",
      "",
      "$ skills --list",
      "- react.js / next.js / vue.js",
      "- node.js / python",
      "- sql / system workflows",
      "",
      "$ focus",
      "ship clean UI + reliable backend",
      "",
      "$ contact --email",
      "ahwingbryan@gmail.com",
    ];
    const text = lines.join("\n");

    if (prefersReducedMotion) {
      termEl.textContent = text;
      return;
    }

    let idx = 0;
    let t = 0;
    const run = () => {
      idx = Math.min(text.length, idx + 2);
      termEl.textContent = text.slice(0, idx);
      if (idx < text.length) t = window.setTimeout(run, 18);
    };
    t = window.setTimeout(run, 350);
    return () => window.clearTimeout(t);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const tiltEls = [...document.querySelectorAll("[data-tilt]")];
    if (prefersReducedMotion) return;

    const cleanups = tiltEls.map((el) => {
      const max = 9;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -2 * max;
        const ry = (px - 0.5) * 2 * max;
        el.style.setProperty("--mx", `${Math.round(px * 100)}%`);
        el.style.setProperty("--my", `${Math.round(py * 100)}%`);
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
      };
      const onLeave = () => {
        el.style.transform = "";
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, [prefersReducedMotion]);

  useEffect(() => {
    const magneticEls = [...document.querySelectorAll(".magnetic")];
    if (prefersReducedMotion) return;

    const cleanups = magneticEls.map((el) => {
      const strength = el.classList.contains("cta--small") ? 10 : 16;
      let raf = 0;
      let tx = 0;
      let ty = 0;
      const onMove = (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const targetTx = (dx / r.width) * strength;
        const targetTy = (dy / r.height) * strength;
        
        const tick = () => {
          tx += (targetTx - tx) * 0.15;
          ty += (targetTy - ty) * 0.15;
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          raf = requestAnimationFrame(tick);
        };
        
        if (!raf) raf = requestAnimationFrame(tick);
      };
      const onLeave = () => {
        const tick = () => {
          tx += (0 - tx) * 0.15;
          ty += (0 - ty) * 0.15;
          
          if (Math.abs(tx) < 0.1 && Math.abs(ty) < 0.1) {
        el.style.transform = "";
        cancelAnimationFrame(raf);
        raf = 0;
        return;
          }
          
          el.style.transform = `translate(${tx}px, ${ty}px)`;
          raf = requestAnimationFrame(tick);
        };
        
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      };
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        if (raf) cancelAnimationFrame(raf);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    });

    return () => cleanups.forEach((fn) => fn());
  }, [prefersReducedMotion]);

  useEffect(() => {
    const form = document.querySelector("#miniForm");
    if (!form) return;

    const onSubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = String(fd.get("name") || "").trim();
      const type = String(fd.get("type") || "").trim();
      const msg = String(fd.get("message") || "").trim();
      const subject = `Project Inquiry - ${type || "Software Development"}`;
      const body = [
        "Hi Bryan,",
        "",
        `My name: ${name || "(not provided)"}`,
        `Project type: ${type || "(not provided)"}`,
        "",
        "Details:",
        msg || "(please describe your project)",
        "",
        "Timeline:",
        "- ",
        "",
        "Budget range:",
        "- ",
        "",
        "Links / references:",
        "- ",
        "",
        "Thanks!",
      ].join("\n");
      const href = `mailto:ahwingbryan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`;
      window.location.href = href;
    };

    form.addEventListener("submit", onSubmit);
    return () => form.removeEventListener("submit", onSubmit);
  }, []);

  useEffect(() => {
    const canvas = starsRef?.current;
    if (!(canvas instanceof HTMLCanvasElement)) return;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(2, window.devicePixelRatio || 1),
      stars: [],
      lastT: performance.now(),
      mx: 0.5,
      my: 0.35,
      raf: 0,
    };

    const resize = () => {
      state.w = Math.max(1, window.innerWidth);
      state.h = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(state.w * state.dpr);
      canvas.height = Math.floor(state.h * state.dpr);
      canvas.style.width = `${state.w}px`;
      canvas.style.height = `${state.h}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      const count = Math.floor(Math.min(220, (state.w * state.h) / 9000));
      state.stars = Array.from({ length: count }, () => ({
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        z: 0.35 + Math.random() * 0.9,
        r: 0.4 + Math.random() * 1.2,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e) => {
      state.mx = e.clientX / state.w;
      state.my = e.clientY / state.h;
    };

    const draw = (t) => {
      const dt = Math.min(40, t - state.lastT);
      state.lastT = t;

      ctx.clearRect(0, 0, state.w, state.h);

      const ox = (state.mx - 0.5) * 14;
      const oy = (state.my - 0.5) * 10;

      for (const s of state.stars) {
        s.tw += dt * 0.0012 * (0.6 + s.z);
        const tw = 0.55 + Math.sin(s.tw) * 0.45;
        const a = 0.08 + s.z * 0.18 + tw * 0.06;
        const x = s.x + ox * (0.6 + s.z);
        const y = s.y + oy * (0.6 + s.z);

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      state.raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    state.raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(state.raf);
    };
  }, [prefersReducedMotion, starsRef]);
}

export default function App() {
  const starsRef = useRef(null);
  useFancyEffects({ starsRef });

  return (
    <>
      <div className="bg">
        <div className="bg__grid" />
        <canvas ref={starsRef} id="stars" className="bg__stars" aria-hidden="true" />
        <div className="bg__blobs" aria-hidden="true">
          <div className="blob blob--a" />
          <div className="blob blob--b" />
          <div className="blob blob--c" />
        </div>
        <div className="bg__noise" aria-hidden="true" />
      </div>

      <header className="header" data-glass="">
        <a className="brand" href="#top" aria-label="Go to top">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__name">Bryan Leung</span>
        </a>

        <nav className="nav" aria-label="Primary navigation">
          <a className="nav__link" href="#services">
            Services
          </a>
          <a className="nav__link" href="#experience">
            Experience
          </a>
          <a className="nav__link" href="#stack">
            Stack
          </a>
          <a className="nav__link" href="#contact">
            Contact
          </a>
        </nav>

        <div className="header__actions">
          <button className="iconBtn" id="themeBtn" type="button" aria-label="Toggle theme">
            <span className="iconBtn__icon" aria-hidden="true">
              ◐
            </span>
          </button>
          <a className="cta cta--small magnetic" href="#contact">
            <span className="cta__shine" aria-hidden="true" />
            <span className="cta__label">Hire me</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero__left">
            <div className="pill reveal">
              <span className="pulse" aria-hidden="true" />
              <span>Available for freelance · Web, systems, and backend</span>
            </div>

            <h1 className="hero__title reveal">
              I build <span className="grad">high-impact</span> web products
              <span className="hero__titleSub">that feel fast, modern, and trustworthy.</span>
            </h1>

            <p className="hero__lead reveal">
              Software developer with experience delivering platforms for HK financial organizations. I ship
              responsive UIs, reliable APIs, databases, and end-to-end systems.
            </p>

            <div className="hero__roles reveal" aria-label="Key roles">
              <span className="mono">I can help with</span>
              <span className="type" id="typewriter" aria-live="polite" />
            </div>

            <div className="hero__ctaRow reveal">
              <a className="cta magnetic" href="#contact" data-track="cta-primary">
                <span className="cta__shine" aria-hidden="true" />
                <span className="cta__label">Let’s build your project</span>
                <span className="cta__arrow" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="ghostBtn" href="#services">
                See what I do
              </a>
            </div>

            <div className="hero__meta reveal">
              <a className="chip" href="mailto:ahwingbryan@gmail.com">
                <span className="chip__k">Email</span>
                <span className="chip__v">ahwingbryan@gmail.com</span>
              </a>
              <a
                className="chip"
                href="https://www.linkedin.com/in/YOUR_LINKEDIN_HANDLE"
                target="_blank"
                rel="noreferrer"
                title="Replace with your LinkedIn URL"
              >
                <span className="chip__k">LinkedIn</span>
                <span className="chip__v">@your-profile</span>
              </a>
            </div>
          </div>

          <div className="hero__right reveal">
            <div className="card3d" data-tilt="">
              <div className="card3d__inner">
                <div className="card3d__top">
                  <span className="badge">Trusted delivery</span>
                  <span className="mono small">React · Next.js · Vue · Node · Python · SQL</span>
                </div>

                <div className="statGrid">
                  <div className="stat">
                    <div className="stat__num">End‑to‑end</div>
                    <div className="stat__label">Product mindset + clean engineering</div>
                  </div>
                  <div className="stat">
                    <div className="stat__num">Systems</div>
                    <div className="stat__label">APIs, DB, auth, dashboards, workflows</div>
                  </div>
                  <div className="stat">
                    <div className="stat__num">Quality</div>
                    <div className="stat__label">Performance, security, maintainability</div>
                  </div>
                </div>

                <div className="terminal">
                  <div className="terminal__bar">
                    <span className="dot dot--r" />
                    <span className="dot dot--y" />
                    <span className="dot dot--g" />
                    <span className="terminal__title mono">bryan@dev:~</span>
                  </div>
                  <pre className="terminal__body mono" aria-label="Animated terminal">
                    <code id="terminalText" />
                  </pre>
                </div>

                <div className="card3d__glow" aria-hidden="true" />
              </div>
            </div>

            {/* <div className="scrollHint" aria-hidden="true">
              <span className="scrollHint__mouse" />
              <span className="mono small">Scroll</span>
            </div> */}
          </div>
        </section>

        <section className="section" id="services">
          <div className="section__head reveal">
            <h2 className="h2">Services that clients hire me for</h2>
            <p className="sub">
              Clear outcomes, modern UI, and solid backend foundations—built to scale with your business.
            </p>
          </div>

          <div className="grid3">
            <article className="tiltCard reveal" data-tilt="">
              <div className="tiltCard__icon">⚡</div>
              <h3>Web apps that convert</h3>
              <p>
                Landing pages, dashboards, admin panels, portals—fast, responsive, and polished with modern
                animations and UX.
              </p>
              <ul className="list">
                <li>React / Next.js / Vue</li>
                <li>SEO + performance</li>
                <li>Design-to-code execution</li>
              </ul>
            </article>

            <article className="tiltCard reveal" data-tilt="">
              <div className="tiltCard__icon">🧱</div>
              <h3>Backend & systems</h3>
              <p>APIs, auth, queues, integrations, and workflows. Clean architecture that’s easy to maintain.</p>
              <ul className="list">
                <li>Node.js / Python</li>
                <li>SQL databases</li>
                <li>Security-minded implementation</li>
              </ul>
            </article>

            <article className="tiltCard reveal" data-tilt="">
              <div className="tiltCard__icon">🛒</div>
              <h3>Online shops & business tools</h3>
              <p>E‑commerce, booking, internal systems, and custom platforms that automate operations.</p>
              <ul className="list">
                <li>Payments + admin tools</li>
                <li>Inventory / orders</li>
                <li>Analytics-ready tracking</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="section__head reveal">
            <h2 className="h2">Experience</h2>
            <p className="sub">Delivery for financial orgs in Hong Kong, with real-world constraints.</p>
          </div>

          <div className="timeline">
            <div className="timeline__line" aria-hidden="true" />

            <article className="timeItem reveal">
              <div className="timeItem__dot" aria-hidden="true" />
              <div className="timeItem__card">
                <div className="timeItem__top">
                  <h3 className="timeItem__title">Astri — Federated Learning Platform</h3>
                  <span className="timeItem__tag mono">Banks · Insurance · HKMA · IA</span>
                </div>
                <p className="timeItem__text">
                  Built a federated learning platform used by Hong Kong banks and insurance companies, serving
                  stakeholders including the Hong Kong Monetary Authority and Insurance Authority.
                </p>
                <div className="tagRow">
                  <span className="tag">Web platform</span>
                  <span className="tag">Security & governance</span>
                  <span className="tag">Data collaboration</span>
                </div>
              </div>
            </article>

            <article className="timeItem reveal">
              <div className="timeItem__dot" aria-hidden="true" />
              <div className="timeItem__card">
                <div className="timeItem__top">
                  <h3 className="timeItem__title">Hong Kong Monetary Authority — Loan Classification Platform</h3>
                  <span className="timeItem__tag mono">Risk · Workflow · Reporting</span>
                </div>
                <p className="timeItem__text">
                  Delivered a loan classification platform supporting clear workflows and consistent decisioning, 
                  tailored to regulatory and operational needs. Integrated SAML 2.0 SSO to streamline user authentication, 
                  ensuring secure, centralized access control and compliance with enterprise identity standards.
                </p>
                <div className="tagRow">
                  <span className="tag">Dashboards</span>
                  <span className="tag">Backend APIs</span>
                  <span className="tag">SQL</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="section" id="stack">
          <div className="section__head reveal">
            <h2 className="h2">Tech stack</h2>
            <p className="sub">Tools I’m comfortable shipping production work with.</p>
          </div>

          <div className="stackGrid reveal">
            <div className="stackCol">
              <h3 className="stackCol__h">Frontend</h3>
              <div className="pillGrid">
                <span className="pill2">React.js</span>
                <span className="pill2">Next.js</span>
                <span className="pill2">Vue.js</span>
                <span className="pill2">TypeScript</span>
                <span className="pill2">Performance</span>
                <span className="pill2">SEO</span>
              </div>
            </div>
            <div className="stackCol">
              <h3 className="stackCol__h">Backend</h3>
              <div className="pillGrid">
                <span className="pill2">Node.js</span>
                <span className="pill2">Python</span>
                <span className="pill2">REST APIs</span>
                <span className="pill2">Auth</span>
                <span className="pill2">Integrations</span>
                <span className="pill2">System design</span>
              </div>
            </div>
            <div className="stackCol">
              <h3 className="stackCol__h">Data</h3>
              <div className="pillGrid">
                <span className="pill2">SQL</span>
                <span className="pill2">Schema design</span>
                <span className="pill2">Reporting</span>
                <span className="pill2">ETL-ready</span>
                <span className="pill2">Observability</span>
                <span className="pill2">Reliability</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--cta" id="contact">
          <div className="ctaPanel reveal" data-glass="">
            <div className="ctaPanel__left">
              <h2 className="h2">Have a project in mind?</h2>
              <p className="sub">
                Tell me what you’re building. I can jump in as a freelance developer for web apps, systems,
                online shops, and custom platforms.
              </p>
              <div className="contactRow">
                <a
                  className="cta magnetic"
                  href="mailto:ahwingbryan@gmail.com?subject=Project%20Inquiry%20-%20Bryan%20Leung"
                >
                  <span className="cta__shine" aria-hidden="true" />
                  <span className="cta__label">Email me</span>
                  <span className="cta__arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
                <a
                  className="ghostBtn"
                  href="https://www.linkedin.com/in/bryan-leung-1386bb1b3/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on LinkedIn
                </a>
              </div>
              <p className="fine mono">
                Email: <a href="mailto:ahwingbryan@gmail.com">ahwingbryan@gmail.com</a>
              </p>
            </div>

            <form className="miniForm" id="miniForm" autoComplete="on">
              <label className="field">
                <span className="field__label">Your name</span>
                <input className="field__input" name="name" placeholder="Jane Doe" required />
              </label>
              <label className="field">
                <span className="field__label">Project type</span>
                <input className="field__input" name="type" placeholder="Online shop / system / web app" required />
              </label>
              <label className="field">
                <span className="field__label">What do you need?</span>
                <textarea
                  className="field__input field__input--ta"
                  name="message"
                  placeholder="Timeline, scope, links, requirements…"
                  required
                />
              </label>
              <button className="cta cta--block magnetic" type="submit">
                <span className="cta__shine" aria-hidden="true" />
                <span className="cta__label">Generate email draft</span>
                <span className="cta__arrow" aria-hidden="true">
                  →
                </span>
              </button>
              <p className="fine">This form doesn’t send data to a server; it generates a ready-to-send email.</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span className="mono small">
            © <span id="year" /> Bryan Leung
          </span>
          <div className="footer__links">
            <a className="footer__link" href="#services">
              Services
            </a>
            <a className="footer__link" href="#experience">
              Experience
            </a>
            <a className="footer__link" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

