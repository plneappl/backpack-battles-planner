# Backpack battles planner

## Getting Started

### Install Node.js

Using some kind of node version manager, install LTS:

```bash
nvm install lts
nvm use lts
```

### Install dependencies

Using NPM, install dependencies:

```bash
npm install
```

### Assets

Running the planner requires assets from the game/presskit. You can find the presskit here: (Presskit on github.io)[https://playwithfurcifer.github.io/backpack-battles-presskit/].
Extract it to `/public`, so that it contains at least `Background/Shop.jpg` and the whole folder `Items/`. Keep the other files, too, in case more assets are used in the future! Structure should be something like:
```
root
│   README.md
│   ...
│                   
├───public
│   │   
│   ├───Background
│   │       Shop.jpg
│   │       
│   └───Items
│           AceofSpades.png
│           AcornCollar.png
│           ...
│
└───src
    └───app
            Board.tsx
            ...
```

### Running

```bash
npx next dev
```

## Deployment

### Static

Uncomment `output: 'export'` from `next.config.js`, then run 

```bash
npx next build
```
