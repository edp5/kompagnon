<script setup>
import BaseButton from "@/components/BaseButton.vue";
import BaseCard from "@/components/BaseCard.vue";

const emit = defineEmits(["logout"]);

defineProps({
  userId: {
    type: Number,
    default: null,
  },
});

const helperTags = ["Accessibilité", "Lisibilité", "Ergonomie"];
</script>

<template>
  <section class="hero-layout">
    <BaseCard hero>
      <div class="hero-layout__content">
        <span class="section-kicker">Accueil</span>
        <h1>Bienvenue sur votre espace Kompagnon</h1>
        <p>
          Organisez vos trajets, repérez des accompagnements fiables et gardez une expérience fluide
          sur mobile comme sur desktop.
        </p>

        <div class="hero-chip-row">
          <span
            v-for="tag in helperTags"
            :key="tag"
            class="surface-pill"
          >
            {{ tag }}
          </span>
          <span
            v-if="userId"
            class="surface-pill"
          >
            Utilisateur #{{ userId }}
          </span>
        </div>

        <div class="auth-layout__actions">
          <BaseButton @click="emit('logout')">
            Se déconnecter
          </BaseButton>
          <BaseButton variant="secondary">
            Explorer les accompagnements
          </BaseButton>
        </div>
      </div>
    </BaseCard>

    <div class="hero-layout__image surface-card">
      <img
        src="/kompagnon-banner.jpg"
        alt="Illustration Kompagnon représentant un accompagnement bienveillant"
      >
      <div class="hero-layout__overlay">
        <strong>Un design rassurant et inclusif</strong>
        <p>
          L'interface met en avant des contrastes élevés, des zones tactiles larges et un parcours
          clair pour chaque page.
        </p>
      </div>
    </div>
  </section>
</template>


