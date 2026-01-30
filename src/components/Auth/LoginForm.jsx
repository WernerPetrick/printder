import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

export default function LoginForm({ onToggle }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Failed to log in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Log In</h2>
      {error && <p className="auth-error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Log In"}
      </button>
      <p className="auth-toggle">
        Don't have an account?{" "}
        <button type="button" onClick={onToggle}>
          Sign Up
        </button>
      </p>
    </form>
  );
}
