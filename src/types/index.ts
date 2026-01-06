import type { User } from "@auth0/auth0-vue";

type TUser = User;

interface ILoadingProps {
  items: {
    color: string;
    delay: number;
  }[];
}

export type { TUser, ILoadingProps };
