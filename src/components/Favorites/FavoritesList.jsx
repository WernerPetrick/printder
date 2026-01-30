import { useState, useEffect } from "react";
import { getUserFavorites, getModelById } from "../../services/appwrite";
import { useAuth } from "../../hooks/useAuth";
import "./FavoritesList.css";

export default function FavoritesList() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadFavorites() {
      try {
        const swipes = await getUserFavorites(user.$id);
        const models = await Promise.all(
          swipes.documents.map((swipe) =>
            getModelById(swipe.modelId).catch(() => null)
          )
        );
        setFavorites(models.filter(Boolean));
      } catch (err) {
        console.error("Failed to load favorites:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [user]);

  if (loading) {
    return <div className="favorites-loading">Loading your prints...</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-empty">
        <h3>No favorites yet</h3>
        <p>Start swiping to save models you like!</p>
      </div>
    );
  }

  return (
    <div className="favorites-grid">
      {favorites.map((model) => (
        <a
          key={model.$id}
          className="favorites-card"
          href={model.printablesUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="favorites-card__image">
            <img src={model.thumbnailUrl} alt={model.title} />
          </div>
          <div className="favorites-card__info">
            <h4>{model.title}</h4>
            <p>by {model.author}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
