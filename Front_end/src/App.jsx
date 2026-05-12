

import { useState, useRef, useCallback } from "react";
import "./App.css";

import HeroSection          from "./components/HeroSection.jsx";
import  CVTemplateSection from "./components/TemplateSection.jsx";
import PortfolioTemplateSection from "./components/PortfolioTemplateSection.jsx";
import AboutSection         from "./components/AboutSection.jsx";
import FAQsSection          from "./components/FAQsSection.jsx";
import Footer               from "./components/Footer.jsx";
import LoadingScreen        from "./components/LoadingScreen.jsx";
import CVPreview            from "./components/CVPreview.jsx";
import PortfolioPreview     from "./components/PortfolioPreview.jsx";
import Toast                from "./components/Toast.jsx";

import { fetchAllGitHubData } from "./services/githubService.js";

// pages: "home" | "loading" | "cv" | "portfolio"
export default function App() {
  const [page, setPage]                           = useState("home");
  const [selectedCVTemplate, setSelectedCVTemplate]             = useState(null);
  const [selectedPortfolioTemplate, setSelectedPortfolioTemplate] = useState(null);
  const [githubData, setGithubData]               = useState(null);
  const [username, setUsername]                   = useState("");
  const [toast, setToast]                         = useState(null);
  const [pendingAction, setPendingAction]         = useState(null); // "cv" | "portfolio"

  const inputRef = useRef(null);

  // ── toast ─────────────────────────────────────────────────────
  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  }, []);

  // ── scroll to input ───────────────────────────────────────────
  const scrollToInput = useCallback(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => inputRef.current.focus(), 420);
      }
    }, 80);
  }, []);

  // ── CV template selected ──────────────────────────────────────
  const handleCVTemplateSelect = useCallback((template) => {
    setSelectedCVTemplate(template);
    showToast(`✓ CV template "${template.name}" selected — enter your GitHub username`, "success");
    scrollToInput();
  }, [showToast, scrollToInput]);

  // ── Portfolio template selected ───────────────────────────────
  const handlePortfolioTemplateSelect = useCallback((template) => {
    setSelectedPortfolioTemplate(template);
    showToast(`✓ Portfolio template "${template.name}" selected — enter your GitHub username`, "success");
    scrollToInput();
  }, [showToast, scrollToInput]);

  // ── smooth scroll ─────────────────────────────────────────────
  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // ── generate (shared fetch) ───────────────────────────────────
  const handleGenerate = useCallback(async (action) => {
    const trimmed = username.trim();
    if (!trimmed) {
      showToast("⚠ Please enter your GitHub username first", "warning");
      inputRef.current?.focus();
      return;
    }
    if (action === "cv" && !selectedCVTemplate) {
      showToast("⚠ Please choose a CV template first", "warning");
      document.getElementById("cv-templates")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (action === "portfolio" && !selectedPortfolioTemplate) {
      showToast("⚠ Please choose a Portfolio template first", "warning");
      document.getElementById("portfolio-templates")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setPendingAction(action);
    setPage("loading");
    try {
      const data = await fetchAllGitHubData(trimmed);
      setGithubData(data);
      setPage(action); // "cv" or "portfolio"
    } catch (err) {
      setPage("home");
      setPendingAction(null);
      showToast(`✗ ${err.message}`, "error");
    }
  }, [username, selectedCVTemplate, selectedPortfolioTemplate, showToast]);

  // ── back to home ─────────────────────────────────────────────
  const handleBack = useCallback(() => {
    setPage("home");
    setGithubData(null);
    setPendingAction(null);
  }, []);

  // ── LOADING ──────────────────────────────────────────────────
  if (page === "loading") {
    return (
      <LoadingScreen
        username={username}
        templateName={
          pendingAction === "cv"
            ? selectedCVTemplate?.name
            : selectedPortfolioTemplate?.name
        }
        mode={pendingAction}
      />
    );
  }

  // ── CV PAGE ──────────────────────────────────────────────────
  if (page === "cv" && githubData && selectedCVTemplate) {
    return <CVPreview githubData={githubData} template={selectedCVTemplate} onBack={handleBack} />;
  }

  // ── PORTFOLIO PAGE ───────────────────────────────────────────
  if (page === "portfolio" && githubData && selectedPortfolioTemplate) {
    return <PortfolioPreview githubData={githubData} template={selectedPortfolioTemplate} onBack={handleBack} />;
  }

  // ── HOME ─────────────────────────────────────────────────────
  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <HeroSection
        username={username}
        setUsername={setUsername}
        inputRef={inputRef}
        selectedCVTemplate={selectedCVTemplate}
        selectedPortfolioTemplate={selectedPortfolioTemplate}
        onGenerateCV={() => handleGenerate("cv")}
        onGeneratePortfolio={() => handleGenerate("portfolio")}
        scrollTo={scrollTo}
      />

      <CVTemplateSection
        selectedTemplate={selectedCVTemplate}
        onSelectTemplate={handleCVTemplateSelect}
      />

      <PortfolioTemplateSection
        selectedTemplate={selectedPortfolioTemplate}
        onSelectTemplate={handlePortfolioTemplateSelect}
      />

      <AboutSection />
      <FAQsSection />
      <Footer />
    </>
  );
}