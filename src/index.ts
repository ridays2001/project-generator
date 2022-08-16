#!/usr/bin/env node

import inquirer from 'inquirer';
import { readdirSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import url from 'node:url';
import copyDir from './copyDir.js';
import ora from 'ora';
import shell from 'shelljs';

if (!process.stdin.isTTY) {
	console.log('This terminal does not support interactivity. Please use a different terminal.');
	process.exit(1);
}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const choices = readdirSync(join(__dirname, '../templates'));

const CURRENT_DIR = process.cwd();

inquirer
	.prompt([
		{
			name: 'template',
			type: 'list',
			message: 'Which project would you like to generate?',
			choices
		},
		{
			name: 'name',
			type: 'input',
			message: 'What should be the name of this newly generated project?',
			validate: function (input) {
				if (/^([a-z\-\d])+$/.test(input)) return true;
				return 'Project name may only include lowercase letters, numbers, and dashes.';
			}
		}
	])
	.then(answers => {
		const { template, name } = answers;
		const templatePath = join(__dirname, '../templates', template);

		const folder = ora({
			text: `Creating a new ${name} folder...`,
			spinner: 'dots'
		});
		mkdirSync(`${CURRENT_DIR}/${name}`);
		folder.succeed(`Created a new ${name} folder.`);

		try {
			const copying = ora({
				text: 'Copying files...',
				spinner: 'dots'
			}).start();
			copyDir(templatePath, `${CURRENT_DIR}/${name}`);
			copying.succeed('Copied files.');

			const templateFiles = readdirSync(templatePath);
			if (templateFiles.includes('deps.json')) {
				const deps = JSON.parse(readFileSync(`${templatePath}/deps.json`, 'utf-8'));

				shell.cd(name);

				const dependencies = deps.deps.map(d => `${d}@latest`).join(' ');
				const d1 = ora({
					text: 'Installing project dependencies...',
					spinner: 'dots'
				}).start();

				shell.exec(`npm i ${dependencies}`, { silent: true });
				d1.succeed('Installed project dependencies.');

				const devDependencies = deps.dev.map(d => `${d}@latest`).join(' ');
				const d2 = ora({
					text: 'Installing developer dependencies...',
					spinner: 'dots'
				}).start();

				shell.exec(`npm i ${devDependencies}`, { silent: true });
				d2.succeed('Installed developer dependencies.');
			}

			shell.exec('git init');
		} catch (err) {
			const del = ora({
				text: 'Something went wrong. Deleting the directory now...',
				spinner: 'dots'
			}).start();
			shell.cd(CURRENT_DIR);
			shell.rm('-rf', name);
			del.stopAndPersist({
				symbol: '🗑️',
				text: 'Something went wrong. The folder has been deleted.'
			});
			console.error(err);
		}
	});
