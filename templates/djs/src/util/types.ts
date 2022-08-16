import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
	name: string;
	slash: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommandGroup' | 'addSubcommand'>;
	exec: (interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>;
}

export interface MessageCommand {
	name: string;
	aliases: Array<string>;
	exec: (message: Message) => Promise<any>;
}
