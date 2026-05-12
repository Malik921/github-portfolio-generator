import React, { useState } from "react";
import "./FAQsSection.css";

const faqs = [
  {
    q: "How does the generator work?",
    a: "It fetches your GitHub profile data and automatically generates either a CV or a Portfolio based on your selection."
  },
  {
    q: "Do I need to manually enter my experience?",
    a: "No. All data is automatically extracted from your GitHub profile."
  },
  {
    q: "Can I choose between CV and Portfolio?",
    a: "Yes. You can select either CV or Portfolio before generation depending on your need."
  },
  {
    q: "What format is the CV downloaded in?",
    a: "The CV is generated in a clean, structured format that can be exported as a downloadable document."
  },
  {
    q: "How is the Portfolio downloaded?",
    a: "The Portfolio is downloaded as a ZIP file containing HTML, CSS, and JavaScript files, fully ready to run or deploy."
  },
  {
    q: "Is my GitHub data stored?",
    a: "No. We only fetch data temporarily from GitHub and do not store any personal information."
  }
];

const FAQsSection = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="faq-section">

      <h1 className="faq-title">
        Frequently Asked Questions
      </h1>

      <div className="faq-container">

        {faqs.map((item, index) => (
          <div
            className={`faq-item ${openIndex === index ? "active" : ""}`}
            key={index}
            onClick={() => toggleFAQ(index)}
          >

            <div className="faq-question">
              {item.q}
              <span>{openIndex === index ? "−" : "+"}</span>
            </div>

            {openIndex === index && (
              <div className="faq-answer">
                {item.a}
              </div>
            )}

          </div>
        ))}

      </div>

    </section>
  );
};

export default FAQsSection;