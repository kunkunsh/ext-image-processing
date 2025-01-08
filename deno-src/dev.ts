import { ExifTool, ExifDateTime } from 'exiftool-vendored';
// import { image } from '@hk/photographer-toolbox';

// import { convertDate } from './lib.ts';
// import { batchReadImageMetadata, readImageMetadata2 } from './lib.ts';

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
							DateTimeOriginal: newDate,
							CreateDate: newDate,
							ModifyDate: newDate
						},
						['-overwrite_original']
					);
				})
			).then(() => Promise.resolve());
		})
		.finally(() => loader.end());
}

const files = [
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2512.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2510.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2507.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2506.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2504.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2505.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2503.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2502.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2501.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2499.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2500.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2497.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2498.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2496.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2495.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2494.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2491.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2492.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2493.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2490.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2489.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2488.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2487.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2485.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2486.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2484.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2483.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2482.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2481.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2480.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2479.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2473.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2469.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2465.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2463.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2464.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2461.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2462.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2459.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2460.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2458.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2457.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2456.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2454.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2453.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2451.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2447.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2446.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2439.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2440.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2437.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2435.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2436.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2430.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2428.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2427.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2423.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2424.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2425.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2422.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2420.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2418.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2417.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2415.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2411.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2412.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2410.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2409.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2407.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2404.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2402.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2403.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2401.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2400.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2399.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2396.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2397.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2394.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2395.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2392.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2393.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2390.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2387.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2386.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2382.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2383.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2384.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2385.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2380.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2376.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2375.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2374.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2372.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2370.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2371.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2368.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2369.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2364.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2365.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2366.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2367.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2362.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2363.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2360.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2361.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2358.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2359.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2355.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2356.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2357.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2354.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2352.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2353.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2351.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2348.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2346.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2347.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2340.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2339.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2338.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2336.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2337.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2334.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2335.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2331.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2329.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2327.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2326.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2324.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2323.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2322.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2320.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2317.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2316.ARW',
	'/Users/hk/Pictures/2024-Vancouver/11-27/_DSC2314.ARW'
];

batchSmartSetImageOriginalDate(files, files[0], ExifDateTime.from('2024-11-27T15:00:00.000Z'))
	.then(console.log)
	.catch(console.error);
// image.batchReadImageMetadata(files).then((xs) => {
// 	for (const x of xs) {
// 		console.log(convertDate(x));
// 		// console.log(x);
// 	}
// 	// console.log(xs.map(convertDate));
// });

//
// readImageMetadata2(files[4]).then(console.log);
// for (const promise of files.map(readImageMetadata2)) {
// 	promise.then(console.log);
// }
// await new Promise((resolve) => setTimeout(resolve, 1000));
// batchReadImageMetadata(files).then(console.log);
// files.forEach(async (file) => {
// 	console.log('file', file);
// 	const metadata = await image.readImageMetadata(file);
// 	console.log('metadata', metadata);
// });
// image
// 	.readImageMetadata(files[4])
// 	.then(console.log);
