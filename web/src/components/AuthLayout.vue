<script setup>
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
} from "lucide-vue-next";

defineProps({
  title: {
    type: String,
    required: true,
  },
  kicker: {
    type: String,
    default: "Espace sécurisé",
  },
  description: {
    type: String,
    default: "",
  },
  heroTitle: {
    type: String,
    default: "L’accompagnement inclusif, pensé pour des connexions simples et rassurantes.",
  },
  heroDescription: {
    type: String,
    default: "Kompagnon rassemble les bons contacts, les bons repères et une interface claire pour avancer sereinement au quotidien.",
  },
});

const heroPills = [
  "Accessible",
  "Vérifié",
  "Bienveillant",
];

const highlights = [
  {
    icon: HeartHandshake,
    title: "Des échanges humains",
    text: "Retrouvez rapidement une aide proche, claire et rassurante.",
  },
  {
    icon: ShieldCheck,
    title: "Connexion sécurisée",
    text: "Votre accès et vos données restent protégés à chaque étape.",
  },
  {
    icon: Sparkles,
    title: "Pensé pour l’accessibilité",
    text: "Lisibilité renforcée, parcours direct et repères visibles.",
  },
];

const stats = [
  {
    value: "24/7",
    label: "Accès à votre espace",
  },
  {
    value: "100%",
    label: "Design centré usage",
  },
  {
    value: "1 min",
    label: "Pour reprendre la main",
  },
];
</script>

<template>
  <div class="auth-page">
    <div class="auth-page__orb auth-page__orb--teal" />
    <div class="auth-page__orb auth-page__orb--navy" />
    <div class="auth-page__grid" />

    <div class="auth-shell">
      <header class="auth-shell__brand">
        <div class="auth-shell__brand-logo">
          <img
            src="/kompagnon-logo.png"
            alt="Logo Kompagnon"
            class="auth-shell__brand-image"
          >
        </div>
        <div class="auth-shell__brand-copy">
          <strong>Kompagnon</strong>
          <span>Accompagnement solidaire</span>
        </div>
      </header>

      <section class="auth-hero">
        <div class="auth-hero__intro">
          <span class="auth-hero__badge">
            <Sparkles class="auth-hero__badge-icon" />
            {{ kicker }}
          </span>

          <h1 class="auth-hero__title">
            {{ heroTitle }}
          </h1>

          <p class="auth-hero__description">
            {{ heroDescription }}
          </p>

          <div class="auth-hero__pills">
            <span
              v-for="pill in heroPills"
              :key="pill"
              class="auth-hero__pill"
            >
              {{ pill }}
            </span>
          </div>
        </div>

        <div class="auth-hero__cards">
          <article
            v-for="item in highlights"
            :key="item.title"
            class="auth-hero__card"
          >
            <div class="auth-hero__card-icon">
              <component :is="item.icon" />
            </div>
            <div class="auth-hero__card-copy">
              <h2>{{ item.title }}</h2>
              <p>{{ item.text }}</p>
            </div>
          </article>
        </div>

        <div class="auth-hero__footer">
          <div class="auth-hero__stats">
            <div
              v-for="item in stats"
              :key="item.label"
              class="auth-hero__stat"
            >
              <strong>{{ item.value }}</strong>
              <span>{{ item.label }}</span>
            </div>
          </div>

          <div class="auth-hero__quote">
            <CheckCircle2 class="auth-hero__quote-icon" />
            <div>
              <strong>Une expérience plus calme, plus claire, plus humaine.</strong>
              <p>
                Conçue pour redonner confiance dès l’écran de connexion.
              </p>
            </div>
            <ArrowRight class="auth-hero__quote-arrow" />
          </div>
        </div>
      </section>

      <main class="auth-panel">
        <div class="auth-panel__box">
          <div class="auth-panel__header">
            <p class="auth-panel__kicker">
              {{ kicker }}
            </p>
            <h2 class="auth-panel__title">
              {{ title }}
            </h2>
            <p
              v-if="description"
              class="auth-panel__description"
            >
              {{ description }}
            </p>
          </div>

          <slot />

          <footer class="auth-panel__footer">
            <slot name="footer" />
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(72, 175, 196, 0.22), transparent 28%),
    radial-gradient(circle at bottom right, rgba(30, 44, 56, 0.16), transparent 24%),
    linear-gradient(160deg, #eff7f8 0%, #f7f1eb 45%, #fcfaf7 100%);
}

