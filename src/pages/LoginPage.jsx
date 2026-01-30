import { useState } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";

export default function LoginPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");

  if (user) {
    return <Navigate to="/swipe" replace />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div style={{ padding: "20px 0 0", textAlign: "center" }}>
        <Link to="/" style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
          &larr; Back to Home
        </Link>
      </div>
      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggle={() => setIsLogin(true)} />
      )}
    </div>
  );
}
