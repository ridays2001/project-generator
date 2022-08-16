import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';

function copyDir(templatePath: string, newPath: string) {
	const files = readdirSync(templatePath);

	files.forEach(item => {
		const filePath = `${templatePath}/${item}`;
		const stats = statSync(filePath);
		if (stats.isFile()) {
			if (item === 'deps.json') return undefined;

			const contents = readFileSync(filePath, 'utf-8');
			if (item === '.npmignore') item = '.gitignore';
			writeFileSync(`${newPath}/${item}`, contents, { encoding: 'utf-8' });
		} else if (stats.isDirectory()) {
			mkdirSync(`${newPath}/${item}`);
			copyDir(`${templatePath}/${item}`, `${newPath}/${item}`);
		}
	});
}

export default copyDir;
