import { motion } from "framer-motion";

export default function SpoolIllustration({ variant = "tangled", className = "", animate = true }) {
  if (variant === "overheated") {
    return <OverheatedSpool className={className} animate={animate} />;
  }
  return <TangledSpool className={className} animate={animate} />;
}

function TangledSpool({ className, animate }) {
  const wiggleVariants = {
    animate: {
      d: [
        "M 140 80 Q 160 60 180 85 Q 200 110 185 140 Q 170 160 190 180",
        "M 140 80 Q 165 55 180 85 Q 195 115 185 140 Q 175 165 190 180",
        "M 140 80 Q 160 60 180 85 Q 200 110 185 140 Q 170 160 190 180",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const wiggleVariants2 = {
    animate: {
      d: [
        "M 190 180 Q 210 200 195 220 Q 175 240 200 250",
        "M 190 180 Q 205 195 195 220 Q 180 245 200 250",
        "M 190 180 Q 210 200 195 220 Q 175 240 200 250",
      ],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.2,
      },
    },
  };

  return (
    <svg viewBox="0 0 300 300" className={className} aria-label="Tangled filament spool">
      {/* Spool body - outer ring */}
      <circle
        cx="120"
        cy="150"
        r="90"
        fill="var(--pink)"
        stroke="var(--fg)"
        strokeWidth="4"
      />
      {/* Spool body - inner ring */}
      <circle
        cx="120"
        cy="150"
        r="60"
        fill="var(--bg)"
        stroke="var(--fg)"
        strokeWidth="4"
      />
      {/* Spool center hole */}
      <circle
        cx="120"
        cy="150"
        r="25"
        fill="var(--fg)"
        stroke="var(--fg)"
        strokeWidth="2"
      />
      {/* Remaining filament (partial) */}
      <path
        d="M 120 90 A 60 60 0 0 1 180 150"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* Filament coming off spool */}
      <path
        d="M 175 120 Q 155 100 140 80"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Tangled filament - animated */}
      {animate ? (
        <>
          <motion.path
            fill="none"
            stroke="var(--fg)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ d: "M 140 80 Q 160 60 180 85 Q 200 110 185 140 Q 170 160 190 180" }}
            variants={wiggleVariants}
            animate="animate"
          />
          <motion.path
            fill="none"
            stroke="var(--fg)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ d: "M 190 180 Q 210 200 195 220 Q 175 240 200 250" }}
            variants={wiggleVariants2}
            animate="animate"
          />
        </>
      ) : (
        <>
          <path
            d="M 140 80 Q 160 60 180 85 Q 200 110 185 140 Q 170 160 190 180"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 190 180 Q 210 200 195 220 Q 175 240 200 250"
            fill="none"
            stroke="var(--fg)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </>
      )}
      {/* Knot in the filament */}
      <circle cx="185" cy="140" r="8" fill="var(--fg)" />
      {/* Broken end indicator */}
      <path
        d="M 195 250 L 205 255 M 195 250 L 200 260 M 195 250 L 190 258"
        stroke="var(--fg)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Question mark accent */}
      <text
        x="230"
        y="80"
        fontSize="40"
        fontWeight="bold"
        fontFamily="Space Mono, monospace"
        fill="var(--fg)"
      >
        ?
      </text>
    </svg>
  );
}

function OverheatedSpool({ className, animate }) {
  const smokeVariants = (delay) => ({
    animate: {
      y: [0, -30],
      opacity: [0.7, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeOut",
        delay,
      },
    },
  });

  const heatWaveVariants = {
    animate: {
      d: [
        "M 50 100 Q 60 90 70 100 Q 80 110 90 100",
        "M 50 100 Q 60 110 70 100 Q 80 90 90 100",
        "M 50 100 Q 60 90 70 100 Q 80 110 90 100",
      ],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <svg viewBox="0 0 300 300" className={className} aria-label="Overheated filament spool">
      {/* Heat waves behind spool */}
      {animate ? (
        <>
          <motion.path
            fill="none"
            stroke="var(--fg)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
            initial={{ d: "M 50 100 Q 60 90 70 100 Q 80 110 90 100" }}
            variants={heatWaveVariants}
            animate="animate"
          />
          <motion.path
            fill="none"
            stroke="var(--fg)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
            initial={{ d: "M 40 130 Q 50 120 60 130 Q 70 140 80 130" }}
            variants={heatWaveVariants}
            animate="animate"
            style={{ animationDelay: "0.2s" }}
          />
        </>
      ) : null}

      {/* Spool body - outer ring (slightly warped) */}
      <ellipse
        cx="150"
        cy="160"
        rx="85"
        ry="90"
        fill="var(--orange)"
        stroke="var(--fg)"
        strokeWidth="4"
      />
      {/* Spool body - inner ring */}
      <ellipse
        cx="150"
        cy="160"
        rx="55"
        ry="60"
        fill="var(--bg)"
        stroke="var(--fg)"
        strokeWidth="4"
      />
      {/* Spool center hole */}
      <circle
        cx="150"
        cy="160"
        r="25"
        fill="var(--fg)"
        stroke="var(--fg)"
        strokeWidth="2"
      />
      {/* Melted/warped filament on spool */}
      <path
        d="M 150 100 A 55 60 0 1 1 95 160"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="20 15"
      />
      {/* Melted drip 1 */}
      <path
        d="M 100 200 Q 95 220 100 240 Q 105 250 100 260"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Melted drip 2 */}
      <path
        d="M 180 210 Q 185 225 180 240"
        fill="none"
        stroke="var(--fg)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Smoke particles */}
      {animate ? (
        <>
          <motion.circle
            cx="130"
            cy="80"
            r="8"
            fill="var(--fg)"
            opacity="0.7"
            variants={smokeVariants(0)}
            animate="animate"
          />
          <motion.circle
            cx="155"
            cy="70"
            r="12"
            fill="var(--fg)"
            opacity="0.7"
            variants={smokeVariants(0.3)}
            animate="animate"
          />
          <motion.circle
            cx="175"
            cy="85"
            r="6"
            fill="var(--fg)"
            opacity="0.7"
            variants={smokeVariants(0.6)}
            animate="animate"
          />
          <motion.circle
            cx="145"
            cy="60"
            r="10"
            fill="var(--fg)"
            opacity="0.7"
            variants={smokeVariants(0.9)}
            animate="animate"
          />
        </>
      ) : (
        <>
          <circle cx="130" cy="70" r="8" fill="var(--fg)" opacity="0.5" />
          <circle cx="155" cy="55" r="12" fill="var(--fg)" opacity="0.4" />
          <circle cx="175" cy="65" r="6" fill="var(--fg)" opacity="0.3" />
        </>
      )}
      {/* Warning exclamation */}
      <text
        x="220"
        y="90"
        fontSize="45"
        fontWeight="bold"
        fontFamily="Space Mono, monospace"
        fill="var(--fg)"
      >
        !
      </text>
    </svg>
  );
}
