import { AnimatePresence } from "framer-motion";
import SwipeCard from "../SwipeCard/SwipeCard";
import { createSwipe } from "../../services/appwrite";
import { useAuth } from "../../hooks/useAuth";
import "./CardStack.css";

export default function CardStack({ models, onSwiped, onNeedMore }) {
  const { user } = useAuth();

  // Show top 2 cards for the stack effect
  const visibleCards = models.slice(0, 2);

  async function handleSwipe(model, action) {
    try {
      await createSwipe(user.$id, model.$id, action);
      onSwiped(model.$id);

      // Fetch more when running low
      if (models.length <= 3) {
        onNeedMore();
      }
    } catch (err) {
      console.error("Failed to record swipe:", err);
    }
  }

  if (models.length === 0) {
    return (
      <div className="card-stack__empty">
        <h3>No more models to show</h3>
        <p>Try changing your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="card-stack">
      <div className="card-stack__cards">
        <AnimatePresence>
          {visibleCards.map((model, i) => (
            <SwipeCard
              key={model.$id}
              model={model}
              isTop={i === 0}
              onSwipe={(action) => handleSwipe(model, action)}
            />
          ))}
        </AnimatePresence>
      </div>
      <div className="card-stack__actions">
        <button
          className="card-stack__btn card-stack__btn--nope"
          onClick={() => handleSwipe(visibleCards[0], "dismissed")}
          aria-label="Dismiss"
        >
          &times;
        </button>
        <button
          className="card-stack__btn card-stack__btn--like"
          onClick={() => handleSwipe(visibleCards[0], "liked")}
          aria-label="Like"
        >
          &#x2764;
        </button>
      </div>
    </div>
  );
}
