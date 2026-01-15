import { ref } from "vue";
import { defineStore } from "pinia";

// types
import type { TUser } from "@/types";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const error = ref<Error | null>(null);
  const user = ref<TUser | null>(null);

  const setError = (value: Error | null) => {
    error.value = value;
  };

  const setUser = (value: TUser | null) => {
    user.value = value;
  };

  const setLoading = (value: boolean) => {
    loading.value = value;
  };

  return { loading, setLoading, error, setError, user, setUser };
});
