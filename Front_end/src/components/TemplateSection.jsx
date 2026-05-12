

import React, { useRef } from "react";
import "./TemplateSection.css";

const templates = [
  { id: 1, name: "Classic Pro",      accent: "#1a56db", bg: "#fff",     sidebar: "#1e3a5f", style: "classic" },
  { id: 2, name: "Modern Slate",     accent: "#0f766e", bg: "#f8fafc",  sidebar: "#134e4a", style: "modern" },
  { id: 3, name: "Executive Dark",   accent: "#7c3aed", bg: "#fff",     sidebar: "#1e1b4b", style: "executive" },
  //{ id: 4, name: "Minimal Light",    accent: "#d97706", bg: "#fffbeb",  sidebar: "#fff",    style: "minimal" },
  { id: 5, name: "Corporate Blue",   accent: "#1d4ed8", bg: "#fff",     sidebar: "#1e3a8a", style: "corporate" },
  { id: 6, name: "Elegant Rose",     accent: "#be185d", bg: "#fff",     sidebar: "#831843", style: "elegant" },
  { id: 7, name: "Tech Dark",        accent: "#06b6d4", bg: "#0f172a",  sidebar: "#0c4a6e", style: "tech" },
  { id: 8, name: "Fresh Green",      accent: "#16a34a", bg: "#f0fdf4",  sidebar: "#14532d", style: "fresh" },
  { id: 9, name: "Bold Crimson",     accent: "#dc2626", bg: "#fff",     sidebar: "#7f1d1d", style: "bold" },
  //{ id: 10, name: "Soft Lavender",   accent: "#7c3aed", bg: "#faf5ff",  sidebar: "#ede9fe", style: "soft" },
  { id: 11, name: "Sharp Black",     accent: "#f59e0b", bg: "#fff",     sidebar: "#111827", style: "sharp" },
  { id: 12, name: "Ocean Breeze",    accent: "#0284c7", bg: "#f0f9ff",  sidebar: "#0c4a6e", style: "ocean" },
  { id: 13, name: "Warm Terracotta", accent: "#c2410c", bg: "#fff7ed",  sidebar: "#7c2d12", style: "warm" },
  { id: 14, name: "Professional Gray",accent: "#374151",bg: "#f9fafb",  sidebar: "#1f2937", style: "gray" },
  { id: 15, name: "Neon Cyber",      accent: "#10b981", bg: "#030712",  sidebar: "#064e3b", style: "cyber" },
];

const CVMiniPreview = ({ template, isSelected }) => {
  const isDark = template.bg === "#0f172a" || template.bg === "#030712";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const lineColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  return (
    <div
      className="cv-mini-preview"
      style={{ background: template.bg, borderColor: isSelected ? template.accent : "rgba(0,0,0,0.12)" }}
    >
      {/* Sidebar */}
      <div className="cv-mini-sidebar" style={{ background: template.sidebar }}>
        <div className="mini-avatar" style={{ background: template.accent, opacity: 0.9 }} />
        <div className="mini-sidebar-line" style={{ background: "rgba(255,255,255,0.5)", width: "70%" }} />
        <div className="mini-sidebar-line" style={{ background: "rgba(255,255,255,0.3)", width: "50%" }} />
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          {[80, 60, 90, 70].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: template.accent, opacity: 0.8 }} />
              <div style={{ height: 3, width: `${w}%`, background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 3, width: "60%", background: template.accent, opacity: 0.7, borderRadius: 2, marginBottom: 6 }} />
          {[75, 55, 85].map((w, i) => (
            <div key={i} style={{ height: 3, width: `${w}%`, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginBottom: 4 }} />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="cv-mini-main">
        {/* Header */}
        <div style={{ borderBottom: `1px solid ${lineColor}`, paddingBottom: 6, marginBottom: 6 }}>
          <div style={{ height: 5, width: "65%", background: textColor, borderRadius: 2, opacity: 0.85, marginBottom: 3 }} />
          <div style={{ height: 3, width: "45%", background: template.accent, borderRadius: 2 }} />
          <div style={{ height: 2.5, width: "80%", background: mutedColor, borderRadius: 2, opacity: 0.4, marginTop: 3 }} />
        </div>

        {/* Experience */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ height: 3, width: "40%", background: template.accent, borderRadius: 2, marginBottom: 4 }} />
          {[
            { title: 75, sub: 55, lines: [90, 80] },
            { title: 65, sub: 50, lines: [85] },
          ].map((block, i) => (
            <div key={i} style={{ marginBottom: 5 }}>
              <div style={{ height: 3, width: `${block.title}%`, background: textColor, borderRadius: 2, opacity: 0.7, marginBottom: 2 }} />
              <div style={{ height: 2.5, width: `${block.sub}%`, background: template.accent, borderRadius: 2, opacity: 0.6, marginBottom: 2 }} />
              {block.lines.map((lw, j) => (
                <div key={j} style={{ height: 2, width: `${lw}%`, background: mutedColor, borderRadius: 2, opacity: 0.35, marginBottom: 1.5 }} />
              ))}
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <div style={{ height: 3, width: "35%", background: template.accent, borderRadius: 2, marginBottom: 4 }} />
          <div style={{ height: 3, width: "60%", background: textColor, borderRadius: 2, opacity: 0.7, marginBottom: 2 }} />
          <div style={{ height: 2.5, width: "45%", background: mutedColor, borderRadius: 2, opacity: 0.35 }} />
        </div>
      </div>

      {/* Selected badge */}
      {isSelected && (
        <div className="selected-badge" style={{ background: template.accent }}>✓</div>
      )}
    </div>
  );
};

const TemplateSection = ({ selectedTemplate, onSelectTemplate }) => {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: dir * 300, behavior: "smooth" });
    }
  };

  const handleSelect = (template) => {
    onSelectTemplate(template);
    const input = document.querySelector(".github-input");
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 600);
    }
  };

  return (
    <section id="cv-templates" className="template-section">
      <div className="template-section-header">
        <h2 className="template-section-title">Choose Your CV Template</h2>
        <p className="template-section-sub">
          Select a template below — your GitHub data will be automatically placed inside it
        </p>
      </div>

      <div className="template-carousel-wrapper">
        <button className="carousel-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left">‹</button>

        <div className="template-track" ref={trackRef}>
          {templates.map((t) => (
            <div
              key={t.id}
              className={`template-card ${selectedTemplate?.id === t.id ? "selected" : ""}`}
              onClick={() => handleSelect(t)}
            >
              <CVMiniPreview template={t} isSelected={selectedTemplate?.id === t.id} />
              <div className="template-card-footer">
                <span className="template-name">{t.name}</span>
                <button
                  className="use-template-btn"
                  style={{ background: t.accent }}
                  onClick={(e) => { e.stopPropagation(); handleSelect(t); }}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-arrow right" onClick={() => scroll(1)} aria-label="Scroll right">›</button>
      </div>

      <div className="template-dots">
        {templates.map((_, i) => (
          <span key={i} className="template-dot" />
        ))}
      </div>
    </section>
  );
};

export { templates };
export default TemplateSection;