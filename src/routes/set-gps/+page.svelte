<script lang="ts">
	import { clipboard, notification, ui, toast, dialog, shell } from '@kksh/api/ui/iframe';
	import { ModeToggle, Command, ModeWatcher, Separator, Button, Input } from '@kksh/svelte5';
	import { ArrowLeftIcon } from 'lucide-svelte';
</script>

<div class="h-12"></div>
<Button variant="outline" size="icon" class="fixed left-2 top-2 z-50" onclick={ui.goBack}>
	<ArrowLeftIcon class="h-4 w-4" />
</Button>
