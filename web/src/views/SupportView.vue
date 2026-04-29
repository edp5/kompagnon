<script setup>
const contacts = [
  { icon: "connect", label: "Chat en direct", detail: "Réponse immédiate", time: "< 2 min", bg: "linear-gradient(160deg, #101820 0%, #16212d 55%, #1d3140 100%)" },
  { icon: "phone", label: "Téléphone", detail: "0800 123 456", time: "< 5 min", bg: "linear-gradient(135deg, #16a34a, #22c55e)" },
  { icon: "mail", label: "Email", detail: "support@kompagnon.fr", time: "< 2h", bg: "linear-gradient(135deg, #2a5f70, #48afc4)" },
];

const categories = [
  { icon: "user", label: "Mon compte", desc: "Gestion du profil, paramètres, mot de passe", count: 12 },
  { icon: "notifications", label: "Réservations", desc: "Demande, annulation, modification", count: 8 },
  { icon: "shield", label: "Sécurité", desc: "Vérifications, signalements, urgences", count: 6 },
  { icon: "privacy", label: "Paiements", desc: "Frais, remboursements, facturation", count: 4 },
  { icon: "accessibility", label: "Accessibilité", desc: "Besoins spécifiques, équipements", count: 10 },
  { icon: "heart", label: "Volontaires", desc: "Devenir volontaire, formation, évaluation", count: 15 },
];

const faq = [
  { q: "Comment demander un accompagnement ?", a: "Cliquez sur \"Demander un accompagnement\" depuis l'écran d'accueil, indiquez votre destination et choisissez un volontaire disponible." },
  { q: "L'accompagnement est-il gratuit ?", a: "Oui, tous les accompagnements via Kompagnon sont entièrement gratuits. Notre service est financé par des partenaires et des subventions." },
  { q: "Comment sont vérifiés les volontaires ?", a: "Tous nos volontaires passent par une vérification d'identité, une formation obligatoire et sont évalués régulièrement par la communauté." },
  { q: "Que faire en cas d'urgence ?", a: "Utilisez le bouton d'urgence rouge sur l'écran d'accueil ou dans la carte. Vous serez immédiatement mis en relation avec notre équipe." },
  { q: "Comment modifier mon profil ?", a: "Rendez-vous dans l'onglet \"Profil\", cliquez sur l'icône de modification en haut à droite, puis modifiez vos informations." },
];

const resources = [
  { emoji: "📗", label: "Guide d'utilisation", desc: "Découvrez toutes les fonctionnalités" },
  { emoji: "🎥", label: "Tutoriels vidéo", desc: "Apprenez en images" },
  { emoji: "📄", label: "Conditions d'utilisation", desc: "Règles et engagements" },
];
</script>

