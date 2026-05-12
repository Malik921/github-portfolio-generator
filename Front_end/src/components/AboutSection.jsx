

import React from "react";
import "./AboutSection.css";

const AboutSection = () => {
  return (
    <section id="about" className="about-section">

      {/* BACKGROUND EFFECTS */}
      <div className="bg-glow glow1"></div>
      <div className="bg-glow glow2"></div>

      {/* CONTENT */}
      <div className="about-content">

        <h1>About GitHub CV/Portfolio Generator</h1>

        <p className="subtitle">
          Turn your GitHub profile into a professional CV/Portfolio in seconds.
        </p>

        <p className="description">
          This platform automatically extracts your GitHub data and converts it
          into clean, structured CV/Portfolio templates. No manual writing needed — just
          enter your username, choose a template, and generate your CV instantly.
        </p>

        {/* FEATURES */}
        <div className="features">

          <div className="feature">
            <span className="icon">⚡</span>
            Instant CV/Portfolio Generation
          </div>

          <div className="feature">
            <span className="icon">🎨</span>
            Multiple Modern Templates
          </div>

          <div className="feature">
            <span className="icon">📊</span>
            GitHub-Based Data Extraction
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutSection;