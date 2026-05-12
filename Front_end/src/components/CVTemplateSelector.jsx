import React from "react";
import { templates } from "../templates/templateStyles";

const CVTemplateSelector = ({ setTemplate, scrollToInput, notify }) => {

  return (
    <div className="template-scroll">

      {templates.map((t) => (
        <div
          key={t.id}
          className="template-card"
          onClick={() => {
            setTemplate(t.id);
            notify(`${t.name} selected`);
            scrollToInput();
          }}
        >
          <div className="mini-preview">
            {t.name}
          </div>
        </div>
      ))}

    </div>
  );
};

export default CVTemplateSelector;