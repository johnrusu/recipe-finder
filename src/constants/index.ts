const APP = {
  TITLE: "Recipe Finder",
  DESCRIPTION: "Find recipes based on ingredients you have at home.",
};

const LABELS = {
  RECENT_DISCOVERIES: "Recent Discoveries",
  MY_KITCHEN: "My Kitchen",
  SEARCH_RECIPES: "Search Recipes",
  INGREDIENTS_PLACEHOLDER: "Enter ingredients (comma separated)",
  FIND_RECIPES: "Find Recipes",
  NO_RECIPES_FOUND: "No recipes found with the given ingredients.",
  CREATE_NEW_RECIPE: "Create New Recipe",
  SAVE_RECIPE: "Save Recipe",
  VIEW_RECIPE: "View Recipe",
  RECIPE_SAVED: "Recipe saved successfully!",
  RECIPE_DELETED: "Recipe deleted successfully!",
  ALL_RIGHTS_RESERVED: "All rights reserved.",
  LOGIN: "Log In",
  LOGOUT: "Log Out",
  HOME: "Home",
  USER: "User",
  ACCOUNT: "Account",
  LOADING: "Loading...",
  ERROR_TITLE: "Oops!",
  ERROR_MESSAGE: "Something went wrong",
  WELCOME_TITLE: `Welcome to ${APP.TITLE}`,
  BUTTON_LOGIN_TITLE: "Log in to your account",
  NO_ANIMATION: "No Animation Data Found",
  INVALID_JSON: "Invalid JSON Data",
  MISSING_DATA: "No Animation Data Provided",
  ACTIONS: "Actions",
  DELETE: "Delete",
  CONFIRM_DELETE_TITLE: "Confirm Deletion",
  CONFIRM_DELETE_MESSAGE: "Are you sure you want to delete this entry?",
  CONFIRM: "Confirm",
  CANCEL: "Cancel",
  VIEW_DETAILS: "View Details",
  DELETE_ALL: (links: number) =>
    `Are you sure you want to delete all ${links} entries? This action cannot be undone.`,
  GO_BACK: "Go Back",
  GO_HOME: "Go to Home Page",
  NOT_FOUND_MESSAGE: "The page you are looking for does not exist.",
  NOT_FOUND_HEADING: "404 - Page Not Found",
  NOT_FOUND_TITLE: "Page Not Found",
  FIX_AUTH_ISSUE: "Fix Authentication Issue",
  REMOVE_STORAGE: "Clear your browser storage and cookies.",
  RELOGIN: "Then log in again.",
  GUEST_CONFIRM_TITLE: "Continue as Guest?",
  GUEST_CONFIRM_MESSAGE:
    "By browsing as a guest, you'll miss out on these benefits:",
  GUEST_BENEFIT_1: "💾 Save your favorite recipes",
  GUEST_BENEFIT_2: "📝 Create your personal recipe collection",
  GUEST_BENEFIT_3: "🔍 Access your search history",
  GUEST_BENEFIT_4: "⭐ Get personalized recommendations",
  GUEST_CONTINUE: "Continue as Guest",
  GUEST_CREATE_ACCOUNT: "Create Account",
};

