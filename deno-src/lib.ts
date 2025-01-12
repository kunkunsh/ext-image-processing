// deno-fmt-ignore-file
// deno-lint-ignore-file
import { ExifDateTime } from 'exiftool-vendored';
import type { ImageMetadata } from '@hk/photographer-toolbox/types';
import { ImageMetadataMod } from '../src/types.ts';

export function convertDate(data: ImageMetadata): ImageMetadataMod {
	const dateKeys = [
		'DateTimeOriginal',
		'FileModifyDate',
		'ModifyDate',
		'CreateDate',
		'dateCreated',
		'dateModified'
	];
	for (const key of dateKeys) {
		if (data[key] && typeof data[key] !== 'string') {
			data[key] = (data[key] as ExifDateTime).toISOString();
		}
	}
	return data;
}
