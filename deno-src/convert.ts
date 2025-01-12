// deno-lint-ignore-file
import sharp from 'sharp';

/**
 * Convert image to another format
 * This is a direct conversion, expecting sharp to figure out the conversion based on output file extension
 * Both paths should be absolute paths
 * @param inputPath - The path to the input file
 * @param outputPath - The path to the output file
 */
export function convert(inputPath: string, outputPath: string) {
	if (!Deno.statSync(inputPath).isFile) {
		throw new Error('Input path is not a file');
	}
	return sharp(inputPath).toFile(outputPath);
}
