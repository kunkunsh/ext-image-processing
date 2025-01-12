// deno-lint-ignore-file
import sharp from 'sharp';
import * as v from 'valibot';

export function compressToJpeg(inputPath: string, outputPath: string, quality: number) {
	// verify with valibot that quality is between 0 and 100
	const validatedQuality = v.pipe(v.number(), v.minValue(0), v.maxValue(100));
	const parsedQuality = v.safeParse(validatedQuality, quality);
	if (!parsedQuality.success) {
		throw new Error('Invalid quality');
	}
	return sharp(inputPath).jpeg({ quality: parsedQuality.output }).toFile(outputPath);
}
