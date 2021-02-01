const fetch = require('node-fetch');
const http = require('http');
const { EventEmitter } = require('events');

class Tracker extends EventEmitter {
	/**
	 * The tracker class. Will emit change event if anything changes.
	 * @param {any} path The path to fetch
	 * @param {any} fetchOptions The options for fetching
	 * @param {TrackerOptions} trackerOptions The options for this tracker
	 */
	constructor(path, fetchOptions, trackerOptions) {
		super();

		let { ratelimit = 1, exitOn404 = false } = trackerOptions;

		/**
		 * The Path to fetch
		 */
		this.path = path;

		/**
		 * Options to use for fetching
		 */
		this.fetchOptions = fetchOptions;

		/**
		 * The ratelimit at which to fetch
		 */
		this.ratelimit = ratelimit || 1;

		/**
		 * Exit on 404?
		 */
		this.exitOn404 = exitOn404 || false;

		this._data = new Map();
	}

	/**
	 * Fetches the path given when instantiated
	 * @returns Promise.
	 * @private Private function, not meant to be used.
	 */
	async _fetch() {
		let fet = await fetch(this.path, this.fetchOptions);
		let json = await fet.json();
		return {
			res: fet,
			json: json,
		};
	}

	/**
	 * Sleeps for the given no. of seconds.
	 * @param {Number} ms The number of milliseconds to wait for.
	 * @returns Promise
	 * @private Private function, not meant to be used.
	 */
	async _sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	/**
	 * The main function that keeps running.
	 * @private Private function, not meant to be used.
	 */
	async _main() {
		let oldData = this._data.get('key');
		if (oldData) {
			let fet = await this._fetch()
			if (fet.res.status === 200) {
				let newData = fet.json
				if(!oldData === newData) {
					this.emit('change', oldData, newData, this)
				}
			} else if (fet.res.status === 404) {
				let err = new Error('[ Tracker Error ] => 404 Not found');
				this.exitOn404 ? process.exit(1) : this.emit('error', err);
			} else {
				let err = new Error(
					`[ Tracker Error ] => ${fet.res.status} ${
						http.STATUS_CODES[fet.res.status]
					}`,
				);
				this.emit('error', err);
			}
		} else {
			let fet = await this._fetch();
			if (fet.res.status === 200) {
				let json = fet.json;
				this._data.set('key', json);
			} else if (fet.res.status === 404) {
                let err;
                err = new Error('[ Tracker Error ] => 404 Not found');
                this.exitOn404 ? process.exit(1) : this.emit('error', err);
            } else {
				let err = new Error(
					`[ Tracker Error ] => ${fet.res.status} ${
						http.STATUS_CODES[fet.res.status]
					}`,
				);
				this.emit('error', err);
			}
		}
		await this._sleep(1000 / this.ratelimit)
		this._main()
	}

	/**
	 * The Initializing function, it is important to run this.
	 */
	async init() {
		await this._main()
		this.emit('ready', this)
	}
}

module.exports = Tracker

/**
 * Tracker Options
 * @typedef TrackerOptions
 * @property {Number} [ratelimit=1] - Times per second that the tracker should check for change
 * @property {Boolean} [exitOn404=false] - Whether or not to exit when hitting route 404
 */

/**
 * Emitted when the tracker is ready.
 * @event Tracker#ready
 * @param {Tracker} tracker The tracker that is ready.
 */

/**
 * Emitted whenever the status code of fetched' result is not 200
 * @event Tracker#error
 * @param {Error} err The error created.
 */

/**
 * Emitted whenever a change is noticed in the fetched' result's json
 * @event Tracker#change
 * @param {any} oldData The old Data
 * @param {any} newData The new Data
 * @param {Tracker} tracker The tracker that detected change
 */
