# Recipe Finder 🍳

A modern recipe discovery application built with Vue 3, Vuetify, and Auth0 authentication. Find recipes based on ingredients you have at home using the Spoonacular API.

## ✨ Features

- 🔐 **Secure Authentication**: Integrated Auth0 authentication for secure user login
- 🔍 **Recipe Search**: Find recipes based on available ingredients
- 🎨 **Modern UI**: Beautiful, responsive interface built with Vuetify 3 and Tailwind CSS
- ⚡ **Fast Performance**: Powered by Vite for lightning-fast development and builds
- 📱 **Responsive Design**: Works seamlessly across desktop and mobile devices
- 🗃️ **State Management**: Pinia for efficient state management
- 🚦 **Client-Side Routing**: Vue Router for smooth navigation

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with TypeScript
- **UI Components**: Vuetify 3
- **Styling**: Tailwind CSS 4
- **Authentication**: Auth0
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **API**: Spoonacular Recipe API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

You'll also need:

- An [Auth0 account](https://auth0.com/) and application credentials
- A [Spoonacular API key](https://spoonacular.com/food-api)

## 💿 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd recipe-finder
   ```

2. **Install dependencies**

   Choose your preferred package manager:

   | Package Manager | Command        |
   | --------------- | -------------- |
   | yarn            | `yarn install` |
   | npm             | `npm install`  |
   | pnpm            | `pnpm install` |
   | bun             | `bun install`  |

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   API_KEY=your-spoonacular-api-key
   VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-auth0-client-id
   ```

4. **Configure Auth0**
   - Create an Auth0 application (Single Page Application)
   - Add `http://localhost:5173` to Allowed Callback URLs
   - Add `http://localhost:5173` to Allowed Logout URLs
   - Add `http://localhost:5173` to Allowed Web Origins

## 🚀 Usage

### Development Server

Start the development server with hot-reload:

```bash
# Using yarn
yarn dev

# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using bun
bun dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

Build your project for production:

```bash
# Using yarn
yarn build

# Using npm
npm run build

# Using pnpm
pnpm build

# Using bun
bun run build
```

### Preview Production Build

Preview the production build locally:

```bash
# Using yarn
yarn preview

# Using npm
npm run preview

# Using pnpm
pnpm preview

# Using bun
bun run preview
```

### Type Checking

Run TypeScript type checking:

```bash
yarn type-check
# or
npm run type-check
```

### Linting

Lint and fix files:

```bash
yarn lint
# or
npm run lint
```

### Formatting

Format code with Prettier:

```bash
yarn format
# or
npm run format
```

## 📁 Project Structure

```
recipe-finder/
├── public/              # Static assets
│   └── favicons/        # App icons and favicons
├── server/              # Server-side code (if any)
├── src/
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable Vue components
│   │   ├── Header.vue
│   │   └── Loading.vue
│   ├── composables/     # Vue composables
│   ├── constants/       # Application constants and labels
│   ├── pages/           # Page components
│   │   ├── About.vue
│   │   ├── Dashboard.vue
│   │   ├── Home.vue
│   │   └── NotFound.vue
│   ├── plugins/         # Vue plugins (Vuetify, Auth0)
│   ├── router/          # Vue Router configuration
│   ├── services/        # API services
│   ├── stores/          # Pinia stores
│   ├── styles/          # Global styles
│   │   └── main.css
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── .env                 # Environment variables (create this)
├── index.html
├── package.json
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.mts      # Vite configuration
```

## 🔐 Authentication

The application uses Auth0 for authentication. Users must log in to access the recipe finder features. The authentication flow includes:

- Login with Auth0
- Secure token management
- Protected routes
- Logout functionality

## 🌐 Environment Variables

| Variable               | Description         | Required |
| ---------------------- | ------------------- | -------- |
| `API_KEY`              | Spoonacular API key | Yes      |
| `VITE_AUTH0_DOMAIN`    | Auth0 domain        | Yes      |
| `VITE_AUTH0_CLIENT_ID` | Auth0 client ID     | Yes      |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Vuetify](https://vuetifyjs.com/) for the beautiful UI components
- [Spoonacular](https://spoonacular.com/) for the recipe API
- [Auth0](https://auth0.com/) for authentication services

## 📞 Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Made with ❤️ using Vue 3 and Vuetify
