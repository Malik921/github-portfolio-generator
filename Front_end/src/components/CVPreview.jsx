

import React, { useRef, useState } from "react";
import "./CVPreview.css";

/* ── language colors ─────────────────────────────────────────── */
const LC = {
  JavaScript:"#f1e05a", TypeScript:"#3178c6", Python:"#3572A5",
  Java:"#b07219", "C++":"#f34b7d", "C#":"#178600", Go:"#00ADD8",
  Rust:"#dea584", Ruby:"#701516", PHP:"#4F5D95", Swift:"#ffac45",
  Kotlin:"#A97BFF", HTML:"#e34c26", CSS:"#563d7c", Shell:"#89e051",
  Vue:"#41b883", React:"#61dafb", Dart:"#00B4AB", R:"#198CE7",
  Scala:"#c22d40", Assembly:"#6E4C13", Makefile:"#427819",
  "Jupyter Notebook":"#DA5B0B", SCSS:"#c6538c", C:"#555555",
  PowerShell:"#012456", Lua:"#000080", Perl:"#0298c3", Yacc:"#4B6C4B",
  SmPL:"#c30b4e", OpenSCAD:"#e5cd31",
};
const lc = (lang) => LC[lang] || "#8b92a5";

/* ── template helpers ────────────────────────────────────────── */
const isDarkBg = (bg) => bg === "#0f172a" || bg === "#030712";
const getStyles = (t) => ({
  dark:    isDarkBg(t.bg),
  text:    isDarkBg(t.bg) ? "#f1f5f9" : "#0f172a",
  muted:   isDarkBg(t.bg) ? "#94a3b8" : "#475569",
  card:    isDarkBg(t.bg) ? "rgba(255,255,255,0.05)" : "#f8fafc",
  track:   isDarkBg(t.bg) ? "rgba(255,255,255,0.1)"  : "#e2e8f0",
  divider: isDarkBg(t.bg) ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
  sideText:"rgba(255,255,255,0.82)",
  sideMuted:"rgba(255,255,255,0.55)",
});

/* ── small shared pieces ─────────────────────────────────────── */
const SH = ({ title, accent }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
      <div style={{ width:3, height:14, background:accent, borderRadius:2, flexShrink:0 }} />
      <h3 style={{ fontSize:10, fontWeight:700, color:accent, textTransform:"uppercase", letterSpacing:"1.5px", margin:0 }}>
        {title}
      </h3>
    </div>
    <div style={{ height:1, background:accent, opacity:0.2, borderRadius:1 }} />
  </div>
);

const SideRow = ({ icon, text, href }) =>
  text ? (
    <div style={{ display:"flex", alignItems:"flex-start", gap:7, marginBottom:6,
      fontSize:11, color:"rgba(255,255,255,0.78)", lineHeight:1.45 }}>
      <span style={{ flexShrink:0, marginTop:1 }}>{icon}</span>
      {href
        ? <a href={href} style={{ color:"rgba(255,255,255,0.78)", wordBreak:"break-all", textDecoration:"none" }}>{text}</a>
        : <span style={{ wordBreak:"break-all" }}>{text}</span>}
    </div>
  ) : null;

const StatRow = ({ label, value }) => (
  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11,
    color:"rgba(255,255,255,0.65)", marginBottom:4 }}>
    <span>{label}</span>
    <strong style={{ color:"rgba(255,255,255,0.95)" }}>{value}</strong>
  </div>
);

const fmtDate = (iso) => iso
  ? new Date(iso).toLocaleDateString("en-US",{ month:"short", year:"numeric" })
  : "";

