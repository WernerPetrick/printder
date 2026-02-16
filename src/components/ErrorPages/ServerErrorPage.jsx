import { motion } from "framer-motion";
import SpoolIllustration from "./SpoolIllustration";
import "./ServerErrorPage.css";

export default function ServerErrorPage({ onReset }) {
  const handleGoHome = () => {
    onReset?.();
    window.location.href = "/";
  };

  const handleRetry = () => {
    onReset?.();
    window.location.reload();
  };

  return (
    <div className="error-page error-page--500">
      <motion.div
        className="error-page__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SpoolIllustration variant="overheated" className="error-page__spool" animate />

        <h1 className="error-page__code">500</h1>
        <h2 className="error-page__title">Printer Jammed!</h2>
        <p className="error-page__message">
          Something went wrong on our end. The spool overheated!
        </p>

        <div className="error-page__actions">
          <button
            className="error-page__btn error-page__btn--primary"
            onClick={handleRetry}
          >
            Try Again
          </button>
          <button
            className="error-page__btn error-page__btn--secondary"
            onClick={handleGoHome}
          >
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
