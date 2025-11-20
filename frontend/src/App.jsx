import React from "react";
import InputBar from "./components/inputBar/inputBar.jsx";

function App() {

  const handleUpdate = (value) => {
    console.log("Updated:", value);
  };

  const handleSubmit = (value) => {
    console.log("Submitted:", value);
  };

  return (
    <div>
      <InputBar 
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
