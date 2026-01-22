<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isVisible = ref(false);
const body = document.body;

const scrollToTop = () => {
  body.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  const handleScroll = () => {
    const scrollTop =
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
    isVisible.value = scrollTop > 200;
  };

  body.addEventListener("scroll", handleScroll);

  onUnmounted(() => {
    body.removeEventListener("scroll", handleScroll);
  });
});
</script>

<template>
  <v-btn
    icon="mdi-arrow-up"
    v-show="isVisible"
    @click="scrollToTop"
    class="scroll-up-button fixed! bottom-6 right-6"
    aria-label="Scroll to top"
  ></v-btn>
</template>
