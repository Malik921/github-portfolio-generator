import React, { useRef, useState } from "react";
import "./PortfolioPreview.css";

/* ── contrast helper ───────────────────────────────────────────── */
const isLight = (hex = "#000000") => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b) > 160;
};

const LANG_COLORS = {
  JavaScript:"#f1e05a",TypeScript:"#3178c6",Python:"#3572A5",Java:"#b07219",
  "C++":"#f34b7d","C#":"#178600",Go:"#00ADD8",Rust:"#dea584",Ruby:"#701516",
  PHP:"#4F5D95",Swift:"#ffac45",Kotlin:"#A97BFF",HTML:"#e34c26",CSS:"#563d7c",
  Shell:"#89e051",Vue:"#41b883",Dart:"#00B4AB",
};

/* ── generate full HTML string for the portfolio ────────────────── */
const generatePortfolioHTML = (data, template) => {
  const {
    login, name, bio, avatar_url, location, company, blog, email, twitter,
    public_repos, followers, following, totalStars,
    topRepos = [], repos = [], languages = {}, orgs = [], topics = [],
    contributions = {},
  } = data;

  const { navBg, navText, accent, heroBg, heroText, cardBg, sectionBg } = template;
  const navTextColor = navText;
  const heroTextColor = heroText;
  const cardTextColor = isLight(cardBg) ? "#1e293b" : "#f1f5f9";
  const cardMutedColor = isLight(cardBg) ? "#64748b" : "#94a3b8";
  const sectionTextColor = isLight(sectionBg) ? "#1e293b" : "#f1f5f9";
  const sectionMutedColor = isLight(sectionBg) ? "#64748b" : "#94a3b8";
  const accentText = isLight(accent) ? "#111111" : "#ffffff";

  const topLangs = Object.entries(languages).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const totalBytes = topLangs.reduce((s,[,c])=>s+c,0);

  const displayName = name || login;

  // nav links — only include ones with data
  const navLinks = [
    { label:"About", id:"about" },
    ...(topRepos.length > 0 ? [{ label:"Projects", id:"projects" }] : []),
    ...(topLangs.length > 0 ? [{ label:"Skills", id:"skills" }] : []),
    ...(repos.length > 0 ? [{ label:"All Repos", id:"all-repos" }] : []),
    { label:"Contact", id:"contact" },
  ];

  const navLinksHTML = navLinks
    .map(l => `<a href="#${l.id}">${l.label}</a>`)
    .join("\n            ");

  const socialLinksHTML = [
    `<a href="https://github.com/${login}" target="_blank" rel="noreferrer" class="social-btn">GitHub</a>`,
    blog ? `<a href="${blog}" target="_blank" rel="noreferrer" class="social-btn">Website</a>` : "",
    twitter ? `<a href="https://twitter.com/${twitter}" target="_blank" rel="noreferrer" class="social-btn">Twitter</a>` : "",
    email ? `<a href="mailto:${email}" class="social-btn">Email</a>` : "",
  ].filter(Boolean).join("\n          ");

  const topReposHTML = topRepos.map(repo => `
        <div class="project-card">
          <div class="project-header">
            <h3>${repo.name}</h3>
            <div class="project-meta">
              ${repo.stargazers_count > 0 ? `<span class="star">★ ${repo.stargazers_count}</span>` : ""}
              ${repo.forks_count > 0 ? `<span class="fork">⑂ ${repo.forks_count}</span>` : ""}
            </div>
          </div>
          ${repo.description ? `<p class="project-desc">${repo.description}</p>` : ""}
          <div class="project-footer">
            ${repo.language ? `<span class="lang-badge" style="background:${(LANG_COLORS[repo.language]||accent)+"22"};color:${LANG_COLORS[repo.language]||accent}">${repo.language}</span>` : ""}
            <a href="${repo.html_url}" target="_blank" rel="noreferrer" class="repo-link">View →</a>
          </div>
          ${(repo.topics||[]).length > 0 ? `<div class="topic-row">${repo.topics.slice(0,4).map(t=>`<span class="topic">${t}</span>`).join("")}</div>` : ""}
        </div>`).join("");

  const langBarsHTML = topLangs.map(([lang, count]) => {
    const pct = Math.round((count/totalBytes)*100);
    const color = LANG_COLORS[lang] || accent;
    return `
        <div class="lang-row">
          <div class="lang-label">
            <span class="lang-dot" style="background:${color}"></span>
            <span>${lang}</span>
          </div>
          <div class="lang-bar-wrap">
            <div class="lang-bar-fill" style="width:${pct}%;background:${color}"></div>
          </div>
          <span class="lang-pct">${pct}%</span>
        </div>`;
  }).join("");

  const topicsHTML = topics.length > 0
    ? `<div class="topics-row">${topics.map(t=>`<span class="skill-chip">${t}</span>`).join("")}</div>`
    : "";

  const allReposHTML = repos.map(repo => `
        <div class="repo-row">
          <div class="repo-info">
            <span class="repo-name">${repo.name}</span>
            ${repo.fork ? '<span class="repo-badge">fork</span>' : ""}
            ${repo.archived ? '<span class="repo-badge archived">archived</span>' : ""}
            ${repo.description ? `<span class="repo-desc">${repo.description}</span>` : ""}
          </div>
          <div class="repo-right">
            ${repo.language ? `<span class="repo-lang"><span style="background:${LANG_COLORS[repo.language]||accent}" class="lang-dot"></span>${repo.language}</span>` : ""}
            ${repo.stargazers_count > 0 ? `<span class="repo-star">★ ${repo.stargazers_count}</span>` : ""}
          </div>
        </div>`).join("");

  const orgsHTML = orgs.length > 0 ? `
        <div class="orgs-row">
          ${orgs.map(o=>`<span class="org-chip">${o.login}</span>`).join("")}
        </div>` : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${displayName} — Portfolio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

  <!-- NAVBAR -->
  <nav class="navbar">
    <div class="nav-logo">${displayName}</div>
    <div class="nav-links">
      ${navLinksHTML}
    </div>
    <button class="nav-toggle" id="navToggle">☰</button>
  </nav>

  <!-- HERO -->
  <section class="hero" id="hero">
    <div class="hero-inner">
      <div class="hero-text">
        <p class="hero-greeting">Hi, I'm</p>
        <h1 class="hero-name">${displayName}</h1>
        ${bio ? `<p class="hero-bio">${bio}</p>` : ""}
        <div class="hero-stats">
          <div class="stat"><span class="stat-num">${public_repos}</span><span class="stat-label">Repos</span></div>
          <div class="stat"><span class="stat-num">${followers}</span><span class="stat-label">Followers</span></div>
          <div class="stat"><span class="stat-num">${totalStars}</span><span class="stat-label">Stars</span></div>
        </div>
        <div class="hero-socials">
          ${socialLinksHTML}
        </div>
      </div>
      <div class="hero-avatar">
        ${avatar_url
          ? `<img src="${avatar_url}" alt="${displayName}" class="avatar-img" />`
          : `<div class="avatar-placeholder">${(displayName||"?")[0].toUpperCase()}</div>`
        }
      </div>
    </div>
    <div class="hero-scroll-hint">scroll down ↓</div>
  </section>

  <!-- ABOUT -->
  <section class="section" id="about">
    <div class="container">
      <h2 class="section-title">About Me</h2>
      <div class="about-grid">
        <div class="about-info">
          ${location ? `<div class="about-row"><span class="about-icon">📍</span><span>${location}</span></div>` : ""}
          ${company ? `<div class="about-row"><span class="about-icon">🏢</span><span>${company}</span></div>` : ""}
          ${blog ? `<div class="about-row"><span class="about-icon">🌐</span><a href="${blog}" target="_blank">${blog}</a></div>` : ""}
          ${email ? `<div class="about-row"><span class="about-icon">✉</span><a href="mailto:${email}">${email}</a></div>` : ""}
          ${orgsHTML}
        </div>
        <div class="about-stats-grid">
          <div class="about-stat-card"><div class="asn">${public_repos}</div><div class="asl">Repositories</div></div>
          <div class="about-stat-card"><div class="asn">${followers}</div><div class="asl">Followers</div></div>
          <div class="about-stat-card"><div class="asn">${following}</div><div class="asl">Following</div></div>
          <div class="about-stat-card"><div class="asn">${totalStars}</div><div class="asl">Total Stars</div></div>
          ${contributions.commits > 0 ? `<div class="about-stat-card"><div class="asn">${contributions.commits}</div><div class="asl">Commits (90d)</div></div>` : ""}
          ${contributions.prs > 0 ? `<div class="about-stat-card"><div class="asn">${contributions.prs}</div><div class="asl">Pull Requests</div></div>` : ""}
        </div>
      </div>
    </div>
  </section>

  ${topRepos.length > 0 ? `
  <!-- PROJECTS -->
  <section class="section section-alt" id="projects">
    <div class="container">
      <h2 class="section-title">Featured Projects</h2>
      <div class="projects-grid">
        ${topReposHTML}
      </div>
    </div>
  </section>` : ""}

  ${topLangs.length > 0 ? `
  <!-- SKILLS -->
  <section class="section" id="skills">
    <div class="container">
      <h2 class="section-title">Skills & Languages</h2>
      <div class="skills-inner">
        <div class="lang-bars">
          ${langBarsHTML}
        </div>
        ${topicsHTML}
      </div>
    </div>
  </section>` : ""}

  ${repos.length > 0 ? `
  <!-- ALL REPOS -->
  <section class="section section-alt" id="all-repos">
    <div class="container">
      <h2 class="section-title">All Repositories <span class="repo-count">(${repos.length})</span></h2>
      <div class="all-repos-list">
        ${allReposHTML}
      </div>
    </div>
  </section>` : ""}

  <!-- CONTACT -->
  <section class="section contact-section" id="contact">
    <div class="container contact-inner">
      <h2 class="section-title">Get In Touch</h2>
      <p class="contact-sub">I'm always open to new opportunities and collaborations.</p>
      <div class="contact-links">
        <a href="https://github.com/${login}" target="_blank" rel="noreferrer" class="contact-btn">View GitHub Profile</a>
        ${email ? `<a href="mailto:${email}" class="contact-btn contact-btn-outline">Send Email</a>` : ""}
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <p>Built with GitHub Portfolio Generator · <a href="https://github.com/${login}" target="_blank">@${login}</a></p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`;

  const css = `/* =====================================
   ${displayName} — Portfolio Stylesheet
   Template: ${template.name}
===================================== */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { font-family: 'Inter', sans-serif; background: ${sectionBg}; color: ${sectionTextColor}; line-height: 1.6; }
a { color: ${accent}; text-decoration: none; }
a:hover { opacity: 0.8; }

/* ── NAVBAR ── */
.navbar {
  position: sticky; top: 0; z-index: 1000;
  background: ${navBg};
  padding: 0 40px;
  height: 64px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 2px 20px rgba(0,0,0,0.15);
}
.nav-logo { font-size: 18px; font-weight: 700; color: ${accent}; letter-spacing: -0.5px; }
.nav-links { display: flex; gap: 28px; }
.nav-links a { font-size: 14px; font-weight: 500; color: ${navTextColor}; opacity: 0.85; transition: all 0.2s; }
.nav-links a:hover { opacity: 1; color: ${accent}; }
.nav-toggle { display: none; background: transparent; border: none; color: ${navTextColor}; font-size: 22px; cursor: pointer; }

/* ── HERO ── */
.hero {
  min-height: 100vh;
  background: ${heroBg};
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 40px 60px;
  position: relative;
}
.hero::before {
  content: ""; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 70% 50%, ${accent}18, transparent 60%);
  pointer-events: none;
}
.hero-inner { max-width: 1100px; margin: auto; display: flex; justify-content: space-between; align-items: center; gap: 60px; width: 100%; }
.hero-text { flex: 1; }
.hero-greeting { font-size: 18px; color: ${accent}; font-weight: 600; margin-bottom: 8px; }
.hero-name { font-size: clamp(36px, 6vw, 72px); font-weight: 800; color: ${heroTextColor}; line-height: 1.1; margin-bottom: 20px; letter-spacing: -2px; }
.hero-bio { font-size: 17px; color: ${heroTextColor}; opacity: 0.7; max-width: 500px; line-height: 1.7; margin-bottom: 28px; }
.hero-stats { display: flex; gap: 32px; margin-bottom: 32px; }
.stat { display: flex; flex-direction: column; }
.stat-num { font-size: 28px; font-weight: 700; color: ${accent}; line-height: 1; }
.stat-label { font-size: 12px; color: ${heroTextColor}; opacity: 0.55; margin-top: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
.hero-socials { display: flex; gap: 12px; flex-wrap: wrap; }
.social-btn {
  padding: 10px 22px; border-radius: 8px; font-weight: 600; font-size: 14px;
  background: ${accent}; color: ${accentText}; transition: all 0.2s;
  display: inline-block;
}
.social-btn:first-child { background: ${accent}; color: ${accentText}; opacity: 1; }
.social-btn:not(:first-child) {
  background: transparent; color: ${heroTextColor};
  border: 1.5px solid ${heroTextColor}30; opacity: 0.8;
}
.social-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.2); opacity: 1; }
.hero-avatar { flex-shrink: 0; }
.avatar-img { width: 220px; height: 220px; border-radius: 50%; object-fit: cover; border: 4px solid ${accent}; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.avatar-placeholder { width: 220px; height: 220px; border-radius: 50%; background: ${accent}; display: flex; align-items: center; justify-content: center; font-size: 72px; font-weight: 700; color: ${accentText}; }
.hero-scroll-hint { text-align: center; color: ${heroTextColor}; opacity: 0.3; font-size: 13px; margin-top: 60px; }

/* ── SECTIONS ── */
.section { padding: 90px 40px; }
.section-alt { background: ${isLight(sectionBg) ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)"}; }
.container { max-width: 1100px; margin: auto; }
.section-title {
  font-size: 32px; font-weight: 700; color: ${sectionTextColor};
  margin-bottom: 40px; letter-spacing: -0.5px;
  padding-bottom: 12px; border-bottom: 2px solid ${accent}30;
  display: flex; align-items: center; gap: 12px;
}
.section-title::before { content: ""; width: 4px; height: 32px; background: ${accent}; border-radius: 2px; display: inline-block; }
.repo-count { font-size: 18px; font-weight: 400; opacity: 0.5; }

/* ── ABOUT ── */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.about-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; font-size: 15px; color: ${sectionTextColor}; }
.about-icon { font-size: 18px; }
.about-row a { color: ${accent}; }
.about-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.about-stat-card { background: ${cardBg}; border-radius: 12px; padding: 18px; border-left: 3px solid ${accent}; }
.asn { font-size: 28px; font-weight: 700; color: ${accent}; line-height: 1; }
.asl { font-size: 12px; color: ${cardMutedColor}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.orgs-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
.org-chip { background: ${accent}18; color: ${accent}; border-radius: 20px; padding: 4px 12px; font-size: 13px; font-weight: 600; }

/* ── PROJECTS ── */
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.project-card {
  background: ${cardBg}; border-radius: 14px; padding: 22px;
  border-top: 3px solid ${accent}; transition: all 0.25s;
  display: flex; flex-direction: column; gap: 8px;
}
.project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.project-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.project-header h3 { font-size: 15px; font-weight: 700; color: ${cardTextColor}; word-break: break-word; }
.project-meta { display: flex; gap: 8px; flex-shrink: 0; }
.star { color: ${accent}; font-size: 12px; font-weight: 700; }
.fork { color: ${cardMutedColor}; font-size: 12px; }
.project-desc { font-size: 13px; color: ${cardMutedColor}; line-height: 1.5; flex: 1; }
.project-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.lang-badge { font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
.repo-link { font-size: 13px; font-weight: 600; color: ${accent}; }
.topic-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
.topic { font-size: 10.5px; background: ${accent}15; color: ${accent}; border-radius: 4px; padding: 2px 7px; font-weight: 500; }

/* ── SKILLS ── */
.skills-inner { display: flex; flex-direction: column; gap: 28px; }
.lang-bars { display: flex; flex-direction: column; gap: 12px; }
.lang-row { display: flex; align-items: center; gap: 12px; }
.lang-label { display: flex; align-items: center; gap: 7px; width: 120px; flex-shrink: 0; font-size: 13.5px; font-weight: 500; color: ${sectionTextColor}; }
.lang-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; display: inline-block; }
.lang-bar-wrap { flex: 1; height: 8px; background: ${isLight(sectionBg)?"#e2e8f0":"rgba(255,255,255,0.08)"}; border-radius: 20px; overflow: hidden; }
.lang-bar-fill { height: 100%; border-radius: 20px; transition: width 1s ease; }
.lang-pct { font-size: 12px; color: ${sectionMutedColor}; width: 36px; text-align: right; flex-shrink: 0; }
.topics-row { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-chip { background: ${accent}18; color: ${accent}; border-radius: 20px; padding: 5px 14px; font-size: 13px; font-weight: 600; border: 1px solid ${accent}30; }

/* ── ALL REPOS ── */
.all-repos-list { display: flex; flex-direction: column; gap: 10px; }
.repo-row {
  display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;
  padding: 14px 16px; background: ${cardBg}; border-radius: 10px;
  border-left: 2px solid ${accent}40; transition: all 0.2s;
}
.repo-row:hover { border-left-color: ${accent}; transform: translateX(3px); }
.repo-info { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; flex: 1; min-width: 0; }
.repo-name { font-size: 14px; font-weight: 600; color: ${cardTextColor}; }
.repo-badge { font-size: 10px; background: ${isLight(cardBg)?"#e2e8f0":"rgba(255,255,255,0.1)"}; color: ${cardMutedColor}; border-radius: 4px; padding: 2px 6px; }
.repo-badge.archived { background: #f59e0b22; color: #f59e0b; }
.repo-desc { font-size: 12.5px; color: ${cardMutedColor}; flex-basis: 100%; line-height: 1.4; }
.repo-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.repo-lang { display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${cardMutedColor}; }
.repo-star { font-size: 12px; color: ${accent}; font-weight: 600; }

/* ── CONTACT ── */
.contact-section { background: ${heroBg}; }
.contact-inner { text-align: center; }
.contact-inner .section-title { justify-content: center; }
.contact-inner .section-title::before { display: none; }
.contact-sub { font-size: 16px; color: ${heroTextColor}; opacity: 0.6; margin-bottom: 32px; }
.contact-links { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
.contact-btn { padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; background: ${accent}; color: ${accentText}; transition: all 0.2s; display: inline-block; }
.contact-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.25); opacity: 1; }
.contact-btn-outline { background: transparent; color: ${heroTextColor}; border: 2px solid ${heroTextColor}30; }

/* ── FOOTER ── */
.footer { background: ${navBg}; color: ${navTextColor}; text-align: center; padding: 24px; font-size: 13px; opacity: 0.7; }
.footer a { color: ${accent}; }

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero-inner { flex-direction: column-reverse; text-align: center; gap: 30px; }
  .hero-stats { justify-content: center; }
  .hero-socials { justify-content: center; }
  .avatar-img, .avatar-placeholder { width: 140px; height: 140px; font-size: 48px; }
  .about-grid { grid-template-columns: 1fr; }
  .projects-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
  .nav-toggle { display: block; }
  .nav-links.open { display: flex; flex-direction: column; position: absolute; top: 64px; left: 0; right: 0; background: ${navBg}; padding: 20px 40px; gap: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
  .section { padding: 60px 20px; }
  .hero { padding: 60px 20px 40px; }
  .navbar { padding: 0 20px; }
}
`;

  const js = `// Portfolio Script — ${displayName}

// smooth nav toggle for mobile
const toggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// animate lang bars on scroll
const bars = document.querySelectorAll('.lang-bar-fill');
if (bars.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target;
        const w = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => { fill.style.width = w; }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.2 });
  bars.forEach(b => observer.observe(b));
}

// active nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) current = s.id;
  });
  links.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? '${accent}' : '';
    a.style.opacity = a.getAttribute('href') === '#' + current ? '1' : '';
  });
});
`;

  return { html, css, js };
};

/* ── ZIP download using JSZip ───────────────────────────────────── */
const downloadZip = async (data, template) => {
  const JSZip = (await import("jszip")).default;
  const { html, css, js } = generatePortfolioHTML(data, template);

  const zip = new JSZip();
  const folder = zip.folder(`${data.login || "portfolio"}_portfolio`);
  folder.file("index.html", html);
  folder.file("style.css", css);
  folder.file("script.js", js);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${data.login || "portfolio"}_portfolio.zip`;
  a.click();
  URL.revokeObjectURL(url);
};

