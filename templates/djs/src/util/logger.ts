import { DateTime } from 'luxon';

const getTs = (date = new Date()) => DateTime.fromJSDate(date).setZone('Asia/Kolkata').toFormat('LLL dd, HH:mm:ss');

const logger = {
	log: (...args) => console.log(`[${getTs()}]`, ...args),
	info: (...args) => console.info(`[${getTs()}]`, ...args),
	err: (...args) => console.error(`[${getTs()}]`, ...args),
	warn: (...args) => console.warn(`[${getTs()}]`, ...args)
};

global.logger = logger;

declare global {
	var logger: {
		log: (...args) => void;
		info: (...args) => void;
		err: (...args) => void;
		warn: (...args) => void;
	};
}

export default logger;
