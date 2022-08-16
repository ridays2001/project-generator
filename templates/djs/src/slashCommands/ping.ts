import { Message, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../util/types';

const slash = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pings the server to check bot latency!')
	.setDMPermission(false);

const PingCommand: SlashCommand = {
	name: 'ping',
	slash,
	exec: async interaction => {
		const m = (await interaction.reply({ content: 'Pinging...', ephemeral: true, fetchReply: true })) as Message;
		await interaction.editReply(
			`Pong!\nMy Speed: ${m.createdTimestamp - interaction.createdTimestamp}ms\nDiscord API Latency: ${
				interaction.client.ws.ping
			}ms`
		);
	}
};

export default PingCommand;
