import React from "react";
import "@google/model-viewer";
import { assets } from "../assets/assets";



const ARViewer = () => {
  const params = new URLSearchParams(window.location.search);
  const modelUrl = params.get("model");
  const name = params.get("name");

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h2 style={{ textAlign: "center", marginTop: "1rem" }}>{name}</h2>
      <model-viewer
        src={modelUrl}
        alt={`3D model of ${name}`}
        ar
        ar-modes="scene-viewer webxr quick-look"
        environment-image="neutral"
        auto-rotate
        camera-controls
        autoplay
        style={{ width: "100%", height: "90%" }}
        shadow-intensity="1"
        exposure="1"
      ></model-viewer>
    </div>
  );
};


export default ARViewer;