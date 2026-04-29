<script setup>
import BaseCard from "@/components/BaseCard.vue";

const actions = [
  {
    icon: "🧭",
    title: "Préparer un trajet",
    description: "Centralisez les étapes importantes et visualisez les prochains accompagnements utiles.",
    meta: "Parcours guidé",
  },
  {
    icon: "🤝",
    title: "Trouver de l'aide",
    description: "Mettez en avant les besoins essentiels avec une interface simple et rassurante.",
    meta: "Aide rapide",
  },
  {
    icon: "💬",
    title: "Échanger facilement",
    description: "Gardez des messages lisibles avec des points d'entrée clairs sur tous les écrans.",
    meta: "Communication claire",
  },
  {
    icon: "🛡️",
    title: "Suivre la confiance",
    description: "Des repères visuels forts pour savoir qui vous accompagne et quand agir.",
    meta: "Repères de confiance",
  },
];
</script>

<template>
  <section class="page-stack">
    <div class="page-stack">
      <span class="section-kicker">Actions rapides</span>
      <h2>Des points d'entrée pensés pour aller à l'essentiel</h2>
      <p class="muted-text">
        Cette première itération transforme les pages existantes avec une base de composants cohérente.
      </p>
    </div>

    <div class="action-grid">
      <BaseCard
        v-for="action in actions"
        :key="action.title"
        interactive
        class="action-card"
      >
        <span class="action-card__icon">{{ action.icon }}</span>
        <strong>{{ action.title }}</strong>
        <p class="muted-text">
          {{ action.description }}
        </p>
        <span class="action-card__meta">{{ action.meta }}</span>
      </BaseCard>
    </div>
  </section>
</template>

