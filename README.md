# Tia Moto – front

React (Create React App 4) front end for Tia Moto: motorbike stock, sales, invoices (Facture / BL) and cash register (Caisse).

## Requirements

- Node 16 (`nvm use 16`)
- yarn 1

## Setup

Create a `.env` file with the backend URL:

```sh
REACT_APP_BACKEND_URL=http://localhost:8000
```

Then:

```sh
yarn install
yarn start
```

## Scripts

| Command      | What it does                         |
| ------------ | ------------------------------------ |
| `yarn start` | Dev server on http://localhost:3000  |
| `yarn build` | Production build in `build/`         |
| `yarn lint`  | ESLint on `src/`                     |

## Project structure

```
src/
  pages/           One file per route (auth, dashboard, moto, caisse, landing, 404/500)
  sections/        Feature UI used by the pages
    auth/          Login, register, reset password and verify code forms
    caisse/        Balance, entry form and entry list
    dashboard/     Stock widgets, sales charts, sales details, moto table
    landing/       Public home page blocks
    moto/          Moto form, Facture, BL and their PDF templates (pdf/)
  components/      Shared building blocks (page wrapper, nav, carousel, animations...)
  layouts/         Dashboard, public and logo-only layouts
  redux/           Store and slices (moto, caisse)
  routes/          Route table and path constants
  contexts/        Auth (JWT), settings and sidebar state
  hooks/ utils/    Shared hooks and helpers
  theme/           MUI theme and component overrides
```
