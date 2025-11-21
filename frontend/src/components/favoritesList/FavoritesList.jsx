import { useState } from "react";

function FavoritesList({ favorites, onRemoveFavorite, onShowClick }) {
  const [hoveredId, setHoveredId] = useState(null);

  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl px-4 mt-8">
      <h3 className="text-xl font-semibold text-white mb-4 text-center">
        Your Favorites
      </h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="relative group"
            onMouseEnter={() => setHoveredId(favorite.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Show image */}
            <button
              onClick={() => onShowClick?.(favorite.id)}
              className="block transition-transform duration-200 hover:scale-105"
            >
              {favorite.image ? (
                <img
                  src={favorite.image}
                  alt={favorite.name}
                  className="w-32 h-48 md:w-40 md:h-60 object-cover rounded-lg shadow-lg"
                />
              ) : (
                <div className="w-32 h-48 md:w-40 md:h-60 bg-gray-700 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-white text-xs text-center px-2">
                    {favorite.name}
                  </span>
                </div>
              )}
            </button>

            {/* Delete button on hover */}
            {hoveredId === favorite.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(favorite.id);
                }}
                className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 rounded-full shadow-lg transition-all duration-200 animate-fade-in z-10"
                aria-label="Remove from favorites"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavoritesList;



