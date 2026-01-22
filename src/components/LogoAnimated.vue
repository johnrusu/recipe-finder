<template>
  <div class="animation-container">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <ellipse
        cx="100"
        cy="180"
        rx="45"
        ry="5"
        fill="#42210B"
        opacity="0.06"
        class="shadow-pulse"
      />

      <path
        d="M30,55 Q20,40 25,25 Q45,20 50,45 Z"
        fill="#F4D390"
        class="float-leaf"
      />

      <g class="float-tomato">
        <circle cx="165" cy="70" r="17" fill="#F15A24" />
        <rect x="162" y="52" width="6" height="8" rx="2" fill="#42210B" />
      </g>

      <g class="book-group">
        <rect x="50" y="50" width="100" height="100" rx="14" fill="#F15A24" />

        <rect x="50" y="140" width="100" height="15" rx="7" fill="#FFFBEB" />
        <rect x="50" y="140" width="100" height="8" fill="#FFFBEB" />
        <path d="M72 135 V168 L82 160 L92 168 V135" fill="#FF8E6D" />

        <g fill="#42210B">
          <path
            d="M85 70 V115 M80 70 V90 M90 70 V90"
            stroke="#42210B"
            stroke-width="4"
            stroke-linecap="round"
          />
          <ellipse cx="118" cy="85" rx="8" ry="12" />
          <rect x="115" y="90" width="6" height="25" rx="3" />
        </g>
      </g>

      <g class="glass-anim">
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="rgba(255,255,255,0.2)"
          stroke="#42210B"
          stroke-width="6"
        />
        <line
          x1="18"
          y1="18"
          x2="36"
          y2="36"
          stroke="#42210B"
          stroke-width="9"
          stroke-linecap="round"
        />
      </g>

      <circle class="sparkle s1" cx="35" cy="120" r="4" fill="#F4D390" />
      <circle class="sparkle s2" cx="170" cy="135" r="5" fill="#F4D390" />
    </svg>
  </div>
</template>

<style scoped>
/* Elegant, non-linear floating */
.book-group {
  animation: float 5s ease-in-out infinite;
}
.float-leaf {
  animation: float 7s ease-in-out infinite;
}
.float-tomato {
  animation: float 6s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* Slow, sweeping scan of the glass */
.glass-anim {
  animation: scan 10s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

@keyframes scan {
  0% {
    transform: translate(145px, 140px);
  }
  33% {
    transform: translate(80px, 85px);
  }
  66% {
    transform: translate(120px, 115px);
  }
  100% {
    transform: translate(145px, 140px);
  }
}

.shadow-pulse {
  transform-origin: center;
  animation: shadowPulse 5s ease-in-out infinite;
}

@keyframes shadowPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.06;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.03;
  }
}

.sparkle {
  animation: twinkle 3s ease-in-out infinite;
}
.s2 {
  animation-delay: 1.5s;
}
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
