import { ref, onMounted, type Ref, type ComputedRef } from "vue";
import { pathOr } from "ramda";

// Utils & Constants
import { isNilOrEmpty, loadAsyncImage } from "@/utils";

// Constants
import { PLACEHOLDER_IMAGE } from "@/constants";

// Types
import type { TUser } from "@/types";

export function useUserAvatar(
  user: Ref<TUser | undefined> | ComputedRef<TUser | undefined>
) {
  const imageSrc: Ref<string> = ref(PLACEHOLDER_IMAGE);

  onMounted(() => {
    if (!isNilOrEmpty(user)) {
      const picture: string = pathOr("", ["value", "picture"], user);
      if (!isNilOrEmpty(picture)) {
        loadAsyncImage(picture).then((validImage) => {
          imageSrc.value =
            !isNilOrEmpty(picture) && validImage
              ? (validImage?.src as string)
              : PLACEHOLDER_IMAGE;
        });
      }
    }
  });

  return { imageSrc };
}
