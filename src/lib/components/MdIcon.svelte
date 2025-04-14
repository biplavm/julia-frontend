<script lang="ts">
	export let compact = false;
	export let short = compact;
	export let narrow = compact;
	export let align: 'start' | 'end' | 'none' = 'none';
	export let label = '';
	export let size: 'small' | 'medium' | 'large' | `${number}` = 'medium';
	export let color = 'currentColor';
	export let rotate: `${number}` | number | 'clockwise' | 'counterclockwise' = '0';
	export let rotationPeriod: `${number}` = '1';

	let fontSize = 24;

	$: switch (size) {
		case 'small':
			fontSize = 8;
			break;
		case 'medium':
			fontSize = 12;
			break;
		case 'large':
			fontSize = 18;
			break;
		default:
			fontSize = Number(size) || fontSize;
			break;
	}
</script>

{#if label}
	<span
		class="md-icon"
		class:short
		class:narrow
		class:compact
		class:align-start={align === 'start'}
		class:align-end={align === 'end'}
		class:rotate-clockwise={rotate === 'clockwise'}
		class:rotate-counterclockwise={rotate === 'counterclockwise'}
		style:--md-icon-rotate="{Number(rotate) || 0}deg"
		style:--md-icon-rotation-period="{Number(rotationPeriod) || 1}s"
		style:--md-icon-font-size="{(fontSize / 10).toFixed(1)}rem"
		style:--md-icon-padding="{(fontSize / 30).toFixed(1)}rem"
		style:--md-icon-color={color}
		aria-hidden="true"
		aria-label={label}
		data-nosnippet
	>
		<slot />
	</span>
{:else}
	<span
		class="md-icon"
		class:short
		class:narrow
		class:compact
		class:align-start={align === 'start'}
		class:align-end={align === 'end'}
		class:rotate-clockwise={rotate === 'clockwise'}
		class:rotate-counterclockwise={rotate === 'counterclockwise'}
		style:--md-icon-rotate="{Number(rotate) || 0}deg"
		style:--md-icon-rotation-period="{Number(rotationPeriod) || 1}s"
		style:--md-icon-font-size="{(fontSize / 10).toFixed(1)}rem"
		style:--md-icon-padding="{(fontSize / 30).toFixed(1)}rem"
		style:--md-icon-color={color}
		aria-hidden="true"
		data-nosnippet
	>
		<slot />
	</span>
{/if}

<style>
	.md-icon {
		display: inline-flex;
		font-family: 'Material Symbols Outlined';
		font-size: var(--md-icon-font-size);
		line-height: 1;
		min-width: calc(calc(var(--md-icon-padding) * 2) + var(--md-icon-font-size));
		min-height: calc(calc(var(--md-icon-padding) * 2) + var(--md-icon-font-size));
		padding: var(--md-icon-padding);
		align-items: center;
		justify-content: center;
		color: var(--md-icon-color);
		transform: rotate(var(--md-icon-rotate));
		flex: 0 0 auto;
		vertical-align: calc(var(--md-icon-padding) / -4);
	}

	.align-start {
		margin-inline-start: calc(-1 * var(--md-icon-padding));
	}

	.align-end {
		margin-inline-end: calc(-1 * var(--md-icon-padding));
	}

	.short,
	.compact {
		margin-block: calc(-1 * var(--md-icon-padding));
	}

	.narrow,
	.compact {
		margin-inline: calc(-1 * var(--md-icon-padding));
	}

	.rotate-clockwise {
		animation: rotate-clockwise var(--md-icon-rotation-period) linear infinite;
	}

	.rotate-counterclockwise {
		animation: rotate-counterclockwise var(--md-icon-rotation-period) linear infinite;
	}

	@keyframes rotate-clockwise {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes rotate-counterclockwise {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
</style>
