# Recipe Finder 🍳

Discover recipes based on ingredients you have. A modern web app built with Vue 3, TypeScript, and Vuetify.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vuetify](https://img.shields.io/badge/Vuetify-3.11-1867C0?logo=vuetify)

## Features

**Smart Recipe Search**
- Search by ingredients, cuisine, or dish name
- Quick filters for meal types (Breakfast, Lunch, Dinner, Snacks, Desserts)
- Advanced filtering: cuisine types, difficulty, dietary preferences, cooking time
- Random recipe suggestions

**User Features**
- Auth0 authentication with guest browsing
- Save favorite recipes
- View recent searches
- Personal dashboard

**Modern UI**
- Fully responsive design
- Smooth animations and transitions
- Dark/light mode support
- Mobile-optimized interface

## Quick Start

```bash
# Clone repository
git clone https://github.com/johnrusu/recipe-finder.git
cd recipe-finder

# Install dependencies
npm install

# Setup environment variables (create .env file)
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_REDIRECT_URI=http://localhost:5173

# Start development server
npm run dev
```

Visit `http://localhost:5173`

## Tech Stack

**Core**
- Vue 3 (Composition API)
- TypeScript
- Vite

**UI & Styling**
- Vuetify 3
- Tailwind CSS
- Custom CSS

**State & Routing**
- Pinia
- Vue Router

**Quality & Testing**
- Vitest
- Playwright
- ESLint
- Prettier

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # Lint files
npm run format       # Format code
npm run test         # Run tests
npm run test:e2e     # E2E tests
```

## Project Structure

```
src/
├── components/      # Reusable components
├── pages/          # Route pages
├── composables/    # Vue composables
├── stores/         # Pinia stores
├── router/         # Vue Router config
├── services/       # API services
├── types/          # TypeScript types
├── utils/          # Helper functions
├── constants/      # App constants
└── styles/         # Global styles
```

## Contributing

Pull requests welcome! Please follow the existing code style and add tests for new features.

## Author

**Ionut Rusu**

[Portfolio](https://rusu-ionut.ro) • [GitHub](https://github.com/johnrusu) • [LinkedIn](https://www.linkedin.com/in/ionut-rusu-1035b112)

## License

MIT
