import React from "react";
import { templates } from "./templateStyles";
import "../components/Templates.css";

const TemplateRenderer = ({ data, selectedId }) => {

  if (!data) return <div className="empty">No CV Generated</div>;

  const template = templates.find(t => t.id === selectedId);

  return (
    <div className={`cv cv-${template.layout} theme-${template.theme}`}>

      {/* LEFT / MAIN PROFILE */}
      <div className="cv-header">
        <img src={data.avatar} className="avatar" />
        <h1>{data.name}</h1>
        <p>{data.bio}</p>
      </div>

      {/* STATS */}
      <div className="cv-stats">
        <div>Repos: {data.repos}</div>
        <div>Followers: {data.followers}</div>
        <div>Following: {data.following}</div>
      </div>

      {/* OPTIONAL FIELDS */}
      {data.location && <p>📍 {data.location}</p>}
      {data.company && <p>🏢 {data.company}</p>}

    </div>
  );
};

export default TemplateRenderer;