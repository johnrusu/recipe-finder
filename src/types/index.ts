import type { User } from "@auth0/auth0-vue";

type TUser = User;

interface ILoadingProps {
  items: {
    color: string;
    delay: number;
  }[];
}

interface ApiRequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface IUserData {
  auth0Id: string;
  email: string;
  name?: string;
}

interface IUser extends IUserData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

interface IRecipeSearchParams {
  query: string;
  number?: number;
  offset?: number;
  type?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  maxReadyTime?: number;
  includeIngredients?: string;
  excludeIngredients?: string;
  [key: string]: unknown;
}

interface IRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  [key: string]: unknown;
}

interface IRecipeSearchResponse {
  success: boolean;
  recipes: {
    results: IRecipe[];
    baseUri: string;
    offset: number;
    number: number;
    totalResults: number;
    processingTimeMs: number;
    expires: number;
  };
}

interface IRecipeDetailsResponse {
  success: boolean;
  recipe: IRecipe & {
    nutrition?: Record<string, unknown>;
    [key: string]: unknown;
  };
}

export type {
  TUser,
  ILoadingProps,
  ApiRequestOptions,
  IUserData,
  IUser,
  IRecipeSearchParams,
  IRecipe,
  IRecipeSearchResponse,
  IRecipeDetailsResponse,
};
