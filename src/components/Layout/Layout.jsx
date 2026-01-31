import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Layout.css";

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__logo">Printder</h1>
        <nav className="layout__nav">
          <NavLink to="/swipe" className="layout__link">
            Swipe
          </NavLink>
          <NavLink to="/favorites" className="layout__link">
            Favourites
          </NavLink>
          <NavLink to="/prints" className="layout__link">
            Prints
          </NavLink>
        </nav>
        <div className="layout__user">
          <span>{user?.name}</span>
          <button onClick={logout} className="layout__logout">
            Log Out
          </button>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
