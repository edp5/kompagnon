import "./styles/design-system.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const mountTarget = document.querySelector("#app");

app.use(createPinia());
app.use(router);

if (!mountTarget) {
  throw new Error("Missing #app element in index.html");
}
app.mount(mountTarget);
