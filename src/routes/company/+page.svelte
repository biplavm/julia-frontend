<script lang="ts" context="module">
	interface Text {
		subcontractors: Subcontractor[];
	}

	interface Subcontractor {
		id: string;
		phone: string;
		email: string;
		contact: string;
		company_name: string;
		location: {
			borough: string;
			address: string;
		};
		capabilities: string[];
		certifications: string[];
		yearsInBusiness: number;
		employeeCount: number;
		projectCapacity: string;
	}

	const bidPackages = [
		{ bid_package: 'Electrical Wiring Bid Package', project: 'Tech Campus Alpha' },
		{ bid_package: 'Concrete Foundation Bid Package', project: 'Highway Expansion Phase 2' },
		{ bid_package: 'Steel Structure Bid Package', project: 'Corporate HQ Tower' },
		{ bid_package: 'Roofing and Waterproofing', project: 'City Library Renovation' },
		{ bid_package: 'Interior Finishes Package', project: 'Downtown Retail Complex' },
		{ bid_package: 'Plumbing and Fixtures', project: 'Midtown Medical Center' },
		{ bid_package: 'HVAC Systems Bid Package', project: 'Green Energy Research Lab' },
		{ bid_package: 'Glass & Glazing', project: 'University Engineering Building' },
		{ bid_package: 'Sitework and Landscaping', project: 'Riverside Apartments' },
		{ bid_package: 'Elevator Installation Package', project: 'Central Business Complex' }
	];
</script>

<script lang="ts">
	import MdIcon from '$lib/components/MdIcon.svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let data;

	$: searchQuery = data.searchQuery;

	let isChatbotOpen = true;
	let chatbotSize: 'small' | 'large' = 'small';
	let selectedSubcontractors: Subcontractor[] = [];
	let message = '';
	let selectedEmailAddresses: string[] = [];
	let chatHistory = [];
	let isCompanyModalOpen = true;
	let selectedCompany: Subcontractor | null = null;
	let isEmailModalOpen = false;
	let isCallModalOpen = false;
	let selectedCallNumbers: Record<string, string>[] = [];
	let chatLoading = false;
	let showBidPackagePrompt = false;
	let isBidPackageModalOpen = false;
	let bidPackageStep: 'add' | 'find' = 'find';
	let bidPackageSearch = '';
	let selectedBidPackage: Record<string, string> | null = null;
	let senderEmail = '';
	let emailSubject = '';
	let emailBody = '';

	async function makePhoneCall() {
		try {
			const response = await fetch('http://24.144.88.94/make-call', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					to: '+923369009019',
					message: 'hello there!',
					callback_url: 'string'
				})
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			toast.success('Phone call initiated successfully!');
			isCallModalOpen = false;
		} catch (error) {
			toast.error('Error sending email');
		}
	}
	async function sendEmail() {
		try {
			const response = await fetch('http://24.144.88.94/send-email', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					to: [
						'danish@toughleaf.com',
						'biplav@toughleaf.com',
						'scott@toughleaf.com',
						'mac@toughleaf.com'
					],
					subject: emailSubject,
					body: emailBody
				})
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			toast.success('Email(s) sent successfully!');
			isEmailModalOpen = false;
		} catch (error) {
			toast.error('Error sending email');
		}
	}

	async function fetchSubcontractors(query: string): Promise<Text | null> {
		try {
			chatLoading = true;
			const response = await fetch('http://24.144.88.94/find-subcontractors', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: query,
					max_tokens: 150
				})
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data: Text = await response.json();

			return data; // Return the response data
		} catch (error) {
			console.error('Error fetching subcontractors:', error);
			return null; // Return null in case of an error
		}
	}

	function toggleChatbot() {
		isChatbotOpen = !isChatbotOpen;
	}

	function toggleChatbotSize() {
		chatbotSize = chatbotSize === 'small' ? 'large' : 'small';
	}

	function selectSubcontractor(sub: Subcontractor) {
		if (selectedSubcontractors.length > 0) {
			showBidPackagePrompt = true;
		} else {
			showBidPackagePrompt = false;
		}

		if (selectedSubcontractors.includes(sub)) {
			selectedSubcontractors = selectedSubcontractors.filter((s) => s !== sub);
		} else {
			selectedSubcontractors = [...selectedSubcontractors, sub];
		}
	}

	function handleKeypress(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			sendMessage();
		}
	}
	let showMessageIcon = false;

	const sendMessage = async () => {
		if (!message.trim()) return;

		// Push user message
		chatHistory = [...chatHistory, { sender: 'user', text: message }];

		const botResponse = await fetchSubcontractors(message);
		message = '';

		// Show message icon
		// Clear input
		setTimeout(() => {
			if (botResponse) {
				chatHistory = [...chatHistory, { sender: 'Julia', text: botResponse }];
			} else {
				chatHistory = [
					...chatHistory,
					{ sender: 'Julia', text: 'Sorry, I could not fetch the data.' }
				];
			}
			showMessageIcon = false;
			chatLoading = false;
		}, 2000);
	};

	onMount(() => {
		message = searchQuery;

		sendMessage();
	});
