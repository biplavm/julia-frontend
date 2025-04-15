import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url }) => {
	const searchQuery = url.searchParams.get('query') || '';

	console.log('searchQuery', searchQuery);

	return {
		searchQuery
	};
}) satisfies PageServerLoad;
