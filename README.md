# SD Jamaat Website

Public website and authenticated member portal for the San Diego Dawoodi Bohra Jamaat.

## Features

- Public Jamaat information and contact form
- Member login, password reset, registration, and family invitations
- Account, family, and family-member profile management
- Faiz-ul-Mawaid il-Burhaniyah menu calendar, thaali selections, and confirmation emails
- Committee information and Burhani Qardan Hasana forms

## Tech stack

- React 18 and TypeScript
- Vite 6
- Ant Design, React Bootstrap, and styled-components
- Firebase Authentication, Firestore, and callable Functions
- Netlify

## Local development

### Requirements

- Node.js 20 (see `.nvmrc`)
- npm
- Development Firebase configuration from a project maintainer

### Setup

```shell
git clone https://github.com/sdjamaat/website.git
cd website
npm ci
```

Create `.env.development` in the repository root:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_ENCRYPTION_TYPE=
VITE_ENCRYPTION_SECRET=
VITE_ARE_NEW_USERS_DISABLED=false
```

`VITE_MAPBOX_TOKEN` is only needed when working on the currently unmounted Markaz map component.

Do not commit environment files. Variables prefixed with `VITE_` are bundled into the browser application, so they must not contain server-side secrets.

Start the development server:

```shell
npm run dev
```

Open <http://localhost:8000>.

## Available scripts

| Command           | Purpose                                                               |
| ----------------- | --------------------------------------------------------------------- |
| `npm run dev`     | Start the Vite development server on port 8000                        |
| `npm run build`   | Type-check and create a production build in `dist/`                   |
| `npm run preview` | Preview the production build locally                                  |
| `npm run format`  | Format JavaScript, TypeScript, JSON, and Markdown files with Prettier |

Run `npm run build` before opening a pull request to catch TypeScript and production-build errors.

## Project structure

```text
src/
  components/       Shared UI plus home, dashboard, FMB, profile, and committee features
  pages/            Route-level pages
  provider/         Authentication, database, and date contexts
  lib/firebase.ts   Firebase client initialization
  functions/        Client-side helpers (not deployed Firebase Functions)
```

The deployed Firebase Functions used by this site are maintained in the [`sdjamaat/admin`](https://github.com/sdjamaat/admin) repository under `functions/`.

## Deployment

Netlify builds and deploys pushes to `main` using `netlify.toml`. The production build output is `dist/`, and the catch-all redirect in that file supports client-side routing. The `Track Netlify Deploy` GitHub Actions workflow waits for the matching Netlify deploy and reports whether it succeeded.

## Project access

Ask a project maintainer for access to the development Firebase project or other team-owned services.
