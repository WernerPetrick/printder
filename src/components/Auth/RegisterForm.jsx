import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Auth.css";

export default function RegisterForm({ onToggle }) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register(email, password, name);
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <p className="auth-error">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password (8+ characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={8}
        required
      />
      <button type="submit" disabled={submitting}>
        {submitting ? "Creating account..." : "Sign Up"}
      </button>
      <p className="auth-toggle">
        Already have an account?{" "}
        <button type="button" onClick={onToggle}>
          Log In
        </button>
      </p>
    </form>
  );
}