</script>

<div class="main">
	<div class="container">
		<div class="left">
			<h2>Recent Searches</h2>

			<div class="searches">
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
				<div class="search">
					<p>
						Any business that has a company name, capability, or commodity code matching "+Traffic
						Control" and is certified as WBE - CA or DBE - CA and is not in the La Vista Park
						project under Traffic Striping and Signage and Traffic Control and is located in
						California and is in or around the 94540 zip code within a 300 mile radius.
					</p>
					<MdIcon color="hsl(5, 90%, 54%)">delete</MdIcon>
				</div>
			</div>
		</div>
		<div class="right">
			<div class="right-top-container">
				<input type="text" placeholder="Search by capabilities and commodity codes" />
			</div>
			<ul>
				<li>Certification <MdIcon>chevron_forward</MdIcon></li>
				<li>Commodity Code <MdIcon>chevron_forward</MdIcon></li>
				<li>Location <MdIcon>chevron_forward</MdIcon></li>
				<li>Ethnicity <MdIcon>chevron_forward</MdIcon></li>
				<li>Revenue <MdIcon>chevron_forward</MdIcon></li>
				<li>Labor Type <MdIcon>chevron_forward</MdIcon></li>
				<li>Projects <MdIcon>chevron_forward</MdIcon></li>
				<li>Flags <MdIcon>chevron_forward</MdIcon></li>
				<li>Bookmarks <MdIcon>chevron_forward</MdIcon></li>
			</ul>
			<button>Search</button>
		</div>
	</div>
</div>

<footer>
	<p>© 2023 Tough Leaf. All rights reserved.</p>
	<p>Terms of Service | Privacy Policy</p>
</footer>

