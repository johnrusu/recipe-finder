<template>
  <div
    v-if="
      !isNilOrEmpty(props.config) &&
      props.config?.items &&
      isArrayNotEmpty(props.config.items)
    "
    class="loader"
  >
    <span
      v-for="(item, index) in props.config?.items"
      :key="`loading-item-${index}`"
      :style="{ background: item.color, animationDelay: `${item.delay}s` }"
    />
  </div>
</template>

<script setup lang="ts">
// type
import type { ILoadingProps } from "@/types";

// utils
import { isArrayNotEmpty, isNilOrEmpty } from "@/utils";

const props = defineProps<{
  config?: ILoadingProps;
}>();
</script>

<style type="text/css">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  gap: 6px;
}
.loader span {
  width: 2px;
  height: 50px;
  background: blue;
  animation: scale 1s infinite ease-in-out;
}
.loader span:nth-child(2) {
  background: green;
  animation-delay: -0.9s;
}
.loader span:nth-child(3) {
  background: orange;
  animation-delay: -0.8s;
}
.loader span:nth-child(4) {
  background: red;
  animation-delay: -0.7s;
}
.loader span:nth-child(5) {
  background: purple;
  animation-delay: -0.6s;
}
@keyframes scale {
  0%,
  40%,
  100% {
    transform: scaleY(0.05);
  }
  20% {
    transform: scaleY(1);
  }
}
</style>
