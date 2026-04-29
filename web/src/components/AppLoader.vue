<template>
  <section
    class="splash"
    aria-live="polite"
    aria-busy="true"
  >
    <div
      class="splash__ripple splash__ripple--1"
      aria-hidden="true"
    />
    <div
      class="splash__ripple splash__ripple--2"
      aria-hidden="true"
    />

    <div class="splash__center">
      <div
        class="splash__pill"
        aria-hidden="true"
      >
        <img
          src="/kompagnon-logo.png"
          alt=""
          class="splash__logo"
        >
        <span class="splash__wordmark">KOMPAGNON</span>
      </div>
      <p class="splash__tagline">
        Votre espace solidaire
      </p>
      <div
        class="splash__bar-wrap"
        aria-hidden="true"
      >
        <div class="splash__bar" />
      </div>
    </div>

    <p class="splash__version">
      v1.0
    </p>
  </section>
</template>

<style scoped>
@keyframes kRipple {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
}

@keyframes kLogoIn {
  0% { opacity: 0; transform: translateY(12px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes kTagIn {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes kBarIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes kFill {
  0% { width: 0; }
  100% { width: 100%; }
}

.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--c-navy);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.splash__ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 2px solid var(--c-teal);
  animation: kRipple 2.4s ease-out infinite;
}

.splash__ripple--1 {
  width: 260px;
  height: 260px;
  animation-delay: 0s;
}

.splash__ripple--2 {
  width: 380px;
  height: 380px;
  animation-delay: 0.8s;
}

.splash__center {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: kLogoIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
}

.splash__pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: #fff;
  border-radius: 999px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}

.splash__logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.splash__wordmark {
  font-family: var(--font-display), sans-serif;
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--c-navy);
  letter-spacing: 0.08em;
}

.splash__tagline {
  margin: 0;
  color: var(--c-teal-light, #9ed4d9);
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  animation: kTagIn 0.6s ease 0.8s both;
}

.splash__bar-wrap {
  width: 72px;
  height: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  overflow: hidden;
  animation: kBarIn 0.4s ease 1s both;
}

.splash__bar {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--c-teal), #9ed4d9);
  animation: kFill 1.6s cubic-bezier(0.4, 0, 0.2, 1) 1.1s both;
}

.splash__version {
  position: absolute;
  bottom: 2rem;
  margin: 0;
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
}
</style>
