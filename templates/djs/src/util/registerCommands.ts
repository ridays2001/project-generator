import { Client, REST, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';

function registerCommands(client: Client, body: Array<RESTPostAPIApplicationCommandsJSONBody>) {
	// Register the commands JSON using the REST API.
	const rest = new REST().setToken(client.token as string);

	if (process.env.DEV) {
		rest.put(Routes.applicationGuildCommands(client.user!.id, process.env.GUILD_ID!), { body })
			.then(() => logger.log('Successfully registered guild application commands.'))
			.catch(logger.err);
	} else {
		rest.put(Routes.applicationCommands(client.user!.id), { body })
			.then(() => logger.log('Successfully registered global application commands.'))
			.catch(logger.err);
	}
}

export default registerCommands;
