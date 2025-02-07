import { image } from '@hk/photographer-toolbox';
import { type FormatEnum } from 'sharp';
import type { ImageMetadata } from '@hk/photographer-toolbox/types';

export type ImageMetadataMod = ImageMetadata & {
	DateTimeOriginal?: string;
	FileModifyDate?: string;
	ModifyDate?: string;
	CreateDate?: string;
	dateCreated?: string;
	dateModified?: string;
};

export type API = {
	echo: (paths: string[]) => Promise<string[]>;
	readImageMetadata: (imagePath: string) => Promise<ImageMetadataMod>;
	batchReadImageMetadata: (imagePaths: string[]) => Promise<ImageMetadataMod[]>;
	batchSmartSetImageOriginalDate: (
		imagePaths: string[],
		baseImagePath: string,
		targetDateIso: string
	) => Promise<void>;
	compressImage: (
		imagePath: string,
		format: keyof FormatEnum,
		quality: number,
		outputPath: string
	) => Promise<void>;
};