.auth-page__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.28) 1px, transparent 1px);
  background-size: 36px 36px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.7), transparent 90%);
  pointer-events: none;
}

.auth-page__orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(18px);
  opacity: 0.7;
  pointer-events: none;
}

.auth-page__orb--teal {
  width: 18rem;
  height: 18rem;
  top: 8%;
  right: 10%;
  background: rgba(72, 175, 196, 0.2);
}

.auth-page__orb--navy {
  width: 14rem;
  height: 14rem;
  bottom: 8%;
  left: 6%;
  background: rgba(30, 44, 56, 0.14);
}

.auth-shell {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  min-height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  align-items: start;
  gap: 1.5rem;
  padding: 1.5rem;
}

.auth-shell__brand {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.65rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 14px 30px rgba(30, 44, 56, 0.08);
  backdrop-filter: blur(18px);
}

.auth-shell__brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(72, 175, 196, 0.14), rgba(30, 44, 56, 0.08));
}

.auth-shell__brand-image {
  width: 1.8rem;
  height: 1.8rem;
  object-fit: contain;
}

.auth-shell__brand-copy {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.auth-shell__brand-copy strong {
  color: var(--c-navy);
  font-size: 0.98rem;
  line-height: 1.1;
}

.auth-shell__brand-copy span {
  color: var(--c-text-medium);
  font-size: 0.78rem;
  line-height: 1.1;
}

.auth-hero {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 6rem 1rem 1rem;
}

.auth-hero__intro {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 36rem;
}

.auth-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  width: fit-content;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  color: var(--c-navy);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 8px 24px rgba(30, 44, 56, 0.06);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.auth-hero__badge-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--c-teal-dark);
}

.auth-hero__title {
  margin: 0;
  color: var(--c-navy);
  font-family: var(--font-display), sans-serif;
  font-size: clamp(2.2rem, 5vw, 4.15rem);
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.auth-hero__description {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 1.02rem;
  line-height: 1.75;
  max-width: 32rem;
}

.auth-hero__pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.auth-hero__pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(30, 44, 56, 0.08);
  color: var(--c-text-medium);
  font-size: 0.82rem;
  font-weight: 700;
}

.auth-hero__cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.auth-hero__card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 100%;
  padding: 1.25rem;
  border-radius: 1.6rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 18px 36px rgba(30, 44, 56, 0.07);
  backdrop-filter: blur(16px);
}

.auth-hero__card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  color: var(--c-teal-dark);
  background: rgba(72, 175, 196, 0.12);
}

.auth-hero__card-icon :deep(svg) {
  width: 1.35rem;
  height: 1.35rem;
}

.auth-hero__card-copy {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.auth-hero__card-copy h2 {
  margin: 0;
  color: var(--c-navy);
  font-size: 1rem;
  line-height: 1.2;
}

.auth-hero__card-copy p {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.89rem;
  line-height: 1.6;
}

.auth-hero__footer {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-hero__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.875rem;
}

.auth-hero__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.1rem;
  border-radius: 1.4rem;
  background: rgba(30, 44, 56, 0.9);
  box-shadow: 0 18px 34px rgba(30, 44, 56, 0.14);
}

.auth-hero__stat strong {
  color: #ffffff;
  font-size: 1.35rem;
  line-height: 1;
}

.auth-hero__stat span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.8rem;
  line-height: 1.45;
}

.auth-hero__quote {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.9rem;
  padding: 1.1rem 1.2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 18px 36px rgba(30, 44, 56, 0.07);
}

.auth-hero__quote-icon,
.auth-hero__quote-arrow {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--c-teal-dark);
}

.auth-hero__quote strong {
  display: block;
  margin-bottom: 0.2rem;
  color: var(--c-navy);
  font-size: 0.95rem;
}

.auth-hero__quote p {
  margin: 0;
  color: var(--c-text-medium);
  font-size: 0.84rem;
  line-height: 1.55;
}

.auth-panel {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  min-height: 100%;
  padding: 5rem 0 1rem;
}

