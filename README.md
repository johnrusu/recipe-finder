# 🍳 Recipe Finder

A modern, intuitive web application for discovering delicious recipes based on ingredients you have at home. Built with Vue 3, TypeScript, and Vuetify, Recipe Finder offers a seamless experience for food enthusiasts and home cooks.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vuetify](https://img.shields.io/badge/Vuetify-3.11-1867C0?logo=vuetify&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)

## ✨ Features

### 🔍 Advanced Search
- **Smart Search Bar**: Search by ingredients, cuisines, or dish names
- **Quick Filters**: One-click meal type selection (Breakfast, Lunch, Dinner, Snacks, Desserts)
- **Advanced Filters**: 
  - Multiple cuisine types (Italian, Mexican, Chinese, Japanese, and more)
  - Difficulty levels (Easy, Medium, Hard)
  - Dietary preferences (Vegetarian, Vegan, Gluten-Free, Keto, Paleo, etc.)
  - Cooking time slider (10-120+ minutes)
  - Include/exclude specific ingredients

### 🎲 Random Recipe Generator
- Surprise yourself with random recipe suggestions
- Perfect for when you can't decide what to cook

### 👤 User Authentication
- Secure authentication powered by Auth0
- Guest browsing available
- Personalized user experience

### 💼 User Benefits
- Save your favorite recipes
- Create personal recipe collections
- Access your search history
- Get personalized recommendations

### 📱 Responsive Design
- Fully optimized for mobile, tablet, and desktop
- Touch-friendly interface
- Adaptive layouts for all screen sizes

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Framework**: Vuetify 3
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS + Custom CSS
- **Build Tool**: Vite
- **Authentication**: Auth0
- **Testing**: 
  - Vitest (Unit Tests)
  - Playwright (E2E Tests)
- **Code Quality**: 
  - ESLint
  - Prettier
  - Husky (Git Hooks)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/johnrusu/recipe-finder.git
   cd recipe-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_AUTH0_DOMAIN=your-auth0-domain
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   VITE_AUTH0_REDIRECT_URI=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint and fix files |
| `npm run format` | Format code with Prettier |
| `npm run type-check` | Type check with TypeScript |
| `npm run test` | Run all tests |
| `npm run test:e2e` | Run E2E tests with Playwright |

## 🏗️ Project Structure

```
recipe-finder/
├── public/              # Static assets
├── src/
│   ├── components/      # Vue components
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── RecipeFinderForm.vue
│   │   └── ...
│   ├── composables/     # Vue composables
│   ├── constants/       # App constants and labels
│   ├── pages/          # Page components
│   │   ├── HomePage.vue
│   │   ├── AboutPage.vue
│   │   └── DashboardPage.vue
│   ├── plugins/        # Vue plugins (Vuetify, etc.)
│   ├── router/         # Vue Router configuration
│   ├── services/       # API services
│   ├── stores/         # Pinia stores
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   ├── App.vue         # Root component
│   └── main.ts         # App entry point
├── e2e/                # E2E tests
└── ...config files
```

## 🎨 Key Components

### RecipeFinderForm
The main search interface with advanced filtering options:
- Responsive design with mobile-optimized layout
- Dynamic search placeholder
- Collapsible advanced filters
- Real-time filter state management

### AppHeader
Navigation header with:
- Logo and app title
- Route navigation
- User authentication menu
- Mobile-responsive menu

### HomePage
Landing page featuring:
- Welcome greeting for non-authenticated users
- Guest confirmation dialog highlighting account benefits
- Recipe search form

## 🔐 Authentication Flow

1. **New Visitor**: Sees welcome message with options to log in or browse as guest
2. **Guest Browsing**: Confirmation dialog shows benefits of creating an account
3. **Authenticated Users**: Access to personalized features and saved content

## 🌐 API Integration

The app is designed to integrate with a recipe API. Currently, the search functionality logs filters to the console for development purposes. Update the `handleSearch` method in `RecipeFinderForm.vue` to connect to your backend.

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## 🎯 Roadmap

- [ ] Backend API integration
- [ ] Recipe details page
- [ ] User recipe collections
- [ ] Shopping list generator
- [ ] Meal planning calendar
- [ ] Social sharing features
- [ ] Recipe ratings and reviews
- [ ] Nutritional information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Developer

**Ionut Rusu**
- Portfolio: [rusu-ionut.ro](https://rusu-ionut.ro)
- GitHub: [@johnrusu](https://github.com/johnrusu)
- LinkedIn: [Ionut Rusu](https://www.linkedin.com/in/ionut-rusu-1035b112)

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Vue.js team for the amazing framework
- Vuetify team for the beautiful UI components
- Auth0 for secure authentication
- All contributors and supporters

---

Made with ❤️ and Vue 3
