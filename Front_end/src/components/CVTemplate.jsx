

import React from "react";

const CVTemplate = ({ onSelect, setMessage, scrollToInput }) => {
  const templates = Array.from({ length: 15 });

  const handleClick = (index) => {
    onSelect(index);

    setMessage("Enter GitHub username to generate CV");

    scrollToInput();
  };

  return (
    <div className="template-section">

      <h1>Choose CV Template</h1>

      <div className="template-grid">

        {templates.map((_, index) => (
          <div
            key={index}
            className="template-card"
            onClick={() => handleClick(index)}
          >

            {/* MINI CV PREVIEW */}
            <div className="mini-cv">

              <div className="sidebar"></div>

              <div className="content">
                <div className="line title"></div>
                <div className="line"></div>
                <div className="line short"></div>

                <div className="box-row">
                  <div></div>
                  <div></div>
                </div>

                <div className="line"></div>
              </div>

            </div>

            <p>Template {index + 1}</p>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CVTemplate;