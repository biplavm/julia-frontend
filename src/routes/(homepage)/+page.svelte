<script lang="ts">
	import MdIcon from '$lib/components/MdIcon.svelte';
	import { goto } from '$app/navigation';

	let query = '';

	const handleSubmit = async () => {
		if (query.trim()) {
			return goto(`/company?query=${encodeURIComponent(query)}`);
		}
	};
</script>

<div class="container">
	<div class="welcome-info">
		<img src="./images/julia.png" alt="Julia" width="200" height="200" />
		<h1>Hi, Julia here</h1>

		<h2>Can I help you with anything?</h2>
		<p>
			Ready to assist you with anything you need, from answering questions about subcontractors to
			providing recommendations. Let's get started!
		</p>
	</div>

	<form class="input-container" on:submit|preventDefault={handleSubmit}>
		<input type="text" bind:value={query} placeholder="Ask me anything about subcontractors..." />
		<button type="submit">
			<MdIcon>send</MdIcon>
		</button>
	</form>
</div>

<style>
	h1 {
		font-size: 32px;
		font-weight: 600;
	}

	h2 {
		font-size: 24px;
		font-weight: 500;
	}
	p {
		font-size: 16px;
	}

	.container {
		min-height: 80vh;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.welcome-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: center;
		max-width: 600px;
		height: 100%;
		align-items: center;
		justify-content: center;
	}

	.input-container {
		display: flex;
		border-radius: 1.6rem;
		border: 1px solid #e0e0e0;
		overflow: hidden;
		padding: 4px;
		margin-top: 32px;
		min-width: 600px;
	}

	input[type='text'] {
		width: 100%;
		max-width: 800px;
		height: 50px;
		border-radius: 8px;
		border: none;
		padding: 0 16px;
		font-size: 16px;
	}
</style>
