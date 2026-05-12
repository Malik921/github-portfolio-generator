import React, { useEffect, useState } from "react";
import "./Toast.css";

const Toast = ({ message, type = "info" }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount → slide in
    const t1 = setTimeout(() => setVisible(true), 10);
    // after 3s → slide out
    const t2 = setTimeout(() => setVisible(false), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [message]);

  return (
    <div className={`toast toast--${type} ${visible ? "toast--show" : ""}`}>
      <span className="toast-msg">{message}</span>
    </div>
  );
};

export default Toast;