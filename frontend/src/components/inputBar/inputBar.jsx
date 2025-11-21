import { useState, useEffect, useRef } from "react";

function InputBar({ onUpdate, onSubmit, onShowClick }) {
  const [value, setValue] = useState("");  //current text within the input bar
  const [suggestions, setSuggestions] = useState([]); //array of suggestions
  const [showDropdown, setShowDropdown] = useState(false);  //conditional render fror dropdown
  const [isLoading, setIsLoading] = useState(false); //awaiting fetch
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const searchTVMaze = async () => {
      if (value.trim().length < 2) { //we gather input
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true); //will await fro fetch
      try {
        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(value)}`
        );
        const data = await response.json();
        const limitedResults = data.slice(0, 5).map((item) => ({
          id: item.show.id,
          name: item.show.name,
          image: item.show.image?.medium || null,
        })); //unpack
        setSuggestions(limitedResults);
        setShowDropdown(limitedResults.length > 0);
      } catch (error) {
        console.error("Error fetching from TVMaze:", error); //error handling
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      } //will dismiss loading
    };
    
    //to not hammer the api wayyyy to much
    const debounceTimer = setTimeout(searchTVMaze, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => { //classic click outside and i close
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    
    //when component is mounted it will run this function
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //the holy trinity of input bars with dropdowns
  const handleSubmit = (e) => { //when submitting
    e.preventDefault();
    setShowDropdown(false);
    onSubmit?.(value);
  };

  const handleChange = (e) => { //when typing
    const newVal = e.target.value;
    setValue(newVal);
    onUpdate?.(newVal);
  };

  const handleSuggestionClick = (suggestion) => { //when click
    setValue(suggestion.name);
    setShowDropdown(false);
    onShowClick?.(suggestion.id); // Pass show ID to open modal
  };
    //i mean the structure i ssimilar to your form input form
    //main difference would be the conitional dropdown div
    //and a button
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 relative z-20 py-8">
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