const RECIPE_FINDER = {
  TITLE: "Discover Your Next Meal",
  SEARCH_PLACEHOLDER: "Search for ingredients, cuisines, or dish names...",
  SEARCH_BUTTON: "Search",
  QUICK_FILTERS_TITLE: "Quick Filters",
  CLEAR_ALL: "Clear All",
  SHOW_ADVANCED: "Show Advanced Filters",
  HIDE_ADVANCED: "Hide Advanced Filters",
  CUISINE_LABEL: "Cuisine Type",
  DIETARY_PREFERENCES_TITLE: "Dietary Preferences",
  INTOLERANCES_TITLE: "Intolerances",
  MAX_COOKING_TIME_LABEL: "Max Cooking Time",
  INCLUDE_INGREDIENTS_LABEL: "Include Ingredients",
  EXCLUDE_INGREDIENTS_LABEL: "Exclude Ingredients",
  INGREDIENTS_HINT: "Press Enter to add",
  FIND_RECIPES_BUTTON: "Find Recipes",
  SURPRISE_ME_BUTTON: "Surprise Me!",
  PRO_TIPS_TITLE: "Pro Tips:",
  PRO_TIPS_TEXT:
    'Try searching for "pasta with chicken" or "30-minute dinners". Use filters to narrow down results based on your preferences!',
  TIME_2PLUS_HOURS: "2+ hours",
  TIME_MINUTES: (mins: number) => `${mins} min`,
  SEARCH_RESULTS_HEADER: (found: number, total: number) =>
    `Search Results (${found}/${total} recipes found)`,
  IMAGE_BASE_URI: "https://img.spoonacular.com/recipes/",

  // Error messages
  ERROR_EMPTY_QUERY: "Please enter a search query",
  ERROR_NO_RESULTS: "No recipes found. Try a different search query.",
  ERROR_SEARCH_FAILED: "Search failed",

  MEAL_TYPES: {
    BREAKFAST: "Breakfast",
    LUNCH: "Lunch",
    DINNER: "Dinner",
    SNACK: "Snack",
    DESSERT: "Dessert",
  },

  DIETARY: {
    VEGETARIAN: "Vegetarian",
    VEGAN: "Vegan",
    GLUTEN_FREE: "Gluten-Free",
    KETO: "Keto",
    PALEO: "Paleo",
  },

  CUISINES: [
    "Italian",
    "Mexican",
    "Chinese",
    "Japanese",
    "Indian",
    "Thai",
    "French",
    "Greek",
    "Spanish",
    "Mediterranean",
    "Korean",
    "Vietnamese",
    "American",
    "Middle Eastern",
  ],
};

const HOME_PAGE = {
  TITLE: "Welcome to Recipe Finder",
  DESCRIPTION:
    "Discover and share amazing recipes from around the world. Start your culinary journey today!",
  AUTH_DESCRIPTION: `Sign in to unlock personalized features like saving favorites and managing your recipe collection.`,
  AUTH_BENEFITS: `Save your favorite recipes, build your personal cookbook, and get personalized recommendations based on your preferences.`,
  BUTTON_LOGIN: "Sign In to Get Started",
  BUTTON_GUEST: "Browse as Guest",
  START_YOUR_JOURNEY: "Start Your Culinary Journey",
};

