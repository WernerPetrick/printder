# Printder

A Tinder-style web app for discovering 3D printable models. Swipe through thousands of models sourced from [Printables.com](https://www.printables.com), save the ones you like, and visit Printables to download and print them.

## About

Printder solves a common problem for 3D printer owners: not knowing what to print next. Instead of endlessly browsing catalogs, users swipe through models one at a time in a card stack interface. Swipe right to save a model to your favorites, swipe left to skip. Your saved collection links directly back to Printables for downloading.

The app features a neo-brutalist design with bold colors, thick borders, hard shadows, and monospace typography.

### Features

- **Swipe interface** -- Drag-to-swipe card stack with animated transitions
- **Category filtering** -- Optionally filter models by category or discover randomly
- **Favorites collection** -- Browse your saved models with direct links to Printables
- **User accounts** -- Required authentication via Appwrite (email/password)
- **Interactive landing page** -- Public landing page with a live swipe demo
- **Automated scraper** -- Appwrite Function that populates the database from Printables via their GraphQL API

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, vanilla JavaScript |
| Routing | React Router v7 |
| Animations | Framer Motion |
| Backend / Auth / DB | Appwrite |
| Scraper | Node.js, Appwrite Functions, Cheerio, Undici |
| Fonts | Space Mono (Google Fonts) |

## Project Structure

```
src/
  components/
    Auth/           Login, Register, AuthGuard
    CardStack/      Swipe deck manager with like/dismiss buttons
    SwipeCard/      Draggable card with PRINT/NOPE stamps
    SwipeDemo/      Interactive demo for the landing page
    Favorites/      Grid of saved models
    Filters/        Category filter chips
    Layout/         App shell with nav and header
  pages/
    LandingPage     Public landing page
    LoginPage       Authentication (login/register)
    SwipePage       Main swiping experience
    FavoritesPage   Saved prints collection
  services/
    appwrite.js     Appwrite client, auth, and database helpers
  hooks/
    useAuth.jsx     Auth context provider and hook
    useModels.js    Fetch/paginate models, track swiped IDs
  assets/
    filament-spool.png
functions/
  scraper/
    src/main.js     Appwrite Function -- scrapes Printables GraphQL API
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- An [Appwrite](https://appwrite.io/) project (Cloud or self-hosted)

## Appwrite Setup

### 1. Create a database

Create a database in your Appwrite console (e.g., `PrintderDB`).

### 2. Create the `models` collection

Create a collection called `models` with these attributes:

| Attribute | Type | Size | Required |
|---|---|---|---|
| `title` | String | 255 | Yes |
| `slug` | String | 255 | Yes |
| `description` | String | 1024 | No |
| `author` | String | 255 | No |
| `category` | String | 100 | No |
| `thumbnailUrl` | URL | -- | No |
| `previewImages` | String | 5000 | No |
| `likesCount` | Integer | -- | No |
| `downloadCount` | Integer | -- | No |
| `printablesUrl` | URL | -- | Yes |

Indexes:
- **slug** -- Unique key index
- **category** -- Key index (ASC)

Permissions:
- Read: Any
- Create, Update, Delete: Any (required for the scraper; restrict to API key in production)

### 3. Create the `swipes` collection

Create a collection called `swipes` with these attributes:

| Attribute | Type | Size | Required |
|---|---|---|---|
| `userId` | String | 255 | Yes |
| `modelId` | String | 255 | Yes |
| `action` | String | 20 | Yes |

Indexes:
- **userId** -- Key index
- **userId + action** -- Key index (composite)

Permissions:
- Read: Users
- Create: Users

### 4. Enable authentication

In Auth > Settings, enable **Email/Password** as a sign-in method.

### 5. Create an API key

Go to Overview > API Keys > Create API Key. The key needs `databases.read` and `databases.write` scopes (and their sub-scopes for collections and documents).

## Environment Variables

### Frontend (`.env`)

Copy `.env.example` to `.env` and fill in:

```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_MODELS_COLLECTION_ID=your_models_collection_id
VITE_APPWRITE_SWIPES_COLLECTION_ID=your_swipes_collection_id
```

### Scraper (`functions/scraper/.env`)

Copy `functions/scraper/.env.example` to `functions/scraper/.env` and fill in:

```
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_api_key
DATABASE_ID=your_database_id
MODELS_COLLECTION_ID=your_models_collection_id
```

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/printder.git
cd printder

# Install frontend dependencies
npm install

# Install scraper dependencies
cd functions/scraper
npm install
cd ../..
```

## Running

### Development server

```bash
npm run dev
```

Opens at `http://localhost:5173` (or the next available port).

### Populate the database

Run the scraper locally to fetch models from Printables:

```bash
cd functions/scraper
node --max-http-header-size=65536 run-local.js
```

The scraper paginates through all Printables categories via their GraphQL API and saves models to your Appwrite database. It includes rate limiting and duplicate detection via the `slug` index.

### Build for production

```bash
npm run build
```

Output is written to the `dist/` directory.

### Preview production build

```bash
npm run preview
```

## Routes

| Path | Auth | Description |
|---|---|---|
| `/` | Public | Landing page with hero, about, swipe demo, and footer |
| `/login` | Public | Login and registration forms |
| `/swipe` | Required | Main swiping interface |
| `/favorites` | Required | Saved models collection |

## License

This project is for educational purposes. Models displayed in the app are sourced from [Printables.com](https://www.printables.com) and remain under their respective licenses.
