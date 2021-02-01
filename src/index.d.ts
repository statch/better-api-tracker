declare module 'better-api-tracker' {
	import EventEmitter from 'events';

	export class Tracker extends EventEmitter {
		public constructor(
			path: any,
			fetchOptions: any,
			trackerOptions: TrackerOptions,
        );
        public path: any;
        public fetchOptions: any;
        public ratelimit: number;
        public exitOn404: boolean;
		public init(): Promise<void>;
		public on(event: 'ready', listener: (trakcer: Tracker) => any): this;
		public on(event: 'error', listener: (error: Error) => any): this;
		public on(
			event: 'change',
			listener: (
				oldData: any,
				newData: any,
				tracker: Tracker,
			) => any,
		): this;
	}

	export interface TrackerOptions {
		ratelimit?: number;
		exitOn404?: boolean;
	}
}
