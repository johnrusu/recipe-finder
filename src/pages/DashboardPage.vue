<template>
  <v-container class="dashboard-page">
    <DashboardNotLogged v-if="!isAuthenticated" @on-login="handleLogin" />
  </v-container>
</template>
<script setup lang="ts">
// auth0
import { useAuth0 } from "@auth0/auth0-vue";

// components
import DashboardNotLogged from "@/components/DashboardNotLogged.vue";

// hooks
const { isAuthenticated, loginWithRedirect } = useAuth0();

// methods
const handleLogin = () => {
  loginWithRedirect();
};
</script>
