

import React, { useState } from "react";
import "./HeroSection.css";

const HeroSection = ({
  username, setUsername, inputRef,
  selectedCVTemplate, selectedPortfolioTemplate,
  onGenerateCV, onGeneratePortfolio, scrollTo,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="hero">
      <div className="blur blur1" />
      <div className="blur blur2" />

      <h1 className="main-title">GitHub Portfolio Generator</h1>

      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">G</div>
        <div className="nav-links">
          {/* FIX: dropdown stays open when mouse moves into menu via padding bridge */}
          <div
            className={`dropdown ${open ? "dropdown--open" : ""}`}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="template-btn" onClick={() => setOpen((v) => !v)}>
              Templates ▾
            </button>
            {/* invisible bridge so the menu doesn't close as mouse moves down */}
            <div className="dropdown-bridge" />
            <div className={`dropdown-menu ${open ? "show" : ""}`}>
              <button
                className="dropdown-item"
                onClick={() => { scrollTo("cv-templates"); setOpen(false); }}
              >
                <span className="dropdown-item-icon">📄</span>
                CV Templates
              </button>
              <button
                className="dropdown-item"
                onClick={() => { scrollTo("portfolio-templates"); setOpen(false); }}
              >
                <span className="dropdown-item-icon">🌐</span>
                Portfolio Templates
              </button>
            </div>
          </div>
          <button className="nav-btn" onClick={() => scrollTo("about")}>About Us</button>
          <button className="nav-btn" onClick={() => scrollTo("faqs")}>FAQs</button>
        </div>
      </div>

      {/* HERO CONTENT */}
      <div className="hero-content">
        <div className="left-content">
          <h1>
            Build Your <br />
            Professional <br />
            <span>GitHub</span> Portfolio/CV
          </h1>
          <p>
            Create a stunning portfolio or CV in minutes.
            All data fetched automatically from your GitHub profile.
          </p>

          {/* ── HCI: STEP INDICATOR CARDS ── */}
          <div className="steps-row">

            {/* STEP 1 — CV Template */}
            <div
              className={`step-card ${selectedCVTemplate ? "step-card--done" : "step-card--pending"}`}
              onClick={() => scrollTo("cv-templates")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollTo("cv-templates")}
              aria-label="Choose CV Template"
            >
              <div className="step-number" style={selectedCVTemplate ? { background: selectedCVTemplate.accent } : {}}>
                {selectedCVTemplate ? "✓" : "1"}
              </div>
              <div className="step-text-wrap">
                <span className="step-label">CV Template</span>
                {selectedCVTemplate ? (
                  <span className="step-value" style={{ color: selectedCVTemplate.accent }}>
                    {selectedCVTemplate.name}
                  </span>
                ) : (
                  <span className="step-action">Click to choose ↓</span>
                )}
              </div>
              {selectedCVTemplate && (
                <button
                  className="step-change-btn"
                  onClick={(e) => { e.stopPropagation(); scrollTo("cv-templates"); }}
                  aria-label="Change CV template"
                >
                  Change
                </button>
              )}
            </div>

            {/* STEP 2 — Portfolio Template */}
            <div
              className={`step-card ${selectedPortfolioTemplate ? "step-card--done" : "step-card--pending"}`}
              onClick={() => scrollTo("portfolio-templates")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && scrollTo("portfolio-templates")}
              aria-label="Choose Portfolio Template"
            >
              <div className="step-number" style={selectedPortfolioTemplate ? { background: selectedPortfolioTemplate.accent } : {}}>
                {selectedPortfolioTemplate ? "✓" : "2"}
              </div>
              <div className="step-text-wrap">
                <span className="step-label">Portfolio Template</span>
                {selectedPortfolioTemplate ? (
                  <span className="step-value" style={{ color: selectedPortfolioTemplate.accent }}>
                    {selectedPortfolioTemplate.name}
                  </span>
                ) : (
                  <span className="step-action">Click to choose ↓</span>
                )}
              </div>
              {selectedPortfolioTemplate && (
                <button
                  className="step-change-btn"
                  onClick={(e) => { e.stopPropagation(); scrollTo("portfolio-templates"); }}
                  aria-label="Change Portfolio template"
                >
                  Change
                </button>
              )}
            </div>

          </div>

          {/* INPUT */}
          <div className="github-input-box">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter your GitHub Username"
              className="github-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onGenerateCV()}
            />
          </div>

          {/* BUTTONS */}
          <div className="hero-buttons">
            <button className="get-started" onClick={onGenerateCV}>Generate CV</button>
            <button className="view-template" onClick={onGeneratePortfolio}>Generate Portfolio</button>
          </div>
        </div>

        {/* RIGHT — laptop mockup */}
        <div className="right-content">
          <div className="floating code-icon">{"</>"}</div>
          <div className="floating js-icon">JS</div>
          <div className="floating github-icon">GitHub</div>
          <div className="laptop">
            <div className="screen">
              <div className="screen-sidebar">
                <div className="line" /><div className="line short" />
                <div className="line" /><div className="line short" /><div className="line" />
              </div>
              <div className="screen-content">
                <div className="top-links">
                  <span>Home</span><span>About</span><span>Projects</span><span>Contact</span>
                </div>
                <div className="profile">
                  <div className="profile-text">
                    <h2>Hi, I'm</h2><h1>Alex Developer</h1><p>Full Stack Developer</p>
                    <div className="socials"><div /><div /><div /></div>
                  </div>
                  <div className="avatar" />
                </div>
                <div className="projects"><div /><div /><div /></div>
              </div>
            </div>
            <div className="keyboard" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;