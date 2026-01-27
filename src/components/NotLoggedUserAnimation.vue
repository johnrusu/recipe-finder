<template>
  <div class="animation-viewport mb-4">
    <svg
      viewBox="0 0 200 160"
      xmlns="http://www.w3.org/2000/svg"
      class="benefit-svg"
    >
      <rect x="75" y="40" width="50" height="50" rx="25" class="profile-head" />
      <path
        d="M60 130 C60 100 80 95 100 95 C120 95 140 100 140 130"
        class="profile-body"
      />

      <g class="benefit-blocks">
        <rect x="40" y="30" width="20" height="20" rx="4" class="block b1" />
        <rect x="140" y="40" width="16" height="16" rx="4" class="block b2" />
        <rect x="30" y="80" width="18" height="18" rx="4" class="block b3" />
        <rect x="150" y="90" width="22" height="22" rx="4" class="block b4" />
      </g>
    </svg>
  </div>
</template>

<style>
.animation-viewport {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .animation-viewport {
    max-width: 300px;
  }
}

.benefit-svg {
  width: 100%;
  height: auto;
  fill: none;
  stroke-width: 2;
}

/* The User (The Guest) */
.profile-head,
.profile-body {
  stroke: #94a3b8; /* Professional Slate Gray */
  stroke-dasharray: 4; /* Dashed line = Incomplete / Guest */
}

/* The Benefits (The items being missed) */
.block {
  fill-opacity: 0.1;
  stroke-width: 1.5;
  animation: float 4s ease-in-out infinite;
}

/* Individual colors to represent different features */
.b1 {
  stroke: #f87171;
  animation-delay: 0s;
} /* Red - Favorites */
.b2 {
  stroke: #60a5fa;
  animation-delay: 0.5s;
} /* Blue - Recommendations */
.b3 {
  stroke: #fbbf24;
  animation-delay: 1.2s;
} /* Amber - History */
.b4 {
  stroke: #34d399;
  animation-delay: 0.8s;
} /* Green - Collections */

/* The "Missing Out" Animation */
@keyframes float {
  0%,
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
  50% {
    /* Blocks drift away from the center user */
    transform: translate(var(--x-dist, 10px), var(--y-dist, -10px));
    opacity: 0.3; /* Fading out represents losing the benefit */
  }
}

/* Specific drift directions for each block */
.b1 {
  --x-dist: -8px;
  --y-dist: -10px;
}
.b2 {
  --x-dist: 12px;
  --y-dist: -5px;
}
.b3 {
  --x-dist: -12px;
  --y-dist: 8px;
}
.b4 {
  --x-dist: 10px;
  --y-dist: 12px;
}
</style>