/* ══════════════════════════════════════════════════════════════
   LIVE PREVIEW COMPONENT
══════════════════════════════════════════════════════════════ */
const PortfolioPreview = ({ githubData, template, onBack }) => {
  const [downloading, setDownloading] = useState(false);
  const iframeRef = useRef(null);

  const {
    login, name, bio, avatar_url, location, company, blog, email, twitter,
    public_repos, followers, following, totalStars,
    topRepos = [], repos = [], languages = {}, orgs = [], topics = [],
    contributions = {},
  } = githubData;

  const { navBg, navText, accent, heroBg, heroText, cardBg, sectionBg } = template;
  const accentText = isLight(accent) ? "#111" : "#fff";
  const sectionText = isLight(sectionBg) ? "#1e293b" : "#f1f5f9";
  const sectionMuted = isLight(sectionBg) ? "#64748b" : "#94a3b8";
  const cardText = isLight(cardBg) ? "#1e293b" : "#f1f5f9";
  const cardMuted = isLight(cardBg) ? "#64748b" : "#94a3b8";

  const topLangs = Object.entries(languages).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const totalBytes = topLangs.reduce((s,[,c])=>s+c,0);
  const displayName = name || login;

  const navLinks = [
    "About",
    ...(topRepos.length > 0 ? ["Projects"] : []),
    ...(topLangs.length > 0 ? ["Skills"] : []),
    ...(repos.length > 0 ? ["All Repos"] : []),
    "Contact",
  ];

  const handleDownload = async () => {
    setDownloading(true);
    try { await downloadZip(githubData, template); }
    catch(e) { console.error(e); alert("Download failed. Make sure jszip is installed: npm install jszip"); }
    finally { setDownloading(false); }
  };

  return (
    <div className="portfolio-preview-page">

      {/* TOP BAR */}
      <div className="port-topbar">
        <button className="port-back-btn" onClick={onBack}>← Back</button>
        <div className="port-topbar-center">
          <span className="port-badge" style={{ background: accent, color: accentText }}>{template.name}</span>
          <span className="port-label">Portfolio Preview — {displayName}</span>
        </div>
        <button className="port-download-btn" onClick={handleDownload} disabled={downloading}
          style={{ background: accent, color: accentText, opacity: downloading ? 0.7 : 1 }}>
          {downloading ? "⏳ Zipping..." : "⬇ Download ZIP"}
        </button>
      </div>

      {/* LIVE PORTFOLIO */}
      <div className="portfolio-live" style={{ background: sectionBg, color: sectionText, fontFamily:"'Inter',sans-serif" }}>

        {/* ── NAVBAR ── */}
        <nav className="pf-nav" style={{ background: navBg }}>
          <div className="pf-nav-logo" style={{ color: accent }}>{displayName}</div>
          <div className="pf-nav-links">
            {navLinks.map(l => (
              <a key={l} href={`#pf-${l.toLowerCase().replace(" ","-")}`}
                style={{ color: navText }}>{l}</a>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="pf-hero" style={{ background: heroBg }} id="pf-hero">
          <div className="pf-hero-inner">
            <div className="pf-hero-text">
              <p className="pf-greeting" style={{ color: accent }}>Hi, I'm</p>
              <h1 className="pf-name" style={{ color: heroText }}>{displayName}</h1>
              {bio && <p className="pf-bio" style={{ color: heroText }}>{bio}</p>}
              <div className="pf-stats">
                {[["Repos", public_repos],["Followers", followers],["Stars ⭐", totalStars]].map(([l,v])=>(
                  <div key={l} className="pf-stat">
                    <span className="pf-stat-n" style={{ color: accent }}>{v}</span>
                    <span className="pf-stat-l" style={{ color: heroText }}>{l}</span>
                  </div>
                ))}
              </div>
              <div className="pf-socials">
                <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer"
                  className="pf-btn-primary" style={{ background: accent, color: accentText }}>GitHub</a>
                {blog && <a href={blog} target="_blank" rel="noreferrer" className="pf-btn-outline" style={{ color: heroText, borderColor:`${heroText}30` }}>Website</a>}
                {twitter && <a href={`https://twitter.com/${twitter}`} target="_blank" rel="noreferrer" className="pf-btn-outline" style={{ color: heroText, borderColor:`${heroText}30` }}>Twitter</a>}
              </div>
            </div>
            <div className="pf-hero-avatar">
              {avatar_url
                ? <img src={avatar_url} alt={displayName} className="pf-avatar" style={{ borderColor: accent }} crossOrigin="anonymous" />
                : <div className="pf-avatar-ph" style={{ background: accent, color: accentText }}>{(displayName||"?")[0].toUpperCase()}</div>
              }
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section className="pf-section" id="pf-about" style={{ background: sectionBg }}>
          <div className="pf-container">
            <h2 className="pf-section-title" style={{ color: sectionText, borderColor:`${accent}30` }}>
              <span className="pf-title-bar" style={{ background: accent }} />
              About Me
            </h2>
            <div className="pf-about-grid">
              <div className="pf-about-info">
                {[location&&["📍",location],company&&["🏢",company],blog&&["🌐",blog],email&&["✉",email]].filter(Boolean).map(([icon,val])=>(
                  <div key={icon} className="pf-about-row" style={{ color: sectionText }}>
                    <span>{icon}</span><span>{val}</span>
                  </div>
                ))}
                {orgs.length > 0 && (
                  <div className="pf-orgs">
                    {orgs.map(o=><span key={o.login} className="pf-org-chip" style={{ background:`${accent}18`, color:accent }}>{o.login}</span>)}
                  </div>
                )}
              </div>
              <div className="pf-stat-grid">
                {[["Repositories",public_repos],["Followers",followers],["Following",following],["Total Stars ⭐",totalStars],
                  ...(contributions.commits>0?[["Commits (90d)",contributions.commits]]:[]),
                  ...(contributions.prs>0?[["Pull Requests",contributions.prs]]:[])
                ].map(([l,v])=>(
                  <div key={l} className="pf-stat-card" style={{ background:cardBg, borderColor:accent }}>
                    <div className="pf-sn" style={{ color:accent }}>{v}</div>
                    <div className="pf-sl" style={{ color:cardMuted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PROJECTS ── */}
        {topRepos.length > 0 && (
          <section className="pf-section pf-alt" id="pf-projects"
            style={{ background: isLight(sectionBg)?"rgba(0,0,0,0.03)":"rgba(255,255,255,0.03)" }}>
            <div className="pf-container">
              <h2 className="pf-section-title" style={{ color: sectionText, borderColor:`${accent}30` }}>
                <span className="pf-title-bar" style={{ background: accent }} />Featured Projects
              </h2>
              <div className="pf-projects-grid">
                {topRepos.map(repo => (
                  <div key={repo.id} className="pf-project-card" style={{ background:cardBg, borderColor:accent }}>
                    <div className="pf-proj-head">
                      <span className="pf-proj-name" style={{ color:cardText }}>{repo.name}</span>
                      <div className="pf-proj-meta">
                        {repo.stargazers_count>0&&<span style={{color:accent,fontSize:12,fontWeight:700}}>★ {repo.stargazers_count}</span>}
                        {repo.forks_count>0&&<span style={{color:cardMuted,fontSize:12}}>⑂ {repo.forks_count}</span>}
                      </div>
                    </div>
                    {repo.description&&<p className="pf-proj-desc" style={{color:cardMuted}}>{repo.description}</p>}
                    {(repo.topics||[]).length>0&&(
                      <div className="pf-topics">
                        {repo.topics.slice(0,4).map(t=><span key={t} className="pf-topic" style={{background:`${accent}18`,color:accent}}>{t}</span>)}
                      </div>
                    )}
                    <div className="pf-proj-foot">
                      {repo.language&&(
                        <span className="pf-lang" style={{background:`${LANG_COLORS[repo.language]||accent}20`,color:LANG_COLORS[repo.language]||accent}}>
                          <span style={{width:7,height:7,borderRadius:"50%",background:LANG_COLORS[repo.language]||accent,display:"inline-block",marginRight:4}}/>
                          {repo.language}
                        </span>
                      )}
                      <a href={repo.html_url} target="_blank" rel="noreferrer" style={{color:accent,fontSize:13,fontWeight:600}}>View →</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── SKILLS ── */}
        {topLangs.length > 0 && (
          <section className="pf-section" id="pf-skills" style={{ background: sectionBg }}>
            <div className="pf-container">
              <h2 className="pf-section-title" style={{ color:sectionText, borderColor:`${accent}30` }}>
                <span className="pf-title-bar" style={{background:accent}}/>Skills & Languages
              </h2>
              <div className="pf-lang-bars">
                {topLangs.map(([lang,count])=>{
                  const pct=Math.round((count/totalBytes)*100);
                  const col=LANG_COLORS[lang]||accent;
                  return (
                    <div key={lang} className="pf-lang-row">
                      <div className="pf-lang-label" style={{color:sectionText}}>
                        <span style={{width:9,height:9,borderRadius:"50%",background:col,display:"inline-block"}}/>
                        {lang}
                      </div>
                      <div className="pf-lang-track" style={{background:isLight(sectionBg)?"#e2e8f0":"rgba(255,255,255,0.08)"}}>
                        <div className="pf-lang-fill" style={{width:`${pct}%`,background:col}}/>
                      </div>
                      <span className="pf-lang-pct" style={{color:sectionMuted}}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
              {topics.length>0&&(
                <div className="pf-topics-row">
                  {topics.map(t=><span key={t} className="pf-skill-chip" style={{background:`${accent}15`,color:accent,border:`1px solid ${accent}30`}}>{t}</span>)}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── ALL REPOS ── */}
        {repos.length > 0 && (
          <section className="pf-section pf-alt" id="pf-all-repos"
            style={{background:isLight(sectionBg)?"rgba(0,0,0,0.03)":"rgba(255,255,255,0.03)"}}>
            <div className="pf-container">
              <h2 className="pf-section-title" style={{color:sectionText,borderColor:`${accent}30`}}>
                <span className="pf-title-bar" style={{background:accent}}/>
                All Repositories <span style={{fontSize:18,fontWeight:400,opacity:0.5}}>({repos.length})</span>
              </h2>
              <div className="pf-all-repos">
                {repos.map(repo=>(
                  <div key={repo.id} className="pf-repo-row" style={{background:cardBg,borderColor:`${accent}40`}}>
                    <div className="pf-repo-info">
                      <span style={{fontSize:14,fontWeight:600,color:cardText}}>{repo.name}</span>
                      {repo.fork&&<span className="pf-repo-badge" style={{background:isLight(cardBg)?"#e2e8f0":"rgba(255,255,255,0.1)",color:cardMuted}}>fork</span>}
                      {repo.archived&&<span className="pf-repo-badge" style={{background:"#f59e0b22",color:"#f59e0b"}}>archived</span>}
                      {repo.description&&<span style={{fontSize:12.5,color:cardMuted,display:"block"}}>{repo.description}</span>}
                    </div>
                    <div className="pf-repo-right">
                      {repo.language&&<span style={{display:"flex",alignItems:"center",gap:5,fontSize:12,color:cardMuted}}>
                        <span style={{width:6,height:6,borderRadius:"50%",background:LANG_COLORS[repo.language]||accent,display:"inline-block"}}/>
                        {repo.language}</span>}
                      {repo.stargazers_count>0&&<span style={{fontSize:12,color:accent,fontWeight:600}}>★ {repo.stargazers_count}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CONTACT ── */}
        <section className="pf-section pf-contact" id="pf-contact" style={{background:heroBg}}>
          <div className="pf-container" style={{textAlign:"center"}}>
            <h2 className="pf-section-title" style={{color:heroText,borderColor:`${accent}30`,justifyContent:"center"}}>
              Get In Touch
            </h2>
            <p style={{color:heroText,opacity:0.6,marginBottom:28,fontSize:16}}>Always open to new opportunities and collaborations.</p>
            <div className="pf-contact-links">
              <a href={`https://github.com/${login}`} target="_blank" rel="noreferrer"
                className="pf-contact-btn" style={{background:accent,color:accentText}}>View GitHub Profile</a>
              {email&&<a href={`mailto:${email}`} className="pf-contact-btn pf-contact-outline" style={{color:heroText,borderColor:`${heroText}30`}}>Send Email</a>}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="pf-footer" style={{background:navBg,color:navText}}>
          Built with GitHub Portfolio Generator · <a href={`https://github.com/${login}`} style={{color:accent}}>@{login}</a>
        </footer>

      </div>
    </div>
  );
};

export default PortfolioPreview;