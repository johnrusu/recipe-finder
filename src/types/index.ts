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
  id: number | string;
  [key: string]: unknown;
}

interface IExtendedIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
    metric: {
      amount: number;
      unitShort: string;
      unitLong: string;
    };
  };
}

interface IRecipeDetails {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: IExtendedIngredient[];
  summary?: string;
  instructions?: string;
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
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients?: IExtendedIngredient[];
  summary?: string;
  instructions?: string;
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

interface IAutocompleteSuggestion {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export type {
  TUser,
  ILoadingProps,
  ApiRequestOptions,
  IUserData,
  IUser,
  IRecipeSearchParams,
  IRecipeDetails,
  IExtendedIngredient,
  IRecipe,
  IRecipeSearchResponse,
  IRecipeDetailsResponse,
  IAutocompleteSuggestion,
};
