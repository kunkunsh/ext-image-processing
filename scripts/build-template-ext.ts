import { watch } from 'fs';
import { join } from 'path';
import { refreshTemplateWorkerExtension } from '@kksh/api/dev';
import { $ } from 'bun';

const entrypoints = ['./template-ext-src/image-info.ts'];

async function build() {
	try {
		// for (const entrypoint of entrypoints) {
		// 	await $`bun build --minify --target=browser --outdir=./dist ${entrypoint}`;
		// }
		await Bun.build({
			entrypoints,
			target: 'browser',
			outdir: './dist',
			minify: false
		});
		// const distFile = join(import.meta.dir, '..', 'dist', 'image-info.js');
		// console.log(distFile);
		// await $`cp ${distFile} "/Users/hk/Library/Application Support/sh.kunkun.desktop/extensions/image-processing/dist/image-info.js"`;
		if (Bun.argv.includes('dev')) {
			await refreshTemplateWorkerExtension();
		}
	} catch (error) {
		console.error(error);
	}
}

const srcDir = join(import.meta.dir, '..', 'template-ext-src');

await build();

if (Bun.argv.includes('dev')) {
	console.log(`Watching ${srcDir} for changes...`);
	watch(srcDir, { recursive: true }, async (event, filename) => {
		await build();
	});
}
