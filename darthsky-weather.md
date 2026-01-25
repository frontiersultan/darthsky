# Darth Sky Weather App - Complete Design Specification

## Executive Summary

This document provides an exhaustive design specification for building an open-source weather application inspired by Dark Sky, widely regarded as the gold standard in weather app design before its acquisition by Apple and subsequent shutdown in January 2023. The goal is to recreate and improve upon Dark Sky's legendary information design, data visualization principles, and user experience while using modern, freely available weather APIs.

**Project Name:** Darth Sky (working title - alternatives: Clear Sky, Sky Glass, Weather Shape)

**Core Philosophy:** "Understand the shape of the weather at a glance."

---

## Table of Contents

1. [Design Philosophy & Principles](#1-design-philosophy--principles)
2. [Feature Specification](#2-feature-specification)
3. [Data Architecture](#3-data-architecture)
4. [UI/UX Specification](#4-uiux-specification)
5. [Visual Design System](#5-visual-design-system)
6. [Screen-by-Screen Specifications](#6-screen-by-screen-specifications)
7. [Data Visualization Components](#7-data-visualization-components)
8. [Notifications & Alerts System](#8-notifications--alerts-system)
9. [Animation & Micro-interactions](#9-animation--micro-interactions)
10. [Technical Implementation](#10-technical-implementation)
11. [API Integration](#11-api-integration)
12. [Accessibility Requirements](#12-accessibility-requirements)
13. [Platform-Specific Considerations](#13-platform-specific-considerations)
14. [Testing & Quality Assurance](#14-testing--quality-assurance)

---

## 1. Design Philosophy & Principles

### 1.1 Core Design Tenets

Dark Sky's brilliance stemmed from treating weather data as context-sensitive information graphics. The app succeeded because it answered real user questions efficiently, not because it displayed the most data.

#### Information Design Principles (from Bret Victor's "Magic Ink")

1. **Context-Sensitive Information Graphics**: Unlike static graphics, software can incorporate context from the user's environment (location, time, current conditions) to display only what's relevant.

2. **Progressive Disclosure**: Show the most critical information immediately; detailed data available on demand.

3. **Visual Hierarchy Through Relevance**: The most relevant information for current conditions should dominate the display.

4. **Shape Over Numbers**: Users should understand weather trends through visual shape, not by reading individual data points.

5. **Actionable Intelligence**: Every piece of information should help users make decisions (should I bring an umbrella? can I go for a run?).

### 1.2 User Context Categories

The app must address these primary use cases:

| Context | Primary Questions | Required Information |
|---------|-------------------|----------------------|
| Morning Planning | What should I wear? Do I need an umbrella? | Temperature range, precipitation probability, "feels like" |
| Commute Decision | Will it rain during my commute? | Minute-by-minute precipitation for next hour |
| Outdoor Activity | Is it safe to go outside? When's the best window? | Hourly breakdown, severe weather alerts, UV index |
| Travel Planning | What's the weather at my destination? | Multi-location support, weekly forecast |
| Event Planning | What will the weather be like on [date]? | Extended forecast, historical averages |
| Real-time Awareness | Is a storm approaching? | Radar animation, storm tracking, alerts |

### 1.3 Design Anti-Patterns to Avoid

- **Skeuomorphic animations** that prioritize aesthetics over information (e.g., Apple Weather's full-screen weather animations)
- **Hiding information behind multiple taps** when it could be shown in context
- **Uniform scaling** of temperature ranges that obscures actual magnitude differences
- **Precision theater**: showing decimals or exact percentages when uncertainty is high
- **Information overload**: displaying all possible data instead of contextually relevant data

---

## 2. Feature Specification

### 2.1 Core Features (MVP)

#### 2.1.1 Current Conditions Display
- Current temperature (actual and "feels like")
- Current weather summary (one-line natural language description)
- Current precipitation status with intensity
- Humidity percentage
- Wind speed and direction with visual indicator
- Barometric pressure
- Visibility distance
- UV index with severity indicator
- Dew point
- Cloud cover percentage

#### 2.1.2 Minute-by-Minute Precipitation (Next 60-120 Minutes)
- Animated precipitation graph showing intensity over time
- Visual uncertainty indicator (wobbling/stability of the line)
- Text summary: "Rain starting in 12 minutes, stopping 45 minutes later"
- Precipitation type differentiation (rain, snow, sleet, hail)
- Intensity categories: None, Light, Medium, Heavy

#### 2.1.3 Hourly Forecast (Next 24-48 Hours)
- Horizontal scrolling timeline
- Temperature as horizontal bar graph (preserving magnitude)
- Precipitation probability per hour
- Cloud cover visualization (grayscale gradient column)
- Wind speed with directional arrows
- Switchable views: Temperature, Feels Like, Precipitation Probability

#### 2.1.4 Daily/Weekly Forecast (7-14 Days)
- High/low temperature ranges as "temperature pills" that preserve magnitude
- Precipitation probability per day
- Weather condition icons
- Sunrise/sunset times
- Moon phase indicator
- Brief text summary per day

#### 2.1.5 Weather Maps
- Animated radar/precipitation overlay
- Temperature overlay
- Cloud cover overlay
- Storm tracking with directional arrows
- User location marker
- Pinch-to-zoom, pan navigation
- Time scrubbing (past 2 hours, forecast 2 hours)

#### 2.1.6 Location Management
- Current location (GPS-based hyperlocal)
- Saved locations list
- Location search (city, address, landmark)
- Quick switching between locations
- Location-specific forecasts down to street level

### 2.2 Advanced Features

#### 2.2.1 Time Machine
- Historical weather data browser
- Select any past date to view actual conditions
- Future date selection shows historical averages
- Useful for: planning, memory ("what was the weather on our wedding day?"), pattern recognition

#### 2.2.2 Custom Notifications
- **Standard alerts:**
  - Rain starting soon (with customizable lead time)
  - Severe weather alerts (government-issued)
  - Daily weather summary (customizable time)
  - Significant temperature changes
  
- **Custom condition alerts:**
  - Temperature above/below threshold
  - Precipitation probability above threshold
  - Wind speed above threshold
  - UV index above threshold
  - Humidity above/below threshold

#### 2.2.3 Weather Alerts Integration
- NWS (National Weather Service) severe weather alerts
- Visual differentiation by severity
- Full alert text with affected areas
- Alert duration and expiration

#### 2.2.4 Widgets
- **Small widget:** Current temp + condition icon
- **Medium widget:** Current conditions + next hour precipitation
- **Large widget:** Current + 24-hour mini graph + 5-day outlook
- All widgets update at least hourly

#### 2.2.5 Daily Summary
- Configurable daily notification time
- Customizable data points (select from 20+):
  - High/low temperature
  - Precipitation probability
  - Wind speed
  - UV index
  - Sunrise/sunset
  - Air quality (if available)
  - And more...

### 2.3 Feature Priority Matrix

| Feature | MVP | v1.1 | v2.0 | Priority |
|---------|-----|------|------|----------|
| Current Conditions | ✓ | | | P0 |
| Hourly Forecast | ✓ | | | P0 |
| Daily Forecast | ✓ | | | P0 |
| Minute Precipitation | ✓ | | | P0 |
| Weather Map | ✓ | | | P0 |
| Multiple Locations | ✓ | | | P0 |
| Basic Notifications | ✓ | | | P1 |
| Custom Alerts | | ✓ | | P1 |
| Time Machine | | ✓ | | P2 |
| Widgets | | ✓ | | P1 |
| Daily Summary | | ✓ | | P2 |
| Air Quality | | | ✓ | P2 |
| Watch App | | | ✓ | P3 |

---

## 3. Data Architecture

### 3.1 Weather Data Model

```typescript
interface WeatherData {
  location: Location;
  timezone: string;
  currently: CurrentConditions;
  minutely: MinutelyData[];      // 60-120 data points
  hourly: HourlyData[];          // 48-168 data points
  daily: DailyData[];            // 7-14 data points
  alerts: WeatherAlert[];
}

interface Location {
  latitude: number;              // Precise to 0.001° (hyperlocal)
  longitude: number;
  name: string;                  // Display name
  timezone: string;
  elevation?: number;            // Meters above sea level
}

interface CurrentConditions {
  time: number;                  // Unix timestamp
  summary: string;               // "Partly Cloudy"
  icon: WeatherIcon;             // Machine-readable icon code
  
  // Temperature
  temperature: number;           // Actual temperature
  apparentTemperature: number;   // "Feels like"
  
  // Precipitation
  precipIntensity: number;       // mm/hour
  precipProbability: number;     // 0-1
  precipType?: 'rain' | 'snow' | 'sleet' | 'hail';
  
  // Atmospheric
  humidity: number;              // 0-1
  pressure: number;              // hPa/millibars
  dewPoint: number;              // Temperature
  cloudCover: number;            // 0-1
  visibility: number;            // km
  ozone?: number;                // Dobson units
  
  // Wind
  windSpeed: number;             // m/s or mph
  windGust?: number;             // m/s or mph
  windBearing: number;           // Degrees (0 = North)
  
  // Solar/UV
  uvIndex: number;               // 0-11+
  
  // Storm tracking
  nearestStormDistance?: number; // km
  nearestStormBearing?: number;  // Degrees
}

interface MinutelyData {
  time: number;
  precipIntensity: number;
  precipProbability: number;
  precipType?: string;
}

interface HourlyData extends CurrentConditions {
  // Inherits all CurrentConditions fields
  // Additional aggregated fields for the hour
}

interface DailyData {
  time: number;                  // Unix timestamp (midnight local)
  summary: string;
  icon: WeatherIcon;
  
  // Temperature range
  temperatureHigh: number;
  temperatureHighTime: number;
  temperatureLow: number;
  temperatureLowTime: number;
  apparentTemperatureHigh: number;
  apparentTemperatureLow: number;
  
  // Precipitation
  precipIntensity: number;       // Daily average
  precipIntensityMax: number;
  precipIntensityMaxTime: number;
  precipProbability: number;     // Max probability for day
  precipType?: string;
  precipAccumulation?: number;   // Total accumulation (rain/snow)
  
  // Wind
  windSpeed: number;             // Daily average
  windGust: number;
  windGustTime: number;
  windBearing: number;
  
  // Atmospheric (daily averages)
  humidity: number;
  pressure: number;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  uvIndexTime: number;
  
  // Sun/Moon
  sunriseTime: number;
  sunsetTime: number;
  moonPhase: number;             // 0-1 (0 = new moon, 0.5 = full moon)
}

interface WeatherAlert {
  title: string;
  severity: 'advisory' | 'watch' | 'warning';
  time: number;                  // Start time
  expires: number;               // End time
  description: string;
  uri?: string;                  // Link to full alert
  regions: string[];             // Affected areas
}

type WeatherIcon = 
  | 'clear-day' 
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'rain'
  | 'sleet'
  | 'snow'
  | 'wind'
  | 'fog'
  | 'thunderstorm'
  | 'hail'
  | 'tornado';
```

### 3.2 Unit System

```typescript
interface UnitPreferences {
  temperature: 'celsius' | 'fahrenheit';
  windSpeed: 'mps' | 'kph' | 'mph' | 'knots';
  pressure: 'hPa' | 'mb' | 'inHg' | 'mmHg';
  visibility: 'km' | 'mi';
  precipitation: 'mm' | 'in';
  time: '12h' | '24h';
}
```

### 3.3 Caching Strategy

```typescript
interface CachePolicy {
  currentConditions: {
    maxAge: 300,         // 5 minutes
    staleWhileRevalidate: 600
  };
  minutelyForecast: {
    maxAge: 300,         // 5 minutes
    staleWhileRevalidate: 600
  };
  hourlyForecast: {
    maxAge: 1800,        // 30 minutes
    staleWhileRevalidate: 3600
  };
  dailyForecast: {
    maxAge: 3600,        // 1 hour
    staleWhileRevalidate: 7200
  };
  radarTiles: {
    maxAge: 300,         // 5 minutes
    staleWhileRevalidate: 600
  };
}
```

---

## 4. UI/UX Specification

### 4.1 Navigation Structure

```
┌─────────────────────────────────────────────┐
│                 Main View                    │
│  ┌─────────────────────────────────────┐    │
│  │     Current + Hourly Forecast       │    │
│  │         (Scrollable)                │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  [Weather]  [Map]  [Alerts]  [Settings]     │
└─────────────────────────────────────────────┘
```

#### Tab Bar Navigation
1. **Weather** (default) - Main forecast view
2. **Map** - Interactive weather map
3. **Alerts** - Notification settings and alert history
4. **Settings** - Preferences, locations, units

### 4.2 Information Hierarchy

The main weather view should present information in this priority order (top to bottom):

1. **Location + Last Updated** (minimal, top bar)
2. **Current Conditions Summary** (dominant visual)
3. **Next Hour Precipitation** (if precipitation expected)
4. **Active Weather Alerts** (if any)
5. **Hourly Forecast Timeline** (12-24 hours)
6. **Weekly Forecast** (7 days)
7. **Detailed Current Conditions Grid** (expandable)

### 4.3 Interaction Patterns

#### 4.3.1 Scrolling Behavior
- **Vertical scroll** on main view to reveal additional sections
- **Horizontal scroll** within hourly timeline
- **Scroll position memory** - return to same position when navigating back

#### 4.3.2 Tap Interactions
- Tap on any hour → Expand hourly detail
- Tap on any day → Expand daily detail view
- Tap on precipitation graph → Show precipitation overlay on map
- Tap on weather alert → Show full alert details
- Tap on data toggle buttons → Switch displayed metric

#### 4.3.3 Swipe Interactions
- Swipe left/right on daily forecast → Navigate days (in detail view)
- Pull down to refresh
- Swipe between saved locations (optional gesture)

#### 4.3.4 Long Press
- Long press on location → Quick edit/delete
- Long press on any data point → Show more context

### 4.4 State Management

```typescript
interface AppState {
  // Location State
  currentLocation: Location | null;
  savedLocations: Location[];
  selectedLocationIndex: number;
  
  // Weather Data State
  weatherData: Map<string, WeatherData>; // keyed by location ID
  loadingState: 'idle' | 'loading' | 'error';
  lastUpdated: Map<string, number>;
  
  // UI State
  selectedView: 'hourly' | 'daily';
  selectedMetric: 'temperature' | 'feelsLike' | 'precipitation' | 'wind';
  expandedDay: number | null;
  mapOverlay: 'precipitation' | 'temperature' | 'clouds';
  
  // User Preferences
  units: UnitPreferences;
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'auto';
}
```

---

## 5. Visual Design System

### 5.1 Color Palette

#### 5.1.1 Base Colors (Light Theme)
```css
:root {
  /* Background */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --bg-tertiary: #ECECEC;
  
  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  
  /* Accent */
  --accent-primary: #007AFF;
  --accent-secondary: #5AC8FA;
}
```

#### 5.1.2 Base Colors (Dark Theme)
```css
:root {
  /* Background */
  --bg-primary: #1C1C1E;
  --bg-secondary: #2C2C2E;
  --bg-tertiary: #3A3A3C;
  
  /* Text */
  --text-primary: #FFFFFF;
  --text-secondary: #ABABAB;
  --text-tertiary: #636366;
  
  /* Accent */
  --accent-primary: #0A84FF;
  --accent-secondary: #64D2FF;
}
```

#### 5.1.3 Semantic Colors
```css
:root {
  /* Temperature (cool to hot) */
  --temp-freezing: #A5D6F7;     /* < 32°F / 0°C */
  --temp-cold: #7EC8E3;          /* 32-50°F / 0-10°C */
  --temp-cool: #B4E7CE;          /* 50-65°F / 10-18°C */
  --temp-mild: #C5E8B7;          /* 65-75°F / 18-24°C */
  --temp-warm: #F7E8AA;          /* 75-85°F / 24-29°C */
  --temp-hot: #F5C77E;           /* 85-95°F / 29-35°C */
  --temp-extreme: #E8846E;       /* > 95°F / 35°C */
  
  /* Precipitation */
  --precip-none: transparent;
  --precip-light: #ADD8E6;       /* Light blue */
  --precip-medium: #4A90D9;      /* Medium blue */
  --precip-heavy: #1E3A5F;       /* Dark blue */
  --precip-snow: #E8E8E8;        /* Near-white */
  --precip-sleet: #B8C5D6;       /* Blue-gray */
  
  /* Cloud Cover */
  --clouds-clear: transparent;
  --clouds-few: #F0F0F0;
  --clouds-scattered: #D9D9D9;
  --clouds-broken: #BFBFBF;
  --clouds-overcast: #A0A0A0;
  
  /* Alerts */
  --alert-advisory: #FFC107;     /* Yellow */
  --alert-watch: #FF9800;        /* Orange */
  --alert-warning: #F44336;      /* Red */
  
  /* UV Index */
  --uv-low: #4CAF50;             /* 0-2: Green */
  --uv-moderate: #FFEB3B;        /* 3-5: Yellow */
  --uv-high: #FF9800;            /* 6-7: Orange */
  --uv-very-high: #F44336;       /* 8-10: Red */
  --uv-extreme: #9C27B0;         /* 11+: Purple */
}
```

### 5.2 Typography

```css
:root {
  /* Font Family */
  --font-primary: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 
                  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', Consolas, monospace;
  
  /* Font Sizes */
  --text-xs: 11px;
  --text-sm: 13px;
  --text-base: 15px;
  --text-lg: 17px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-4xl: 48px;
  --text-5xl: 64px;
  
  /* Font Weights */
  --font-light: 300;
  --font-regular: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

#### Typography Usage

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Current Temperature | 5xl (64px) | Light (300) | Tight |
| Section Headers | xl (20px) | Semibold (600) | Normal |
| Body Text | base (15px) | Regular (400) | Normal |
| Secondary Text | sm (13px) | Regular (400) | Normal |
| Caption/Labels | xs (11px) | Medium (500) | Normal |
| Data Values | lg (17px) | Medium (500) | Tight |

### 5.3 Spacing System

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### 5.4 Border Radius

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}
```

### 5.5 Shadows

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
}
```

### 5.6 Weather Icons

Use a consistent, minimal icon set. Recommended: Weather Icons font or custom SVG set.

Required icons:
- `clear-day` - Sun
- `clear-night` - Moon
- `partly-cloudy-day` - Sun with cloud
- `partly-cloudy-night` - Moon with cloud
- `cloudy` - Cloud
- `rain` - Cloud with rain drops
- `heavy-rain` - Cloud with heavy rain
- `drizzle` - Cloud with light drops
- `snow` - Cloud with snowflakes
- `sleet` - Cloud with mixed precipitation
- `wind` - Wind lines
- `fog` - Horizontal lines (fog)
- `thunderstorm` - Cloud with lightning
- `hail` - Cloud with hail
- `tornado` - Tornado funnel

Additional UI icons:
- `location` - Map pin
- `search` - Magnifying glass
- `settings` - Gear
- `notification` - Bell
- `arrow-up/down/left/right` - Directional arrows
- `expand/collapse` - Chevrons
- `refresh` - Circular arrow

---

## 6. Screen-by-Screen Specifications

### 6.1 Main Weather View

```
┌────────────────────────────────────────────────┐
│ ☰  San Francisco, CA                    [🔍]  │ ← Location bar
├────────────────────────────────────────────────┤
│                                                │
│            Partly Cloudy                       │ ← Summary text
│                                                │
│               58°                              │ ← Current temp (large)
│            Feels like 54°                      │ ← Apparent temp
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │ Rain starting in 23 min                  │ │ ← Next hour precipitation
│  │ ▁▂▃▅▇█████▇▅▃▂▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁    │ │   (animated wave graph)
│  │ Light  Med  Heavy                        │ │
│  │ Now        15m        30m        45m     │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ⚠️ Wind Advisory until 6:00 PM              │ ← Alert (if active)
│                                                │
├────────────────────────────────────────────────┤
│  [Temperature ▼]  [Feels Like]  [Rain %]      │ ← Toggle buttons
├────────────────────────────────────────────────┤
│                                                │
│  Now  1PM  2PM  3PM  4PM  5PM  6PM  7PM  →   │ ← Hourly timeline
│  ╔══╗                                         │   (horizontal scroll)
│  ║▓▓║ 58° ▓▓▓▓▓▓▓▓▓░░░░░░░                   │
│  ╚══╝                                         │
│  ░░░  60° ▓▓▓▓▓▓▓▓▓▓▓░░░░░                   │
│  ░░░  62° ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░                   │
│  ███  59° ▓▓▓▓▓▓▓▓▓░░░░░░░  ← Rain overlay   │
│  ...                                          │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  TODAY        ☀️   58°  ──────────  48°       │ ← 7-day forecast
│  WED          🌧️   52°  ────────    46°       │   (temperature pills)
│  THU          ⛅   55°  ─────────   42°       │
│  FRI          ☀️   60°  ──────────  45°       │
│  SAT          ☀️   64°  ────────────  50°     │
│  SUN          ⛅   58°  ─────────   48°       │
│  MON          🌧️   54°  ────────    44°       │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  DETAILS                                       │
│  ┌─────────┬─────────┬─────────┬─────────┐   │
│  │ Humidity│   Wind  │ UV Index│ Pressure│   │
│  │   72%   │ 12 mph  │  4 Mod  │ 1015 hPa│   │
│  │         │   NW ↗  │         │         │   │
│  └─────────┴─────────┴─────────┴─────────┘   │
│  ┌─────────┬─────────┬─────────┬─────────┐   │
│  │Dew Point│Visibility│ Sunrise │ Sunset  │   │
│  │   48°   │  10 mi  │ 6:42 AM │ 7:38 PM │   │
│  └─────────┴─────────┴─────────┴─────────┘   │
│                                                │
│  Updated 2:34 PM                               │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.2 Hourly Detail View (Expanded)

When user taps on an hour in the timeline:

```
┌────────────────────────────────────────────────┐
│                  ← Back                        │
├────────────────────────────────────────────────┤
│                                                │
│  Tuesday, January 24 at 3:00 PM               │
│                                                │
│               62°                              │
│         Partly Cloudy                          │
│                                                │
│  ┌─────────────────────────────────────────┐  │
│  │                                         │  │
│  │        Temperature                      │  │
│  │    ╭─────────────────────────────╮     │  │
│  │   ╱                               ╲    │  │
│  │  ╱                                 ╲   │  │
│  │ 12P  1P  2P  3P  4P  5P  6P  7P  8P   │  │
│  │                  ▲                     │  │
│  │              Selected                  │  │
│  │                                         │  │
│  └─────────────────────────────────────────┘  │
│                                                │
│  ┌──────────────┬──────────────┐              │
│  │ Feels Like   │ Precipitation │              │
│  │     58°      │     15%       │              │
│  └──────────────┴──────────────┘              │
│  ┌──────────────┬──────────────┐              │
│  │    Wind      │   Humidity    │              │
│  │  8 mph NW ↗  │     65%       │              │
│  └──────────────┴──────────────┘              │
│  ┌──────────────┬──────────────┐              │
│  │  Cloud Cover │   UV Index    │              │
│  │     45%      │   3 (Mod)     │              │
│  └──────────────┴──────────────┘              │
│                                                │
│  ← 2 PM                               4 PM →  │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.3 Daily Detail View

When user taps on a day in the weekly forecast:

```
┌────────────────────────────────────────────────┐
│                  ← Back                        │
├────────────────────────────────────────────────┤
│                                                │
│  Wednesday, January 25                         │
│                                                │
│           🌧️  Rainy                           │
│                                                │
│         High: 52°  Low: 46°                    │
│                                                │
│  ┌─────────────────────────────────────────┐  │
│  │ 12A  3A  6A  9A  12P  3P  6P  9P  12A   │  │
│  │  ▃▃  ▂▂  ▁▁  ▄▄  ▆▆  ██  ▇▇  ▅▅  ▃▃   │  │ ← Temperature curve
│  │                                         │  │
│  │  ░░  ░░  ▓▓  ██  ██  ▓▓  ░░  ░░  ░░   │  │ ← Precipitation bars
│  └─────────────────────────────────────────┘  │
│                                                │
│  Rain expected 6 AM - 4 PM                     │
│  0.4 inches total accumulation                 │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │ ☀️ Sunrise  6:44 AM   🌙 Sunset 7:36 PM │   │
│  │ 🌓 Moon: First Quarter                  │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  ┌──────────────┬──────────────┐              │
│  │ High Feels   │ Low Feels    │              │
│  │     48°      │     43°      │              │
│  └──────────────┴──────────────┘              │
│  ┌──────────────┬──────────────┐              │
│  │ Wind         │ Humidity     │              │
│  │ 15 mph SW    │    82%       │              │
│  └──────────────┴──────────────┘              │
│  ┌──────────────┬──────────────┐              │
│  │ UV Index Max │ Pressure     │              │
│  │  2 (Low)     │  1008 hPa    │              │
│  └──────────────┴──────────────┘              │
│                                                │
│  ← Tuesday                          Thursday → │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.4 Weather Map View

```
┌────────────────────────────────────────────────┐
│  ← Back      Weather Map      [Layers ▼]      │
├────────────────────────────────────────────────┤
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │                                        │   │
│  │     ┌───────┐                          │   │
│  │     │ ▓▓▓▓▓ │  ←Storm system           │   │
│  │     │ ▓▓▓▓▓ │    with direction        │   │
│  │     └───↘───┘    arrow                 │   │
│  │                                        │   │
│  │                📍                       │   │ ← User location
│  │            You are here                │   │
│  │                                        │   │
│  │                                        │   │
│  │     Legend:                            │   │
│  │     ░ Light  ▒ Med  ▓ Heavy           │   │
│  │                                        │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │ ◀◀  ◀   [▶]   ▶   ▶▶                  │   │ ← Time controls
│  │        2:30 PM (Now)                   │   │   (scrub through time)
│  └────────────────────────────────────────┘   │
│                                                │
│  [Precipitation]  [Temperature]  [Clouds]     │ ← Layer toggles
│                                                │
└────────────────────────────────────────────────┘
```

### 6.5 Location Management

```
┌────────────────────────────────────────────────┐
│  ← Back         Locations         [+ Add]     │
├────────────────────────────────────────────────┤
│                                                │
│  🔵 CURRENT LOCATION                           │
│  ┌────────────────────────────────────────┐   │
│  │ 📍 San Francisco, CA                   │   │
│  │    58° Partly Cloudy                   │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  SAVED LOCATIONS                               │
│  ┌────────────────────────────────────────┐   │
│  │ New York, NY                           │   │
│  │    42° Cloudy                          │   │
│  └────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────┐   │
│  │ Austin, TX                             │   │
│  │    75° Sunny                           │   │
│  └────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────┐   │
│  │ 123 Main St, Boston, MA                │   │
│  │    38° Light Snow                      │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  [Edit]                                        │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.6 Settings View

```
┌────────────────────────────────────────────────┐
│  ← Back           Settings                     │
├────────────────────────────────────────────────┤
│                                                │
│  UNITS                                         │
│  ┌────────────────────────────────────────┐   │
│  │ Temperature      [Fahrenheit ▼]        │   │
│  │ Wind Speed       [mph ▼]               │   │
│  │ Precipitation    [inches ▼]            │   │
│  │ Pressure         [inHg ▼]              │   │
│  │ Distance         [miles ▼]             │   │
│  │ Time Format      [12-hour ▼]           │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  APPEARANCE                                    │
│  ┌────────────────────────────────────────┐   │
│  │ Theme            [Auto ▼]              │   │
│  │ App Icon         [Default ▼]           │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  NOTIFICATIONS                                 │
│  ┌────────────────────────────────────────┐   │
│  │ Rain Alerts               [ON]         │   │
│  │ Severe Weather            [ON]         │   │
│  │ Daily Summary             [ON]         │   │
│  │   └─ Time: 7:00 AM                     │   │
│  │ Custom Alerts →                        │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  DATA                                          │
│  ┌────────────────────────────────────────┐   │
│  │ Data Source         [Open-Meteo ▼]     │   │
│  │ Cache Size          24.5 MB [Clear]    │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  ABOUT                                         │
│  ┌────────────────────────────────────────┐   │
│  │ Version              1.0.0             │   │
│  │ Open Source Licenses →                 │   │
│  │ Privacy Policy →                       │   │
│  │ Send Feedback →                        │   │
│  └────────────────────────────────────────┘   │
│                                                │
└────────────────────────────────────────────────┘
```

### 6.7 Time Machine View (v1.1)

```
┌────────────────────────────────────────────────┐
│  ← Back        Time Machine                    │
├────────────────────────────────────────────────┤
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │     ◀   January 24, 2023   ▶           │   │
│  │    [Select Date]                       │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  Historical Data for San Francisco, CA         │
│                                                │
│  ┌────────────────────────────────────────┐   │
│  │                                        │   │
│  │        High: 58°    Low: 46°           │   │
│  │                                        │   │
│  │        ⛅ Partly Cloudy                │   │
│  │                                        │   │
│  │        Precipitation: 0.1 in           │   │
│  │        Max Wind: 15 mph                │   │
│  │                                        │   │
│  └────────────────────────────────────────┘   │
│                                                │
│  HOURLY DATA                                   │
│  ┌─────────────────────────────────────────┐  │
│  │ 12A  3A  6A  9A  12P  3P  6P  9P  12A  │  │
│  │  47  46  46  48   54  58  56  52   49  │  │
│  │  ░░  ░░  ░░  ░░   ░░  ░░  ▓▓  ░░   ░░  │  │
│  └─────────────────────────────────────────┘  │
│                                                │
│  ℹ️ Showing actual recorded weather data       │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 7. Data Visualization Components

### 7.1 Precipitation Graph (Next Hour)

This is Dark Sky's signature visualization. Key characteristics:

```typescript
interface PrecipitationGraph {
  // Data
  dataPoints: Array<{
    time: number;           // Unix timestamp
    intensity: number;      // 0 to max intensity
    probability: number;    // 0 to 1
    type: 'rain' | 'snow' | 'sleet';
  }>;
  
  // Visual properties
  width: number;            // Full container width
  height: number;           // ~80px recommended
  
  // Design
  fillColor: string;        // Blue gradient for rain
  lineColor: string;        // Slightly darker blue
  uncertaintyAnimation: boolean;  // Wobble effect
}
```

#### Visual Specifications

```
┌──────────────────────────────────────────────────────────────┐
│ Heavy ├─────────────────────────────────────────────────────│
│       │                    ████████                          │
│Medium ├──────────────── ███████████████ ───────────────────│
│       │               ██████████████████████                 │
│ Light ├────────── ████████████████████████████ ────────────│
│       │        ██████████████████████████████████████       │
│ None  └────████████████████████████████████████████████────│
│        Now       15m        30m        45m        60m       │
└──────────────────────────────────────────────────────────────┘
```

#### Animation Behavior
- **High confidence**: Line is stable, minimal movement
- **Low confidence**: Line "wobbles" gently, edges are less defined
- The wobble should feel like water waves, subtle and calming
- Use sine wave displacement with amplitude proportional to (1 - probability)

#### Color Mapping
```javascript
const precipitationColor = (intensity: number, type: string) => {
  if (type === 'snow') return interpolate('#E8E8E8', '#B0C4DE', intensity);
  if (type === 'sleet') return interpolate('#B8C5D6', '#7A8B9C', intensity);
  // Rain (default)
  return interpolate('#ADD8E6', '#1E3A5F', intensity);
};
```

### 7.2 Temperature Timeline (Horizontal Bar Graph)

Dark Sky's distinctive approach: horizontal bars that preserve magnitude, not normalized bars.

```
Time  Temp   [← Low end of range                        High end →]
──────────────────────────────────────────────────────────────────────
Now   58°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░|
1PM   60°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░|
2PM   62°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░|
3PM   64°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░|
4PM   59°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░|
5PM   55°    |▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░|
──────────────────────────────────────────────────────────────────────
         30°  35°  40°  45°  50°  55°  60°  65°  70°  75°  80°
```

#### Key Design Decisions:
1. **Fixed scale** based on visible data range (not 0-100)
2. **Consistent scale** across all visible hours
3. **Color gradient** from cool to warm
4. **Cloud/precipitation column** on the left side of each row

### 7.3 Weekly Temperature Pills

Preserve magnitude relationships between days:

```
         ←─ Coldest in range                    Warmest in range ─→
         30°                                                      70°
         |                                                         |
TODAY    |            ○──────────────────────●                     |  48° - 58°
WED      |          ○────────────●                                 |  46° - 52°
THU      |        ○───────────────●                                |  42° - 55°
FRI      |          ○───────────────────────────●                  |  45° - 60°
SAT      |              ○────────────────────────────●             |  50° - 64°
SUN      |            ○───────────────────────●                    |  48° - 58°
MON      |        ○────────────●                                   |  44° - 54°
         |                                                         |
```

- `○` = Low temperature
- `●` = High temperature
- Line connects low to high
- Position on X-axis represents actual temperature value
- Line color: gradient from cool (left) to warm (right)

### 7.4 Wind Direction Indicators

Use arrows that point in the direction the wind is coming FROM:

```
Wind: 12 mph NW ↘
```

The arrow (↘) shows wind blowing TO the southeast, meaning it's coming FROM the northwest.

#### Arrow Mapping
```javascript
const windArrow = (bearing: number) => {
  // bearing is direction wind is coming FROM
  // Arrow points in direction wind is going TO
  const arrows = ['↓', '↙', '←', '↖', '↑', '↗', '→', '↘'];
  const index = Math.round(bearing / 45) % 8;
  return arrows[index];
};
```

### 7.5 UV Index Indicator

Visual scale with color coding:

```
UV Index: 6 (High)

[██████░░░░░] 
 0  2  4  6  8  10+
    Low  Mod High  V.High
```

Color bands:
- 0-2: Green (Low)
- 3-5: Yellow (Moderate)
- 6-7: Orange (High)
- 8-10: Red (Very High)
- 11+: Purple (Extreme)

### 7.6 Moon Phase Display

```javascript
const moonPhaseEmoji = (phase: number) => {
  // phase: 0-1 where 0 = new moon, 0.5 = full moon
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  const index = Math.round(phase * 8) % 8;
  return phases[index];
};

const moonPhaseName = (phase: number) => {
  if (phase === 0) return 'New Moon';
  if (phase < 0.25) return 'Waxing Crescent';
  if (phase === 0.25) return 'First Quarter';
  if (phase < 0.5) return 'Waxing Gibbous';
  if (phase === 0.5) return 'Full Moon';
  if (phase < 0.75) return 'Waning Gibbous';
  if (phase === 0.75) return 'Last Quarter';
  return 'Waning Crescent';
};
```

---

## 8. Notifications & Alerts System

### 8.1 Standard Notifications

#### 8.1.1 Precipitation Alert
**Trigger:** precipProbability > 0.5 AND precipIntensity > 0.1 within next 60 minutes

**Content:**
```
Title: "Rain starting soon"
Body: "Light rain expected in 23 minutes at your location."
// or
Body: "Heavy rain starting in 12 minutes, lasting about 45 minutes."
```

#### 8.1.2 Severe Weather Alert
**Trigger:** Government-issued weather alert for user's location

**Content:**
```
Title: "[SEVERITY] [ALERT TYPE]"
Body: "[Brief description]. Tap for details."

Examples:
Title: "⚠️ Tornado Warning"
Body: "Tornado warning in effect until 6:00 PM. Seek shelter immediately."

Title: "🌊 Flood Watch"
Body: "Flash flood watch in effect until tomorrow morning."
```

#### 8.1.3 Daily Summary
**Trigger:** User-configured time (default: 7:00 AM)

**Content:**
```
Title: "Today's Weather"
Body: "High of 72°, low of 58°. Partly cloudy with a 20% chance of afternoon showers."
```

### 8.2 Custom Alert Configuration

```typescript
interface CustomAlert {
  id: string;
  enabled: boolean;
  condition: {
    metric: 'temperature' | 'apparentTemperature' | 'precipProbability' | 
            'windSpeed' | 'uvIndex' | 'humidity';
    operator: 'above' | 'below' | 'equals';
    threshold: number;
  };
  schedule: {
    type: 'anytime' | 'morning' | 'afternoon' | 'evening' | 'specific';
    specificTime?: string;  // HH:mm format
  };
  locations: string[];  // Location IDs, or ['current'] for current location
  cooldown: number;     // Minutes between repeated alerts
}
```

### 8.3 Notification UI

```
┌────────────────────────────────────────────────┐
│ My Notifications                               │
├────────────────────────────────────────────────┤
│                                                │
│ STANDARD ALERTS                                │
│ ┌────────────────────────────────────────┐    │
│ │ 🌧️ Rain Starting Soon        [ON]     │    │
│ │    Alert when rain begins nearby       │    │
│ └────────────────────────────────────────┘    │
│ ┌────────────────────────────────────────┐    │
│ │ ⚠️ Severe Weather Alerts      [ON]     │    │
│ │    Government-issued warnings          │    │
│ └────────────────────────────────────────┘    │
│ ┌────────────────────────────────────────┐    │
│ │ 📋 Daily Summary              [ON]     │    │
│ │    Every day at 7:00 AM                │    │
│ └────────────────────────────────────────┘    │
│                                                │
│ CUSTOM ALERTS                                  │
│ ┌────────────────────────────────────────┐    │
│ │ 🌡️ High Temperature           [ON]     │    │
│ │    When temp rises above 85°F          │    │
│ └────────────────────────────────────────┘    │
│ ┌────────────────────────────────────────┐    │
│ │ 💨 Strong Winds               [OFF]    │    │
│ │    When wind exceeds 20 mph            │    │
│ └────────────────────────────────────────┘    │
│                                                │
│ [+ Add Custom Alert]                           │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 9. Animation & Micro-interactions

### 9.1 Animation Principles

1. **Purpose-driven**: Every animation should communicate information or provide feedback
2. **Subtle**: Animations should enhance, not distract
3. **Fast**: Most animations should complete in 200-300ms
4. **Interruptible**: User actions should be able to interrupt animations

### 9.2 Specific Animations

#### 9.2.1 Precipitation Graph Wave Effect
```css
@keyframes precipitation-wave {
  0%, 100% { 
    transform: translateY(0); 
  }
  25% { 
    transform: translateY(-2px); 
  }
  75% { 
    transform: translateY(2px); 
  }
}

.precip-line {
  animation: precipitation-wave 3s ease-in-out infinite;
  /* Amplitude based on uncertainty */
  animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
}
```

#### 9.2.2 Pull to Refresh
- Spring physics for pull resistance
- Circular progress indicator
- Success haptic feedback on completion

#### 9.2.3 Temperature Transition
When switching between locations or refreshing:
```css
.temperature-value {
  transition: all 0.3s ease-out;
}

.temperature-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.temperature-enter-active {
  opacity: 1;
  transform: translateY(0);
}
```

#### 9.2.4 Radar Map Animation
- Smooth loop through time steps
- Configurable animation speed (slow, normal, fast)
- Precipitation appears to flow naturally
- Frame rate: 10-15 FPS for smooth appearance

#### 9.2.5 Day/Hour Expansion
```css
.detail-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out, opacity 0.2s ease-out;
}

.detail-panel.expanded {
  max-height: 500px;
  opacity: 1;
}
```

### 9.3 Haptic Feedback (Mobile)

| Action | Haptic Type |
|--------|-------------|
| Pull to refresh complete | Success |
| Alert received | Warning |
| Location changed | Light impact |
| Toggle switch | Selection change |
| Error | Error |

---

## 10. Technical Implementation

### 10.1 Recommended Tech Stack

#### Web / PWA
```json
{
  "frontend": {
    "framework": "React 18+ or Vue 3",
    "stateManagement": "Zustand or Pinia",
    "styling": "Tailwind CSS or CSS Modules",
    "charts": "D3.js (custom) or Recharts",
    "maps": "Mapbox GL JS or Leaflet",
    "animations": "Framer Motion or Vue Motion"
  },
  "mobile": {
    "framework": "React Native or Flutter",
    "maps": "react-native-maps or flutter_map",
    "charts": "Victory Native or fl_chart",
    "notifications": "Firebase Cloud Messaging"
  },
  "backend": {
    "runtime": "Node.js or Python",
    "api": "Express, Fastify, or FastAPI",
    "caching": "Redis",
    "database": "PostgreSQL (for user data)",
    "queue": "Bull (for notifications)"
  }
}
```

### 10.2 Project Structure

```
open-sky/
├── apps/
│   ├── web/                    # Web application (PWA)
│   │   ├── src/
│   │   │   ├── components/     # React/Vue components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── stores/         # State management
│   │   │   ├── services/       # API clients
│   │   │   ├── utils/          # Helpers
│   │   │   └── styles/         # Global styles
│   │   └── public/
│   ├── mobile/                 # React Native / Flutter app
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── navigation/
│   │   │   └── services/
│   │   ├── ios/
│   │   └── android/
│   └── api/                    # Backend API (optional)
│       ├── src/
│       │   ├── routes/
│       │   ├── services/
│       │   └── middleware/
│       └── Dockerfile
├── packages/
│   ├── weather-client/         # Shared weather API client
│   ├── ui-components/          # Shared UI components
│   └── types/                  # Shared TypeScript types
├── docs/
│   ├── api.md
│   ├── contributing.md
│   └── design.md
└── README.md
```

### 10.3 Key Components Architecture

```typescript
// Component hierarchy for main weather view

<App>
  <LocationProvider>
    <WeatherDataProvider>
      <ThemeProvider>
        <Navigation>
          <WeatherScreen>
            <LocationHeader />
            <CurrentConditions />
            <PrecipitationGraph />
            <WeatherAlerts />
            <HourlyForecast>
              <MetricToggle />
              <HourlyTimeline />
            </HourlyForecast>
            <DailyForecast>
              <DayRow />
              <DayRow />
              ...
            </DailyForecast>
            <DetailsGrid />
            <LastUpdated />
          </WeatherScreen>
          <MapScreen />
          <AlertsScreen />
          <SettingsScreen />
        </Navigation>
      </ThemeProvider>
    </WeatherDataProvider>
  </LocationProvider>
</App>
```

### 10.4 State Management

```typescript
// Zustand store example
interface WeatherStore {
  // State
  locations: Location[];
  currentLocationIndex: number;
  weatherData: Record<string, WeatherData>;
  loading: boolean;
  error: string | null;
  
  // Actions
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectLocation: (index: number) => void;
  fetchWeather: (locationId: string) => Promise<void>;
  refreshWeather: () => Promise<void>;
}

interface UIStore {
  // State
  selectedMetric: 'temperature' | 'feelsLike' | 'precipitation' | 'wind';
  expandedDay: number | null;
  mapOverlay: 'precipitation' | 'temperature' | 'clouds';
  
  // Actions
  setSelectedMetric: (metric: string) => void;
  setExpandedDay: (day: number | null) => void;
  setMapOverlay: (overlay: string) => void;
}

interface SettingsStore {
  // State
  units: UnitPreferences;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  
  // Actions
  setUnits: (units: Partial<UnitPreferences>) => void;
  setTheme: (theme: string) => void;
  setNotifications: (settings: Partial<NotificationSettings>) => void;
}
```

### 10.5 API Service Layer

```typescript
// weather-client package

class WeatherService {
  private provider: WeatherProvider;
  private cache: CacheService;
  
  constructor(config: WeatherServiceConfig) {
    this.provider = createProvider(config.provider);
    this.cache = new CacheService(config.cache);
  }
  
  async getCurrentWeather(location: Location): Promise<WeatherData> {
    const cacheKey = `weather:${location.latitude},${location.longitude}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached && !this.isStale(cached)) {
      return cached.data;
    }
    
    const data = await this.provider.fetchWeather(location);
    await this.cache.set(cacheKey, data, CACHE_TTL);
    
    return data;
  }
  
  async getMinutelyForecast(location: Location): Promise<MinutelyData[]> {
    // Implementation
  }
  
  async getRadarTiles(bounds: MapBounds, time: number): Promise<TileData[]> {
    // Implementation
  }
}

// Provider abstraction
interface WeatherProvider {
  fetchWeather(location: Location): Promise<WeatherData>;
  fetchHistorical(location: Location, date: Date): Promise<WeatherData>;
  fetchRadar(bounds: MapBounds): Promise<RadarData>;
}

class OpenMeteoProvider implements WeatherProvider {
  // Open-Meteo implementation
}

class PirateWeatherProvider implements WeatherProvider {
  // Pirate Weather implementation (Dark Sky API compatible)
}
```

---

## 11. API Integration

### 11.1 Recommended Free APIs

#### Primary: Open-Meteo
- **URL:** https://open-meteo.com/
- **Cost:** Free for non-commercial use
- **Features:**
  - Hourly forecasts up to 16 days
  - 15-minute resolution data (some regions)
  - Historical data back to 1940
  - No API key required
  - Global coverage
  - Multiple weather models

#### Secondary: Pirate Weather
- **URL:** https://pirateweather.net/
- **Cost:** Free tier available
- **Features:**
  - Dark Sky API compatible format
  - Minute-by-minute precipitation
  - More intuitive data structure

#### Radar Data: RainViewer
- **URL:** https://www.rainviewer.com/api.html
- **Cost:** Free
- **Features:**
  - Global radar coverage
  - Historical and nowcast data
  - Tile-based for map integration

#### Geocoding: Nominatim (OpenStreetMap)
- **URL:** https://nominatim.org/
- **Cost:** Free (with attribution)
- **Features:**
  - Forward and reverse geocoding
  - Address search

### 11.2 API Response Transformation

```typescript
// Transform Open-Meteo response to our internal format
function transformOpenMeteoResponse(response: OpenMeteoResponse): WeatherData {
  return {
    location: {
      latitude: response.latitude,
      longitude: response.longitude,
      timezone: response.timezone,
      name: '' // Will be filled by geocoding
    },
    currently: {
      time: response.current.time,
      temperature: response.current.temperature_2m,
      apparentTemperature: response.current.apparent_temperature,
      humidity: response.current.relative_humidity_2m / 100,
      windSpeed: response.current.wind_speed_10m,
      windBearing: response.current.wind_direction_10m,
      cloudCover: response.current.cloud_cover / 100,
      precipProbability: response.current.precipitation_probability / 100,
      precipIntensity: response.current.precipitation,
      pressure: response.current.surface_pressure,
      visibility: response.current.visibility / 1000,
      uvIndex: response.current.uv_index,
      icon: mapWeatherCodeToIcon(response.current.weather_code),
      summary: mapWeatherCodeToSummary(response.current.weather_code)
    },
    hourly: response.hourly.time.map((time, i) => ({
      time: new Date(time).getTime() / 1000,
      temperature: response.hourly.temperature_2m[i],
      apparentTemperature: response.hourly.apparent_temperature[i],
      // ... map all fields
    })),
    daily: response.daily.time.map((time, i) => ({
      time: new Date(time).getTime() / 1000,
      temperatureHigh: response.daily.temperature_2m_max[i],
      temperatureLow: response.daily.temperature_2m_min[i],
      // ... map all fields
    })),
    minutely: [], // Open-Meteo has 15-min data, not minutely
    alerts: [] // Separate API call needed
  };
}

// Weather code to icon mapping (WMO codes used by Open-Meteo)
function mapWeatherCodeToIcon(code: number): WeatherIcon {
  const mapping: Record<number, WeatherIcon> = {
    0: 'clear-day',
    1: 'clear-day',
    2: 'partly-cloudy-day',
    3: 'cloudy',
    45: 'fog',
    48: 'fog',
    51: 'drizzle',
    53: 'drizzle',
    55: 'drizzle',
    61: 'rain',
    63: 'rain',
    65: 'heavy-rain',
    71: 'snow',
    73: 'snow',
    75: 'snow',
    77: 'sleet',
    80: 'rain',
    81: 'rain',
    82: 'heavy-rain',
    85: 'snow',
    86: 'snow',
    95: 'thunderstorm',
    96: 'thunderstorm',
    99: 'thunderstorm'
  };
  return mapping[code] || 'cloudy';
}
```

### 11.3 API Request Examples

#### Open-Meteo Current + Forecast
```bash
curl "https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&timezone=auto"
```

#### RainViewer Radar Tiles
```bash
# Get available timestamps
curl "https://api.rainviewer.com/public/weather-maps.json"

# Tile URL format
"https://tilecache.rainviewer.com/v2/radar/{timestamp}/256/{z}/{x}/{y}/2/1_1.png"
```

---

## 12. Accessibility Requirements

### 12.1 WCAG 2.1 AA Compliance

#### Color Contrast
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- UI components: minimum 3:1 ratio

#### Text Scaling
- Support system font size preferences
- Test at 200% zoom
- No horizontal scrolling at 320px width

#### Screen Reader Support
- All interactive elements have accessible names
- Images have alt text
- Charts have text alternatives
- Focus order matches visual order

### 12.2 Specific Accessibility Features

#### Weather Data Alternatives
```html
<!-- Precipitation graph -->
<figure role="img" aria-label="Precipitation forecast for next hour">
  <canvas id="precip-graph"></canvas>
  <figcaption class="sr-only">
    Light rain expected starting in 23 minutes, becoming moderate 
    around 35 minutes from now, then tapering off after about 50 minutes.
  </figcaption>
</figure>

<!-- Temperature bar -->
<div 
  role="meter" 
  aria-label="Temperature at 3 PM"
  aria-valuenow="62"
  aria-valuemin="0"
  aria-valuemax="100"
>
  62°F
</div>
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .precip-line {
    animation: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

#### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --text-secondary: var(--text-primary);
    --bg-secondary: var(--bg-primary);
  }
  
  .temperature-bar {
    border: 2px solid currentColor;
  }
}
```

### 12.3 Voice Control Labels

```typescript
// Ensure all interactive elements are voice-accessible
const accessibilityLabels = {
  refreshButton: "Refresh weather data",
  locationSearch: "Search for a location",
  temperatureToggle: "Switch to temperature view",
  feelsLikeToggle: "Switch to feels like temperature view",
  precipitationToggle: "Switch to precipitation view",
  dayRow: (day: string) => `Weather forecast for ${day}`,
  hourCell: (hour: string, temp: number) => 
    `${hour}: ${temp} degrees`
};
```

---

## 13. Platform-Specific Considerations

### 13.1 iOS

#### Required Capabilities
- Location Services (When In Use + Always for notifications)
- Background App Refresh
- Push Notifications

#### iOS-Specific UI
- Use SF Symbols for icons where possible
- Support Dynamic Type
- Support Dark Mode
- Use UIKit/SwiftUI haptics
- Home Screen widgets (WidgetKit)
- Lock Screen widgets (iOS 16+)
- Live Activities (iOS 16.1+)

### 13.2 Android

#### Required Permissions
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

#### Android-Specific UI
- Support Material You theming (Android 12+)
- Home Screen widgets (Glance/RemoteViews)
- Notification channels
- Battery optimization exemption for alerts

### 13.3 Web / PWA

#### PWA Requirements
```json
// manifest.json
{
  "name": "Open Sky Weather",
  "short_name": "Open Sky",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#007AFF",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

#### Service Worker
- Cache weather data for offline viewing
- Background sync for data updates
- Push notifications support

---

## 14. Testing & Quality Assurance

### 14.1 Unit Tests

```typescript
describe('WeatherDataTransformer', () => {
  it('should correctly transform Open-Meteo response', () => {
    const input = mockOpenMeteoResponse;
    const result = transformOpenMeteoResponse(input);
    
    expect(result.currently.temperature).toBe(58);
    expect(result.hourly).toHaveLength(168);
    expect(result.daily).toHaveLength(7);
  });
  
  it('should map weather codes to correct icons', () => {
    expect(mapWeatherCodeToIcon(0)).toBe('clear-day');
    expect(mapWeatherCodeToIcon(61)).toBe('rain');
    expect(mapWeatherCodeToIcon(95)).toBe('thunderstorm');
  });
});

describe('TemperatureDisplay', () => {
  it('should convert Celsius to Fahrenheit correctly', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });
});
```

### 14.2 Integration Tests

```typescript
describe('Weather API Integration', () => {
  it('should fetch and cache weather data', async () => {
    const service = new WeatherService(testConfig);
    const location = { latitude: 37.7749, longitude: -122.4194 };
    
    const result = await service.getCurrentWeather(location);
    
    expect(result).toHaveProperty('currently');
    expect(result).toHaveProperty('hourly');
    expect(result).toHaveProperty('daily');
  });
  
  it('should return cached data on subsequent requests', async () => {
    // First request
    await service.getCurrentWeather(location);
    
    // Mock API to fail
    mockApiFailure();
    
    // Should return cached data
    const result = await service.getCurrentWeather(location);
    expect(result).toBeDefined();
  });
});
```

### 14.3 E2E Tests

```typescript
describe('Main Weather Flow', () => {
  it('should display current weather on launch', async () => {
    await app.launch();
    await expect(element(by.id('current-temperature'))).toBeVisible();
    await expect(element(by.id('weather-summary'))).toBeVisible();
  });
  
  it('should refresh weather on pull down', async () => {
    await element(by.id('weather-scroll')).swipe('down', 'fast');
    await expect(element(by.id('loading-indicator'))).toBeVisible();
    await waitFor(element(by.id('last-updated'))).toBeVisible();
  });
  
  it('should navigate to day detail on tap', async () => {
    await element(by.id('day-row-0')).tap();
    await expect(element(by.id('day-detail-screen'))).toBeVisible();
  });
});
```

### 14.4 Visual Regression Tests

- Snapshot tests for all major screens
- Test light and dark themes
- Test with various data states (rain, snow, clear, etc.)
- Test responsive layouts

### 14.5 Performance Benchmarks

| Metric | Target |
|--------|--------|
| Initial load (web) | < 3s on 3G |
| App startup (mobile) | < 2s |
| Weather data fetch | < 1s |
| UI interaction response | < 100ms |
| Animation frame rate | 60fps |
| Memory usage (mobile) | < 100MB |

---

## Appendix A: Weather Icon Mapping Reference

| WMO Code | Description | Icon | Emoji |
|----------|-------------|------|-------|
| 0 | Clear sky | clear-day/night | ☀️/🌙 |
| 1 | Mainly clear | clear-day/night | 🌤️ |
| 2 | Partly cloudy | partly-cloudy-day/night | ⛅ |
| 3 | Overcast | cloudy | ☁️ |
| 45 | Fog | fog | 🌫️ |
| 48 | Depositing rime fog | fog | 🌫️ |
| 51 | Light drizzle | drizzle | 🌧️ |
| 53 | Moderate drizzle | drizzle | 🌧️ |
| 55 | Dense drizzle | drizzle | 🌧️ |
| 61 | Slight rain | rain | 🌧️ |
| 63 | Moderate rain | rain | 🌧️ |
| 65 | Heavy rain | heavy-rain | 🌧️ |
| 71 | Slight snow | snow | 🌨️ |
| 73 | Moderate snow | snow | 🌨️ |
| 75 | Heavy snow | snow | 🌨️ |
| 77 | Snow grains | sleet | 🌨️ |
| 80 | Slight rain showers | rain | 🌦️ |
| 81 | Moderate rain showers | rain | 🌦️ |
| 82 | Violent rain showers | heavy-rain | ⛈️ |
| 85 | Slight snow showers | snow | 🌨️ |
| 86 | Heavy snow showers | snow | 🌨️ |
| 95 | Thunderstorm | thunderstorm | ⛈️ |
| 96 | Thunderstorm + slight hail | thunderstorm | ⛈️ |
| 99 | Thunderstorm + heavy hail | thunderstorm | ⛈️ |

---

## Appendix B: Unit Conversion Reference

```typescript
const conversions = {
  temperature: {
    celsiusToFahrenheit: (c: number) => (c * 9/5) + 32,
    fahrenheitToCelsius: (f: number) => (f - 32) * 5/9,
  },
  speed: {
    mpsToMph: (mps: number) => mps * 2.237,
    mpsToKph: (mps: number) => mps * 3.6,
    mpsToKnots: (mps: number) => mps * 1.944,
  },
  distance: {
    kmToMiles: (km: number) => km * 0.621,
    milesToKm: (mi: number) => mi * 1.609,
  },
  pressure: {
    hPaToInHg: (hPa: number) => hPa * 0.02953,
    hPaToMmHg: (hPa: number) => hPa * 0.75006,
  },
  precipitation: {
    mmToInches: (mm: number) => mm * 0.03937,
    inchesToMm: (inches: number) => inches * 25.4,
  }
};
```

---

## Appendix C: Localization Support

### Supported Languages (Initial Release)
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Japanese (ja)
- Chinese Simplified (zh-CN)

### Weather Description Localization
```json
{
  "en": {
    "clear-day": "Clear",
    "partly-cloudy-day": "Partly Cloudy",
    "rain": "Rain",
    "heavy-rain": "Heavy Rain",
    "snow": "Snow",
    "thunderstorm": "Thunderstorm"
  },
  "es": {
    "clear-day": "Despejado",
    "partly-cloudy-day": "Parcialmente Nublado",
    "rain": "Lluvia",
    "heavy-rain": "Lluvia Fuerte",
    "snow": "Nieve",
    "thunderstorm": "Tormenta"
  }
}
```

---

## Appendix D: Error Handling

### Error States
```typescript
enum WeatherErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  LOCATION_PERMISSION_DENIED = 'LOCATION_PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  API_ERROR = 'API_ERROR',
  RATE_LIMITED = 'RATE_LIMITED',
  UNKNOWN = 'UNKNOWN'
}

interface WeatherError {
  type: WeatherErrorType;
  message: string;
  retryable: boolean;
  retryAfter?: number; // seconds
}
```

### User-Facing Error Messages
```typescript
const errorMessages: Record<WeatherErrorType, string> = {
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  LOCATION_PERMISSION_DENIED: "Location access denied. Enable in Settings to see local weather.",
  LOCATION_UNAVAILABLE: "Unable to determine your location. Please try again.",
  API_ERROR: "Weather data temporarily unavailable. Please try again later.",
  RATE_LIMITED: "Too many requests. Please wait a moment.",
  UNKNOWN: "Something went wrong. Please try again."
};
```

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-24 | Claude | Initial specification |

---

*This document is designed to serve as a comprehensive blueprint for development. Each section can be implemented incrementally. Start with MVP features (P0) and iterate.*
