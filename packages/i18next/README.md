# i18next-react-router

Seamless [i18next](https://www.i18next.com/) integration for [React Router](https://reactrouter.com/) v7+.

[![npm version](https://img.shields.io/npm/v/i18next-react-router.svg)](https://www.npmjs.com/package/i18next-react-router)
[![license](https://img.shields.io/npm/l/i18next-react-router.svg)](https://github.com/albojs/remix-i18next/blob/main/LICENSE)

## Features

- 🚀 **Server-Side Translation Loading** - Load translations on the server and hydrate on the client
- 🔄 **Automatic Language Detection** - Detect language from route params, cookies, headers, etc.
- 📦 **Namespace Support** - Load only the namespaces you need per route
- 🎯 **Middleware Integration** - Use React Router middleware for i18n context
- ⚡ **Vite Compatible** - Works seamlessly with Vite's `import.meta.glob`
- 🔌 **Plugin System** - Extend with custom backends and language detectors

## Installation

```bash
npm install i18next-react-router i18next react-i18next
# or
pnpm add i18next-react-router i18next react-i18next
# or
yarn add i18next-react-router i18next react-i18next
```

## Peer Dependencies

- `react` >= 18
- `react-dom` >= 18
- `react-router` >= 7
- `i18next` >= 23
- `react-i18next` >= 14

## Entry Points

This package provides two entry points:

| Entry Point | Import Path | Environment | Description |
|-------------|-------------|-------------|-------------|
| Main | `i18next-react-router` | Client & Server | Core APIs: `createConfig`, `createMiddleware`, `appWithTranslation` |
| Node | `i18next-react-router/node` | Server only | Server utilities: `loadTranslations` |

```typescript
// Client & Server
import { createConfig, createMiddleware, appWithTranslation } from "i18next-react-router";

// Server only (loaders, actions)
import { loadTranslations } from "i18next-react-router/node";
```

## Quick Start

### 1. Create i18n Configuration

Create a configuration file (e.g., `app/i18n/index.ts`):

```typescript
import { createConfig } from "i18next-react-router";
import type { ConfigurationOptions } from "i18next-react-router";

const options: ConfigurationOptions = {
  fallbackLng: "en",
  supportedLngs: ["en", "vi", "ja"],
  defaultNS: "common",
};

// Load translation files on the server
if (import.meta.env.SSR) {
  options.backend = {
    files: import.meta.glob("./locales/*/*.json", {
      import: "default",
    }),
  };
}

createConfig(options);
```

### 2. Setup Root Route

In your `app/root.tsx`:

```typescript
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { appWithTranslation, createMiddleware } from "i18next-react-router";
import { loadTranslations } from "i18next-react-router/node";
import type { Route } from "./+types/root";

// Import your i18n configuration
import "./i18n";

// Define middleware to specify namespaces for this route
export const middleware: Route.MiddlewareFunction[] = [
  createMiddleware({
    ns: ["common"],
  }),
];

// Load translations in the loader (server-side)
export const loader = async (args: Route.LoaderArgs) => {
  return {
    ...(await loadTranslations(args)),
  };
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return <Outlet />;
}

// Wrap your app with the translation HOC
export default appWithTranslation(App);
```

### 3. Create Translation Files

Create your translation files in the `app/i18n/locales` directory:

```
app/
└── i18n/
    ├── index.ts
    └── locales/
        ├── en/
        │   └── common.json
        └── vi/
            └── common.json
```

`app/i18n/locales/en/common.json`:
```json
{
  "greeting": "Hello, World!",
  "welcome": "Welcome to our app"
}
```

`app/i18n/locales/vi/common.json`:
```json
{
  "greeting": "Xin chào, Thế giới!",
  "welcome": "Chào mừng đến với ứng dụng của chúng tôi"
}
```

### 4. Use Translations in Components

```typescript
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t("greeting")}</h1>
      <p>{t("welcome")}</p>
    </div>
  );
}
```

## API Reference

### Main Entry (`i18next-react-router`)

#### `createConfig(options)`

Initialize the global i18next configuration.

```typescript
import { createConfig } from "i18next-react-router";

createConfig({
  fallbackLng: "en",
  supportedLngs: ["en", "vi", "ja"],
  defaultNS: "common",
  ns: ["common", "home"],
  backend: {
    // Backend options
  },
  detection: {
    // Language detector options
  },
  plugins: [
    // Custom plugins
  ],
});
```

#### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `fallbackLng` | `string \| string[]` | Fallback language(s) |
| `supportedLngs` | `string[]` | Supported languages |
| `defaultNS` | `string` | Default namespace |
| `ns` | `string[]` | Namespaces to load |
| `backend` | `BackendOptions` | Backend configuration |
| `detection` | `LanguageDetectorOptions` | Language detector configuration |
| `plugins` | `Array<Module>` | Custom i18next plugins |

#### `createMiddleware(options)`

Create a middleware function to set up i18n context for a route.

```typescript
import { createMiddleware } from "i18next-react-router";

export const middleware = [
  createMiddleware({
    ns: ["home", "common"], // Namespaces to load for this route
    lng: "en", // Optional: force a specific language
  }),
];
```

#### `appWithTranslation(Component)`

Higher-order component that wraps your app with the `I18nextProvider`.

```typescript
import { appWithTranslation } from "i18next-react-router";

function App() {
  return <Outlet />;
}

export default appWithTranslation(App);
```

---

### Node Entry (`i18next-react-router/node`)

#### `loadTranslations(args, options?)`

Load translations in a route loader. Returns translation data to be hydrated on the client.

> ⚠️ **Note:** This function is only available from `i18next-react-router/node` and should only be used in server-side code (loaders, actions).

```typescript
import { loadTranslations } from "i18next-react-router/node";

export const loader = async (args: Route.LoaderArgs) => {
  const translations = await loadTranslations(args);
  
  return {
    ...translations,
    // Other loader data
  };
};
```

#### Return Type

```typescript
type LoadTranslationsResponse = {
  locale: string;
  resources: Record<string, Record<string, unknown>>;
};
```

---

## Backend Options

The built-in backend supports loading translations from files using Vite's `import.meta.glob`.

```typescript
type BackendOptions = {
  // Pattern for resolving translation files
  pattern?: string | ((options: { lng: string; ns: string }) => string);
  // Pre-loaded translation files (from import.meta.glob)
  files?: Record<string, ResourceKey | (() => Promise<ResourceKey>)>;
};
```

### Default Pattern

```
locales/{{lng}}/{{ns}}.json
```

### Example with Custom Pattern

```typescript
createConfig({
  backend: {
    pattern: "translations/{{lng}}/{{ns}}.json",
    files: import.meta.glob("./translations/*/*.json", {
      import: "default",
    }),
  },
});
```

## Language Detector Options

The built-in language detector can detect language from React Router loader arguments.

```typescript
type LanguageDetectorOptions = {
  detect: (args: LoaderFunctionArgs) => string | undefined;
};
```

### Default Behavior

By default, the language is detected from `args.params.lng`.

### Custom Detection

```typescript
createConfig({
  detection: {
    detect: (args) => {
      // Detect from URL params
      const url = new URL(args.request.url);
      const langParam = url.searchParams.get("lang");
      if (langParam) return langParam;
      
      // Detect from route params
      if (args.params.lng) return args.params.lng;
      
      // Detect from Accept-Language header
      const acceptLanguage = args.request.headers.get("Accept-Language");
      if (acceptLanguage) {
        return acceptLanguage.split(",")[0].split("-")[0];
      }
      
      return "en";
    },
  },
});
```

## Route-Based Language

To implement language-based routing (e.g., `/en/about`, `/vi/about`):

### 1. Update Route Configuration

```typescript
// app/routes.ts
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route(":lng?", "root.tsx", [
    route("", "routes/home.tsx", { index: true }),
    route("about", "routes/about.tsx"),
  ]),
] satisfies RouteConfig;
```

### 2. Configure Language Detection

```typescript
createConfig({
  supportedLngs: ["en", "vi", "ja"],
  fallbackLng: "en",
  detection: {
    detect: (args) => args.params.lng || "en",
  },
});
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions.

### Type-Safe Translations

For type-safe translations, extend the i18next type definitions:

```typescript
// app/i18next.d.ts
import "i18next";
import type common from "./i18n/locales/en/common.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
    };
  }
}
```

## Custom Plugins

You can extend the library with custom i18next plugins:

```typescript
import { createConfig } from "i18next-react-router";
import CustomBackend from "./custom-backend";
import CustomDetector from "./custom-detector";

createConfig({
  plugins: [CustomBackend, CustomDetector],
});
```

## License

MIT © [Albojs](https://github.com/albojs)
