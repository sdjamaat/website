## SD Jamaat Website

### Current tooling:

- GatsbyJS & React
- Ant Design UI and Bootstrap

### Local Development

Step 1: Clone the repository with Git

```shell
git clone https://github.com/sdjamaat/website.git sdjwebsite
cd sdjwebsite
```

Step 2: Download npm modules ([NodeJS](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/en/docs/install/)installation required)

```shell
yarn install
```

Step 3: Run locally on live server

```shell
npm run dev
# then navigate to localhost:8000
```

### Working with Firebase Functions

In this repository, there is a folder called `functions` which contains code related to Firebase cloud functions.

First, install the `firebase-tools` npm package globally

```shell
npm install -g firebase-tools
```

Then go into the `functions` directory. You will need to install dependencies here as well, however with `npm` this time instead of `yarn`

```shell
cd functions
npm install
```

To deploy new functions:

```shell
firebase deploy --only functions
```

...add more details here
