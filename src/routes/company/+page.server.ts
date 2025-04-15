import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const searchQuery = (await url.searchParams.get('query')) || '';

	return {
		searchQuery
	};
}) satisfies PageServerLoad;
