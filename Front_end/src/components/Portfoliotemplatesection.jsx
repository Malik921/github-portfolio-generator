import React, { useRef } from "react";
import "./PortfolioTemplateSection.css";

export const portfolioTemplates = [
  { id: 1,  name: "Dark Hacker",     navBg: "#0d0d0d", navText: "#ffffff", accent: "#00ff88", heroBg: "#111111", heroText: "#ffffff", cardBg: "#1a1a1a", sectionBg: "#0d0d0d" },
  { id: 2,  name: "Minimal White",   navBg: "#ffffff", navText: "#111111", accent: "#6366f1", heroBg: "#fafafa", heroText: "#111111", cardBg: "#f4f4f5", sectionBg: "#ffffff" },
  { id: 3,  name: "Blue Gradient",   navBg: "#1e3a8a", navText: "#ffffff", accent: "#60a5fa", heroBg: "#1e40af", heroText: "#ffffff", cardBg: "#1e3a8a", sectionBg: "#eff6ff" },
  { id: 4,  name: "Deep Purple",     navBg: "#1e1b4b", navText: "#ffffff", accent: "#a78bfa", heroBg: "#0f0a2e", heroText: "#ffffff", cardBg: "#1e1b4b", sectionBg: "#13103a" },
  { id: 5,  name: "Forest Green",    navBg: "#14532d", navText: "#ffffff", accent: "#4ade80", heroBg: "#052e16", heroText: "#ffffff", cardBg: "#14532d", sectionBg: "#f0fdf4" },
  { id: 6,  name: "Warm Sunset",     navBg: "#7c2d12", navText: "#ffffff", accent: "#fb923c", heroBg: "#431407", heroText: "#ffffff", cardBg: "#7c2d12", sectionBg: "#fff7ed" },
  { id: 7,  name: "Slate Pro",       navBg: "#0f172a", navText: "#e2e8f0", accent: "#38bdf8", heroBg: "#020617", heroText: "#f1f5f9", cardBg: "#1e293b", sectionBg: "#0f172a" },
  { id: 8,  name: "Rose Gold",       navBg: "#881337", navText: "#ffffff", accent: "#fb7185", heroBg: "#4c0519", heroText: "#ffffff", cardBg: "#881337", sectionBg: "#fff1f2" },
  { id: 9,  name: "Monochrome",      navBg: "#18181b", navText: "#ffffff", accent: "#d4d4d8", heroBg: "#09090b", heroText: "#fafafa", cardBg: "#27272a", sectionBg: "#18181b" },
  { id: 10, name: "Teal Modern",     navBg: "#134e4a", navText: "#ffffff", accent: "#2dd4bf", heroBg: "#042f2e", heroText: "#ffffff", cardBg: "#134e4a", sectionBg: "#f0fdfa" },
];

/* lightweight contrast checker */
const isLight = (hex) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return (0.299*r + 0.587*g + 0.114*b) > 160;
};

