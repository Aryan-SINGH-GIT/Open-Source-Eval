# 🎯 Smart City Dashboard - User Flow

## Navigation Flow

```
Landing Page (/)
    ↓
    [Get Started Button]
    ↓
Auth Page (/auth)
    ↓
    [Login/Sign Up]
    ↓
Dashboard (/dashboard)
```

## Page Details

### 1. Landing Page (`/`)
- **URL**: `http://localhost:3000/`
- **Features**:
  - Hero section with animated 3D sphere
  - Smooth scroll animations
  - Features grid (4 cards)
  - Stats section with rotating 3D sphere
  - Final CTA section
- **Action**: Click "Get Started" → Redirects to `/auth`

### 2. Auth Page (`/auth`)
- **URL**: `http://localhost:3000/auth`
- **Features**:
  - Animated 3D floating shapes background
  - Tab switching between Login/Sign Up
  - Smooth form transitions
  - Glassmorphism card design
- **Forms**:
  - **Login**: Email, Password, Remember me, Forgot password
  - **Sign Up**: Name, Email, Password, Confirm Password
- **Action**: Submit form → Redirects to `/dashboard`

### 3. Dashboard (`/dashboard`)
- **URL**: `http://localhost:3000/dashboard`
- **Features**:
  - Collapsible sidebar navigation
  - 4 KPI widgets (Population, Energy, Traffic, Air Quality)
  - Interactive 3D city map
  - Weather widget
  - Air quality circular progress
  - Traffic flow chart (24-hour data)
  - Real-time data updates every 5 seconds

## Design System

### Colors
- **Primary Blue**: `#6366f1`
- **Purple**: `#a855f7`
- **Pink**: `#ec4899`
- **Light Blue**: `#60a5fa`
- **Background**: Black gradients

### Border Radius
- All cards: `30px` (smooth, flowing)
- Buttons: `15px` - `50px`
- Inputs: `15px`

### Glassmorphism
- Background: `rgba(15, 25, 50, 0.4)`
- Backdrop blur: `30px`
- Border: `1px solid rgba(99, 102, 241, 0.3)`

### Animations
- Hover scale: `1.02` - `1.05`
- Transition: `0.4s cubic-bezier(0.4, 0, 0.2, 1)`
- 3D rotations: Auto-rotate at 0.5-2 speed
- Floating animations: 3s ease-in-out infinite

## Testing the Flow

1. Start dev server: `npm run dev`
2. Open browser: `http://localhost:3000/`
3. Scroll through landing page
4. Click "Get Started" or "Start Your Journey"
5. Toggle between Login/Sign Up tabs
6. Fill form and submit
7. Explore dashboard with sidebar navigation
8. Watch real-time data updates

## Direct URLs

- Landing: `http://localhost:3000/`
- Auth: `http://localhost:3000/auth`
- Dashboard: `http://localhost:3000/dashboard`
