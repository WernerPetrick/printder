import { motion, useMotionValue, useTransform } from "framer-motion";
import "./SwipeCard.css";

const SWIPE_THRESHOLD = 150;

export default function SwipeCard({ model, onSwipe, isTop }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("liked");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("dismissed");
    }
  }

  return (
    <motion.div
      className={`swipe-card ${isTop ? "swipe-card--top" : ""}`}
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      animate={isTop ? {} : { scale: 0.95, y: 10 }}
      exit={{
        x: x.get() > 0 ? 400 : -400,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="swipe-card__image">
        <img src={model.thumbnailUrl} alt={model.title} draggable={false} />
        <motion.div className="swipe-card__stamp swipe-card__stamp--like" style={{ opacity: likeOpacity }}>
          PRINT
        </motion.div>
        <motion.div className="swipe-card__stamp swipe-card__stamp--nope" style={{ opacity: nopeOpacity }}>
          NOPE
        </motion.div>
      </div>
      <div className="swipe-card__info">
        <h3 className="swipe-card__title">{model.title}</h3>
        <p className="swipe-card__author">by {model.author}</p>
        {model.category && <span className="swipe-card__category">{model.category}</span>}
        <div className="swipe-card__stats">
          <span>{model.likesCount ?? 0} likes</span>
          <span>{model.downloadCount ?? 0} downloads</span>
        </div>
        {model.description && (
          <p className="swipe-card__description">{model.description.slice(0, 150)}...</p>
        )}
      </div>
    </motion.div>
  );
}