const PortfolioMiniPreview = ({ template, isSelected }) => {
  const { navBg, navText, accent, heroBg, heroText, cardBg, sectionBg } = template;
  const heroLight = isLight(heroBg);

  return (
    <div className="portfolio-mini-preview"
      style={{ borderColor: isSelected ? accent : "rgba(0,0,0,0.12)", background: sectionBg }}>

      {/* MINI NAVBAR */}
      <div style={{ background: navBg, padding:"5px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ width:16, height:4, background:accent, borderRadius:2 }} />
        <div style={{ display:"flex", gap:5 }}>
          {[30,28,32].map((w,i)=>(
            <div key={i} style={{ width:w, height:3, background:navText, borderRadius:2, opacity:0.5 }} />
          ))}
        </div>
      </div>

      {/* MINI HERO */}
      <div style={{ background: heroBg, padding:"10px 8px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ flex:1 }}>
          <div style={{ height:5, width:"70%", background:heroText, borderRadius:2, opacity:0.9, marginBottom:4 }} />
          <div style={{ height:3, width:"55%", background:heroText, borderRadius:2, opacity:0.5, marginBottom:3 }} />
          <div style={{ height:3, width:"45%", background:heroText, borderRadius:2, opacity:0.35, marginBottom:7 }} />
          <div style={{ display:"inline-block", padding:"3px 8px", background:accent, borderRadius:4 }}>
            <div style={{ height:3, width:36, background: isLight(accent) ? "#111" : "#fff", borderRadius:2 }} />
          </div>
        </div>
        <div style={{ width:38, height:38, borderRadius:"50%", background:accent, opacity:0.7, marginLeft:8, flexShrink:0 }} />
      </div>

      {/* MINI WORKED WITH */}
      <div style={{ background: sectionBg, padding:"5px 8px" }}>
        <div style={{ height:2.5, width:"30%", background: isLight(sectionBg)?"#94a3b8":"#475569", borderRadius:2, marginBottom:4, opacity:0.6 }} />
        <div style={{ display:"flex", gap:4 }}>
          {[40,36,42,38].map((w,i)=>(
            <div key={i} style={{ height:12, width:w, background: isLight(sectionBg)?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)", borderRadius:4, border:`1px solid ${isLight(sectionBg)?"rgba(0,0,0,0.12)":"rgba(255,255,255,0.1)"}` }} />
          ))}
        </div>
      </div>

      {/* MINI PROJECT CARDS */}
      <div style={{ background: sectionBg, padding:"4px 8px 6px", display:"flex", gap:5 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ flex:1, background:cardBg, borderRadius:5, padding:"5px 5px", borderTop:`2px solid ${accent}` }}>
            <div style={{ height:3, width:"80%", background: isLight(cardBg)?"#1e293b":"#e2e8f0", borderRadius:2, opacity:0.7, marginBottom:2 }} />
            <div style={{ height:2, width:"60%", background: isLight(cardBg)?"#64748b":"#94a3b8", borderRadius:2, opacity:0.5 }} />
          </div>
        ))}
      </div>

      {isSelected && (
        <div style={{ position:"absolute", top:6, right:6, width:18, height:18, borderRadius:"50%", background:accent,
          color: isLight(accent)?"#000":"#fff", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>✓</div>
      )}
    </div>
  );
};

const PortfolioTemplateSection = ({ selectedTemplate, onSelectTemplate }) => {
  const trackRef = useRef(null);
  const scroll = (d) => trackRef.current?.scrollBy({ left: d * 300, behavior: "smooth" });

  const handleSelect = (t) => {
    onSelectTemplate(t);
    const input = document.querySelector(".github-input");
    if (input) { input.scrollIntoView({ behavior:"smooth", block:"center" }); setTimeout(()=>input.focus(),600); }
  };

  return (
    <section id="portfolio-templates" className="template-section portfolio-template-section">
      <div className="template-section-header">
        <h2 className="template-section-title">Choose Your Portfolio Template</h2>
        <p className="template-section-sub">A full single-page portfolio site — downloaded as HTML/CSS/JS zip</p>
      </div>
      <div className="template-carousel-wrapper">
        <button className="carousel-arrow" onClick={() => scroll(-1)}>‹</button>
        <div className="template-track" ref={trackRef}>
          {portfolioTemplates.map((t) => (
            <div key={t.id}
              className={`template-card ${selectedTemplate?.id === t.id ? "selected" : ""}`}
              style={{ borderColor: selectedTemplate?.id === t.id ? t.accent : "transparent" }}
              onClick={() => handleSelect(t)}>
              <PortfolioMiniPreview template={t} isSelected={selectedTemplate?.id === t.id} />
              <div className="template-card-footer">
                <span className="template-name">{t.name}</span>
                <button className="use-template-btn" style={{ background: t.accent, color: isLight(t.accent) ? "#111":"#fff" }}
                  onClick={(e) => { e.stopPropagation(); handleSelect(t); }}>
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-arrow" onClick={() => scroll(1)}>›</button>
      </div>
    </section>
  );
};

export default PortfolioTemplateSection;