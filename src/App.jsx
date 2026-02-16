import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AuthGuard from "./components/Auth/AuthGuard";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SwipePage from "./pages/SwipePage";
import FavoritesPage from "./pages/FavoritesPage";
import NotFoundPage from "./components/ErrorPages/NotFoundPage";
import ErrorBoundary from "./components/ErrorPages/ErrorBoundary";

// Temporary test component - remove after testing
function TestError() {
  throw new Error("Test 500 error");
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/test-error" element={<TestError />} /> {/* Remove after testing */}

            {/* Protected routes */}
            <Route
              element={
                <AuthGuard>
                  <Layout />
                </AuthGuard>
              }
            >
              <Route path="/swipe" element={<SwipePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Route>

            {/* 404 Catch-all route - must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
