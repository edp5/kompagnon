<script setup>
import { reactive, ref } from "vue";

import { registerNewUser } from "@/adapters/authentication.js";

function initialFormState() {
  return {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    birthday: "",
  };
}

const form = reactive(initialFormState());
const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

function resetFeedback() {
  successMessage.value = "";
  errorMessage.value = "";
}

function resetForm() {
  Object.assign(form, initialFormState());
}

async function handleSubmit() {
  resetFeedback();
  isSubmitting.value = true;

  const result = await registerNewUser({ ...form });

  if (result.success) {
    successMessage.value = "An email has been sent to activate your account.";
    resetForm();
  } else {
    errorMessage.value = result.message ?? "Something went wrong. Please try again.";
  }

  isSubmitting.value = false;
}
</script>

<template>
  <section class="register-view">
    <h1>Create your account</h1>

    <form
      class="register-form"
      @submit.prevent="handleSubmit"
    >
      <label>
        First name
        <input
          v-model="form.firstname"
          type="text"
          name="firstname"
          autocomplete="given-name"
          required
        >
      </label>

      <label>
        Last name
        <input
          v-model="form.lastname"
          type="text"
          name="lastname"
          autocomplete="family-name"
          required
        >
      </label>

      <label>
        Email
        <input
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          required
        >
      </label>

      <label>
        Password
        <input
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="new-password"
          required
        >
      </label>

      <label>
        Date of birth
        <input
          v-model="form.birthday"
          type="date"
          name="birthday"
          required
        >
      </label>

      <button
        type="submit"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? "Creating account..." : "Create account" }}
      </button>
    </form>

    <p
      v-if="successMessage"
      class="feedback success"
      role="status"
      aria-live="polite"
    >
      {{ successMessage }}
    </p>

    <p
      v-if="errorMessage"
      class="feedback error"
      role="status"
      aria-live="assertive"
    >
      {{ errorMessage }}
    </p>
  </section>
</template>

<style scoped>
.register-view {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  gap: 0.25rem;
}

input {
  padding: 0.5rem;
  border: 1px solid #d3d3d3;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background-color: #1e40af;
  color: white;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.feedback {
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.feedback.success {
  background-color: #dcfce7;
  color: #166534;
}

.feedback.error {
  background-color: #fee2e2;
  color: #991b1b;
}
</style>