const ABOUT_PAGE = {
  TITLE: "About Recipe Finder",
  WHAT_IS: {
    TITLE: "What is Recipe Finder?",
    DESCRIPTION_1:
      "Recipe Finder is a modern web application designed to help you discover delicious recipes based on ingredients you already have at home.",
    DESCRIPTION_2:
      "Say goodbye to food waste and hello to culinary creativity! Simply enter your available ingredients, and let our powerful search engine find the perfect recipes for you.",
  },
  FEATURES: {
    TITLE: "Key Features",
    SECURE_AUTH: {
      TITLE: "Secure Authentication",
      DESCRIPTION:
        "Secure user authentication to save and manage your recipes.",
    },
    ANALYTICS: {
      TITLE: "Recipe Analytics",
      DESCRIPTION:
        "Track your favorite recipes and cooking history with detailed analytics.",
    },
    MODERN_UI: {
      TITLE: "Modern UI",
      DESCRIPTION:
        "Beautiful, intuitive interface built with Vue 3 and Vuetify.",
    },
    RESPONSIVE: {
      TITLE: "Responsive Design",
      DESCRIPTION:
        "Works seamlessly across desktop, tablet, and mobile devices.",
    },
    CUSTOM_CODES: {
      TITLE: "Custom Search",
      DESCRIPTION:
        "Advanced search filters to find recipes by ingredients, dietary restrictions, and more.",
    },
    USER_ISOLATION: {
      TITLE: "Personal Recipe Collection",
      DESCRIPTION:
        "Save and organize your favorite recipes in your personal collection.",
    },
  },
  TECHNOLOGIES: {
    TITLE: "Technologies Used",
    STACK: [
      "Vue 3",
      "TypeScript",
      "Vuetify",
      "Vite",
      "Pinia",
      "Vue Router",
      "Tailwind CSS",
    ],
  },
  HOW_TO_USE: {
    TITLE: "How to Use",
    STEPS: [
      "Sign in to your account or browse as a guest",
      "Enter the ingredients you have available",
      "Browse through curated recipe suggestions",
      "Click on any recipe to view detailed instructions",
      "Save your favorite recipes to your personal collection",
      "Cook and enjoy your delicious meal!",
    ],
  },
  DEVELOPER: {
    AVATAR: "https://avatars.githubusercontent.com/u/25053517?v=4",
    TITLE: "About the Developer",
    NAME: "Ionut Rusu",
    ROLE: "Fullstack Developer",
    BIO_1:
      "Ionut Rusu is a passionate Fullstack Developer based in Romania, specializing in Vue.js, Node.js, React.js, and UI/UX design. With expertise in modern web technologies and a keen eye for user experience, Ionut creates efficient and elegant solutions for complex problems.",
    BIO_2:
      "This Link Shortener application showcases the power of modern JavaScript frameworks and demonstrates a commitment to building practical, user-friendly tools with enterprise-grade security and scalability.",
    PORTFOLIO: "Visit Portfolio",
    GITHUB: "GitHub",
    LINKEDIN: "LinkedIn",
    TOOLS: "Easy Tools Portfolio",
    PORTFOLIO_URL: "https://rusu-ionut.ro",
    GITHUB_URL: "https://github.com/johnrusu",
    LINKEDIN_URL: "https://www.linkedin.com/in/ionut-rusu-1035b112",
    TOOLS_URL: "https://johnrusu.github.io/easy-tools/",
  },
  CONTACT: {
    TITLE: "Contact & Support",
    DESCRIPTION: "Have questions or feedback? We'd love to hear from you!",
    BUTTON: "Contact Us",
    URL: "https://www.rusu-ionut.ro/contact",
  },
};

const ROUTES = [
  {
    path: "/",
    name: "Home",
    protected: false,
    icon: "mdi-home",
    component: () => import("@/pages/HomePage.vue"),
    isForMenu: true,
  },
  {
    path: "/about",
    name: "About",
    protected: false,
    icon: "mdi-information",
    component: () => import("@/pages/AboutPage.vue"),
    isForMenu: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    protected: true,
    icon: "mdi-view-dashboard",
    component: () => import("@/pages/DashboardPage.vue"),
    isForMenu: false,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/pages/NotFoundPage.vue"),
    protected: false,
    isForMenu: false,
  },
];

const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%2363b3ed'/%3E%3Cpath d='M50 45c7.5 0 13.64-6.14 13.64-13.64S57.5 17.72 50 17.72s-13.64 6.14-13.64 13.64S42.5 45 50 45zm0 6.82c-9.09 0-27.28 4.56-27.28 13.64v3.41c0 1.88 1.53 3.41 3.41 3.41h47.74c1.88 0 3.41-1.53 3.41-3.41v-3.41c0-9.08-18.19-13.64-27.28-13.64z' fill='%23fff'/%3E%3C/svg%3E`;

// loading config
const LOADING_CONFIG = {
  items: [
    { color: "blue", delay: 0 },
    { color: "green", delay: -0.9 },
    { color: "orange", delay: -0.8 },
    { color: "red", delay: -0.7 },
    { color: "purple", delay: -0.6 },
  ],
};

export {
  ROUTES,
  APP,
  LABELS,
  HOME_PAGE,
  ABOUT_PAGE,
  PLACEHOLDER_IMAGE,
  LOADING_CONFIG,
  RECIPE_FINDER,
};
