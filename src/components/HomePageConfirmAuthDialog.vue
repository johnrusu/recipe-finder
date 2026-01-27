<template>
  <!-- Guest Confirmation Dialog -->
  <v-dialog
    v-model="guestDialogRef"
    :max-width="dialogMaxWidth"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="text-h5 font-weight-bold py-4">
        <v-icon icon="mdi-account-alert" color="warning" class="mr-2" />
        {{ LABELS.GUEST_CONFIRM_TITLE }}
      </v-card-title>

      <v-card-text class="pb-2">
        <NotLoggedUserAnimation v-if="!xs" />

        <p class="mb-4 text-xl">{{ LABELS.GUEST_CONFIRM_MESSAGE }}</p>

        <v-list density="compact">
          <v-list-item class="px-0 benefit-container">
            <span class="text-body-2 benefit-text">{{
              LABELS.GUEST_BENEFIT_1
            }}</span>
          </v-list-item>
          <v-list-item class="px-0 benefit-container">
            <span class="text-body-2 benefit-text">{{
              LABELS.GUEST_BENEFIT_2
            }}</span>
          </v-list-item>
          <v-list-item class="px-0 benefit-container">
            <span class="text-body-2 benefit-text">{{
              LABELS.GUEST_BENEFIT_3
            }}</span>
          </v-list-item>
          <v-list-item class="px-0 benefit-container">
            <span class="text-body-2 benefit-text">{{
              LABELS.GUEST_BENEFIT_4
            }}</span>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions
        class="px-6 pb-6 d-flex flex-column flex-sm-row justify-between gap-4!"
      >
        <v-btn
          variant="plain"
          @click="confirmGuestBrowse"
          size="large"
          class="w-full sm:flex-1"
        >
          <span class="text-wrap">{{ LABELS.GUEST_CONTINUE }} </span>
        </v-btn>
        <v-btn
          @click="handleLogin"
          size="large"
          class="gemini-live-border w-full sm:flex-1"
        >
          <span class="text-wrap">{{ LABELS.GUEST_SIGNIN_ACCOUNT }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref, onUpdated, computed, defineAsyncComponent } from "vue";
import { useDisplay } from "vuetify";

// constants
import { LABELS } from "@/constants";

// components
const NotLoggedUserAnimation = defineAsyncComponent(
  () => import("./NotLoggedUserAnimation.vue")
);

// emits
const emit = defineEmits<{
  (e: "on-login"): void;
  (e: "on-guest-confirmed"): void;
}>();

// props
const props = defineProps<{
  showGuestDialog: boolean;
}>();

// refs
const { xs, sm, md } = useDisplay();

// computed
const dialogMaxWidth = computed(() => {
  if (xs.value) return "95%";
  if (sm.value) return "85%";
  if (md.value) return "70%";
  return "50%"; // lg, xl, xxl
});
const guestDialogRef = ref(props.showGuestDialog || false);

onUpdated(() => {
  guestDialogRef.value = props.showGuestDialog || false;
});

// methods
const confirmGuestBrowse = () => {
  emit("on-guest-confirmed");
};

const handleLogin = () => {
  emit("on-login");
};
</script>

<style>
.benefit-container {
  display: block !important;
  padding: 8px 0 !important;
}

.benefit-text {
  white-space: normal !important;
  word-wrap: break-word !important;
  overflow-wrap: break-word !important;
  display: block !important;
}
</style>
