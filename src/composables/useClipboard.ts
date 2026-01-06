import { ref } from "vue";

export function useClipboard() {
  const isCopied = ref(false);
  const error = ref(null);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      isCopied.value = true;
      error.value = null;
      setTimeout(() => (isCopied.value = false), 1500);
    } catch (err) {
      error.value = err;
      isCopied.value = false;
    }
  };

  const read = async () => {
    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (err) {
      error.value = err;
    }
  };

  return { isCopied, error, copy, read };
}
