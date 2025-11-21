import React, { useState, useEffect } from "react";
import InputBar from "./components/inputBar/inputBar.jsx";
import Background from "./components/background/Background.jsx";
import ShowModal from "./components/showModal/ShowModal.jsx";
import FavoritesList from "./components/favoritesList/FavoritesList.jsx";

function App() {
  const [selectedShowId, setSelectedShowId] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("tvMazeFavorites");
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tvMazeFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleUpdate = (value) => {
    console.log("Updated:", value);
  };

  const handleSubmit = (value) => {
    console.log("Submitted:", value);
  };

  const handleShowClick = (showId) => {
    setSelectedShowId(showId);
  };

  const handleCloseModal = () => {
    setSelectedShowId(null);
  };

  const handleAddFavorite = (showData) => {
    const favorite = {
      id: showData.id,
      name: showData.name,
      image: showData.image?.medium || showData.image?.original || null,
    };

    setFavorites((prev) => {
      // Check if already favorited
      if (prev.some((fav) => fav.id === favorite.id)) {
        return prev;
      }
      return [...prev, favorite];
    });
  };

  const handleRemoveFavorite = (showId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== showId));
  };

  const isFavorite = (showId) => {
    return favorites.some((fav) => fav.id === showId);
  };

  return (
    <div className="relative min-h-screen">
      <Background />
      <div className="relative z-20 flex flex-col items-center min-h-screen py-8">
        <InputBar 
          onUpdate={handleUpdate}
          onSubmit={handleSubmit}
          onShowClick={handleShowClick}
        />
        <FavoritesList
          favorites={favorites}
          onRemoveFavorite={handleRemoveFavorite}
          onShowClick={handleShowClick}
        />
      </div>
      <ShowModal
        showId={selectedShowId}
        onClose={handleCloseModal}
        onAddFavorite={handleAddFavorite}
        onRemoveFavorite={handleRemoveFavorite}
        isFavorite={isFavorite(selectedShowId)}
      />
    </div>
  );
}

export default App;
