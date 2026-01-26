# Development Setup

This guide covers setting up your local development environment for Darth Sky Weather.

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For version control
- **Code Editor**: VS Code recommended

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/darthsky.git
cd darthsky
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:9050`

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test -- --run` | Run tests once |

## VS Code Setup

### Recommended Extensions

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Tailwind CSS IntelliSense** - Tailwind autocomplete
- **TypeScript Vue Plugin (Volar)** - TypeScript support

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Project Structure

```
darthsky/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── services/       # API integrations
│   ├── stores/         # Zustand stores
│   ├── hooks/          # Custom hooks
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── constants/      # Configuration
├── public/             # Static assets
├── docs/               # Documentation
└── tests/              # Test files
```

## Environment Variables

No environment variables are required for basic development. All APIs used are public and free.

## Browser DevTools

### React DevTools
Install the [React DevTools](https://react.dev/learn/react-developer-tools) browser extension for component inspection.

### Network Tab
Use browser DevTools Network tab to inspect API calls to Open-Meteo, RainViewer, and Nominatim.

## Troubleshooting

### Port Already in Use

If port 9050 is busy:

```bash
# Find process using port
lsof -i :9050

# Or specify a different port
npm run dev -- --port 3000
```

### Dependencies Not Installing

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### TypeScript Errors

```bash
# Check for type errors
npx tsc --noEmit
```
