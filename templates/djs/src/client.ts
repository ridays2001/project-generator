import { Client, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import interactionCreate from './listeners/interactionCreate';
import messageCreate from './listeners/messageCreate';
import registerCommands from './util/registerCommands';
import { MessageCommand, SlashCommand } from './util/types';

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.on('interactionCreate', interactionCreate);
client.on('messageCreate', messageCreate);

export async function start() {
	client.slashCommands = getFiles('./slashCommands');
	client.messageCommands = getFiles('./messageCommands');
	client.prefix = process.env.PREFIX;

	await client.login(process.env.TOKEN).then(() => logger.log('Logged in successfully.'));

	// Register slash commands if there is a command line argument.
	if (process.argv.slice(2)[0] === 'slash') {
		const body = Array.from(client.slashCommands.values()).map(c => c.slash.toJSON());
		registerCommands(client, body);
	}
}

export default client;

function getFiles(path: string) {
	const map = new Map();
	const folder = join(__dirname, path);
	const files = readdirSync(folder).filter(f => f.endsWith('.js'));
	for (const file of files) {
		const command = require(join(folder, file)).default;
		if (command.aliases) {
			for (const a of command.aliases) {
				if (map.has(a)) {
					logger.err('Duplicate alias - ', a);
					process.exit(1);
				}

				map.set(a, command);
			}
		} else {
			map.set(command.name, command);
		}
	}
	return map;
}

declare module 'discord.js' {
	interface Client {
		prefix: string;

		slashCommands: Map<string, SlashCommand>;
		messageCommands: Map<string, MessageCommand>;
	}
}
