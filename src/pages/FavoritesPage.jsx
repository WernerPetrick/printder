import FavoritesList from "../components/Favorites/FavoritesList";

export default function FavoritesPage() {
  return (
    <div>
      <h2 style={{ textAlign: "center", color: "var(--fg)", margin: "24px 0 0", textTransform: "uppercase", letterSpacing: "2px", fontSize: "20px" }}>Your Saved Prints</h2>
      <FavoritesList />
    </div>
  );
}