{#if !isChatbotOpen}
	<div class="chatbubble">
		<button on:click={toggleChatbot}>
			<img src="./images/julia.png" alt="Julia" width="100" height="100" />
		</button>
	</div>
{/if}

{#if isChatbotOpen}
	<div class="modal">
		<div
			class="chatbot"
			class:small={chatbotSize === 'small'}
			class:large={chatbotSize === 'large'}
		>
			<div class="chat-container" id="scroller">
				<div class="chatbot-info">
					<img src="./images/julia.png" alt="Julia" width="150" height="150" />
					<h2>Hello I'm Julia!</h2>
					<p>
						I'm your AI assistant, ready to help you find and connect with the best local
						businesses. What can I help you with today?
					</p>
				</div>

				<div class="chatlog">
					{#each chatHistory as msg}
						{#if msg.sender.toLowerCase() === 'julia'}
							<div class="message-container bot">
								<div class="avatar">
									<img src="./images/julia.png" alt="Julia" height="35" width="35" />
								</div>
								<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
									<div class="sender">
										{msg.sender}
									</div>
									{#if !msg.text.matches}
										<p>{msg.text.message}</p>
									{:else if msg.text.matches.length === 0}
										<p>Sorry, I couldn't find any matches for your request.</p>
									{:else}
										{@const subcontractors = msg.text.matches}
										<p>
											Here are {msg.text.matches.length} certified firms.
										</p>
										<div class="firm-list">
											{#each subcontractors as sub}
												<div class="firm">
													<input
														type="checkbox"
														checked={selectedSubcontractors.includes(sub)}
														on:click={() => selectSubcontractor(sub)}
													/>
													<h3>{sub.company_name}</h3>
													<div class="actions">
														<button
															on:click={() => {
																selectedCompany = sub;
																isCompanyModalOpen = true;
															}}
														>
															<MdIcon>visibility</MdIcon>
														</button>
														<button
															on:click={() => {
																selectedEmailAddresses = [sub.email];
																isEmailModalOpen = true;
															}}><MdIcon>mail</MdIcon></button
														>
														<button
															on:click={() => {
																selectedCallNumbers = [
																	{ company_name: sub.company_name, number: sub.number }
																];
																isCallModalOpen = true;
															}}><MdIcon>call</MdIcon></button
														>
													</div>
												</div>
											{/each}
											<div class="call-mail-action-buttons">
												<button
													on:click={() => {
														isEmailModalOpen = true;
														selectedEmailAddresses = selectedSubcontractors.map((sub) => sub.email);
													}}
													class="email-selected"
													disabled={!selectedSubcontractors.length}
													><MdIcon>email</MdIcon>Email Selected</button
												>
												<!-- <button
													on:click={() => {
														isCallModalOpen = true;
														selectedCallNumbers = selectedSubcontractors.map((sub) => ({
															company_name: sub.company_name,
															number: sub.phone
														}));
													}}
													class="email-selected"
													disabled={!selectedSubcontractors.length}
													><MdIcon>email</MdIcon>Call Selected</button
												> -->
											</div>
										</div>
									{/if}
								</div>
							</div>
						{:else}
							<div class="message-container user">
								<div class="avatar">
									<MdIcon>person</MdIcon>
								</div>

								<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
									<div class="sender">
										{msg.sender}
									</div>
									<div class="text">
										{msg.text}
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>

			{#if selectedSubcontractors.length && showBidPackagePrompt}
				<div class="add-to-package-prompt">
					<button class="add-to-bid-package" on:click={() => (isBidPackageModalOpen = true)}>
						Would you like to add these firms to a bid package?</button
					><button on:click={() => (showBidPackagePrompt = false)}><MdIcon>close</MdIcon></button>
				</div>
			{/if}
			<div class="input">
				{#if chatLoading}
					<span class="loader"></span>
				{:else}
					<input
						type="text"
						placeholder="Type your message here..."
						bind:value={message}
						on:keypress={handleKeypress}
					/>
					<button><MdIcon>mic</MdIcon></button>
					<button><MdIcon>send</MdIcon></button>
				{/if}
			</div>

			<div class="action-buttons">
				<button class="minimize" on:click={toggleChatbot}><MdIcon compact>minimize</MdIcon></button>
				<button on:click={toggleChatbotSize}><MdIcon compact>open_in_full</MdIcon></button>
			</div>
		</div>
	</div>
{/if}

{#if isCompanyModalOpen && selectedCompany}
	<div class="company-modal">
		<div class="company-info">
			<h2>{selectedCompany.company_name}</h2>
			<div class="subcontractor-info">
				<div class="info-container">
					<p class="label">Primary Contact Name</p>
					<p class="info">{selectedCompany.contact}</p>
				</div>
				<div class="info-container">
					<p class="label">Email</p>
					<p class="info">{selectedCompany.email}</p>
				</div>
				<div class="info-container">
					<p class="label">Phone</p>
					<p class="info">{selectedCompany.phone}</p>
				</div>
				<div class="info-container">
					<p class="label">Location</p>
					<p class="info">{selectedCompany.location.address}, {selectedCompany.location.borough}</p>
				</div>
				<div class="info-container">
					<p class="label">Capabilities</p>
					<div class="capability-list">
						{#each selectedCompany.capabilities as capability}
							<p class="info capability">{capability}</p>
						{/each}
					</div>
				</div>
				<div class="info-container">
					<p class="label">Years in Business</p>
					<p class="info">{selectedCompany.yearsInBusiness}</p>
				</div>
				<div class="info-container">
					<p class="label">Certifications</p>
					<div class="capability-list">
						{#each selectedCompany.certifications as certification}
							<p class="info capability">{certification}</p>
						{/each}
					</div>
				</div>
				<div class="info-container">
					<p class="label">Employee Count</p>
					<p class="info">{selectedCompany.employeeCount}</p>
				</div>
				<div class="info-container">
					<p class="label">Project Capacity</p>
					<p class="info">{selectedCompany.projectCapacity}</p>
				</div>
			</div>
			<div class="action-container">
				<button on:click={() => (isCompanyModalOpen = false)}><MdIcon>close</MdIcon>Close</button>
				{#if selectedSubcontractors.includes(selectedCompany)}
					<button
						class="delete"
						disabled={!selectedSubcontractors.includes(selectedCompany)}
						on:click={() => {
							selectedSubcontractors = selectedSubcontractors.filter(
								(sub) => sub.id !== selectedCompany?.id
							);
							isCompanyModalOpen = false;
						}}><MdIcon>delete</MdIcon>Remove</button
					>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if isEmailModalOpen}
	<div class="email-modal">
		<div class="email-info">
			<h2>Send Email</h2>
			<div class="input-container">
				<p class="label">Recipient(s)</p>
				<input type="text" value={selectedEmailAddresses.join(', ')} />
			</div>
			<div class="input-container">
				<p class="label">From</p>
				<input type="text" placeholder="Enter sender email" bind:value={senderEmail} />
			</div>
			<div class="input-container">
				<p class="label">Subject</p>
				<input type="text" placeholder="Enter subject" bind:value={emailSubject} />
			</div>
			<div class="input-container">
				<p class="label">Message</p>
				<textarea placeholder="Enter your message" bind:value={emailBody}></textarea>
			</div>
			<div class="action-container">
				<button on:click={() => (isEmailModalOpen = false)}><MdIcon>close</MdIcon>Cancel</button>
				<button class="send" on:click={sendEmail}><MdIcon>send</MdIcon>Send Email</button>
			</div>
		</div>
	</div>
{/if}

{#if isCallModalOpen}
	<div class="call-modal">
		<div class="call-info">
			<h2>Make Calls</h2>
			{#each selectedCallNumbers as number}
				<div class="call-number">
					<div class="info">
						<p class="company-name">{number.company_name}</p>
						<p class="number">{number.number}</p>
					</div>
					<button on:click={() => makePhoneCall()}>
						<MdIcon>phone_in_talk</MdIcon>
					</button>
				</div>
			{/each}
			<div class="action-container">
				<button on:click={() => (isCallModalOpen = false)}><MdIcon>close</MdIcon>Cancel</button>
				<!-- <button class="send" ><MdIcon>phone_in_talk</MdIcon>Call</button> -->
			</div>
		</div>
	</div>
{/if}

{#if isBidPackageModalOpen}
	<div class="bid-package-modal">
		<div class="bid-package-info">
			{#if bidPackageStep === 'add'}
				<h2>Bid Package</h2>
				<p>Would you like to add these firms to a bid package?</p>
				{#each selectedSubcontractors as sub}
					<div class="bid-package-firm-container">
						<input type="checkbox" checked />
						<h3>{sub.company_name}</h3>
					</div>
				{/each}
				<div class="action-container">
					<button
						on:click={() => {
							isBidPackageModalOpen = false;
							showBidPackagePrompt = false;
							bidPackageStep = 'add';
							selectedBidPackage = null;
						}}><MdIcon>close</MdIcon>Cancel</button
					>

					<button on:click={() => (bidPackageStep = 'find')} class="send">Next</button>
				</div>
			{:else if bidPackageStep === 'find'}
				<input type="text" bind:value={bidPackageSearch} placeholder="Search for a bid package" />
				{#each bidPackages.filter((bp) => bp.bid_package
						.toLowerCase()
						.includes(bidPackageSearch.toLowerCase())) as bp}
					<button
						class="bid-package-list"
						on:click={() => (selectedBidPackage = bp)}
						class:selected={bp === selectedBidPackage}
					>
						<h3>{bp.bid_package}</h3>
						<p class="project">{bp.project}</p>
					</button>
				{/each}
				<div class="action-container">
					<button on:click={() => (bidPackageStep = 'add')}>Previous</button>
					<button
						class="send"
						on:click={() => {
							toast.success(
								`Successfully added ${selectedSubcontractors.length} packages to ${selectedBidPackage?.bid_package}`
							);
							selectedBidPackage = null;
							isBidPackageModalOpen = false;
						}}><MdIcon>add</MdIcon>Add to Bid Package</button
					>
				</div>
			{/if}
		</div>
	</div>
{/if}

<Toaster />

<style>
	.main {
		background-color: #f4f5f6;
		gap: 40px;
		height: 100%;
		min-height: 100vh;
		padding-bottom: 200px;
	}
	.container {
		display: grid;
		max-width: 1440px;
		margin: auto;
		height: 100%;
		grid-template-columns: 0.7fr 0.34fr;
		gap: 24px;
	}

	.left,
	.right {
		border-radius: 0.6rem;
		margin-top: 24px;
		display: flex;
		align-items: center;
		background-color: white;
	}

	.left {
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: start;
		align-items: start;
		padding: 24px;
		h2 {
			font-size: 1.6rem;
			font-weight: 600;
			color: #101929;
			text-align: start;
		}
		.searches {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 16px;
			.search {
				display: flex;
				align-items: start;
				background-color: hsl(207, 10%, 98%);
				padding: 16px;
				border-radius: 0.4rem;
			}
		}
	}

	.right {
		display: flex;
		flex-direction: column;

		max-height: 52rem;
		.right-top-container {
			padding: 24px;
			width: 100%;
		}
		ul {
			width: 100%;
		}
		li {
			display: flex;
			justify-content: space-between;
			background-color: hsl(207, 10%, 98%);
			padding: 8px;
			width: 100%;
			border-top: 1px solid hsl(0, 0%, 85%);
			padding-inline: 24px;
			padding-block: 20px;
			color: hsl(220, 10%, 46%);
			font-size: 14px;
			text-transform: uppercase;
		}
		input[type='text'] {
			padding: 16px 24px;
			border-radius: 0.4rem;
			background-color: #f4f5f6;
			width: 100%;
		}

		button {
			padding: 16px 24px;
			border-radius: 0.4rem;
			align-self: end;
			margin-right: 8px;
			margin-top: 8px;
			background-color: hsl(207, 83%, 53%);
			color: white;
		}
	}

	.modal:has(.large) {
		background-color: rgba(0, 0, 0, 0.825);
	}
	.modal {
		position: fixed;
		display: flex;
		inset: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.chat-container {
			position: relative;
			overflow-y: scroll;
			max-height: 600px;
			height: 100%;
			margin-bottom: 20px;
			width: 100%;
		}

		.chat-container::-webkit-scrollbar {
			display: none;
		}
		.large {
			background-color: white;
			min-width: 70%;
			min-height: 70%;
			border-radius: 0.8rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin: auto;
			padding: 2.4rem;
			text-align: center;
			position: relative;
			.action-buttons {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				position: absolute;
				right: 1rem;
				top: 1rem;
				.minimize {
					margin-bottom: 8px;
				}
			}

			.chatbot-info {
				max-width: 500px;
				display: flex;
				flex-direction: column;
				align-items: center;
				gap: 0.8rem;
				margin-bottom: 1.2rem;
				margin: auto;
				justify-content: center;
			}

			h2 {
				font-size: 32px;
				font-weight: 700;
			}

			.input {
				margin-top: auto;
				display: flex;
				border: 2px solid hsl(207, 83%, 53%);
				border-radius: 0.4rem;
				width: 100%;
				background-color: #fefefe;
				padding: 8px 12px;
				input[type='text'] {
					width: 100%;
				}

				button {
					color: hsl(207, 83%, 53%);
				}
			}
		}

		.small {
			box-shadow: -1px 2px 28px 5px rgba(0, 0, 0, 0.25);
			background-color: white;
			position: absolute;
			border-radius: 0.8rem;
			right: 0.4rem;
			bottom: 0.4rem;
			max-width: 500px;
			min-height: 70%;
			padding: 0.8rem;
			display: flex;
			justify-content: space-between;
			flex-direction: column;
			padding-top: 40px;
			.chatbot-info {
				max-width: 500px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				text-align: center;
				gap: 0.8rem;
				margin-bottom: 1.2rem;
				align-items: center;
			}
			.action-buttons {
				align-items: center;
				display: flex;
				justify-content: end;
				background-color: white;
				gap: 8px;
				position: absolute;
				left: 0rem;
				right: 0rem;
				top: 1rem;
				padding-right: 1rem;
				.minimize {
					margin-bottom: 8px;
				}
			}

			h2 {
				font-size: 32px;
				font-weight: 700;
			}

			.input {
				margin-top: auto;
				display: flex;
				border: 2px solid hsl(207, 83%, 53%);
				border-radius: 0.4rem;
				width: 100%;
				background-color: #fefefe;
				padding: 8px 12px;
				input[type='text'] {
					width: 100%;
				}

				button {
					color: hsl(207, 83%, 53%);
				}
			}
		}

		.chatlog {
			display: flex;
			flex-direction: column;
			gap: 24px;
			align-self: flex-start;
			/* max-height: 400px; */
			overflow: clip;

			width: 100%;
			.message-container {
				display: flex;
				justify-content: end;
				gap: 8px;
			}

			.message-container.user {
				flex-direction: row-reverse;
			}
			.message-container.bot {
				.avatar {
					background-color: #0e182c;
				}
			}

			.avatar {
				background-color: hsl(207, 83%, 53%);
				height: min-content;
				color: white;
				border-radius: 50%;
			}
			.message {
				padding: 16px;
				background-color: #f9fafb;
				/* max-width: 300px; */
				align-self: end;
				border-radius: 0.4rem;
				display: flex;
				flex-direction: column;
				gap: 8px;
			}

			.sender {
				color: hsl(207, 83%, 53%);
				font-weight: 600;
				text-transform: capitalize;
			}

			.bot {
				align-self: start;
			}
		}

		.firm-list {
			display: flex;
			flex-direction: column;
			gap: 8px;
			width: 100%;

			.firm {
				display: flex;
				align-items: center;
				gap: 18px;
				justify-content: space-between;
				width: 100%;
				box-shadow: -1px 2px 28px 5px rgba(0, 0, 0, 0.05);
				padding: 18px;
				border-radius: 0.8rem;
				border: 1px solid #e5e7eb;

				h3 {
					flex-grow: 1;
					text-align: start;
				}

				.actions {
					display: flex;
					gap: 8px;
				}
			}

			.call-mail-action-buttons {
				display: flex;
				gap: 8px;
				justify-content: start;
				.email-selected {
					display: flex;
					align-items: center;
					background-color: #0e182c;
					color: white;
					padding: 4px 12px;
					width: fit-content;
					border-radius: 0.4rem;
					margin-top: 8px;
				}

				.email-selected:disabled {
					background-color: gray;
					color: white;
				}
			}
		}
	}

	.chatbubble {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		background-color: hsl(207, 83%, 53%);
		color: white;
		border-radius: 50%;
		transition: all 0.2s ease;
		box-shadow: -1px 2px 28px 5px rgba(0, 0, 0, 0.05);
	}

	.chatbubble:hover {
		box-shadow: -1px 2px 28px 5px rgba(0, 0, 0, 0.25);
		rotate: 15deg;
	}
	.message-icon {
		color: hsl(120, 70%, 40%);
		background-color: white;
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		padding: 8px;
	}

	.typing {
		position: relative;

		span {
			content: '';
			animation: blink 1.5s infinite;
			animation-fill-mode: both;
			height: 10px;
			width: 10px;
			background: #3b5998;
			position: absolute;
			left: 0;
			top: 0;
			border-radius: 50%;

			&:nth-child(2) {
				animation-delay: 0.2s;
				margin-left: 10px * 1.5;
			}

			&:nth-child(3) {
				animation-delay: 0.4s;
				margin-left: 10px * 3;
			}
		}
	}

	@keyframes blink {
		0% {
			opacity: 0.1;
		}
		20% {
			opacity: 1;
		}
		100% {
			opacity: 0.1;
		}
	}

	.company-modal {
		position: fixed;
		display: flex;
		inset: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.825);

		.company-info {
			display: flex;
			max-width: 1200px;
			background-color: white;
			z-index: 12;
			flex-direction: column;
			padding: 24px;
			border-radius: 0.8rem;
			gap: 16px;

			.subcontractor-info {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 24px 64px;
			}
			h2 {
				font-size: 32px;
				font-weight: 600;
			}

			.info-container {
				display: flex;
				flex-direction: column;
				gap: 4px;
			}
			.label {
				opacity: 0.8;
				font-weight: 300;
			}

			.info {
				font-weight: 500;
			}

			.capability-list {
				display: flex;
				gap: 8px;
				flex-wrap: wrap;
				.capability {
					background-color: #0e182c;
					color: white;
					padding: 4px 12px;
					border-radius: 0.8rem;
					font-size: 14px;
				}
			}
		}

		.action-container {
			display: flex;
			gap: 8px;
			justify-content: end;
		}
		button {
			padding: 4px 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.4rem;
			border: 2px solid #e5e7eb;
		}

		.delete {
			color: white;
			background-color: #d20700;
		}
		.delete:disabled {
			background-color: gray;
			color: white;
		}
	}

	.email-modal {
		position: fixed;
		display: flex;
		inset: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.825);

		h2 {
			color: #0e182c;
			font-size: 32px;
			font-weight: 500;
		}

		.email-info {
			display: flex;
			width: 100%;
			max-width: 800px;
			background-color: white;
			z-index: 12;
			flex-direction: column;
			padding: 24px;
			border-radius: 0.4rem;
			gap: 16px;

			.input-container {
				display: flex;
				flex-direction: column;
				gap: 4px;
				input[type='text'] {
					padding: 12px 16px;
					border-radius: 0.4rem;
					width: 100%;
					border: 2px solid #e5e7eb;
				}
				textarea {
					padding: 16px 24px;
					border-radius: 0.4rem;
					width: 100%;
					border: 2px solid #e5e7eb;
				}
			}
		}
		.action-container {
			display: flex;
			gap: 8px;
			justify-content: end;
		}
		button {
			padding: 4px 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.4rem;
			border: 2px solid #e5e7eb;
		}

		.send {
			background-color: #0e182c;
			color: white;
		}
	}

	.bid-package-modal {
		position: fixed;
		display: flex;
		inset: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.825);
		h2 {
			color: #0e182c;
			font-size: 32px;
			font-weight: 500;
		}
		.bid-package-info {
			display: flex;
			width: 100%;
			max-width: 800px;
			background-color: white;
			z-index: 12;
			flex-direction: column;
			padding: 24px;
			border-radius: 0.4rem;
			gap: 16px;

			p {
				font-size: 16px;
				font-weight: 500;
				color: #0e182c;
			}
		}
		.action-container {
			display: flex;
			gap: 8px;
			justify-content: end;
		}
		button {
			padding: 4px 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.4rem;
			border: 2px solid #e5e7eb;
		}

		.bid-package-firm-container {
			display: flex;
			align-self: start;
			border: 1px solid hsl(0, 0%, 85%);
			padding: 8px;
			border-radius: 0.4rem;
			gap: 8px;
			width: 100%;
			/* margin-bottom: 8px; */
		}

		.bid-package-list {
			width: 100%;
			text-align: start;
			display: flex;
			flex-direction: column;
			justify-content: start;
			align-items: start;

			h3 {
				font-weight: 600;
			}
			p {
				font-weight: 400;
			}
		}

		.selected {
			background-color: hsl(207, 83%, 53%);
			color: white;

			.project {
				color: white;
			}
		}
	}
	.call-modal {
		position: fixed;
		display: flex;
		inset: 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 2;
		background-color: rgba(0, 0, 0, 0.825);
		h2 {
			color: #0e182c;
			font-size: 32px;
			font-weight: 500;
		}
		.call-info {
			display: flex;
			width: 100%;
			max-width: 800px;
			background-color: white;
			z-index: 12;
			flex-direction: column;
			padding: 24px;
			border-radius: 0.4rem;
			gap: 16px;

			.call-number {
				display: flex;
				justify-content: space-between;
				align-items: center;
				gap: 8px;
				background-color: #f9fafb;
				padding: 12px;
				border-radius: 0.4rem;

				.info {
					display: flex;
					flex-direction: column;
					gap: 4px;

					.company-name {
						font-weight: 500;
					}
					.number {
						font-weight: 300;
						opacity: 0.8;
					}
				}
				button {
					border: none;
					color: #0e182c;
					padding: 8px 12px;
					font-weight: 500;
				}
			}
		}
		.action-container {
			display: flex;
			gap: 8px;
			justify-content: end;
		}
		button {
			padding: 4px 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 0.4rem;
			border: 2px solid #e5e7eb;
		}

		.send {
			background-color: #0e182c;
			color: white;
		}
	}

	.add-to-package-prompt {
		display: flex;
		gap: 4px;
		color: hsl(207, 83%, 53%);
		width: 100%;
		align-items: center;
		margin-bottom: 20px;
	}
	.add-to-bid-package {
		padding: 8px 8px;
		border: 1px solid hsl(207, 83%, 53%);
		border-radius: 0.4rem;
	}
	footer {
		min-height: 300px;
		background-color: #0e182c;
		color: white;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 8px;
	}
	.loader {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		display: block;
		margin: 12px auto;
		position: relative;
		color: hsl(207, 83%, 53%);
		left: -100px;
		box-sizing: border-box;
		animation: shadowRolling 4s linear infinite;
	}

	@keyframes shadowRolling {
		0% {
			box-shadow:
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0);
		}
		12% {
			box-shadow:
				100px 0 hsl(207, 83%, 53%),
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0);
		}
		25% {
			box-shadow:
				110px 0 hsl(207, 83%, 53%),
				100px 0 hsl(207, 83%, 53%),
				0px 0 rgba(255, 255, 255, 0),
				0px 0 rgba(255, 255, 255, 0);
		}
		36% {
			box-shadow:
				120px 0 hsl(207, 83%, 53%),
				110px 0 hsl(207, 83%, 53%),
				100px 0 hsl(207, 83%, 53%),
				0px 0 rgba(255, 255, 255, 0);
		}
		50% {
			box-shadow:
				130px 0 hsl(207, 83%, 53%),
				120px 0 hsl(207, 83%, 53%),
				110px 0 hsl(207, 83%, 53%),
				100px 0 hsl(207, 83%, 53%);
		}
		62% {
			box-shadow:
				200px 0 rgba(255, 255, 255, 0),
				130px 0 hsl(207, 83%, 53%),
				120px 0 hsl(207, 83%, 53%),
				110px 0 hsl(207, 83%, 53%);
		}
		75% {
			box-shadow:
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0),
				130px 0 hsl(207, 83%, 53%),
				120px 0 hsl(207, 83%, 53%);
		}
		87% {
			box-shadow:
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0),
				130px 0 hsl(207, 83%, 53%);
		}
		100% {
			box-shadow:
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0),
				200px 0 rgba(255, 255, 255, 0);
		}
	}
</style>
