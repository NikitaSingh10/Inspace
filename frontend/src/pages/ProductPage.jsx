import React from "react";
import ARViewer from "./ARViewer.jsx";

const ProductPage = () => {
  return (
    <div>
      <h2>Modern Vase</h2>
      <ARViewer 
        modelUrl="../public/models/simple_lamp.glb"   // relative to public folder
        productName="Modern Vase"
      />
    </div>
  );
};

export default ProductPage;
