// Composables
import { createRouter, createWebHistory } from "vue-router";

// constants
import { ROUTES } from "@/constants";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: ROUTES,
});

export default router;
