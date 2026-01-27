<template>
  <footer class="secondary-footer mt-8">
    <v-container class="footer-content py-12">
      <v-row>
        <!-- About Section -->
        <v-col cols="12" md="4" class="footer-column">
          <h3 class="footer-heading mb-4">
            <v-icon class="mr-2" color="white"
              >mdi-silverware-fork-knife</v-icon
            >
            {{ APP.TITLE }}
          </h3>
          <p class="footer-text mb-4">
            {{ APP.DESCRIPTION }} {{ FOOTER.EXPANDED_DESCRIPTION }}
          </p>
        </v-col>

        <!-- Quick Links Section -->
        <v-col cols="12" md="4" class="footer-column">
          <h3 class="footer-heading mb-4">{{ FOOTER.QUICK_LINKS.HEADING }}</h3>
          <ul class="footer-links">
            <li v-for="route in menuRoutes" :key="route.path" class="mb-3">
              <router-link :to="route.path" class="footer-link">
                <v-icon v-if="route.icon" size="small" class="mr-2">{{
                  route.icon
                }}</v-icon>
                {{ route.name }}
              </router-link>
            </li>
          </ul>
        </v-col>

        <!-- Contact & Social Section -->
        <v-col cols="12" md="4" class="footer-column">
          <h3 class="footer-heading mb-4">{{ FOOTER.CONNECT.HEADING }}</h3>
          <p class="footer-text mb-4">
            {{ FOOTER.CONNECT.DESCRIPTION }}
          </p>
          <div class="social-links mb-6">
            <v-btn
              v-for="social in socialLinks"
              :key="social.name"
              :icon="social.icon"
              variant="text"
              color="white"
              size="large"
              class="social-btn"
              :href="social.url"
              target="_blank"
            />
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Bar -->
      <v-row>
        <v-col cols="12" class="text-center">
          <p class="footer-copyright mb-0">
            &copy; {{ fullYear }}
            <a
              href="https://rusu-ionut.ro"
              target="_blank"
              class="developer-link"
              >{{ developer }}</a
            >. {{ LABELS.ALL_RIGHTS_RESERVED }} - {{ APP.TITLE }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { APP, ABOUT_PAGE, FOOTER, LABELS } from "@/constants";

// Props
defineProps<{
  menuRoutes: Array<{
    path: string;
    name: string;
    icon?: string;
    [key: string]: any;
  }>;
}>();

// Data
const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;

const socialLinks = FOOTER.SOCIAL_LINKS;
</script>

<style scoped>
.secondary-footer {
  background: linear-gradient(
    135deg,
    rgba(18, 18, 18, 0.95) 0%,
    rgba(30, 20, 15, 0.92) 25%,
    rgba(35, 25, 20, 0.95) 50%,
    rgba(30, 20, 15, 0.92) 75%,
    rgba(18, 18, 18, 0.95) 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 8s ease infinite;
  color: white;
  position: relative;
  border-top: 3px solid transparent;
  border-image: linear-gradient(
      90deg,
      #ff6b35,
      #f7931e,
      #fdc830,
      #f7931e,
      #ff6b35
    )
    1;
}

.secondary-footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 107, 53, 0.1) 0%,
    rgba(247, 147, 30, 0.08) 50%,
    rgba(253, 200, 48, 0.05) 100%
  );
  z-index: 0;
  pointer-events: none;
}

.footer-content {
  position: relative;
  z-index: 1;
  padding-bottom: 24px !important;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.footer-column {
  padding: 0 24px;
}

.footer-heading {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
}

.footer-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.footer-link:hover {
  color: white;
  transform: translateX(5px);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.social-links {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.social-btn {
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.developer-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.developer-link:hover {
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .footer-column {
    text-align: center;
    margin-bottom: 32px;
  }

  .footer-heading {
    justify-content: center;
  }

  .social-links {
    justify-content: center;
  }

  .footer-link:hover {
    transform: scale(1.05);
  }
}
</style>
