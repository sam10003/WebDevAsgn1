import React from "react";
import InputBar from "./components/inputBar/inputBar.jsx";
import Background from "./components/background/Background.jsx";

function App() {

  const handleUpdate = (value) => {
    console.log("Updated:", value);
  };

  const handleSubmit = (value) => {
    console.log("Submitted:", value);
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-20">
        <InputBar 
          onUpdate={handleUpdate}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default App;
