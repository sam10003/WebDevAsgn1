import { useState, useEffect, useRef } from "react";

function InputBar({ onUpdate, onSubmit }) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const searchTVMaze = async () => {
      if (value.trim().length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const limitedResults = data.slice(0, 5).map((item) => ({
          id: item.show.id,
          name: item.show.name,
          image: item.show.image?.medium || null,
        }));
        setSuggestions(limitedResults);
        setShowDropdown(limitedResults.length > 0);
      } catch (error) {
        console.error("Error fetching from TVMaze:", error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchTVMaze, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    onSubmit?.(value);
  };

  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
    onUpdate?.(newVal);
  };

  const handleSuggestionClick = (suggestion) => {
    setValue(suggestion.name);
    setShowDropdown(false);
    onSubmit?.(suggestion.name);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 relative z-20">
      <div className="w-full max-w-lg relative">
        <form
          onSubmit={handleSubmit}
          className="w-full flex gap-3"
        >
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={value}
              onChange={handleChange}
              placeholder="Search for your favourite media..."
              onFocus={() => {
                if (suggestions.length > 0) {
                  setShowDropdown(true);
                }
              }}
            />
            {showDropdown && suggestions.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto"
              >
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 text-left transition-colors"
                  >
                    {suggestion.image && (
                      <img
                        src={suggestion.image}
                        alt={suggestion.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                    )}
                    <span className="text-gray-900">{suggestion.name}</span>
                  </button>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}

export default InputBar;

