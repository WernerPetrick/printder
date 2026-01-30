import { useState } from "react";
import CardStack from "../components/CardStack/CardStack";
import CategoryFilter from "../components/Filters/CategoryFilter";
import { useModels } from "../hooks/useModels";

export default function SwipePage() {
  const [category, setCategory] = useState(null);
  const { models, loading, fetchMore, markSwiped } = useModels(category);

  return (
    <div>
      <CategoryFilter selected={category} onSelect={setCategory} />
      {loading && models.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", padding: "80px 20px" }}>
          Loading models...
        </div>
      ) : (
        <CardStack models={models} onSwiped={markSwiped} onNeedMore={fetchMore} />
      )}
    </div>
  );
}
