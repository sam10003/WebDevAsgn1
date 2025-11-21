import { useState, useEffect } from "react";

function ShowModal({ showId, onClose, onAddFavorite, onRemoveFavorite, isFavorite }) {
  const [showData, setShowData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!showId) return;

    const fetchShowDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://api.tvmaze.com/shows/${showId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch show details");
        }
        const data = await response.json();
        setShowData(data);
      } catch (err) {
        console.error("Error fetching show details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (showId) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showId, onClose]);

  if (!showId) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden animate-fade-in">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error: {error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        ) : showData ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-700"
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

            {/* Favorite button */}
            {showData && (
              <button
                onClick={() => {
                  if (isFavorite) {
                    onRemoveFavorite?.(showData.id);
                  } else {
                    onAddFavorite?.(showData);
                  }
                }}
                className={`absolute top-4 right-14 z-20 px-4 py-2 flex items-center gap-2 rounded-full shadow-lg transition-all duration-200 ${
                  isFavorite
                    ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                    : "bg-white/80 hover:bg-white text-gray-700"
                }`}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <svg
                  className="w-5 h-5"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {isFavorite ? "Favorited" : "Favorite"}
                </span>
              </button>
            )}

            {/* Show image */}
            {showData.image?.original && (
              <div className="w-full h-64 md:h-80 bg-gray-200">
                <img
                  src={showData.image.original}
                  alt={showData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {showData.name}
              </h2>

              {/* Meta information */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                {showData.premiered && (
                  <span>Premiered: {new Date(showData.premiered).getFullYear()}</span>
                )}
                {showData.genres && showData.genres.length > 0 && (
                  <span>Genres: {showData.genres.join(", ")}</span>
                )}
                {showData.rating?.average && (
                  <span>Rating: {showData.rating.average}/10</span>
                )}
                {showData.network?.name && (
                  <span>Network: {showData.network.name}</span>
                )}
              </div>

              {/* Description */}
              {showData.summary && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Summary
                  </h3>
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: showData.summary }}
                  />
                </div>
              )}

              {/* Additional info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {showData.status && (
                  <div>
                    <span className="font-semibold text-gray-900">Status: </span>
                    <span className="text-gray-700">{showData.status}</span>
                  </div>
                )}
                {showData.type && (
                  <div>
                    <span className="font-semibold text-gray-900">Type: </span>
                    <span className="text-gray-700">{showData.type}</span>
                  </div>
                )}
                {showData.language && (
                  <div>
                    <span className="font-semibold text-gray-900">Language: </span>
                    <span className="text-gray-700">{showData.language}</span>
                  </div>
                )}
                {showData.runtime && (
                  <div>
                    <span className="font-semibold text-gray-900">Runtime: </span>
                    <span className="text-gray-700">{showData.runtime} minutes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ShowModal;

