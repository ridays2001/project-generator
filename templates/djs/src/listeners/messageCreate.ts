import { Message } from 'discord.js';

async function messageCreate(message: Message) {
	// If the message is partial, ignore it.
	if (message.partial) return undefined;

	// Ignore messages by other bots.
	if (message.author.bot) return undefined;

	// Put all characters in [] to adjust characters with special meaning.
	const prefix = message.client.prefix
		.split('')
		.map(e => `[${e}]`)
		.join('');

	const regex = new RegExp(`^(<@!?${message.client.user!.id}>|${prefix})`, 'i');

	const content = message.content.trim();
	if (!regex.test(content)) return undefined;

	const commandName = content.replace(regex, '').trim().split(' ')[0];
	const command = message.client.messageCommands.get(commandName);
	if (command) command.exec(message);
}

export default messageCreate;
