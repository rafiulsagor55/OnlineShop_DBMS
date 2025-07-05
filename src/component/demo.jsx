// Demo.js
import React from "react";
import "./demo.css";
import { useLocation } from "react-router-dom";

const Demo = () => {
  const location =useLocation();
  const { id } = location.state || {};
  return (
    <div className="demo">
      <div className="demo-page">Opps Sorry {id}</div>
    </div>
  );
};

export default Demo;
