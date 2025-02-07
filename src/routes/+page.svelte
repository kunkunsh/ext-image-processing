<script lang="ts">
	import { base } from '$app/paths';
	import { NodeName } from '@kksh/api/models';
	import { clipboard, notification, ui, toast, dialog, shell } from '@kksh/api/ui/custom';
	import {
		// Calendar,
		ModeToggle,
		Command,
		ModeWatcher,
		Separator,
		Button,
		Input
	} from '@kksh/svelte5';
	import { ArrowLeftIcon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { API } from '../types';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import Calendar from '$lib/components/calendar.svelte';
	let targetDate = $state(today(getLocalTimeZone()));
	let targetTime = $state(
		new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
	);
	let targetDateIso = $derived(new Date(`${targetDate}T${targetTime}`).toISOString());
	let images = $state<string[]>([]);
	let baseImagePath = $state<string | null>(null);

	onMount(() => {
		toast.info('Loaded');
	});

	function pickImages() {
		dialog
			.open({
				multiple: true,
				directory: false
			})
			.then((files: string[]) => {
				images = files;
			});
	}

	async function submit() {
		console.log('submit', images, baseImagePath, targetDateIso);
		if (!baseImagePath) return;
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
		command.stderr.on('data', (data) => {
			console.warn(data);
		});
		try {
			const api = rpcChannel.getAPI();
			await api.batchSmartSetImageOriginalDate(images, baseImagePath, targetDateIso);
			toast.success('Images date set to ', { description: targetDateIso });
		} catch (error) {
			console.error(error);
			toast.error('Failed to set date');
		} finally {
			process.kill();
		}
	}

	$inspect(targetDateIso);
</script>

<svelte:window
	on:keydown={(e) => {
		if (e.key === 'Escape') {
			if (document.activeElement?.nodeName === 'BODY') {
				ui.goBack();
			}
		}
	}}
/>
<div class="h-12"></div>
<Button variant="outline" size="icon" class="fixed left-2 top-2 z-50" onclick={ui.goBack}>
	<ArrowLeftIcon class="h-4 w-4" />
</Button>
<div class="container">
	<div class="grid grid-cols-2">
		<div class="space-y-2">
			<Button onclick={pickImages} variant="outline">Pick Images</Button>
			<p>{images.length} Images Selected</p>
			<Button
				variant="outline"
				onclick={() => {
					dialog
						.open({
							multiple: false,
							directory: false
						})
						.then((p: string) => {
							baseImagePath = p;
						});
				}}>Pick Base Image</Button
			>
			{#if baseImagePath}
				<span>Base Image Selected</span>
			{/if}
			<br />
			<Button onclick={submit} variant="default">Submit</Button>
		</div>
		<div class="space-y-2">
			<Input type="time" bind:value={targetTime} />
			<div class="w-fit">
				<Calendar type="single" bind:value={targetDate} class="rounded-md border" />
				<pre>Target Date: {targetDate}</pre>
			</div>
		</div>
	</div>
</div>
