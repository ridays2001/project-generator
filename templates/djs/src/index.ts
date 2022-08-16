import env from './tests/env';
import logger from './util/logger';
import client, { start } from './client';

// Configure the environment variables from the .env file.
require('dotenv').config();

// Test the environment to see if the necessary variables are present.
env();

// Start the bot.
start();

process.on('uncaughtException', logger.err).on('unhandledRejection', logger.err).on('warning', logger.warn);

client
	.on('shardDisconnect', () => logger.log('[DISCONNECTED]'))
	.on('shardReconnecting', () => logger.log('[RECONNECTING]'))
	.on('error', logger.err)
	.on('warn', logger.warn);
