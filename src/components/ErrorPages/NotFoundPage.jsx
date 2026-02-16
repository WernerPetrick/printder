import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SpoolIllustration from "./SpoolIllustration";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page error-page--404">
      <motion.div
        className="error-page__content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <SpoolIllustration variant="tangled" className="error-page__spool" animate />

        <h1 className="error-page__code">404</h1>
        <h2 className="error-page__title">Filament Not Found</h2>
        <p className="error-page__message">
          Looks like this spool ran out! The page you&apos;re looking for doesn&apos;t exist.
        </p>

        <div className="error-page__actions">
          <button
            className="error-page__btn error-page__btn--primary"
            onClick={() => navigate("/")}
          >
            Back to Home
          </button>
          <button
            className="error-page__btn error-page__btn--secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
