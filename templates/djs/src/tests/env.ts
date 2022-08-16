const vars = ['TOKEN', 'PREFIX'];
function env() {
	vars.forEach(v => {
		if (!process.env[v]) {
			logger.err('Missing Environment Variable - ', v);
			process.exit(1);
		}
	});

	if (parseInt(process.env.DEV, 10)) {
		logger.log('Starting in Dev mode...');
		if (!process.env.GUILD_ID) {
			logger.err('Please add the GUILD_ID environment variable to run in Dev mode!');
			process.exit(1);
		}
	}
}

export default env;

// Add types to env variables.
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			TOKEN: string;
			PREFIX: string;

			DEV?: string;
			GUILD_ID?: string;
		}
	}
}
