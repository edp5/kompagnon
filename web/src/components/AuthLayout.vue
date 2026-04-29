<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});

const features = [
  { icon: "✓", label: "Volontaires vérifiés et de confiance" },
  { icon: "✓", label: "Interface accessible, grands boutons lisibles" },
  { icon: "✓", label: "100 % gratuit, financé par des partenaires" },
];

const stats = [
  { value: "2 847", label: "Volontaires" },
  { value: "4.9", label: "Note moyenne" },
  { value: "100%", label: "Sécurisé" },
];
</script>

<template>
  <div class="auth-page">
    <!-- Panneau gauche : branding sombre -->
    <aside class="auth-brand">
      <div class="auth-brand__inner">
        <!-- Logo -->
        <div class="auth-brand__logo-row">
          <img
            src="/kompagnon-logo.png"
            alt="Logo Kompagnon"
            class="auth-brand__logo-img"
          >
          <div class="auth-brand__logo-text">
            <strong class="auth-brand__name">Kompagnon</strong>
            <span class="auth-brand__tagline">Accompagnement solidaire</span>
          </div>
        </div>

        <!-- Headline -->
        <div class="auth-brand__headline">
          <h1 class="auth-brand__h1">
            L'accompagnement<br>inclusif, pensé<br>pour tous.
          </h1>
          <p class="auth-brand__desc">
            Trouvez un volontaire bienveillant près de chez vous en quelques
            secondes.
          </p>
        </div>

        <!-- Features -->
        <ul class="auth-brand__features">
          <li
            v-for="f in features"
            :key="f.label"
            class="auth-brand__feature"
          >
            <span class="auth-brand__feature-icon">{{ f.icon }}</span>
            {{ f.label }}
          </li>
        </ul>

        <!-- Stats -->
        <div class="auth-brand__stats">
          <div
            v-for="s in stats"
            :key="s.label"
            class="auth-brand__stat"
          >
            <strong class="auth-brand__stat-value">{{ s.value }}</strong>
            <span class="auth-brand__stat-label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Panneau droit : formulaire -->
    <main class="auth-form-panel">
      <!-- Logo mobile (masqué desktop) -->
      <div class="auth-form-mobile-logo">
        <img
          src="/kompagnon-logo.png"
          alt="Logo Kompagnon"
          class="auth-form-mobile-logo__img"
        >
        <strong>Kompagnon</strong>
      </div>

      <div class="auth-form-box">
        <div class="auth-form-header">
          <h2 class="auth-form-title">
            {{ title }}
          </h2>
          <p
            v-if="description"
            class="auth-form-desc"
          >
            {{ description }}
          </p>
        </div>

        <slot />

        <div class="auth-form-footer">
          <slot name="footer" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Page shell ─────────────────────────────────────── */
.auth-page {
  display: flex;
  min-height: 100vh;
  background: #ffffff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

/* ── Brand panel (left) ─────────────────────────────── */
.auth-brand {
  display: none;
  flex-direction: column;
  width: 42%;
  min-height: 100vh;
  background: linear-gradient(
    155deg,
    #1e2c38 0%,
    #1a4a58 55%,
    #235e70 100%
  );
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

/* Decorative soft glow */
.auth-brand::before {
  content: "";
  position: absolute;
  top: -120px;
  right: -120px;
  width: 480px;
  height: 480px;
  background: radial-gradient(
    circle,
    rgba(72, 175, 196, 0.22) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.auth-brand::after {
  content: "";
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 360px;
  height: 360px;
  background: radial-gradient(
    circle,
    rgba(158, 212, 217, 0.15) 0%,
    transparent 70%
  );
  pointer-events: none;
}

@media (min-width: 1024px) {
  .auth-brand {
    display: flex;
  }
}

.auth-brand__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem 2.5rem;
  height: 100%;
}

/* Logo row */
.auth-brand__logo-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.auth-brand__logo-img {
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
  flex-shrink: 0;
}

.auth-brand__logo-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.auth-brand__name {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.auth-brand__tagline {
  font-size: 0.8125rem;
  color: rgba(158, 212, 217, 0.85);
  line-height: 1.2;
}

/* Headline block */
.auth-brand__headline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  justify-content: center;
}

.auth-brand__h1 {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  line-height: 1.15;
  color: #ffffff;
  margin: 0;
}

.auth-brand__desc {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
  max-width: 26rem;
}

/* Feature list */
.auth-brand__features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.auth-brand__feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.4;
}

.auth-brand__feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 1.625rem;
  height: 1.625rem;
  border-radius: 50%;
  background: rgba(72, 175, 196, 0.28);
  color: #48afc4;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(72, 175, 196, 0.35);
}

/* Stats row */
.auth-brand__stats {
  display: flex;
  gap: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 1.5rem;
}

.auth-brand__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-brand__stat:last-child {
  border-right: none;
}

.auth-brand__stat-value {
  font-size: 1.375rem;
  font-weight: 700;
  color: #48afc4;
  line-height: 1;
}

.auth-brand__stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  line-height: 1.3;
}

/* ── Form panel (right) ─────────────────────────────── */
.auth-form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  background: #ffffff;
  min-height: 100vh;
}

.auth-form-mobile-logo {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 2rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1e2c38;
}

.auth-form-mobile-logo__img {
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
}

@media (min-width: 1024px) {
  .auth-form-mobile-logo {
    display: none;
  }
}

.auth-form-box {
  width: 100%;
  max-width: 26rem;
}

.auth-form-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.auth-form-title {
  font-size: clamp(1.375rem, 3vw, 1.75rem);
  font-weight: 700;
  color: #1e2c38;
  margin: 0;
  line-height: 1.2;
}

.auth-form-desc {
  font-size: 0.9375rem;
  color: #6b7c8d;
  margin: 0;
  line-height: 1.55;
}

.auth-form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9375rem;
  color: #6b7c8d;
}
</style>
