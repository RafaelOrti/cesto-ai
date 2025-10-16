export const ANIMATIONS = {
  // Easing functions
  EASING: {
    LINEAR: 'linear',
    EASE: 'ease',
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    EASE_IN_QUAD: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    EASE_IN_CUBIC: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    EASE_IN_QUART: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    EASE_IN_QUINT: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    EASE_IN_SINE: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
    EASE_IN_EXPO: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    EASE_IN_CIRC: 'cubic-bezier(0.6, 0.04, 0.98, 0.34)',
    EASE_IN_BACK: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    EASE_OUT_QUAD: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    EASE_OUT_CUBIC: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    EASE_OUT_QUART: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    EASE_OUT_QUINT: 'cubic-bezier(0.23, 1, 0.32, 1)',
    EASE_OUT_SINE: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
    EASE_OUT_EXPO: 'cubic-bezier(0.19, 1, 0.22, 1)',
    EASE_OUT_CIRC: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    EASE_OUT_BACK: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    EASE_IN_OUT_QUAD: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    EASE_IN_OUT_CUBIC: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    EASE_IN_OUT_QUART: 'cubic-bezier(0.77, 0, 0.175, 1)',
    EASE_IN_OUT_QUINT: 'cubic-bezier(0.86, 0, 0.07, 1)',
    EASE_IN_OUT_SINE: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    EASE_IN_OUT_EXPO: 'cubic-bezier(1, 0, 0, 1)',
    EASE_IN_OUT_CIRC: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
    EASE_IN_OUT_BACK: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // Durations
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
    SLOWER: '700ms',
    SLOWEST: '1000ms'
  },

  // Transitions
  TRANSITIONS: {
    // Fade transitions
    FADE_IN: 'fadeIn 0.3s ease-in-out',
    FADE_OUT: 'fadeOut 0.3s ease-in-out',
    FADE_IN_UP: 'fadeInUp 0.3s ease-out',
    FADE_IN_DOWN: 'fadeInDown 0.3s ease-out',
    FADE_IN_LEFT: 'fadeInLeft 0.3s ease-out',
    FADE_IN_RIGHT: 'fadeInRight 0.3s ease-out',

    // Slide transitions
    SLIDE_IN_UP: 'slideInUp 0.3s ease-out',
    SLIDE_IN_DOWN: 'slideInDown 0.3s ease-out',
    SLIDE_IN_LEFT: 'slideInLeft 0.3s ease-out',
    SLIDE_IN_RIGHT: 'slideInRight 0.3s ease-out',
    SLIDE_OUT_UP: 'slideOutUp 0.3s ease-in',
    SLIDE_OUT_DOWN: 'slideOutDown 0.3s ease-in',
    SLIDE_OUT_LEFT: 'slideOutLeft 0.3s ease-in',
    SLIDE_OUT_RIGHT: 'slideOutRight 0.3s ease-in',

    // Scale transitions
    SCALE_IN: 'scaleIn 0.3s ease-out',
    SCALE_OUT: 'scaleOut 0.3s ease-in',
    SCALE_IN_UP: 'scaleInUp 0.3s ease-out',
    SCALE_IN_DOWN: 'scaleInDown 0.3s ease-out',

    // Rotate transitions
    ROTATE_IN: 'rotateIn 0.3s ease-out',
    ROTATE_OUT: 'rotateOut 0.3s ease-in',
    ROTATE_IN_UP_LEFT: 'rotateInUpLeft 0.3s ease-out',
    ROTATE_IN_UP_RIGHT: 'rotateInUpRight 0.3s ease-out',
    ROTATE_IN_DOWN_LEFT: 'rotateInDownLeft 0.3s ease-out',
    ROTATE_IN_DOWN_RIGHT: 'rotateInDownRight 0.3s ease-out',

    // Bounce transitions
    BOUNCE_IN: 'bounceIn 0.6s ease-out',
    BOUNCE_OUT: 'bounceOut 0.6s ease-in',
    BOUNCE_IN_UP: 'bounceInUp 0.6s ease-out',
    BOUNCE_IN_DOWN: 'bounceInDown 0.6s ease-out',
    BOUNCE_IN_LEFT: 'bounceInLeft 0.6s ease-out',
    BOUNCE_IN_RIGHT: 'bounceInRight 0.6s ease-out',

    // Zoom transitions
    ZOOM_IN: 'zoomIn 0.3s ease-out',
    ZOOM_OUT: 'zoomOut 0.3s ease-in',
    ZOOM_IN_UP: 'zoomInUp 0.3s ease-out',
    ZOOM_IN_DOWN: 'zoomInDown 0.3s ease-out',
    ZOOM_IN_LEFT: 'zoomInLeft 0.3s ease-out',
    ZOOM_IN_RIGHT: 'zoomInRight 0.3s ease-out',

    // Flip transitions
    FLIP_IN_X: 'flipInX 0.6s ease-out',
    FLIP_IN_Y: 'flipInY 0.6s ease-out',
    FLIP_OUT_X: 'flipOutX 0.6s ease-in',
    FLIP_OUT_Y: 'flipOutY 0.6s ease-in',

    // Light speed transitions
    LIGHT_SPEED_IN: 'lightSpeedIn 0.5s ease-out',
    LIGHT_SPEED_OUT: 'lightSpeedOut 0.5s ease-in',

    // Roll transitions
    ROLL_IN: 'rollIn 0.6s ease-out',
    ROLL_OUT: 'rollOut 0.6s ease-in',

    // Hover effects
    HOVER_SCALE: 'transform 0.2s ease-in-out',
    HOVER_SHADOW: 'box-shadow 0.2s ease-in-out',
    HOVER_COLOR: 'color 0.2s ease-in-out',
    HOVER_BACKGROUND: 'background-color 0.2s ease-in-out',
    HOVER_BORDER: 'border-color 0.2s ease-in-out',

    // Loading animations
    SPIN: 'spin 1s linear infinite',
    PULSE: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    PING: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
    BOUNCE: 'bounce 1s infinite',

    // Progress animations
    PROGRESS: 'progress 2s ease-in-out infinite',
    PROGRESS_BAR: 'progressBar 2s ease-in-out infinite',

    // Typing animations
    TYPEWRITER: 'typewriter 2s steps(40) 1s 1 normal both',
    BLINK: 'blink 1s infinite',

    // Shake animations
    SHAKE: 'shake 0.5s ease-in-out',
    SHAKE_X: 'shakeX 0.5s ease-in-out',
    SHAKE_Y: 'shakeY 0.5s ease-in-out',

    // Wobble animations
    WOBBLE: 'wobble 1s ease-in-out',
    JELLO: 'jello 1s ease-in-out',

    // Heartbeat animations
    HEARTBEAT: 'heartbeat 1.5s ease-in-out infinite',
    PULSE_HEART: 'pulseHeart 1.5s ease-in-out infinite',

    // Rubber band animations
    RUBBER_BAND: 'rubberBand 1s ease-in-out',
    RUBBER_BAND_X: 'rubberBandX 1s ease-in-out',
    RUBBER_BAND_Y: 'rubberBandY 1s ease-in-out',

    // Swing animations
    SWING: 'swing 1s ease-in-out',
    SWING_UP: 'swingUp 1s ease-in-out',
    SWING_DOWN: 'swingDown 1s ease-in-out',

    // Tada animations
    TADA: 'tada 1s ease-in-out',
    TADA_IN: 'tadaIn 1s ease-in-out',
    TADA_OUT: 'tadaOut 1s ease-in-out',

    // Wobble animations
    WOBBLE_HORIZONTAL: 'wobbleHorizontal 1s ease-in-out',
    WOBBLE_VERTICAL: 'wobbleVertical 1s ease-in-out',

    // Hinge animations
    HINGE: 'hinge 2s ease-in-out',
    HINGE_LEFT: 'hingeLeft 2s ease-in-out',
    HINGE_RIGHT: 'hingeRight 2s ease-in-out',

    // Jack in the box animations
    JACK_IN_THE_BOX: 'jackInTheBox 1s ease-in-out',
    JACK_IN_THE_BOX_UP: 'jackInTheBoxUp 1s ease-in-out',
    JACK_IN_THE_BOX_DOWN: 'jackInTheBoxDown 1s ease-in-out'
  },

  // Keyframes
  KEYFRAMES: {
    FADE_IN: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    FADE_OUT: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    FADE_IN_UP: `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 100%, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    FADE_IN_DOWN: `
      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translate3d(0, -100%, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    FADE_IN_LEFT: `
      @keyframes fadeInLeft {
        from {
          opacity: 0;
          transform: translate3d(-100%, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    FADE_IN_RIGHT: `
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translate3d(100%, 0, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    SLIDE_IN_UP: `
      @keyframes slideInUp {
        from {
          transform: translate3d(0, 100%, 0);
          visibility: visible;
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    SLIDE_IN_DOWN: `
      @keyframes slideInDown {
        from {
          transform: translate3d(0, -100%, 0);
          visibility: visible;
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    SLIDE_IN_LEFT: `
      @keyframes slideInLeft {
        from {
          transform: translate3d(-100%, 0, 0);
          visibility: visible;
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    SLIDE_IN_RIGHT: `
      @keyframes slideInRight {
        from {
          transform: translate3d(100%, 0, 0);
          visibility: visible;
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    SCALE_IN: `
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        to {
          opacity: 1;
          transform: scale3d(1, 1, 1);
        }
      }
    `,
    SCALE_OUT: `
      @keyframes scaleOut {
        from {
          opacity: 1;
          transform: scale3d(1, 1, 1);
        }
        to {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
      }
    `,
    ROTATE_IN: `
      @keyframes rotateIn {
        from {
          opacity: 0;
          transform: rotate3d(0, 0, 1, -200deg);
        }
        to {
          opacity: 1;
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }
    `,
    ROTATE_OUT: `
      @keyframes rotateOut {
        from {
          opacity: 1;
          transform: rotate3d(0, 0, 1, 0deg);
        }
        to {
          opacity: 0;
          transform: rotate3d(0, 0, 1, 200deg);
        }
      }
    `,
    BOUNCE_IN: `
      @keyframes bounceIn {
        0% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        20% {
          transform: scale3d(1.1, 1.1, 1.1);
        }
        40% {
          transform: scale3d(0.9, 0.9, 0.9);
        }
        60% {
          opacity: 1;
          transform: scale3d(1.03, 1.03, 1.03);
        }
        80% {
          transform: scale3d(0.97, 0.97, 0.97);
        }
        100% {
          opacity: 1;
          transform: scale3d(1, 1, 1);
        }
      }
    `,
    BOUNCE_OUT: `
      @keyframes bounceOut {
        20% {
          transform: scale3d(0.9, 0.9, 0.9);
        }
        50% {
          opacity: 1;
          transform: scale3d(1.1, 1.1, 1.1);
        }
        100% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
      }
    `,
    ZOOM_IN: `
      @keyframes zoomIn {
        from {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        50% {
          opacity: 1;
        }
      }
    `,
    ZOOM_OUT: `
      @keyframes zoomOut {
        from {
          opacity: 1;
        }
        50% {
          opacity: 0;
          transform: scale3d(0.3, 0.3, 0.3);
        }
        to {
          opacity: 0;
        }
      }
    `,
    FLIP_IN_X: `
      @keyframes flipInX {
        from {
          transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
          animation-timing-function: ease-in;
          opacity: 0;
        }
        40% {
          transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
          animation-timing-function: ease-in;
        }
        60% {
          transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
          opacity: 1;
        }
        80% {
          transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
        }
        to {
          transform: perspective(400px);
        }
      }
    `,
    FLIP_IN_Y: `
      @keyframes flipInY {
        from {
          transform: perspective(400px) rotate3d(0, 1, 0, 90deg);
          animation-timing-function: ease-in;
          opacity: 0;
        }
        40% {
          transform: perspective(400px) rotate3d(0, 1, 0, -20deg);
          animation-timing-function: ease-in;
        }
        60% {
          transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
          opacity: 1;
        }
        80% {
          transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
        }
        to {
          transform: perspective(400px);
        }
      }
    `,
    LIGHT_SPEED_IN: `
      @keyframes lightSpeedIn {
        from {
          transform: translate3d(100%, 0, 0) skewX(-30deg);
          opacity: 0;
        }
        60% {
          transform: skewX(20deg);
          opacity: 1;
        }
        80% {
          transform: skewX(-5deg);
        }
        to {
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    LIGHT_SPEED_OUT: `
      @keyframes lightSpeedOut {
        from {
          opacity: 1;
        }
        to {
          transform: translate3d(100%, 0, 0) skewX(30deg);
          opacity: 0;
        }
      }
    `,
    ROLL_IN: `
      @keyframes rollIn {
        from {
          opacity: 0;
          transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
    ROLL_OUT: `
      @keyframes rollOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
          transform: translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg);
        }
      }
    `,
    SPIN: `
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
    PULSE: `
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `,
    PING: `
      @keyframes ping {
        75%, 100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `,
    BOUNCE: `
      @keyframes bounce {
        0%, 100% {
          transform: translateY(-25%);
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }
        50% {
          transform: translateY(0);
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
      }
    `,
    PROGRESS: `
      @keyframes progress {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `,
    PROGRESS_BAR: `
      @keyframes progressBar {
        0% {
          width: 0%;
        }
        100% {
          width: 100%;
        }
      }
    `,
    TYPEWRITER: `
      @keyframes typewriter {
        from {
          width: 0;
        }
        to {
          width: 100%;
        }
      }
    `,
    BLINK: `
      @keyframes blink {
        0%, 50% {
          opacity: 1;
        }
        51%, 100% {
          opacity: 0;
        }
      }
    `,
    SHAKE: `
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(10px);
        }
      }
    `,
    SHAKE_X: `
      @keyframes shakeX {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(10px);
        }
      }
    `,
    SHAKE_Y: `
      @keyframes shakeY {
        0%, 100% {
          transform: translateY(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateY(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateY(10px);
        }
      }
    `,
    WOBBLE: `
      @keyframes wobble {
        0% {
          transform: translateX(0%);
        }
        15% {
          transform: translateX(-25%) rotate(-5deg);
        }
        30% {
          transform: translateX(20%) rotate(3deg);
        }
        45% {
          transform: translateX(-15%) rotate(-3deg);
        }
        60% {
          transform: translateX(10%) rotate(2deg);
        }
        75% {
          transform: translateX(-5%) rotate(-1deg);
        }
        100% {
          transform: translateX(0%);
        }
      }
    `,
    JELLO: `
      @keyframes jello {
        0% {
          transform: scale3d(1, 1, 1);
        }
        30% {
          transform: scale3d(1.25, 0.75, 1);
        }
        40% {
          transform: scale3d(0.75, 1.25, 1);
        }
        50% {
          transform: scale3d(1.15, 0.85, 1);
        }
        65% {
          transform: scale3d(0.95, 1.05, 1);
        }
        75% {
          transform: scale3d(1.05, 0.95, 1);
        }
        100% {
          transform: scale3d(1, 1, 1);
        }
      }
    `,
    HEARTBEAT: `
      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        14% {
          transform: scale(1.3);
        }
        28% {
          transform: scale(1);
        }
        42% {
          transform: scale(1.3);
        }
        70% {
          transform: scale(1);
        }
      }
    `,
    PULSE_HEART: `
      @keyframes pulseHeart {
        0% {
          transform: scale(1);
        }
        14% {
          transform: scale(1.3);
        }
        28% {
          transform: scale(1);
        }
        42% {
          transform: scale(1.3);
        }
        70% {
          transform: scale(1);
        }
      }
    `,
    RUBBER_BAND: `
      @keyframes rubberBand {
        0% {
          transform: scale(1);
        }
        30% {
          transform: scaleX(1.25) scaleY(0.75);
        }
        40% {
          transform: scaleX(0.75) scaleY(1.25);
        }
        50% {
          transform: scaleX(1.15) scaleY(0.85);
        }
        65% {
          transform: scaleX(0.95) scaleY(1.05);
        }
        75% {
          transform: scaleX(1.05) scaleY(0.95);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
    SWING: `
      @keyframes swing {
        20% {
          transform: rotate3d(0, 0, 1, 15deg);
        }
        40% {
          transform: rotate3d(0, 0, 1, -10deg);
        }
        60% {
          transform: rotate3d(0, 0, 1, 5deg);
        }
        80% {
          transform: rotate3d(0, 0, 1, -5deg);
        }
        100% {
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }
    `,
    TADA: `
      @keyframes tada {
        0% {
          transform: scale(1);
        }
        10%, 20% {
          transform: scale(0.9) rotate(-3deg);
        }
        30%, 50%, 70%, 90% {
          transform: scale(1.1) rotate(3deg);
        }
        40%, 60%, 80% {
          transform: scale(1.1) rotate(-3deg);
        }
        100% {
          transform: scale(1) rotate(0);
        }
      }
    `,
    HINGE: `
      @keyframes hinge {
        0% {
          transform: rotate(0);
          transform-origin: top left;
          animation-timing-function: ease-in-out;
        }
        20%, 60% {
          transform: rotate(80deg);
          transform-origin: top left;
          animation-timing-function: ease-in-out;
        }
        40% {
          transform: rotate(60deg);
          transform-origin: top left;
          animation-timing-function: ease-in-out;
        }
        80% {
          transform: rotate(60deg) translateY(0);
          transform-origin: top left;
          animation-timing-function: ease-in-out;
        }
        100% {
          transform: translateY(700px);
        }
      }
    `,
    JACK_IN_THE_BOX: `
      @keyframes jackInTheBox {
        from {
          opacity: 0;
          transform: scale(0.1) rotate(30deg);
          transform-origin: center bottom;
        }
        50% {
          transform: rotate(-10deg);
        }
        70% {
          transform: rotate(3deg);
        }
        to {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }
      }
    `
  }
};