.auth-panel__box {
  width: min(100%, 38rem);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(1.2rem, 1.8vw, 2rem);
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(30, 44, 56, 0.08);
  box-shadow: 0 24px 60px rgba(30, 44, 56, 0.12);
  backdrop-filter: blur(22px);
}

.auth-panel__header {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.auth-panel__kicker {
  margin: 0;
  color: var(--c-text-light);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.auth-panel__title {
  margin: 0;
  color: var(--c-navy);
  font-family: var(--font-display), sans-serif;
  font-size: clamp(1.6rem, 3.2vw, 2.3rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

.auth-panel__description {
  margin: 0;
  color: var(--c-text-medium);
  line-height: 1.65;
}

.auth-panel__footer {
  padding-top: 0.75rem;
  border-top: 1px solid rgba(30, 44, 56, 0.08);
  color: var(--c-text-medium);
}

@media (max-width: 1279px) {
  .auth-shell {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .auth-hero {
    padding: 6rem 0 0;
  }

  .auth-hero__cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .auth-panel {
    padding-top: 0;
  }
}

@media (min-width: 1024px) and (max-height: 900px) {
  .auth-shell {
    gap: 1rem;
    padding: 1rem 1rem 1.25rem;
  }

  .auth-shell__brand {
    top: 1rem;
    left: 1rem;
    padding: 0.55rem 0.8rem;
  }

  .auth-hero {
    gap: 1rem;
    padding: 4.75rem 0.5rem 0.5rem;
  }

  .auth-hero__intro {
    gap: 0.95rem;
  }

  .auth-hero__title {
    font-size: clamp(1.9rem, 3.6vw, 3rem);
  }

  .auth-hero__description {
    font-size: 0.94rem;
    line-height: 1.58;
  }

  .auth-hero__cards {
    display: none;
  }

  .auth-hero__stats {
    gap: 0.65rem;
  }

  .auth-hero__stat {
    padding: 0.8rem 0.9rem;
  }

  .auth-hero__stat strong {
    font-size: 1.15rem;
  }

  .auth-hero__quote {
    gap: 0.75rem;
    padding: 0.9rem 1rem;
  }

  .auth-panel {
    padding: 4.6rem 0 0.75rem;
  }

  .auth-panel__box {
    gap: 1rem;
    padding: 1.1rem 1.1rem 1rem;
    border-radius: 1.5rem;
  }

  .auth-panel__header {
    gap: 0.4rem;
  }

  .auth-panel__title {
    font-size: clamp(1.35rem, 2.4vw, 1.9rem);
  }

  .auth-panel__description {
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .auth-panel__footer {
    padding-top: 0.55rem;
  }
}

@media (min-width: 1024px) and (max-height: 820px) {
  .auth-shell {
    grid-template-columns: 1fr;
  }

  .auth-hero {
    display: none;
  }

  .auth-panel {
    padding-top: 4.6rem;
  }

  .auth-panel__box {
    width: min(100%, 36rem);
  }
}

@media (max-width: 1023px) {
  .auth-page {
    background:
      radial-gradient(circle at top right, rgba(72, 175, 196, 0.2), transparent 32%),
      linear-gradient(160deg, #f3ede6 0%, #fbf7f1 100%);
  }

  .auth-shell {
    padding: 1rem;
  }

  .auth-shell__brand {
    left: 1rem;
    right: 1rem;
    width: fit-content;
    max-width: calc(100% - 2rem);
  }

  .auth-hero {
    display: none;
  }

  .auth-panel {
    min-height: 100vh;
    min-height: 100dvh;
    padding: 5.4rem 0 1rem;
  }

  .auth-panel__box {
    width: 100%;
    border-radius: 1.65rem;
  }
}

@media (max-width: 640px) {
  .auth-shell__brand {
    gap: 0.7rem;
    padding: 0.55rem 0.8rem;
  }

  .auth-shell__brand-copy strong {
    font-size: 0.92rem;
  }

  .auth-shell__brand-copy span {
    font-size: 0.72rem;
  }

  .auth-panel {
    align-items: flex-start;
    padding-top: 5rem;
  }

  .auth-panel__box {
    gap: 1.25rem;
    padding: 1.2rem;
  }

  .auth-panel__title {
    font-size: 1.55rem;
  }
}
</style>
