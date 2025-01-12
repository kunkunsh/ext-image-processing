import type { API } from '../src/types.ts';
import { expose } from '@kunkun/api/runtime/deno';
import { image } from '@hk/photographer-toolbox';
import { convertDate } from './lib.ts';
import { ExifDateTime, ExifTool } from 'exiftool-vendored';

export function batchSmartSetImageOriginalDate(
	imagePaths: string[],
	baseImagePath: string,
	targetDate: ExifDateTime
) {
	// Read metadata for all images
	const loader = new ExifTool();

	return loader
		.read(baseImagePath)
		.then(async (baseTags) => {
			const baseOriginalDate = baseTags.DateTimeOriginal;
			if (!baseOriginalDate) {
				throw new Error('Base image has no DateTimeOriginal');
			}

			// Calculate offset between target and base dates
			const targetMillis = targetDate.toMillis();
			const baseMillis = ExifDateTime.from(baseOriginalDate)!.toMillis();
			const offsetMillis = targetMillis - baseMillis;

			// Read all image tags
			const allTags = await Promise.all(imagePaths.map((path) => loader.read(path)));

			// Update each image with offset-adjusted date
			return Promise.all(
				allTags.map((tags, i) => {
					const originalDate = tags.DateTimeOriginal;
					if (!originalDate) {
						throw new Error(`Image ${imagePaths[i]} has no DateTimeOriginal`);
					}

					const imageMillis = ExifDateTime.from(originalDate)!.toMillis();
					const newMillis = imageMillis + offsetMillis;
					const newDate = ExifDateTime.fromMillis(newMillis);

					//   return setImageOriginalDate(imagePaths[i], newDate);
					return loader.write(
						imagePaths[i],
						{
							DateTimeOriginal: newDate
						},
						['-overwrite_original']
					);
				})
			).then(() => Promise.resolve());
		})
		.finally(() => loader.end());
}

expose({
	echo: (paths: string[]) => Promise.resolve(paths),
	readImageMetadata: (imagePath: string) => image.readImageMetadata(imagePath).then(convertDate),
	batchReadImageMetadata: async (paths: string[]) => {
		const data = await image.batchReadImageMetadata(paths);
		return data.map(convertDate);
	},
	batchSmartSetImageOriginalDate: (
		imagePaths: string[],
		baseImagePath: string,
		targetDateIso: string
	) => {
		return image
			.batchSmartSetImageOriginalDate(imagePaths, baseImagePath, ExifDateTime.from(targetDateIso))
			.then(() => Promise.resolve())
			.catch((err) => {
				console.error(err);
				throw new Error(err);
			});
	}
} satisfies API);
