import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import "./SwipeDemo.css";

const DEMO_MODELS = [
  {
    id: 1,
    title: "Honeycomb Storage Wall",
    author: "RostaP",
    category: "Household",
    image: "https://media.printables.com/media/prints/152592/images/1442410_b64ad22a-1849-42fe-b6ad-f3227f4bb652/resize_img_5848.jpg",
  },
  {
    id: 2,
    title: "DUMMY 13 Jointed Figure",
    author: "soozafone",
    category: "Action Figures",
    image: "https://media.printables.com/media/prints/593185/images/4864098_747f5ba4-62e1-40f8-92de-64668b8e2ba5_9314dd72-b7f7-4052-92de-341a2c3d2aa0/landscape.jpg",
  },
  {
    id: 3,
    title: "3D Benchy",
    author: "Prusa Research",
    category: "Test Models",
    image: "https://media.printables.com/media/prints/3161/images/20206_70fde6a0-6da1-4522-ba46-25f1bece7199/benchy.jpg",
  },
  {
    id: 4,
    title: "Prusa Face Shield",
    author: "Prusa Research",
    category: "Medical Tools",
    image: "https://media.printables.com/media/prints/25857/images/270451_9c0a7e85-d034-4eb9-9487-acf952819ba8/rc2.jpg",
  },
  {
    id: 5,
    title: "Dummy 13 — Version 1.0",
    author: "soozafone",
    category: "Action Figures",
    image: "https://media.printables.com/media/prints/981111/images/7608415_5e574d64-9213-459b-9de4-6aa2f00f1884_d36b0ddc-c7d9-4446-9cae-7d8fdd970e08/rainbow-text.jpg",
  },
];

const SWIPE_THRESHOLD = 120;

function DemoCard({ model, isTop, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const likeOpacity = useTransform(x, [0, 80], [0, 1]);
  const nopeOpacity = useTransform(x, [-80, 0], [1, 0]);

  function handleDragEnd(_, info) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  }

  return (
    <motion.div
      className="demo-card"
      style={{ x, rotate, zIndex: isTop ? 2 : 1 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={isTop ? { scale: 1 } : { scale: 0.95, y: 12 }}
      animate={isTop ? { scale: 1 } : { scale: 0.95, y: 12 }}
      exit={{
        x: x.get() > 0 ? 500 : -500,
        opacity: 0,
        transition: { duration: 0.35 },
      }}
    >
      <div className="demo-card__image">
        <img src={model.image} alt={model.title} draggable={false} />
        <motion.div className="demo-card__stamp demo-card__stamp--like" style={{ opacity: likeOpacity }}>
          PRINT
        </motion.div>
        <motion.div className="demo-card__stamp demo-card__stamp--nope" style={{ opacity: nopeOpacity }}>
          NOPE
        </motion.div>
      </div>
      <div className="demo-card__info">
        <h4 className="demo-card__title">{model.title}</h4>
        <p className="demo-card__author">by {model.author}</p>
        <span className="demo-card__category">{model.category}</span>
      </div>
    </motion.div>
  );
}

export default function SwipeDemo() {
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState(null);

  const remaining = DEMO_MODELS.slice(index);
  const visible = remaining.slice(0, 2);

  function handleSwipe(direction) {
    setLastAction(direction === "right" ? "Saved!" : "Skipped!");
    setIndex((prev) => prev + 1);

    setTimeout(() => setLastAction(null), 1200);
  }

  function handleReset() {
    setIndex(0);
    setLastAction(null);
  }

  return (
    <div className="swipe-demo">
      <div className="swipe-demo__stage">
        {visible.length > 0 ? (
          <AnimatePresence>
            {visible.map((model, i) => (
              <DemoCard
                key={model.id}
                model={model}
                isTop={i === 0}
                onSwipe={handleSwipe}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="swipe-demo__done">
            <p>You've seen them all!</p>
            <button className="swipe-demo__reset" onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lastAction && (
          <motion.div
            className={`swipe-demo__toast ${lastAction === "Saved!" ? "swipe-demo__toast--saved" : "swipe-demo__toast--skipped"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {lastAction}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="swipe-demo__hint">
        &larr; Drag cards to try it out &rarr;
      </p>
    </div>
  );
}
