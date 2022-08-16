import { MessageCommand } from '../util/types';

const Ping: MessageCommand = {
	name: 'ping',
	aliases: ['ping', 'beep'],
	exec: async message => {
		const m = await message.channel.send({
			content: 'Pinging...',
			reply: { messageReference: message },
			allowedMentions: { repliedUser: false }
		});

		const t2 = m.editedTimestamp || m.createdTimestamp;
		const t1 = message.editedTimestamp || message.createdTimestamp;

		return m
			.edit({
				content: [
					'Pong!',
					`My speed: ${Math.round(t2 - t1)}ms`,
					`Discord API latency: ${Math.round(message.client.ws.ping)}ms`
				].join('\n'),
				allowedMentions: { repliedUser: false }
			})
			.catch(() => undefined);
	}
};

export default Ping;
