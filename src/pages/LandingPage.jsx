import { useNavigate } from "react-router-dom";
import filamentSpool from "../assets/filament-spool.png";
import SwipeDemo from "../components/SwipeDemo/SwipeDemo";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Top Bar */}
      <nav className="landing__topbar">
        <button className="landing__topbar-btn" onClick={() => navigate("/login")}>
          Log In
        </button>
        <button className="landing__topbar-btn landing__topbar-btn--signup" onClick={() => navigate("/login?mode=signup")}>
          Sign Up
        </button>
      </nav>

      {/* Hero */}
      <section className="landing__hero">
        <div className="landing__hero-content">
          <h1 className="landing__title">
            Printder
          </h1>
          <p className="landing__tagline">
            Swipe. Discover. Print.
          </p>
          <p className="landing__subtitle">
            Don't know what to 3D print next? Swipe through thousands of models and find your next project.
          </p>
          <div className="landing__cta-row">
            <button className="landing__cta landing__cta--primary" onClick={() => navigate("/login")}>
              Get Started
            </button>
            <button className="landing__cta landing__cta--secondary" onClick={() => document.getElementById("about").scrollIntoView({ behavior: "smooth" })}>
              Learn More
            </button>
          </div>
        </div>
        <img src={filamentSpool} alt="" className="landing__hero-spool" />
      </section>

      {/* About */}
      <section className="landing__about" id="about">
        <h2 className="landing__section-title">How It Works</h2>
        <div className="landing__steps">
          <div className="landing__step landing__step--pink">
            <span className="landing__step-num">01</span>
            <h3>Browse</h3>
            <p>Thousands of 3D models from Printables, served up one at a time in a card stack.</p>
          </div>
          <div className="landing__step landing__step--blue">
            <span className="landing__step-num">02</span>
            <h3>Swipe</h3>
            <p>Swipe right to save a model to your collection. Swipe left to skip. It's that simple.</p>
          </div>
          <div className="landing__step landing__step--lime">
            <span className="landing__step-num">03</span>
            <h3>Print</h3>
            <p>Visit your favorites, click through to Printables, and start your next print.</p>
          </div>
        </div>
      </section>

      {/* Try It Out */}
      <section className="landing__example">
        <h2 className="landing__section-title">Try It Out</h2>
        <SwipeDemo />
      </section>

      {/* Footer */}
      <footer className="landing__footer">
        <div className="landing__footer-inner">
          <span className="landing__footer-logo">Printder</span>
          <span className="landing__footer-text">
            Models sourced from Printables.com
          </span>
        </div>
      </footer>
    </div>
  );
}
