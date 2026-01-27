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
          <div class="newsletter-section mt-6">
            <h4 class="text-subtitle-1 mb-2">{{ FOOTER.NEWSLETTER.HEADING }}</h4>
            <v-text-field
              v-model="email"
              :placeholder="FOOTER.NEWSLETTER.PLACEHOLDER"
              variant="outlined"
              density="compact"
              hide-details
              class="newsletter-input"
              append-inner-icon="mdi-send"
              @click:append-inner="handleNewsletter"
              @keyup.enter="handleNewsletter"
            />
          </div>
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
          <div class="mt-6">
            <h4 class="text-subtitle-1 mb-2">{{ FOOTER.RESOURCES.HEADING }}</h4>
            <ul class="footer-links">
              <li class="mb-2">
                <a href="#" class="footer-link">
                  <v-icon size="small" class="mr-2"
                    >mdi-book-open-variant</v-icon
                  >
                  {{ FOOTER.RESOURCES.RECIPE_GUIDE }}
                </a>
              </li>
              <li class="mb-2">
                <a href="#" class="footer-link">
                  <v-icon size="small" class="mr-2">mdi-help-circle</v-icon>
                  {{ FOOTER.RESOURCES.FAQ }}
                </a>
              </li>
            </ul>
          </div>
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
          <div class="contact-info">
            <div class="d-flex align-center mb-2">
              <v-icon class="mr-2" size="small">mdi-email</v-icon>
              <a :href="`mailto:${FOOTER.CONTACT.EMAIL}`" class="footer-link">
                {{ FOOTER.CONTACT.EMAIL }}
              </a>
            </div>
            <div class="d-flex align-center">
              <v-icon class="mr-2" size="small">mdi-web</v-icon>
              <a :href="FOOTER.CONTACT.LOCATION" target="_blank" class="footer-link">
                {{ FOOTER.CONTACT.LOCATION }}
              </a>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Bottom Bar -->
      <v-divider class="my-6 footer-divider" />
      <v-row>
        <v-col cols="12" md="6" class="text-center text-md-left">
          <p class="footer-copyright mb-0">
            &copy; {{ fullYear }} {{ developer }}. All rights reserved.
          </p>
        </v-col>
        <v-col cols="12" md="6" class="text-center text-md-right">
          <a :href="FOOTER.LEGAL_LINKS.PRIVACY_POLICY" class="footer-link mr-4">{{ FOOTER.LEGAL.PRIVACY_POLICY }}</a>
          <a :href="FOOTER.LEGAL_LINKS.TERMS_OF_SERVICE" class="footer-link mr-4">{{ FOOTER.LEGAL.TERMS_OF_SERVICE }}</a>
          <a :href="FOOTER.LEGAL_LINKS.COOKIE_POLICY" target="_blank" class="footer-link">{{ FOOTER.LEGAL.COOKIE_POLICY }}</a>
        </v-col>
      </v-row>
    </v-container>
  </footer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { APP, ABOUT_PAGE, FOOTER } from "@/constants";

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
const email = ref("");
const fullYear = new Date().getFullYear();
const developer = ABOUT_PAGE.DEVELOPER.NAME;

const socialLinks = FOOTER.SOCIAL_LINKS;

// Methods
const handleNewsletter = () => {
  if (email.value) {
    // TODO: Implement newsletter subscription
    console.log("Newsletter subscription:", email.value);
    email.value = "";
  }
};
</script>

<style scoped>
.secondary-footer {
  background: linear-gradient(
    135deg,
    #1a1a1a 0%,
    #2d1810 25%,
    #3d2415 50%,
    #2d1810 75%,
    #1a1a1a 100%
  );
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
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

.newsletter-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.newsletter-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.newsletter-input :deep(.v-field__input) {
  color: #1a1a1a;
}

.newsletter-input :deep(input::placeholder) {
  color: rgba(0, 0, 0, 0.5);
}

.newsletter-input :deep(.v-icon) {
  color: #ff6b35;
}

.newsletter-input :deep(.v-field__append-inner .v-icon) {
  cursor: pointer;
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

.contact-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.footer-divider {
  border-color: rgba(255, 255, 255, 0.2);
  opacity: 1;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
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
