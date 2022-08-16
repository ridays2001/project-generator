import { Interaction } from 'discord.js';

function interactionCreate(interaction: Interaction) {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.slashCommands.get(interaction.commandName);
		if (command && interaction.inCachedGuild()) return command.exec(interaction);
	}
}

export default interactionCreate;
