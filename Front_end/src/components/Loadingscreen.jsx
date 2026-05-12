

import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

const CV_STEPS = [
  { icon: "🔗", text: "Connecting to GitHub API..." },
  { icon: "👤", text: "Fetching your profile..." },
  { icon: "📦", text: "Loading repositories..." },
  { icon: "💻", text: "Analyzing programming languages..." },
  { icon: "⭐", text: "Finding your top projects..." },
  { icon: "🎨", text: "Applying selected template..." },
  { icon: "✨", text: "Generating your CV..." },
];

const PORTFOLIO_STEPS = [
  { icon: "🔗", text: "Connecting to GitHub API..." },
  { icon: "👤", text: "Fetching your profile..." },
  { icon: "📦", text: "Loading all repositories..." },
  { icon: "💻", text: "Analyzing tech stack..." },
  { icon: "⭐", text: "Finding featured projects..." },
  { icon: "🎨", text: "Applying portfolio template..." },
  { icon: "🌐", text: "Building your portfolio site..." },
];

const LoadingScreen = ({ username, templateName, mode = "cv", onAllStepsDone }) => {
  const STEPS = mode === "portfolio" ? PORTFOLIO_STEPS : CV_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState([]);
  const STEP_DELAY = 520;

  useEffect(() => {
    let step = 0;
    const id = setInterval(() => {
      step += 1;
      if (step < STEPS.length) {
        setDone((d) => [...d, step - 1]);
        setCurrentStep(step);
      } else {
        setDone((d) => [...d, STEPS.length - 1]);
        clearInterval(id);
        if (onAllStepsDone) onAllStepsDone();
      }
    }, STEP_DELAY);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <div className="loading-screen">
      <div className="load-orb orb1" />
      <div className="load-orb orb2" />
      <div className="load-orb orb3" />

      <div className="loading-content">
        <div className="spinner-ring">
          <div className="spinner-inner">{mode === "portfolio" ? "🌐" : "📄"}</div>
        </div>

        <h2 className="loading-title">
          {mode === "portfolio" ? "Building" : "Generating"} <span>{username}</span>'s {mode === "portfolio" ? "Portfolio" : "CV"}
        </h2>
        <p className="loading-sub">Template: <strong>{templateName}</strong></p>

        <div className="loading-steps">
          {STEPS.map((step, i) => {
            const isDone = done.includes(i);
            const isActive = currentStep === i;
            return (
              <div key={i} className={`load-step ${isDone ? "done" : isActive ? "active" : "pending"}`}>
                <div className="step-icon-wrap">
                  {isDone   ? <span className="step-check">✓</span>
                 : isActive ? <span className="step-spinner" />
                 :            <span className="step-dot" />}
                </div>
                <span className="step-text">{step.icon} {step.text}</span>
              </div>
            );
          })}
        </div>

        <div className="load-progress-bar">
          <div className="load-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="load-percent">{pct}% complete</p>
      </div>
    </div>
  );
};

export default LoadingScreen;