/* ══════════════════════════════════════════════════════
   PRINT-BASED PDF DOWNLOAD
   Uses the browser print dialog — perfectly respects
   page-break-inside:avoid so nothing gets cut.
   For "save as PDF" users choose the PDF destination.
══════════════════════════════════════════════════════ */
const printCV = (cvEl, template, login) => {
  if (!cvEl) return;

  /* Clone the CV node so we can inject it into a fresh window */
  const clone = cvEl.cloneNode(true);

  const win = window.open("", "_blank", "width=900,height=700");
  if (!win) { alert("Allow pop-ups for this site to download the PDF."); return; }

  const isDark = isDarkBg(template.bg);

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${login || "cv"}_resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"/>
  <style>
    /* ── reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: #fff; }

    /* ── A4 page rules ── */
    @page {
      size: A4 portrait;
      margin: 0;
    }

    /* ── the CV wrapper ── */
    .cv-print-root {
      font-family: 'Poppins', 'Segoe UI', sans-serif;
      display: flex;
      width: 210mm;
      min-height: 0;            /* NO forced height — shrinks to content */
      background: ${template.bg};
      color: ${isDark ? "#f1f5f9" : "#0f172a"};
    }

    /* ── sidebar ── */
    .cv-sidebar {
      width: 62mm;
      flex-shrink: 0;
      background: ${template.sidebar};
      padding: 24px 16px;
      /* sidebar colour continues on every page */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── main ── */
    .cv-main {
      flex: 1;
      padding: 28px 24px;
      background: ${template.bg};
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── avatar — MUST be here; the class lives in CVPreview.css
          which is not loaded in the print popup window ── */
    .cv-avatar-img {
      width: 86px;
      height: 86px;
      border-radius: 50% !important;
      object-fit: cover;
      border: 3px solid rgba(255,255,255,0.25);
      display: block;
      margin: 0 auto 8px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv-avatar-placeholder {
      width: 86px;
      height: 86px;
      border-radius: 50% !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      font-weight: 700;
      color: white;
      border: 3px solid rgba(255,255,255,0.25);
      margin: 0 auto 8px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cv-sidebar-avatar-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 22px;
    }

    /* ── keep every card / repo row together ── */
    .cv-project-card,
    .cv-repo-row,
    .cv-lang-bar-row,
    .cv-sidebar-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* ── section heading never orphaned ── */
    .cv-section-heading {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* ── print ── */
    @media print {
      html, body { margin: 0; padding: 0; }
      .cv-print-root { width: 210mm; }
    }
  </style>
</head>
<body>
  <div class="cv-print-root">
    ${clone.querySelector(".cv-sidebar").outerHTML}
    ${clone.querySelector(".cv-main").outerHTML}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  <\/script>
</body>
</html>`);
  win.document.close();
};

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const CVPreview = ({ githubData, template, onBack }) => {
  const cvRef = useRef(null);
  const [printing, setPrinting] = useState(false);
  const S = getStyles(template);

  const {
    login, name, bio, avatar_url, html_url,
    location, company, blog, email, twitter,
    hireable, created_at,
    public_repos, followers, following,
    totalStars = 0, totalForks = 0, mostUsedLang,
    repos = [], topRepos = [],
    languages = {}, orgs = [],
    contributions = {}, topics = [],
  } = githubData;

  const topLangs = Object.entries(languages).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const totalBytes = topLangs.reduce((s,[,c])=>s+c,0);
  const has = (v) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length);
  const memberSince = created_at ? new Date(created_at).getFullYear() : null;

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      printCV(cvRef.current, template, login);
      setPrinting(false);
    }, 100);
  };

  return (
    <div className="cv-preview-page">

      {/* ── TOP BAR ── */}
      <div className="cv-topbar">
        <button className="cv-back-btn" onClick={onBack}>← Back</button>
        <div className="cv-topbar-center">
          <span className="cv-template-badge" style={{ background: template.accent }}>
            {template.name}
          </span>
          <span className="cv-preview-label">{name || login}</span>
        </div>
        <button className="cv-download-btn"
          onClick={handlePrint}
          disabled={printing}
          style={{ background: template.accent, opacity: printing ? 0.7 : 1 }}>
          {printing ? "⏳ Opening..." : "⬇ Download PDF"}
        </button>
      </div>

      {/* ── HINT ── */}
      <div className="cv-print-hint">
       
      </div>

      {/* ── CV DOCUMENT (screen preview) ── */}
      <div className="cv-document-wrapper">
        <div ref={cvRef} className="cv-document"
          style={{ background: template.bg, color: S.text }}>

          {/* ════ SIDEBAR ════ */}
          <div className="cv-sidebar" style={{ background: template.sidebar }}>

            {/* avatar */}
            <div className="cv-sidebar-avatar-wrap">
              {avatar_url
                ? <img src={avatar_url} alt={name||login} className="cv-avatar-img" crossOrigin="anonymous"/>
                : <div className="cv-avatar-placeholder" style={{ background: template.accent }}>
                    {(name||login||"?")[0].toUpperCase()}
                  </div>
              }
              {hireable &&
                <div style={{ marginTop:8, textAlign:"center" }}>
                  <span style={{ fontSize:9, background:"#10b981", color:"#fff",
                    borderRadius:20, padding:"2px 9px", fontWeight:700 }}>Open to Work</span>
                </div>
              }
            </div>

            {/* Contact */}
            <div className="cv-sidebar-section">
              <p className="cv-sidebar-heading" style={{ color: template.accent }}>Contact</p>
              <SideRow icon="🐙" text={`github.com/${login}`} href={html_url}/>
              <SideRow icon="📍" text={location}/>
              <SideRow icon="✉"  text={email} href={email?`mailto:${email}`:null}/>
              <SideRow icon="🌐" text={blog} href={blog}/>
              <SideRow icon="🏢" text={company}/>
              <SideRow icon="🐦" text={twitter?`@${twitter}`:null} href={twitter?`https://twitter.com/${twitter}`:null}/>
              {memberSince && <SideRow icon="📅" text={`Member since ${memberSince}`}/>}
            </div>

            {/* GitHub Stats */}
            <div className="cv-sidebar-section">
              <p className="cv-sidebar-heading" style={{ color: template.accent }}>GitHub Stats</p>
              <StatRow label="Repositories"   value={public_repos}/>
              <StatRow label="Followers"       value={followers}/>
              <StatRow label="Following"       value={following}/>
              <StatRow label="Total Stars ⭐"  value={totalStars}/>
              <StatRow label="Total Forks"     value={totalForks}/>
              {has(mostUsedLang) && <StatRow label="Top Language" value={mostUsedLang}/>}
            </div>

            {/* Recent Activity */}
            {(contributions.commits > 0 || contributions.prs > 0) && (
              <div className="cv-sidebar-section">
                <p className="cv-sidebar-heading" style={{ color: template.accent }}>Recent Activity</p>
                {contributions.commits > 0 && <StatRow label="Commits (90d)"  value={contributions.commits}/>}
                {contributions.prs     > 0 && <StatRow label="Pull Requests"  value={contributions.prs}/>}
                {contributions.issues  > 0 && <StatRow label="Issues"         value={contributions.issues}/>}
              </div>
            )}

            {/* Technologies */}
            {topLangs.length > 0 && (
              <div className="cv-sidebar-section">
                <p className="cv-sidebar-heading" style={{ color: template.accent }}>Technologies</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                  {topLangs.map(([lang]) => (
                    <span key={lang} style={{
                      display:"inline-flex", alignItems:"center", gap:4,
                      fontSize:10, color:"rgba(255,255,255,0.82)",
                      border:`1px solid ${lc(lang)}`, borderRadius:20, padding:"2px 7px",
                    }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:lc(lang), flexShrink:0 }}/>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Topics / Skills */}
            {topics.length > 0 && (
              <div className="cv-sidebar-section">
                <p className="cv-sidebar-heading" style={{ color: template.accent }}>Skills & Topics</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                  {topics.map(t => (
                    <span key={t} style={{
                      fontSize:9.5, color:"rgba(255,255,255,0.7)",
                      background:"rgba(255,255,255,0.08)", borderRadius:4, padding:"2px 6px",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Orgs */}
            {orgs.length > 0 && (
              <div className="cv-sidebar-section">
                <p className="cv-sidebar-heading" style={{ color: template.accent }}>Organizations</p>
                {orgs.map(o => (
                  <div key={o.login} style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                    {o.avatar && <img src={o.avatar} alt={o.login} crossOrigin="anonymous"
                      style={{ width:20, height:20, borderRadius:4, flexShrink:0 }}/>}
                    <span style={{ fontSize:10.5, color:"rgba(255,255,255,0.9)", fontWeight:600 }}>{o.login}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ════ MAIN ════ */}
          <div className="cv-main">

            {/* Header */}
            <div className="cv-header" style={{ borderBottomColor:`${template.accent}30` }}>
              <h1 className="cv-name" style={{ color: S.text }}>{name || login}</h1>
              <p className="cv-username" style={{ color: template.accent }}>
                @{login}{has(mostUsedLang) && ` · ${mostUsedLang} Developer`}
              </p>
              {has(bio) && <p className="cv-bio" style={{ color: S.muted }}>{bio}</p>}
            </div>

            {/* Featured Projects */}
            {topRepos.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-heading">
                  <SH title="⭐ Featured Projects" accent={template.accent}/>
                </div>
                <div className="cv-projects-grid">
                  {topRepos.map(repo => (
                    <div key={repo.id} className="cv-project-card"
                      style={{ borderLeftColor: template.accent, background: S.card }}>
                      <div className="cv-project-header">
                        <span style={{ fontSize:12.5, fontWeight:700, color:S.text, wordBreak:"break-word" }}>
                          {repo.name}
                        </span>
                        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                          {repo.stargazers_count > 0 &&
                            <span style={{ fontSize:10.5, fontWeight:700, color:template.accent }}>★ {repo.stargazers_count}</span>}
                          {repo.forks_count > 0 &&
                            <span style={{ fontSize:10.5, color:S.muted }}>⑂ {repo.forks_count}</span>}
                        </div>
                      </div>
                      {repo.description &&
                        <p style={{ fontSize:11, color:S.muted, margin:"3px 0 5px", lineHeight:1.5 }}>
                          {repo.description}
                        </p>}
                      {(repo.topics||[]).length > 0 &&
                        <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginBottom:5 }}>
                          {repo.topics.slice(0,4).map(t => (
                            <span key={t} style={{ fontSize:9.5, background:`${template.accent}18`,
                              color:template.accent, borderRadius:4, padding:"1px 5px", fontWeight:500 }}>{t}</span>
                          ))}
                        </div>}
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        {repo.language &&
                          <span style={{ display:"inline-flex", alignItems:"center", gap:4,
                            fontSize:10, fontWeight:600, padding:"2px 7px", borderRadius:20,
                            background:`${lc(repo.language)}18`, color:lc(repo.language) }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background:lc(repo.language) }}/>
                            {repo.language}
                          </span>}
                        <span style={{ fontSize:9.5, color:S.muted }}>
                          Updated {fmtDate(repo.pushed_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language Breakdown */}
            {topLangs.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-heading">
                  <SH title="Language Breakdown" accent={template.accent}/>
                </div>
                <div className="cv-lang-bars">
                  {topLangs.map(([lang, count]) => {
                    const pct = Math.round((count / totalBytes) * 100);
                    return (
                      <div key={lang} className="cv-lang-bar-row">
                        <span style={{ fontSize:11.5, fontWeight:500, width:100, flexShrink:0, color:S.text }}>{lang}</span>
                        <div style={{ flex:1, height:7, background:S.track, borderRadius:20, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:lc(lang), borderRadius:20 }}/>
                        </div>
                        <span style={{ fontSize:11, width:32, textAlign:"right", color:S.muted, flexShrink:0 }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* All Repositories */}
            {repos.length > 0 && (
              <div className="cv-section">
                <div className="cv-section-heading">
                  <SH title={`All Repositories (${repos.length})`} accent={template.accent}/>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                  {repos.map(repo => (
                    <div key={repo.id} className="cv-repo-row"
                      style={{ background:S.card, borderLeftColor:`${template.accent}40` }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:2 }}>
                          <span style={{ fontSize:12, fontWeight:600, color:S.text }}>{repo.name}</span>
                          {repo.fork &&
                            <span style={{ fontSize:9, background:S.track, color:S.muted,
                              borderRadius:4, padding:"1px 5px" }}>fork</span>}
                          {repo.archived &&
                            <span style={{ fontSize:9, background:"#f59e0b22", color:"#f59e0b",
                              borderRadius:4, padding:"1px 5px" }}>archived</span>}
                        </div>
                        {repo.description &&
                          <p style={{ fontSize:10.5, color:S.muted, margin:0, lineHeight:1.4 }}>
                            {repo.description}
                          </p>}
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end",
                        gap:3, flexShrink:0 }}>
                        {repo.language &&
                          <span style={{ display:"inline-flex", alignItems:"center", gap:3,
                            fontSize:10, color:S.muted }}>
                            <span style={{ width:5, height:5, borderRadius:"50%",
                              background:lc(repo.language), display:"inline-block" }}/>
                            {repo.language}
                          </span>}
                        {(repo.stargazers_count > 0 || repo.forks_count > 0) &&
                          <span style={{ fontSize:10, color:S.muted }}>
                            {repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : ""}
                            {repo.forks_count > 0 ? `  ⑂ ${repo.forks_count}` : ""}
                          </span>}
                        <span style={{ fontSize:9.5, color:S.muted, opacity:0.7 }}>
                          {fmtDate(repo.pushed_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>{/* end cv-main */}
        </div>{/* end cv-document */}
      </div>
    </div>
  );
};

export default CVPreview;