import { ref } from "vue";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return { loading, setLoading };
});
