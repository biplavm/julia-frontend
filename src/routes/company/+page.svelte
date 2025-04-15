<script lang="ts" context="module">
	interface ChatLog {
		sender: string;
		text: string | Text;
	}

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
</script>

<script lang="ts">
	import MdIcon from '$lib/components/MdIcon.svelte';

	async function fetchSubcontractors(query: string): Promise<Text | null> {
		try {
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

	let isChatbotOpen = true;
	let chatbotSize: 'small' | 'large' = 'small';
	let selectedSubcontractors: Subcontractor[] = [];
	let message = '';
	let chatLog: ChatLog[] = [
		{
			sender: 'user',
			text: 'Hello, I need help finding subcontractors for my project.'
		},
		{
			sender: 'Julia',
			text: {
				subcontractors: [
					{
						id: 'SC001',
						phone: '(212) 555-1234',
						email: 'info@metroconstruction.com',
						contact: 'John Chui',
						company_name: 'Metro Construction Solutions',
						location: {
							borough: 'Manhattan',
							address: '123 Broadway, New York, NY 10007'
						},
						capabilities: ['General Construction', 'Concrete Work', 'Steel Fabrication'],
						certifications: ['MBE', 'SBE'],
						yearsInBusiness: 15,
						employeeCount: 150,
						projectCapacity: '$5M-$20M'
					},
					{
						id: 'SC002',
						phone: '(718) 555-5678',
						email: 'info@brookylenetwork.com',
						contact: 'Jane Smith',
						company_name: 'Brooklyn Electrical Experts',
						location: {
							borough: 'Brooklyn',
							address: '456 Atlantic Ave, Brooklyn, NY 11217'
						},
						capabilities: [
							'Electrical Systems',
							'Smart Building Integration',
							'Solar Installation'
						],
						certifications: ['WBE', 'LEED'],
						yearsInBusiness: 8,
						employeeCount: 75,
						projectCapacity: '$1M-$10M'
					},
					{
						id: 'SC003',
						phone: '(718) 555-5678',
						email: 'info@queensplumbing.com',
						contact: 'John Smith',
						company_name: 'Queens Plumbing & HVAC',
						location: {
							borough: 'Queens',
							address: '789 Northern Blvd, Queens, NY 11101'
						},
						capabilities: ['Plumbing Systems', 'HVAC Installation', 'Building Automation'],
						certifications: ['DBE'],
						yearsInBusiness: 12,
						employeeCount: 90,
						projectCapacity: '$2M-$15M'
					},
					{
						id: 'SC004',
						phone: '(718) 555-5678',
						email: 'info@bronxinterior.com',
						contact: 'John Doe',
						company_name: 'Bronx Interior Specialists',
						location: {
							borough: 'Bronx',
							address: '321 East Fordham Rd, Bronx, NY 10458'
						},
						capabilities: [
							'Interior Finishing',
							'Drywall Installation',
							'Custom Millwork',
							'Painting'
						],
						certifications: ['SBE'],
						yearsInBusiness: 6,
						employeeCount: 45,
						projectCapacity: '$500K-$5M'
					},
					{
						id: 'SC005',
						phone: '(718) 555-5678',
						email: 'info@statenislandexcavation.com',
						contact: 'John Doe',
						company_name: 'Staten Island Excavation',
						location: {
							borough: 'Staten Island',
							address: '987 Victory Blvd, Staten Island, NY 10314'
						},
						capabilities: ['Site Preparation', 'Excavation', 'Foundation Work', 'Steel Molding'],
						certifications: ['DBE', 'ISO 14001'],
						yearsInBusiness: 20,
						employeeCount: 60,
						projectCapacity: '$3M-$25M'
					}
				]
			}
		}
	];

	let chatHistory = [];
	let isCompanyModalOpen = true;
	let selectedCompany: Subcontractor | null = null;

	function toggleChatbot() {
		isChatbotOpen = !isChatbotOpen;
	}

	function toggleChatbotSize() {
		chatbotSize = chatbotSize === 'small' ? 'large' : 'small';
	}

	function selectSubcontractor(sub: Subcontractor) {
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

		message = '';
		const botResponse = await fetchSubcontractors(message);

		// Show message icon
		showMessageIcon = true;
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
		}, 2000);
	};
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
			<MdIcon size="32">robot_2</MdIcon>
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
			<div class="chat-container">
				<div class="chatbot-info">
					<MdIcon size="80" compact color="#2491EB">smart_toy</MdIcon>
					<h2>Welcome to Julia</h2>
					<p>
						I'm your AI assistant, ready to help you find and connect with the best local
						businesses. What can I help you with today?
					</p>
				</div>

				<div class="chatlog">
					{#each chatHistory as msg}
						{#if msg.sender.toLowerCase() === 'julia'}
							<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
								<div class="sender">
									{msg.sender}
								</div>
								{#if msg.text.matches.length === 0}
									<p>Sorry, I couldn't find any matches for your request.</p>
								{:else}
									{@const subcontractors = msg.text.matches}
									<p>Here are {msg.text.matches.length} certified electrical firms in Houston</p>
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
													<button><MdIcon>mail</MdIcon></button>
													<button><MdIcon>call</MdIcon></button>
												</div>
											</div>
										{/each}
										<button class="email-selected" disabled={!selectedSubcontractors.length}
											><MdIcon>email</MdIcon>Email Selected</button
										>
									</div>
								{/if}
							</div>
						{:else}
							<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
								<div class="sender">
									{msg.sender}
								</div>
								<div class="text">
									{msg.text}
								</div>
							</div>
						{/if}
					{/each}
					<!-- {#each chatLog as msg}
						{#if msg.sender.toLowerCase() === 'julia'}
							<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
								<div class="sender">
									{msg.sender}
								</div>
								<p>Here are 4 certified electrical firms in Houston</p>
								<div class="firm-list">
									{#each msg.text.subcontractors as sub}
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
												<button><MdIcon>mail</MdIcon></button>
												<button><MdIcon>call</MdIcon></button>
											</div>
										</div>
									{/each}
									<button class="email-selected" disabled={!selectedSubcontractors.length}
										><MdIcon>email</MdIcon>Email Selected</button
									>
								</div>
							</div>
						{:else}
							<div class="message" class:bot={msg.sender.toLowerCase() === 'julia'}>
								<div class="sender">
									{msg.sender}
								</div>
								<div class="text">
									{msg.text}
								</div>
							</div>
						{/if}
					{/each} -->
					{#if showMessageIcon}
						<div class="typing">
							<span></span>
							<span></span>
							<span></span>
						</div>
					{/if}
				</div>
			</div>

			<div class="input">
				<input
					type="text"
					placeholder="Type your message here..."
					bind:value={message}
					on:keypress={handleKeypress}
				/>
				<button><MdIcon>mic</MdIcon></button>
				<button><MdIcon>send</MdIcon></button>
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
				gap: 0.8rem;
				margin-bottom: 1.2rem;
				margin: auto;
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
				}

				.actions {
					display: flex;
					gap: 8px;
				}
			}

			.email-selected {
				display: flex;
				align-items: center;
				background-color: #0e182c;
				color: white;
				padding: 8px 12px;
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
</style>
