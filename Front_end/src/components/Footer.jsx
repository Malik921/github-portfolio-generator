import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* LEFT BRAND */}
        <div className="footer-brand">
          <h2>GitHub CV & Portfolio Generator</h2>
          <p>
            Turn your GitHub profile into a professional CV or Portfolio in seconds.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">

          <div>
            <h4>Product</h4>
            <a href="#">CV Generator</a>
            <a href="#">Portfolio Generator</a>
            <a href="#">Templates</a>
          </div>

          <div>
            <h4>Support</h4>
            <a href="#">FAQs</a>
            <a href="#">Help Center</a>
            <a href="#">Contact</a>
          </div>

          <div>
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>

        </div>

      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} GitHub CV Generator. Built for developers.
      </div>

    </footer>
  );
};

export default Footer;