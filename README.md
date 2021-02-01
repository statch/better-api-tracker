# Better API Tracker

Track an API contantly to look for changes in the result

## Menu

-   [Getting Started](#getting-started)
    -   [JavaScript](#javascript)
    -   [TypeScript](#typescript)

## Getting Started

Instantiate the "Tracker" class

### JavaScript

```js
const { Tracker } = require('better-api-tracker');

let that = new Tracker(
	'https://domain.invalid',
	{},
	{
		ratelimit: 0.1, // Fetch 0.1 times every second (1 time every 10 seconds)
		exitOn404: true, //If 404 is hit, then process.exit()
	},
);

that.init();
that.on('ready', (tracker) => {
	console.log(
		`[ Tracker Ready ] => Tracker is ready with ratelimit of ${
			tracker.ratelimit
		} and ${
			tracker.exitOn404
				? 'Will exit on 404 route'
				: 'Will just error on 404 route'
		}`,
	);
});

that.on('error', (error) => {
	console.error(error);
});

that.on('change', (oldData, newData, tracker) => {
	//TODO: Do something with oldData and newData
	console.log(`[ Tracker Change ] => Change detected on ${tracker.path}`);
});
```

### TypeScript

```ts
import { Tracker } from 'better-api-tracker';

let that = new Tracker(
	'https://domain.invalid',
	{},
	{
		ratelimit: 0.1, // Fetch 0.1 times every second (1 time every 10 seconds)
		exitOn404: true, //If 404 is hit, then process.exit()
	},
);

that.init();
that.on('ready', (tracker: Tracker) => {
	console.log(
		`[ Tracker Ready ] => Tracker is ready with ratelimit of ${
			tracker.ratelimit
		} and ${
			tracker.exitOn404
				? 'Will exit on 404 route'
				: 'Will just error on 404 route'
		}`,
	);
});

that.on('error', (error: Error) => {
	console.error(error);
});

that.on('change', (oldData: any, newData: any, tracker: Tracker) => {
	//TODO: Do something with oldData and newData
	console.log(`[ Tracker Change ] => Change detected on ${tracker.path}`);
});
```
