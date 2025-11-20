import { useState, useEffect } from "react";

function Background() {
  const [shows, setShows] = useState([]); //array of shows

  useEffect(() => {
    const fetchPopularShows = async () => {
      try {
        //we fetch said shows
        const response = await fetch("https://api.tvmaze.com/shows");
        const data = await response.json();
        
        //i mean we dont need shows without images
        const showsWithImages = data
          .filter((show) => show.image?.original || show.image?.medium)
          .slice(0, 30)
          .map((show) => ({
            id: show.id,
            image: show.image?.original || show.image?.medium,
            name: show.name,
          }));
        
        setShows(showsWithImages);
      } catch (error) {
        console.error("Error fetching shows for background:", error);
      } //i dont know hey maybe tomorrow no shows have a image
    };

    fetchPopularShows();
  }, []);

  if (shows.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-800/60 to-gray-900/95 z-10" />
      
      {/* here we scroll */}
      <div className="absolute inset-0">
        {/* first row towards left*/}
        <div className="absolute top-0 left-0 flex gap-8 animate-scroll-left">
          {shows.slice(0, 15).map((show) => (
            <div
              key={`row1-${show.id}`}
              className="flex-shrink-0 w-56 h-80 opacity-25"
            >
              <img
                src={show.image}
                alt={show.name}
                className="w-full h-full object-cover rounded-xl blur-xs"
              />
            </div>
          ))}
          {/* we duplicate to make it look endless */}
          {shows.slice(0, 15).map((show) => (
            <div
              key={`row1-dup-${show.id}`}
              className="flex-shrink-0 w-56 h-80 opacity-25"
            >
              <img
                src={show.image}
                alt={show.name}
                className="w-full h-full object-cover rounded-xl blur-xs"
              />
            </div>
          ))}
        </div>

        {/* second row */}
        <div className="absolute top-[50%] left-0 flex gap-8 animate-scroll-left-slow">
          {shows.slice(15, 30).map((show) => (
            <div
              key={`row2-${show.id}`}
              className="flex-shrink-0 w-56 h-80 opacity-25"
            >
              <img
                src={show.image}
                alt={show.name}
                className="w-full h-full object-cover rounded-xl blur-xs"
              />
            </div>
          ))}
          {/* same trick */}
          {shows.slice(15, 30).map((show) => (
            <div
              key={`row2-dup-${show.id}`}
              className="flex-shrink-0 w-56 h-80 opacity-25"
            >
              <img
                src={show.image}
                alt={show.name}
                className="w-full h-full object-cover rounded-xl blur-xs"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Background;

