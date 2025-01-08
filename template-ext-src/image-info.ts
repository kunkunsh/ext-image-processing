import { ImageMetadata } from '@hk/photographer-toolbox/types';
import type { API } from '../src/types.ts';
import {
	Action,
	app,
	Child,
	clipboard,
	expose,
	Form,
	fs,
	Icon,
	IconEnum,
	List,
	path,
	shell,
	system,
	toast,
	ui,
	WorkerExtension
} from '@kksh/api/ui/worker';

class ImageInfo extends WorkerExtension {
	api: API | undefined;
	apiProcess: Child | undefined;
	imageMetadata: Record<string, ImageMetadata> = {};

	async fillApi() {
		if (this.api) return;
		const { rpcChannel, process, command } = await shell.createDenoRpcChannel<object, API>(
			'$EXTENSION/deno-src/index.ts',
			[],
			{
				allowAllEnv: true,
				// allowEnv: ['NODE_V8_COVERAGE', 'npm_package_config_libvips', 'EXIFTOOL_HOME', 'OSTYPE'],
				// allowFfi: ["*sharp-darwin-arm64.node"],
				allowAllFfi: true,
				allowAllRead: true,
				allowAllSys: true,
				// allowSys: ['uid', 'cpus'],
				// allowRun: ["*exiftool"]
				allowAllRun: true
			},
			{}
		);
		command.stdout.on('data', (data) => {
			console.log('stdout', data);
		});
		// command.stderr.on('data', (data) => {
		// 	console.warn('stderr', data);
		// });
		this.api = rpcChannel.getAPI();
		this.apiProcess = process;
	}

	async refreshList(paths: string[]) {
		ui.render(new List.List({ items: [] }));
		if (!this.api) await this.fillApi();
		ui.showLoadingBar(true);
		return this.api
			?.batchReadImageMetadata(paths)
			.then((metadata) => {
				console.log('metadata 2', metadata);
				this.imageMetadata = Object.fromEntries(
					paths.map((file, index) => [file, metadata[index]])
				);
			})
			.then(async () => {
				return ui.render(
					new List.List({
						detail: new List.ItemDetail({
							width: 60,
							children: []
						}),
						items: await Promise.all(
							paths.map(async (file) => {
								const baseName = await path.basename(file);
								return new List.Item({
									title: baseName,
									value: file
								});
							})
						)
					})
				);
			})
			.catch((err) => {
				console.error('error refreshList', err);
			})
			.finally(() => {
				ui.showLoadingBar(false);
				console.log('finally, kill api process', this.apiProcess?.pid);
				this.apiProcess?.kill();
				this.apiProcess = undefined;
				this.api = undefined;
			});
	}

	async load() {
		ui.showLoadingBar(true);
		let imagePaths = (
			await Promise.all([
				system.getSelectedFilesInFileExplorer().catch((err) => {
					return [];
				}),
				clipboard.hasFiles().then((hasFiles) => {
					if (hasFiles) return clipboard.readFiles();
					return [];
				})
			])
		).flat();
		imagePaths = imagePaths.filter((path) => !!path);
		this.refreshList(imagePaths);
	}

	async onFilesDropped(paths: string[]): Promise<void> {
		return this.refreshList(paths);
	}

	async onHighlightedListItemChanged(filePath: string): Promise<void> {
		const metadata = this.imageMetadata[filePath];
		const metadataLabels = [
			genMetadataLabel(metadata, 'Width', 'width'),
			genMetadataLabel(metadata, 'Height', 'height'),
			genMetadataLabel(metadata, 'Latitude', 'latitude'),
			genMetadataLabel(metadata, 'LatitudeRef', 'latitudeRef'),
			genMetadataLabel(metadata, 'Longitude', 'longitude'),
			genMetadataLabel(metadata, 'LongitudeRef', 'longitudeRef'),
			genMetadataLabel(metadata, 'Altitude', 'altitude'),
			genMetadataLabel(metadata, 'AltitudeRef', 'altitudeRef'),
			genMetadataLabel(metadata, 'MapDatum', 'mapDatum'),
			genMetadataLabel(metadata, 'Bits Per Sample', 'bitsPerSample'),
			genMetadataLabel(metadata, 'File Size', 'fileSize'),
			genMetadataLabel(metadata, 'Make', 'make'),
			genMetadataLabel(metadata, 'Model', 'model'),
			genMetadataLabel(metadata, 'Date Modified', 'dateModified'),
			genMetadataLabel(metadata, 'Focal Length', 'focalLength'),
			genMetadataLabel(metadata, 'Focal Length in 35mm Format', 'focalLengthIn35mmFormat'),
			genMetadataLabel(metadata, 'F Number', 'fNumber'),
			genMetadataLabel(metadata, 'Exposure Time', 'exposureTime'),
			genMetadataLabel(metadata, 'Exposure Mode', 'exposureMode'),
			genMetadataLabel(metadata, 'Exposure Program', 'exposureProgram'),
			genMetadataLabel(metadata, 'Date Time Original', 'DateTimeOriginal'),
			genMetadataLabel(metadata, 'File Modify Date', 'FileModifyDate'),
			genMetadataLabel(metadata, 'Modify Date', 'ModifyDate'),
			genMetadataLabel(metadata, 'Create Date', 'CreateDate'),
			genMetadataLabel(metadata, 'File Format', 'FileFormat'),
			genMetadataLabel(metadata, 'Quality', 'Quality'),
			genMetadataLabel(metadata, 'RAW File Type', 'RAWFileType'),
			genMetadataLabel(metadata, 'Compression', 'Compression'),
			genMetadataLabel(metadata, 'Camera Orientation', 'CameraOrientation'),
			genMetadataLabel(metadata, 'Faces Detected', 'FacesDetected')
		].filter((label) => label !== null);
		return ui.render(
			new List.List({
				inherits: ['items'],
				detail: new List.ItemDetail({
					width: 55,
					children: [new List.ItemDetailMetadata(metadataLabels)]
				})
			})
		);
	}

	async onBeforeGoBack(): Promise<void> {
		console.log('onBeforeGoBack, kill api process', this.apiProcess?.pid);
		await this.apiProcess?.kill();
	}

	async onListItemSelected(value: string): Promise<void> {
		return Promise.resolve();
	}
}

function genMetadataLabel(metadata: ImageMetadata, title: string, key: string) {
	if (!metadata[key]) return null;
	return new List.ItemDetailMetadataLabel({
		title,
		text:
			typeof metadata[key] === 'number'
				? Number.isInteger(metadata[key])
					? metadata[key].toString()
					: metadata[key].toFixed(3).toString()
				: metadata[key].toString()
	});
}

expose(new ImageInfo());
