# Architecture Overview

Darth Sky Weather is a client-side Progressive Web Application (PWA) built with modern web technologies.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Weather    │  │    Map      │  │  Settings   │   Pages      │
│  │   Page      │  │   Page      │  │   Page      │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────┴────────────────┴────────────────┴──────┐              │
│  │              React Components                  │              │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐         │              │
│  │  │ Current │ │ Hourly  │ │ Weather │         │              │
│  │  │Conditions│ │Timeline │ │   Map   │  ...    │              │
│  │  └─────────┘ └─────────┘ └─────────┘         │              │
│  └──────────────────┬───────────────────────────┘              │
│                     │                                           │
│  ┌──────────────────┴───────────────────────────┐              │
│  │              State Layer                      │              │
│  │  ┌─────────────┐  ┌─────────────┐            │              │
│  │  │  Location   │  │  Settings   │  Zustand   │              │
│  │  │   Store     │  │   Store     │  Stores    │              │
│  │  └─────────────┘  └─────────────┘            │              │
│  └──────────────────┬───────────────────────────┘              │
│                     │                                           │
│  ┌──────────────────┴───────────────────────────┐              │
│  │           Data Fetching Layer                 │              │
│  │  ┌─────────────────────────────────┐         │              │
│  │  │      TanStack React Query       │         │              │
│  │  └─────────────────────────────────┘         │              │
│  └──────────────────┬───────────────────────────┘              │
│                     │                                           │
│  ┌──────────────────┴───────────────────────────┐              │
│  │              Service Layer                    │              │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │              │
│  │  │Weather  │ │ Radar   │ │Geocoding│        │              │
│  │  │Service  │ │ Service │ │ Service │        │              │
│  │  └────┬────┘ └────┬────┘ └────┬────┘        │              │
│  └───────┼───────────┼───────────┼──────────────┘              │
└──────────┼───────────┼───────────┼──────────────────────────────┘
           │           │           │
           ▼           ▼           ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │Open-Meteo│ │RainViewer│ │Nominatim │   External APIs
    └──────────┘ └──────────┘ └──────────┘
```

## Key Design Decisions

### Client-Side Only
All processing happens in the browser. No backend server is required, which simplifies deployment and reduces operational costs.

### Free APIs
All external APIs are free and require no authentication, making the app accessible to everyone without API key management.

### Progressive Web App
The app is installable and works offline thanks to service worker caching strategies.

### Type Safety
TypeScript is used throughout for better developer experience and runtime safety.

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| UI Framework | React 18 | Component-based UI |
| Language | TypeScript | Type safety |
| Build | Vite | Fast development and builds |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | Lightweight state management |
| Data Fetching | TanStack Query | Caching, refetching, sync |
| Maps | MapLibre GL | Interactive maps |
| Visualization | D3.js | Precipitation charts |
| PWA | Workbox | Service worker, caching |
| Testing | Vitest | Fast unit/integration tests |

## Data Flow

1. **User selects location** → Location Store updated
2. **Components subscribe** → React Query fetches data
3. **Services call APIs** → Data transformed to app types
4. **Components render** → UI updates with new data

## File Structure

See [README.md](../../README.md#project-structure) for the complete file structure.
