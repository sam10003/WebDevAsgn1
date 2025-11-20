import { useState } from "react";

function InputBar({ onUpdate, onSubmit }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(value);
  };

  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    onUpdate?.(newVal);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex gap-3"
      >
        <input
          className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={handleChange}
          placeholder="Search for your favourite media..."
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go
        </button>
      </form>
    </div>
  );
}

export default InputBar;

