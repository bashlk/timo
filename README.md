# Timo
This repo contains several implementations of a sample web app called [Timo](https://www.frontendundefined.com/posts/monthly/sample-react-app/#meet-timo). 

## Overview
You can find each implementation of Timo as a separate npm package in the `packages` folder. The `common` package contains code that is shared across several implementations of Timo. The `react` package contains an implementation of Timo using React with no state management or data fetching libraries.

## Running Timo
This repo is setup using npm workspaces. To run Timo, you can install the dependencies by running `npm install` at the root folder and start the dev server for a specific implementation by running `npm run dev -w @timo/<package-name>`. For example, to run the plain React implementation of Timo, you can run `npm run dev -w @timo/react`.

## Demo
Each implementation of Timo is hosted online at `https://timo.frontendundefined.com/<package-name>/`. For example, to view the plain React implementation of Timo, you can go to [https://timo.frontendundefined.com/react/](https://timo.frontendundefined.com/react/) (The trailing slash at the end of the URL is required).

Each implementation of Timo is setup to use [Rollup Plugin Visualizer](https://github.com/btd/rollup-plugin-visualizer) to show an interactive breakdown of the final Javascript bundle. You can view this breakdown by going to `https://timo.frontendundefined.com/<package-name>/stats.html`. For example, to see the breakdown of the plain React implementation's JS bundle, you can go to [https://timo.frontendundefined.com/react/stats.html](https://timo.frontendundefined.com/react/stats.html).