<template>
  <div class="support-view app-page">
    <!-- Topbar -->
    <div class="support-topbar page-toolbar">
      <div class="support-search page-toolbar__search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Rechercher dans l'aide..."
          class="support-search-input"
          aria-label="Rechercher dans le centre d'aide"
        >
      </div>
      <div class="support-topbar__status page-toolbar__pill">
        <span class="support-dot" />
        En ligne
      </div>
    </div>

    <div class="support-content app-page__content app-page__content--stack">
      <!-- Header -->
      <header class="support-page-header app-page__header-main">
        <span class="support-page-header__eyebrow app-page__eyebrow">Centre d'aide</span>
        <h1 class="support-page-header__title app-page__title">
          Comment pouvons-nous vous aider ?
        </h1>
        <p class="support-page-header__sub app-page__subtitle">
          Notre équipe est disponible 24h/24, 7j/7 pour vous accompagner
        </p>
      </header>

      <!-- Contact cards -->
      <section class="support-section">
        <div class="support-section__head">
          <p class="support-section__eyebrow">
            Nous contacter
          </p>
          <h2 class="support-section__title">
            Choisissez votre canal
          </h2>
        </div>
        <div class="support-contacts">
          <button
            v-for="c in contacts"
            :key="c.label"
            class="contact-card"
            :style="{ background: c.bg }"
            :aria-label="`Contacter le support par ${c.label.toLowerCase()} - Temps de réponse: ${c.time}`"
            :title="`Cliquez pour ${c.detail}`"
          >
            <component
              :is="c.icon"
              :size="22"
              color="rgba(255,255,255,0.85)"
              :stroke-width="1.75"
              aria-hidden="true"
            />
            <strong>{{ c.label }}</strong>
            <span>{{ c.detail }}</span>
            <span class="contact-card__time">{{ c.time }}</span>
          </button>
        </div>
      </section>

      <!-- Categories -->
      <section class="support-section">
        <div class="support-section__head">
          <p class="support-section__eyebrow">
            Parcourir
          </p>
          <h2 class="support-section__title">
            Catégories d'aide
          </h2>
        </div>
        <div class="support-categories">
          <button
            v-for="cat in categories"
            :key="cat.label"
            class="cat-card support-card glass-panel"
            :aria-label="`Catégorie: ${cat.label} - ${cat.count} articles disponibles. ${cat.desc}`"
            :title="`Cliquez pour voir les articles sur: ${cat.label}`"
          >
            <span
              class="cat-card__emoji"
              aria-hidden="true"
            >{{ cat.emoji }}</span>
            <strong class="cat-card__label">{{ cat.label }}</strong>
            <span class="cat-card__desc">{{ cat.desc }}</span>
            <span class="cat-card__count">{{ cat.count }} articles</span>
          </button>
        </div>
      </section>

      <!-- FAQ -->
      <section class="support-section">
        <div class="support-section__head">
          <p class="support-section__eyebrow">
            Réponses rapides
          </p>
          <h2 class="support-section__title">
            Questions fréquentes
          </h2>
        </div>
        <div class="support-faq">
          <article
            v-for="item in faq"
            :key="item.q"
            class="faq-item support-card glass-panel"
          >
            <div class="faq-item__icon">
              💬
            </div>
            <div>
              <strong class="faq-item__q">{{ item.q }}</strong>
              <p class="faq-item__a">
                {{ item.a }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- Resources -->
      <section class="support-section">
        <div class="support-section__head">
          <p class="support-section__eyebrow">
            En savoir plus
          </p>
          <h2 class="support-section__title">
            Ressources utiles
          </h2>
        </div>
        <div class="support-resources support-card glass-panel">
          <button
            v-for="r in resources"
            :key="r.label"
            class="resource-row"
            :aria-label="`Ressource: ${r.label}. ${r.desc}`"
            :title="`Cliquez pour accéder à: ${r.label}`"
          >
            <span
              class="resource-row__icon"
              aria-hidden="true"
            >{{ r.emoji }}</span>
            <span class="resource-row__info">
              <strong>{{ r.label }}</strong>
              <span>{{ r.desc }}</span>
            </span>
            <ChevronRight
              :size="17"
              :stroke-width="1.75"
              color="#9ca3af"
              aria-hidden="true"
            />
          </button>
        </div>
      </section>

      <!-- Emergency -->
      <div class="support-emergency support-card support-card--dark glass-panel">
        <div
          class="support-emergency__icon"
          aria-hidden="true"
        >
          📞
        </div>
        <div class="support-emergency__body">
          <p class="support-section__eyebrow support-section__eyebrow--light">
            Urgence
          </p>
          <strong>Une urgence&nbsp;?</strong>
          <p>En cas d'urgence, contactez immédiatement notre ligne d'urgence 24h/24</p>
        </div>
        <button
          class="support-emergency__btn"
          aria-label="Appeler la ligne d'urgence immédiatement"
          title="Appel direct avec le service d'urgence Kompagnon"
        >
          <PhoneCall
            :size="15"
            :stroke-width="2"
            aria-hidden="true"
          />
          Appeler maintenant
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spring-in {
  0% { opacity: 0; transform: translateY(20px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.support-view {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: transparent;
}

/* -- Topbar -- */
.support-topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.support-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  border: 1.5px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  padding: 0.55rem 1rem;
  background: rgba(248, 250, 252, 0.95);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.support-search:focus-within {
  border-color: #48AFC4;
  box-shadow: 0 0 0 3px rgba(72, 175, 196, 0.12);
  background: white;
}

.support-search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  color: var(--kompagnon-navy);
  outline: none;
}

.support-search-input::placeholder {
  color: #9ca3af;
}

.support-topbar__status {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #16a34a;
  white-space: nowrap;
  padding: 0.35rem 0.75rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 999px;
}

.support-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}

/* -- Content -- */
.support-content {
  padding: 1.25rem 1.5rem 1.5rem;
  width: min(100%, 1320px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: none;
}

/* -- Page header -- */
.support-page-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.support-page-header__eyebrow {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: rgba(72, 175, 196, 0.12);
  border: 1px solid rgba(72, 175, 196, 0.2);
  font-size: 0.72rem;
  font-weight: 600;
  color: #2a5f70;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.support-page-header__title {
  font-size: clamp(1.5rem, 2.2vw, 2rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.support-page-header__sub {
  font-size: 0.9rem;
  color: #7b8794;
  margin: 0;
}

/* -- Section -- */
.support-section {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.support-section__head {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.support-section__eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  color: #7b8794;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0;
}

.support-section__eyebrow--light {
  color: rgba(255, 255, 255, 0.56);
}

.support-section__title {
  font-size: clamp(1.1rem, 1.4vw, 1.3rem);
  font-weight: 700;
  color: var(--kompagnon-navy);
  margin: 0;
  letter-spacing: -0.025em;
}

/* -- Base card -- */
.support-card {
  border-radius: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.06);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 32px rgba(15, 23, 42, 0.05), 0 2px 6px rgba(15, 23, 42, 0.03);
  backdrop-filter: blur(10px);
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.support-card--dark {
  background: linear-gradient(160deg, #101820 0%, #16212d 55%, #1d3140 100%);
  border-color: rgba(255, 255, 255, 0.06);
  color: white;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.18);
}

/* -- Contact cards -- */
.support-contacts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4rem;
  padding: 1.4rem 1.25rem;
  border-radius: 1.5rem;
  border: none;
  color: white;
  cursor: pointer;
  text-align: left;
  min-height: 130px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.14);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
  animation: spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.contact-card:nth-child(1) { animation-delay: 0s; }
.contact-card:nth-child(2) { animation-delay: 0.06s; }
.contact-card:nth-child(3) { animation-delay: 0.1s; }

.contact-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.2);
}

.contact-card strong {
  font-size: 1rem;
  font-weight: 700;
}

.contact-card span {
  font-size: 0.85rem;
  opacity: 0.9;
}

.contact-card__time {
  margin-top: auto;
  font-size: 0.78rem !important;
  opacity: 0.75 !important;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

/* -- Categories -- */
.support-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.875rem;
}

@media (min-width: 1180px) {
  .support-contacts {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .support-categories {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.cat-card {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  text-align: left;
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
}

.cat-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 14px 28px rgba(72, 175, 196, 0.14);
  border-color: rgba(72, 175, 196, 0.28);
}

.cat-card__emoji {
  font-size: 1.375rem;
  margin-bottom: 0.125rem;
}

.cat-card__label {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  letter-spacing: -0.02em;
}

.cat-card__desc {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.cat-card__count {
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(72, 175, 196, 0.08);
  color: #2a5f70;
  border: 1px solid rgba(72, 175, 196, 0.15);
  padding: 0.2rem 0.625rem;
  border-radius: 999px;
  margin-top: 0.25rem;
}

/* -- FAQ -- */
.support-faq {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.faq-item {
  display: flex;
  gap: 1rem;
  padding: 1.1rem 1.25rem;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
}

.faq-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.faq-item__icon {
  width: 34px;
  height: 34px;
  border-radius: 0.875rem;
  background: rgba(72, 175, 196, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.faq-item__q {
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--kompagnon-navy);
  display: block;
  margin-bottom: 0.375rem;
  letter-spacing: -0.02em;
}

.faq-item__a {
  font-size: 0.875rem;
  color: #374151;
  margin: 0;
  line-height: 1.55;
}

/* -- Resources -- */
.support-resources {
  overflow: hidden;
}

.resource-row {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1rem 1.25rem;
  border: none;
  border-bottom: 1px solid rgba(15, 23, 42, 0.05);
  background: transparent;
  cursor: pointer;
  text-align: left;
  min-height: 44px;
  transition: background 0.2s, padding-left 0.2s;
}

.resource-row:last-child {
  border-bottom: none;
}

.resource-row:hover {
  background: rgba(72, 175, 196, 0.04);
  padding-left: 1.5rem;
}

.resource-row__icon {
  font-size: 1.125rem;
  width: 38px;
  height: 38px;
  border-radius: 0.875rem;
  background: rgba(72, 175, 196, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resource-row__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.resource-row__info strong {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--kompagnon-navy);
}

.resource-row__info span {
  font-size: 0.8rem;
  color: #6b7280;
}

/* -- Emergency -- */
.support-emergency {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.4rem 1.6rem;
  position: relative;
  overflow: hidden;
}

.support-emergency::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.support-emergency__icon {
  font-size: 1.75rem;
  width: 52px;
  height: 52px;
  border-radius: 1.1rem;
  background: rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.support-emergency__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  position: relative;
  z-index: 1;
}

.support-emergency__body strong {
  font-size: 1rem;
  font-weight: 700;
  color: white;
}

.support-emergency__body p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.45;
}

.support-emergency__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  min-height: 44px;
  box-shadow: 0 6px 18px rgba(239, 68, 68, 0.38);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  z-index: 1;
}

.support-emergency__btn:hover {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 10px 24px rgba(239, 68, 68, 0.44);
}

@media (max-width: 1024px) and (min-width: 769px) {
  .support-contacts { grid-template-columns: 1fr 1fr 1fr; }
  .support-categories { grid-template-columns: repeat(2, 1fr); }
  .support-topbar { padding: 1rem 1.25rem; }
  .support-content { padding: 1.25rem 1.25rem 1.75rem; }
}

@media (max-width: 768px) {
  .support-contacts { grid-template-columns: 1fr 1fr; }
  .support-categories { grid-template-columns: repeat(2, 1fr); }
  .support-topbar { padding: 0.875rem 1.125rem; }
  .support-content { padding: 1.125rem 1.125rem 1.5rem; }
}

@media (max-width: 640px) {
  .support-topbar { padding: 0.75rem 1rem; }
  .support-content { padding: 1rem 1rem 1.5rem; }
  .support-contacts { grid-template-columns: 1fr; }
  .support-categories { grid-template-columns: 1fr; }
  .support-emergency { flex-direction: column; text-align: center; }
  .support-emergency__btn { width: 100%; justify-content: center; }
}
</style>
