<script setup>
import BaseCard from "@/components/BaseCard.vue";

const stats = [
  {
    icon: "🌍",
    label: "Couverture",
    value: "24/7",
    detail: "Une expérience stable et lisible pour les usages essentiels.",
  },
  {
    icon: "⭐",
    label: "Accessibilité",
    value: "WCAG AA",
    detail: "Contrastes élevés, focus visibles et grandes zones d'interaction.",
  },
  {
    icon: "📱",
    label: "Responsive",
    value: "Mobile-first",
    detail: "Le design s'adapte aux petits écrans comme aux grands formats.",
  },
];

const highlights = [
  {
    title: "Un socle de composants réutilisables",
    description: "Boutons, champs, cartes et layouts sont centralisés dans `web/src/components`.",
  },
  {
    title: "Une identité visuelle alignée sur Figma Make",
    description: "Couleurs, typographie fluide, bannière et logo suivent désormais la guideline fournie.",
  },
];
</script>

<template>
  <section class="page-grid">
    <div class="page-stack">
      <span class="section-kicker">Repères</span>
      <h2>Une base UI plus claire pour les prochaines pages</h2>
      <div class="stats-grid">
        <BaseCard
          v-for="stat in stats"
          :key="stat.label"
          class="stat-card"
        >
          <span class="stat-card__icon">{{ stat.icon }}</span>
          <span class="muted-text">{{ stat.label }}</span>
          <strong class="stat-card__value">{{ stat.value }}</strong>
          <p class="muted-text">
            {{ stat.detail }}
          </p>
        </BaseCard>
      </div>
    </div>

    <div class="highlight-grid">
      <BaseCard
        v-for="highlight in highlights"
        :key="highlight.title"
        class="highlight-card"
      >
        <span class="section-kicker">Design system</span>
        <strong>{{ highlight.title }}</strong>
        <p class="muted-text">
          {{ highlight.description }}
        </p>
      </BaseCard>
    </div>
  </section>
</template>

